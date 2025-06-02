import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Assuming types for request body and response are defined
// import { StakeholderOutreachRequestBody, StakeholderOutreachResponseBody } from '@/types/opportunity';

/**
 * API route for identifying stakeholders and drafting outreach messages for a specific opportunity using LLM.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
) {
  // Check authentication
  const session = await getServerSession(authOptions);
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

    // TODO: Fetch user profile data server-side if needed for stakeholder identification
    const profileData = "User profile data placeholder"; // Replace with actual fetch or remove if not necessary

    // --- Stakeholder Identification ---
    const identificationPrompt = `
Identify potential key stakeholders (e.g., hiring manager, recruiters, relevant team members) for the following job opportunity based on the provided job description and company name.

Job Title: ${opportunity.title}
Company: ${opportunity.company}
Job Description:
${opportunity.description || 'No description provided.'}

User Profile:
${profileData}

Instructions:
List potential roles or names of people involved in the hiring process or team. If specific names are not available, suggest relevant roles to look for. Provide the output as a simple list.

Provide ONLY the list of stakeholders, without any introductory or concluding remarks.
`;

    console.log('[STAKEHOLDER_OUTREACH_API] Sending stakeholder identification prompt to LLM...');

    const identificationResponse = await generateLLMResponse(
      REQUEST_TYPES.ASK_QUESTION, // Or a more specific type if available
      identificationPrompt,
      { temperature: 0.5, max_tokens: 300 }
    );

    let identifiedStakeholders: string | null = null;
    if (identificationResponse.success && identificationResponse.content) {
      identifiedStakeholders = identificationResponse.content;
      console.log('[STAKEHOLDER_OUTREACH_API] Identified Stakeholders:\n', identifiedStakeholders);
    } else {
      console.error('[STAKEHOLDER_OUTREACH_API] LLM failed to identify stakeholders:', identificationResponse.error);
      // Continue without stakeholders if identification fails
    }

    // --- Outreach Message Drafting ---
    const outreachDraftingPrompt = `
Draft initial outreach messages (e.g., LinkedIn connection request, introductory email) for potential stakeholders related to the following job opportunity.

Job Title: ${opportunity.title}
Company: ${opportunity.company}
Job Description:
${opportunity.description || 'No description provided.'}

User Profile:
${profileData}

${identifiedStakeholders ? `Potential Stakeholders identified:
${identifiedStakeholders}

` : ''}
${/* tailoredCVContent ? `Tailored CV Content:\n${tailoredCVContent}\n\n` : '' */''}
${/* draftApplicationContent ? `Draft Application Content:\n${draftApplicationContent}\n\n` : '' */''}

Instructions:
Draft concise and professional messages suitable for initial contact. Include options for different platforms (e.g., LinkedIn, email). Tailor the message to express interest in the specific role and highlight relevant qualifications from the user profile. Encourage a brief conversation. Provide different message options.

Provide ONLY the draft messages, clearly labeled for their intended use.
`;

    console.log('[STAKEHOLDER_OUTREACH_API] Sending outreach message drafting prompt to LLM...');

    const outreachDraftingResponse = await generateLLMResponse(
      REQUEST_TYPES.DRAFT_COMMUNICATION,
      outreachDraftingPrompt,
      { temperature: 0.7, max_tokens: 800 }
    );

    let draftOutreachMessages: string | null = null;
    if (outreachDraftingResponse.success && outreachDraftingResponse.content) {
      draftOutreachMessages = outreachDraftingResponse.content;
      console.log('[STAKEHOLDER_OUTREACH_API] Draft Outreach Messages:\n', draftOutreachMessages);
    } else {
      console.error('[STAKEHOLDER_OUTREACH_API] LLM failed to draft outreach messages:', outreachDraftingResponse.error);
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
