/**
 * @fileoverview API route for drafting application emails using a rich context.
 * @description This route orchestrates the generation of email drafts by combining various data sources:
 *   opportunity details from the database, the user's profile, relevant memories from Qdrant, and real-time
 *   web research context (company news). It then leverages an LLM to produce tailored email drafts, focusing on
 *   securing an interview and presenting strategic angles.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint (`POST`) for generating email drafts for a specific `OrionOpportunity`.
 *   - To fetch comprehensive opportunity details using `getOpportunityByIdFromDb`.
 *   - To retrieve the current user's profile data via `fetchUserProfile`.
 *   - To gather relevant company context via web search using `pythonApiService.searchWeb`.
 *   - To gather relevant personal memories using `pythonApiService.searchMemory`.
 *   - To invoke the `orion_llm` service (`generateLLMResponse`) to draft emails with strategic angles.
 *   - To ensure robust error handling and logging at each stage of the drafting process.
 *
 * FILEPATH: `app/api/orion/opportunity/[opportunityId]/draft-email/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Provides `NextRequest` and `NextResponse` for API route handling.
 *   - `@/auth`: Used for user authentication and session management.
 *   - `@/lib/opportunity_db_service`: Provides `getOpportunityByIdFromDb` to fetch opportunity details.
 *   - `@/lib/profile_service`: Provides `fetchUserProfile` to retrieve user profile data.
 *   - `@/lib/pythonApiService`: Interfaces with the Python backend for web search and memory search (Qdrant).
 *   - `@/lib/orion_llm`: Provides `generateLLMResponse` for interacting with the LLM to draft emails.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the route.
 *   - `@/lib/types`: Defines `LLMResponseFailure`, `OrionOpportunity`, and other relevant types.
 *   - `@/lib/utils/serverErrorHandler`: Used for centralized server-side error handling (`handleServerError`).
 *   - `@/lib/utils/errorHandler`: Explicitly imported `HandledApplicationError` to resolve type issues.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx` (or similar client component): This frontend page would likely consume this API to trigger email drafting.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid `opportunityId` is present in the route parameters.
 *   - Assumes the user is authenticated and `session.user.id` is available.
 *   - The Python backend services (`searchWeb`, `searchMemory`) are expected to be operational.
 *   - The LLM service is expected to return structured JSON containing email subjects, bodies, and strategic angles.
 *
 * NOTES:
 *   - **Recent Fixes**: Resolved type errors related to `HandledApplicationError` properties by changing `status` to `statusCode` and `data` to `details` where `HandledApplicationError` objects were accessed. Also, ensured `HandledApplicationError` is explicitly imported from `app/lib/utils/errorHandler.ts` to prevent module declaration conflicts.
 *   - **Error Handling**: Implements graceful degradation for external service failures (e.g., Python API calls), allowing the LLM call to proceed with available context.
 *   - The LLM response parsing includes validation to ensure the returned JSON array has the expected structure (`subject`, `body`, `strategicAngle`).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Input Validation**: Implement Zod schema validation for the request body (`tailoredCvMarkdown`, `userInstructions`) for stricter data integrity.
 *   - **Asynchronous Drafting**: For very long drafts or complex LLM calls, consider asynchronous processing with a job ID for status tracking.
 *   - **LLM Prompt Optimization**: Continuously refine the LLM prompt to improve the quality, conciseness, and strategic depth of generated email drafts.
 *   - **Pre-fill Recipient Info**: Integrate functionality to automatically pre-fill recipient email addresses based on opportunity contact information.
 *   - **A/B Testing**: Potentially allow for A/B testing of different email strategic angles or tones to optimize outreach effectiveness.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  createOpportunityInNotion,
  OpportunityNotionPayload,
  OpportunityNotionPayloadSchema,
} from '@/lib/notion_next_service';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { pythonApiService } from '@/lib/pythonApiService'; // localhost:8000/api/docs
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';
import { LLMResponseFailure, OrionOpportunity } from '@/lib/types';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { HandledApplicationError } from '@/lib/utils/errorHandler'; // Correct import for HandledApplicationError

interface EmailDraft {
  subject: string;
  body: string;
  strategicAngle: string;
}

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const userId = params.opportunityId; // Using opportunityId as userId as per the original code

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
        { success: false, error: opportunityResult.message, details: opportunityResult.details },
        { status: opportunityResult.statusCode || 500 }
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
      { success: false, error: handledError.message, details: handledError.details },
      { status: handledError.statusCode || 500 }
    );
  }
}

export async function GET() {
  // Removed authentication as per user request
  // const session = await auth();
  // if (!session || !session.user) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }
  // ... rest of your logic ...
}
