import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES, constructLlmMessages } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
// Assuming types for request body and response are defined, e.g., in types/opportunity.d.ts
// import { DraftApplicationRequestBody, DraftApplicationResponseBody } from '@/types/opportunity';
import type { MemoryPayload } from '@/types/orion';

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

    // Fetch user profile data
    const profileData = await fetchUserProfile();
    const profileContext = profileData ?
      `User Profile Details:\nSkills: ${profileData.skills || 'N/A'}\nExperience: ${profileData.experience || 'N/A'}\nBackground: ${profileData.background || 'N/A'}\nPersonality: ${profileData.personality || 'N/A'}` :
      "User profile data not available.";

    // Fetch relevant memories
    let memoryResults: MemoryPayload[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Application drafting context for ${opportunity.title} at ${opportunity.company}`,
          limit: 7,
        }),
      });

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        if (memoryData.success && memoryData.results) {
          memoryResults = memoryData.results;
          console.log('[DRAFT_API] Successfully fetched memory results.', memoryResults.length);
        } else {
           console.warn('[DRAFT_API] Memory search proxy returned success: false or no results.', memoryData);
        }
      } else {
         console.error('[DRAFT_API] Failed to call internal memory search proxy:', memoryResponse.status, memoryResponse.statusText);
      }
    } catch (memoryError: any) {
       console.error('[DRAFT_API] Error calling internal memory search proxy:', memoryError);
    }

    // Fetch relevant company web context
    let companyWebContext: string | undefined;
    if (opportunity.company) {
        try {
            const researchResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `${opportunity.company} overview`, // Search query for company overview
                    type: 'web',
                    count: 3, // Limit number of results
                }),
            });

            if (researchResponse.ok) {
                const researchData = await researchResponse.json();
                if (researchData.success && researchData.results && researchData.results.length > 0) {
                     // Format the search results into a string for the LLM context
                    companyWebContext = researchData.results.map((result: any, index: number) =>
                        `Company Web Context Source ${index + 1}:\nURL: ${result.url || 'N/A'}\nTitle: ${result.title || 'N/A'}\nSnippet: ${result.snippet || 'No snippet'}`
                    ).join('\n\n---\n\n');
                     console.log('[DRAFT_API] Successfully fetched company web context.', companyWebContext?.length);
                } else {
                   console.warn('[DRAFT_API] Company web search proxy returned success: false or no results.', researchData);
                }
            } else {
               console.error('[DRAFT_API] Failed to call internal research proxy for company search:', researchResponse.status, researchResponse.statusText);
            }
        } catch (researchError: any) {
           console.error('[DRAFT_API] Error calling internal research proxy for company search:', researchError);
        }
    }

    // Construct the prompt for LLM application drafting using the helper function
    const draftingPromptContent = `
Draft application materials (e.g., cover letter content, key points for a message) for the following job opportunity, tailored to the user's profile and relevant memories.${companyWebContext ? ' Also use the provided company web context.' : ''}\n\nJob Title: ${opportunity.title}\nCompany: ${opportunity.company}\n${opportunity.jobUrl ? `Job URL: ${opportunity.jobUrl}\n` : ''}\nJob Description:\n${opportunity.description || 'No description provided.'}\n\n${/* tailoredCVContent ? `Tailored CV Content:\n${tailoredCVContent}\n\n` : '' */''}Instructions:\nGenerate compelling content suitable for a job application. Focus on highlighting how the user's profile and relevant experiences (from profile and memories) align with the job requirements mentioned in the description. Incorporate relevant details about the company from the provided web context to show genuine interest and tailor the application further. Provide key phrases, bullet points, or a draft paragraph that can be used in a cover letter or application form. Tailor the tone to be professional and enthusiastic.\n\nProvide ONLY the draft content, without any introductory or concluding remarks.`;

    const messages = constructLlmMessages({
      requestType: REQUEST_TYPES.DRAFT_COMMUNICATION,
      primaryContext: draftingPromptContent,
      profileContext: profileContext,
      memoryResults: memoryResults,
      webContext: companyWebContext,
    });

    console.log('[DRAFT_APPLICATION_API] Sending application drafting prompt to LLM...');

    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.DRAFT_COMMUNICATION,
      undefined,
      { messages, temperature: 0.7, max_tokens: 1500 } as any
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
