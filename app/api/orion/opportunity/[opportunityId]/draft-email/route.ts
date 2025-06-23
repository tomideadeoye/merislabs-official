/**
 * @fileoverview API route for drafting application emails using a rich context.
 * @description Orchestrates data from the DB, Python API (web/memory), and LLMs.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { pythonApiService } from '@/lib/pythonApiService'; // localhost:8000/api/docs
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';
import { LLMResponseFailure, OrionOpportunity, HandledApplicationError } from '@/lib/types';
import { handleServerError } from '@/lib/utils/serverErrorHandler';

interface EmailDraft {
  subject: string;
  body: string;
  strategicAngle: string;
}

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/draft-email',
    opportunityId: params.opportunityId,
    userId,
    timestamp: new Date().toISOString(),
  };

  try {
    const { tailoredCvMarkdown, userInstructions } = await request.json();
    const opportunityResult = await getOpportunityByIdFromDb(params.opportunityId);

    if (opportunityResult === null) {
      logger.error('[DRAFT_EMAIL_API][OPPORTUNITY_NOT_FOUND] Opportunity not found.', logContext);
      return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
    }

    if (opportunityResult instanceof HandledApplicationError) {
      logger.error('[DRAFT_EMAIL_API][OPPORTUNITY_FETCH_ERROR]', { ...logContext, error: opportunityResult.message });
      return NextResponse.json(
        { success: false, error: opportunityResult.message, details: opportunityResult.data },
        { status: opportunityResult.status || 500 }
      );
    }

    const opportunity: OrionOpportunity = opportunityResult;

    const userProfile = await fetchUserProfile();
    if (!userProfile?.profileText) {
      logger.error('[DRAFT_EMAIL_API][PROFILE_FETCH_ERROR] User profile not found.', logContext);
      throw new Error('User profile not found.');
    }

    // --- ENRICHMENT (with graceful fallbacks) ---
    let companyContext = 'No company web context available.';
    try {
      const companySearchRes = await pythonApiService.searchWeb(`recent news and values for ${opportunity.company}`);
      companyContext = JSON.stringify(companySearchRes);
    } catch (e) {
      logger.warn(`[DRAFT_EMAIL_API] Python API call for web search failed. Proceeding without it.`, {
        ...logContext,
        error: e,
      });
    }

    let memoryContext = 'No relevant personal memories found.';
    try {
      const memorySearchRes = await pythonApiService.searchMemory(
        `relevant experiences for a ${opportunity.title} role`
      );
      memoryContext = JSON.stringify(memorySearchRes);
    } catch (e) {
      logger.warn(`[DRAFT_EMAIL_API] Python API call for memory search failed. Proceeding without it.`, {
        ...logContext,
        error: e,
      });
    }

    const prompt = `
            You are Tomide Adeoye, an expert strategist. Draft 3 distinct, professional email applications for the following role to secure an interview.

            **CONTEXT BLOCK:**
            - **My Profile:** ${userProfile.profileText}
            - **The Opportunity:** ${opportunity.title ?? ''} at ${opportunity.company ?? ''}
            - **Job Description:** ${opportunity.content ?? ''}
            - **My Tailored CV Highlights:** ${tailoredCvMarkdown}
            - **Recent Company Info/News:** ${companyContext}
            - **My Relevant Personal Memories/Insights:** ${memoryContext}
            - **My Specific Instructions:** ${userInstructions || 'No specific instructions provided.'}

            **INSTRUCTION:**
            Return ONLY a valid JSON array of objects. Each object must have "subject", "body", and "strategicAngle" (a one-sentence explanation of the draft's strategy).
            Example: [{"subject": "Initial Approach", "body": "Dear [Hiring Manager], ...", "strategicAngle": "Focuses on direct value proposition and highlights key skills."},
                      {"subject": "Connection & Value", "body": "Hello [Hiring Manager], ...", "strategicAngle": "Emphasizes alignment with company values and personal fit."},
                      {"subject": "Problem-Solution Focus", "body": "Greetings [Hiring Manager], ...", "strategicAngle": "Presents skills as solutions to potential company challenges."}]
        `;

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.DRAFT_COMMUNICATION, prompt, userId!, {
      responseFormat: 'json_object',
    });

    if (!llmResponse.success || !llmResponse.content) {
      throw new Error(
        (llmResponse as LLMResponseFailure).error || 'LLM failed to generate drafts and provided no specific error.'
      );
    }

    let drafts: EmailDraft[] = [];
    try {
      drafts = JSON.parse(llmResponse.content);
      if (!Array.isArray(drafts)) {
        logger.error('[DRAFT_EMAIL_API] LLM response was not an array', {
          ...logContext,
          content: llmResponse.content,
        });
        throw new Error('LLM returned malformed JSON: expected an array.');
      }
      // Basic validation for each draft object (can be expanded with Zod if needed)
      if (drafts.some((d) => !d.subject || !d.body || !d.strategicAngle)) {
        logger.error('[DRAFT_EMAIL_API] LLM returned drafts with missing properties', { ...logContext, drafts });
        throw new Error('LLM returned drafts with missing subject, body, or strategicAngle.');
      }
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error';
      logger.error('[DRAFT_EMAIL_API] JSON parsing failed', {
        ...logContext,
        error: errorMessage,
        llmContent: llmResponse.content,
      });
      return NextResponse.json(
        { success: false, error: `Failed to parse LLM response: ${errorMessage}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, drafts });
  } catch (error) {
    const handledError = handleServerError(error, logContext);
    logger.error('[DRAFT_EMAIL_API] Error', {
      ...logContext,
      error: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
    });
    return NextResponse.json(
      { success: false, error: handledError.message, details: handledError.data },
      { status: handledError.status || 500 }
    );
  }
}
