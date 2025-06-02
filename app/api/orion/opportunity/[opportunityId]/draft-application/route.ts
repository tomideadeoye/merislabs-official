import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
// Assuming user profile data is accessible server-side
// import { getUserProfile } from '@/lib/user_service'; // Placeholder
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Assuming types for request body and response are defined, e.g., in types/opportunity.d.ts
// import { DraftApplicationRequestBody, DraftApplicationResponseBody } from '@/types/opportunity';

/**
 * API route for drafting application materials for a specific opportunity using LLM.
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
    // Optional: Receive additional context from the frontend, e.g., tailored CV content
    // const { tailoredCVContent } = await request.json();

    // Fetch opportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }

    const opportunity = opportunityResult.opportunity;

    // TODO: Fetch user profile data server-side
    const profileData = "User profile data placeholder (skills, experience, background)"; // Replace with actual fetch

    // Construct the prompt for LLM application drafting
    const draftingPrompt = `
Draft application materials (e.g., cover letter content, key points for a message) for the following job opportunity, tailored to the user's profile.

Job Title: ${opportunity.title}
Company: ${opportunity.company}
Job Description:
${opportunity.description || 'No description provided.'}

User Profile:
${profileData}

${/* tailoredCVContent ? `Tailored CV Content:\n${tailoredCVContent}\n\n` : '' */''}
Instructions:
Generate compelling content suitable for a job application. Focus on highlighting how the user's profile aligns with the job requirements mentioned in the description. Provide key phrases, bullet points, or a draft paragraph that can be used in a cover letter or application form. Tailor the tone to be professional and enthusiastic.

Provide ONLY the draft content, without any introductory or concluding remarks.
`;

    console.log('[DRAFT_APPLICATION_API] Sending application drafting prompt to LLM...');

    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.DRAFT_COMMUNICATION, // Using a general communication type for now, adjust if a specific type exists
      draftingPrompt,
      {
        temperature: 0.7, // Moderate temperature
        max_tokens: 1000, // Allow sufficient length for draft content
      }
    );

    if (llmResponse.success && llmResponse.content) {
      return NextResponse.json({ success: true, draft_content: llmResponse.content });
    } else {
      console.error('[DRAFT_APPLICATION_API] LLM failed to generate draft:', llmResponse.error);
      return NextResponse.json({
        success: false,
        error: llmResponse.error || 'Failed to generate application draft using LLM'
      }, { status: llmResponse.error ? 500 : 500 });
    }

  } catch (error: any) {
    console.error('[DRAFT_APPLICATION_API_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during application drafting.' }, { status: 500 });
  }
}
