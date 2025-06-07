/**
 * GOAL: API route for identifying stakeholders and drafting outreach messages for a specific opportunity using LLM.
 * - Ensures all Opportunity objects include both company and companyOrInstitution.
 * - Adds context-rich, traceable logging for every operation, parameter, and result.
 * - Related files: lib/notion_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/opportunity.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES, constructLlmMessages } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion, fetchContactsFromNotion } from '@/lib/notion_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { auth } from '@/auth';
import type { MemoryPayload } from '@/types/orion';

/**
 * API route for identifying stakeholders and drafting outreach messages for a specific opportunity using LLM.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {

  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }

  try {
    // Optional: Receive additional context from the frontend
    // const { tailoredCVContent, draftApplicationContent } = await request.json();

    // Fetch opportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }

    const opportunity = opportunityResult.opportunity;
    if (!opportunity) {
      console.error('[STAKEHOLDER_OUTREACH_API] Opportunity not found for ID:', opportunityId, { user: session.user?.email });
      return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
    }
    // Normalize company/companyOrInstitution for downstream use
    const company = (opportunity.company ?? (opportunity as any).companyOrInstitution ?? '') || '';
    const companyOrInstitution = ((opportunity as any).companyOrInstitution ?? opportunity.company ?? '') || '';
    console.info('[STAKEHOLDER_OUTREACH_API] Normalized company fields:', { company, companyOrInstitution, opportunityId, user: session.user?.email });

    // Fetch user profile data
    const profileData = await fetchUserProfile();
    const profileContext = profileData ?
      `User Profile Details:\nSkills: ${profileData.skills || 'N/A'}\nExperience: ${profileData.experience || 'N/A'}\nBackground: ${profileData.background || 'N/A'}\nPersonality: ${profileData.personality || 'N/A'}` :
      "User profile data not available.";

    // Fetch relevant memories for stakeholder outreach
    let memoryResults: MemoryPayload[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Stakeholder and networking context for ${opportunity.title} at ${companyOrInstitution}`,
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
         console.error('[OUTREACH_API] Failed to call internal memory search proxy:', memoryResponse.status, memoryResponse.statusText);
      }
    } catch (memoryError: any) {
       console.error('[OUTREACH_API] Error calling internal memory search proxy:', memoryError);
    }

    // Fetch contacts from Notion
    try {
        const contactsResult = await fetchContactsFromNotion();
        if (contactsResult.success) {
            console.log('[OUTREACH_API] Successfully fetched contacts.', contactsResult.contacts ? contactsResult.contacts.length : 0);
        } else {
            console.warn('[OUTREACH_API] Failed to fetch contacts:', contactsResult.error);
        }
    } catch (contactError: any) {
        console.error('[OUTREACH_API] Error fetching contacts:', contactError);
    }

    // --- Stakeholder Identification ---
    const identificationPromptContent = `
Identify potential key stakeholders (e.g., hiring manager, recruiters, relevant team members) for the following job opportunity based on the provided job description and company name. Also consider the user's profile, any relevant memories, AND relevant contacts from their network.

Job Title: ${opportunity.title}
Company: ${companyOrInstitution}
Job Description:
${opportunity.content || 'No content provided.'}

Instructions:
List potential roles or names of people involved in the hiring process or team. **Specifically, review the provided contacts list and identify any individuals who work at the company or in a relevant role. Prioritize listing these existing contacts if they are relevant.** If specific names are not available in the contacts, suggest relevant roles to look for. Provide the output as a simple list.

Provide ONLY the list of stakeholders, without any introductory or concluding remarks.
`;

    const identificationMessages = constructLlmMessages({
      requestType: REQUEST_TYPES.ASK_QUESTION,
      primaryContext: identificationPromptContent,
      profileContext: profileContext,
      memoryResults: memoryResults,
    });

    console.log('[STAKEHOLDER_OUTREACH_API] Sending stakeholder identification prompt to LLM...');

    const identificationResponse = await generateLLMResponse(
      REQUEST_TYPES.ASK_QUESTION,
      '',
      {
        messages: identificationMessages,
        temperature: 0.5,
        max_tokens: 300
      } as any
    );

    let identifiedStakeholders: string | null = null;
    if ((identificationResponse as any).success && (identificationResponse as any).content) {
      identifiedStakeholders = (identificationResponse as any).content;
      console.log('[STAKEHOLDER_OUTREACH_API] Identified Stakeholders:\n', identifiedStakeholders);
    } else {
      console.error('[STAKEHOLDER_OUTREACH_API] LLM failed to identify stakeholders:', (identificationResponse as any).error);
      // Continue without stakeholders if identification fails
    }

    // --- Outreach Message Drafting ---
    const outreachDraftingPromptContent = `
Draft initial outreach messages (e.g., LinkedIn connection request, introductory email) for potential stakeholders related to the following job opportunity. Leverage the user's profile, relevant memories, identified stakeholders, AND relevant contacts.

Job Title: ${opportunity.title}
Company: ${companyOrInstitution}
Job Description:
${opportunity.content || 'No content provided.'}

${identifiedStakeholders ? `Potential Stakeholders identified:
${identifiedStakeholders}

` : ''}
${/* tailoredCVContent ? `Tailored CV Content:\n${tailoredCVContent}\n\n` : '' */''}
${/* draftApplicationContent ? `Draft Application Content:\n${draftApplicationContent}\n\n` : '' */''}

Instructions:
Draft concise and professional messages suitable for initial contact. Include options for different platforms (e.g., LinkedIn, email). Tailor the message to express interest in the specific role and highlight relevant qualifications from the user profile and memories. **Use information from the provided contacts list (like name, company, role) to personalize the messages if a connection to an identified stakeholder is found.** Encourage a brief conversation. Provide different message options.

Provide ONLY the draft messages, clearly labeled for their intended use.
`;

    const outreachMessages = constructLlmMessages({
      requestType: REQUEST_TYPES.DRAFT_COMMUNICATION,
      primaryContext: outreachDraftingPromptContent,
      profileContext: profileContext,
      memoryResults: memoryResults,
    });

    console.log('[STAKEHOLDER_OUTREACH_API] Sending outreach message drafting prompt to LLM...');

    const outreachDraftingResponse = await generateLLMResponse(
      REQUEST_TYPES.DRAFT_COMMUNICATION,
      '',
      {
        messages: outreachMessages,
        temperature: 0.7,
        max_tokens: 1000
      } as any
    );

    let draftOutreachMessages: string | null = null;
    if ((outreachDraftingResponse as any).success && (outreachDraftingResponse as any).content) {
      draftOutreachMessages = (outreachDraftingResponse as any).content;
      console.log('[STAKEHOLDER_OUTREACH_API] Draft Outreach Messages:\n', draftOutreachMessages);
    } else {
      console.error('[STAKEHOLDER_OUTREACH_API] LLM failed to draft outreach messages:', (outreachDraftingResponse as any).error);
      // Continue without draft messages if drafting fails
    }

    if (identifiedStakeholders || draftOutreachMessages) {
      return NextResponse.json({
        success: true,
        identified_stakeholders: identifiedStakeholders,
        draft_outreach_messages: draftOutreachMessages,
      });
    } else {
        return NextResponse.json({
            success: false,
            error: "Failed to identify stakeholders and draft outreach messages."
        }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[STAKEHOLDER_OUTREACH_API_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during stakeholder outreach.' }, { status: 500 });
  }
}
