/**
 * GOAL: API route for identifying stakeholders and drafting outreach messages for a specific OrionOpportunity using LLM.
 * - Ensures all OrionOpportunity objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/notion_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/OrionOpportunity.d.ts
 * - opportunities for consolidation and improvement:
 * integrate with python api to scrape web information on stakeholders, usr python api to generate email address, have editable section to send emails from the UI, store details of previously reached individuals
 */
import { auth } from '@/app/auth';
import { fetchUserProfile, MemoryPayload, generateLLMResponse, REQUEST_TYPES, LLMResponseFailure } from '@/app/index';
import { fetchOpportunityByIdFromNotion, fetchContactsFromNotion } from '@/lib/notion_service';
import { UserProfileFetchResponse } from '@/types/orion';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for identifying stakeholders and drafting outreach messages for a specific OrionOpportunity using LLM.
 */
export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'OrionOpportunity ID is required.' }, { status: 400 });
  }

  try {
    // Optional: Receive additional context from the frontend
    // const { tailoredCVContent, draftApplicationContent } = await request.json();

    // Fetch OrionOpportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }

    const OrionOpportunity = opportunityResult.OrionOpportunity;
    if (!OrionOpportunity) {
      console.error('[STAKEHOLDER_OUTREACH_API] OrionOpportunity not found for ID:', opportunityId, {
        user: session.user?.email,
      });
      return NextResponse.json({ success: false, error: 'OrionOpportunity not found.' }, { status: 404 });
    }
    // Normalize company/companyOrInstitution for downstream use
    const company = OrionOpportunity.company ?? OrionOpportunity.companyOrInstitution ?? '';
    const companyOrInstitution = OrionOpportunity.companyOrInstitution ?? OrionOpportunity.company ?? '';
    console.info('[STAKEHOLDER_OUTREACH_API] Normalized company fields:', {
      company,
      companyOrInstitution,
      opportunityId,
      user: session.user?.email,
    });

    // Fetch user profile data
    const profileData: UserProfileFetchResponse | null = await fetchUserProfile();
    const profileContext = profileData?.profileText
      ? `User Profile Details:\n${profileData.profileText}`
      : 'User profile data not available.';

    // Fetch relevant memories for stakeholder outreach
    let memoryResults: MemoryPayload[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Stakeholder and networking context for ${OrionOpportunity.title} at ${companyOrInstitution}`,
          limit: 5,
        }),
      });

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        if (memoryData.success && memoryData.results) {
          memoryResults = memoryData.results;
          console.log('[OUTREACH_API] Successfully fetched memory results.', memoryResults.length);
        } else {
          console.warn('[OUTREACH_API] Memory search proxy returned success: false or no results.', memoryData);
        }
      } else {
        console.error(
          '[OUTREACH_API] Failed to call internal memory search proxy:',
          memoryResponse.status,
          memoryResponse.statusText
        );
      }
    } catch (memoryError: unknown) {
      console.error(
        '[OUTREACH_API] Error calling internal memory search proxy:',
        memoryError instanceof Error ? memoryError.message : 'Unknown error'
      );
    }

    // Fetch contacts from Notion
    try {
      const contacts = await fetchContactsFromNotion();
      console.log('[OUTREACH_API] Successfully fetched contacts.', contacts.length);
      // You can now use the 'contacts' array in your logic, for example, by passing it to the LLM.
    } catch (contactError: unknown) {
      console.error(
        '[OUTREACH_API] Error fetching contacts:',
        contactError instanceof Error ? contactError.message : 'Unknown error'
      );
    }

    // --- Stakeholder Identification ---
    const identificationPromptContent = `
Identify potential key stakeholders (e.g., hiring manager, recruiters, relevant team members) for the following job OrionOpportunity based on the provided job description and company name. Also consider the user's profile, any relevant memories, AND relevant contacts from their network.

Job Title: ${OrionOpportunity.title}
Company: ${companyOrInstitution}
Job Description:
${OrionOpportunity.content || 'No content provided.'}

Instructions:
List potential roles or names of people involved in the hiring process or team. **Specifically, review the provided contacts list and identify any individuals who work at the company or in a relevant role. Prioritize listing these existing contacts if they are relevant.** If specific names are not available in the contacts, suggest relevant roles to look for. Provide the output as a simple list.

Provide ONLY the list of stakeholders, without any introductory or concluding remarks.
`;

    console.log('[STAKEHOLDER_OUTREACH_API] Sending stakeholder identification prompt to LLM...');

    const identificationResponse = await generateLLMResponse(REQUEST_TYPES.ASK_QUESTION, identificationPromptContent, {
      profileContext: profileContext,
      memoryResults: memoryResults,
      temperature: 0.5,
      maxTokens: 300,
    });

    let identifiedStakeholders: string | null = null;
    if (identificationResponse.success && identificationResponse.content) {
      identifiedStakeholders = identificationResponse.content;
      console.log('[STAKEHOLDER_OUTREACH_API] Identified Stakeholders:\n', identifiedStakeholders);
    } else {
      console.error(
        '[STAKEHOLDER_OUTREACH_API] LLM failed to identify stakeholders:',
        (identificationResponse as LLMResponseFailure).error
      );
      // Continue without stakeholders if identification fails
    }

    // --- Outreach Message Drafting ---
    const outreachDraftingPromptContent = `
Draft initial outreach messages (e.g., LinkedIn connection request, introductory email) for potential stakeholders related to the following job OrionOpportunity. Leverage the user's profile, relevant memories, identified stakeholders, AND relevant contacts.

Job Title: ${OrionOpportunity.title}
Company: ${companyOrInstitution}
Job Description:
${OrionOpportunity.content || 'No content provided.'}

${identifiedStakeholders ? `Potential Stakeholders identified:\n${identifiedStakeholders}\n\n` : ''}
${/* tailoredCVContent ? `Tailored CV Content:\n${tailoredCVContent}\n\n` : '' */ ''}
${/* draftApplicationContent ? `Draft Application Content:\n${draftApplicationContent}\n\n` : '' */ ''}

Instructions:
Draft concise and professional messages suitable for initial contact. Include options for different platforms (e.g., LinkedIn, email). Tailor the message to express interest in the specific role and highlight relevant qualifications from the user profile and memories. **Use information from the provided contacts list (like name, company, role) to personalize the messages if a connection to an identified stakeholder is found.** Encourage a brief conversation. Provide different message options.

Provide ONLY the draft messages, clearly labeled for their intended use.
`;

    console.log('[STAKEHOLDER_OUTREACH_API] Sending outreach message drafting prompt to LLM...');

    const outreachDraftingResponse = await generateLLMResponse(
      REQUEST_TYPES.DRAFT_COMMUNICATION,
      outreachDraftingPromptContent,
      {
        profileContext: profileContext,
        memoryResults: memoryResults,
        temperature: 0.7,
        maxTokens: 1000,
      }
    );

    let draftOutreachMessages: string | null = null;
    if (outreachDraftingResponse.success && outreachDraftingResponse.content) {
      draftOutreachMessages = outreachDraftingResponse.content;
      console.log('[STAKEHOLDER_OUTREACH_API] Draft Outreach Messages:\n', draftOutreachMessages);
    } else {
      console.error(
        '[STAKEHOLDER_OUTREACH_API] LLM failed to draft outreach messages:',
        (outreachDraftingResponse as LLMResponseFailure).error
      );
      // Continue without draft messages if drafting fails
    }

    if (identifiedStakeholders || draftOutreachMessages) {
      return NextResponse.json({
        success: true,
        identified_stakeholders: identifiedStakeholders,
        draft_outreach_messages: draftOutreachMessages,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to identify stakeholders and draft outreach messages.',
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('[STAKEHOLDER_OUTREACH_API_ERROR]', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        success: false,
        error:
          (error instanceof Error ? error.message : 'Unknown error') ||
          'An unexpected error occurred during stakeholder outreach.',
      },
      { status: 500 }
    );
  }
}
