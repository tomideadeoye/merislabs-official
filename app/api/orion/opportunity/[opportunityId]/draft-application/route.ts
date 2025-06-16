import { auth } from '@/app/auth';
import { fetchUserProfile, MemoryPayload, generateLLMResponse, REQUEST_TYPES } from '@/app/index';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for drafting application materials for a specific OrionOpportunity using LLM.
 */
export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'OrionOpportunity ID is required.' }, { status: 400 });
  }

  try {
    const reqBody = await request.json().catch(() => ({}));
    const numberOfDrafts = Math.max(1, Math.min(Number(reqBody.numberOfDrafts) || 3, 5));

    // Fetch OrionOpportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }

    // Normalize company/companyOrInstitution for downstream use
    const OrionOpportunity = opportunityResult.OrionOpportunity;
    if (!OrionOpportunity) {
      return NextResponse.json({ success: false, error: 'OrionOpportunity not found.' }, { status: 404 });
    }
    const companyOrInstitution = OrionOpportunity.companyOrInstitution || OrionOpportunity.company || '';

    // Fetch user profile data
    const profileData = await fetchUserProfile();
    const profileContext = profileData
      ? `User Profile Details:\n${profileData?.profileText || 'No profile data available.'}`
      : 'User profile data not available.';

    // Fetch relevant memories
    let memoryResults: MemoryPayload[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Application drafting context for ${OrionOpportunity.title} at ${companyOrInstitution}`,
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
        console.error(
          '[DRAFT_API] Failed to call internal memory search proxy:',
          memoryResponse.status,
          memoryResponse.statusText
        );
      }
    } catch (memoryError: unknown) {
      console.error(
        '[DRAFT_API] Error calling internal memory search proxy:',
        memoryError instanceof Error ? memoryError.message : String(memoryError)
      );
    }

    // Fetch relevant company web context
    let companyWebContext: string | undefined;
    if (companyOrInstitution) {
      try {
        const researchResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `${companyOrInstitution} overview`, // Search query for company overview
            type: 'web',
            count: 3, // Limit number of results
          }),
        });

        if (researchResponse.ok) {
          const researchData = await researchResponse.json();
          if (researchData.success && researchData.results && researchData.results.length > 0) {
            // Define a type for research result snippet
            interface ResearchSnippet {
              url?: string;
              title?: string;
              snippet?: string;
            }
            // Format the search results into a string for the LLM context
            companyWebContext = researchData.results
              .map(
                (result: ResearchSnippet, index: number) =>
                  `Company Web Context Source ${index + 1}:\nURL: ${result.url || 'N/A'}\nTitle: ${result.title || 'N/A'}\nSnippet: ${result.snippet || 'No snippet'}`
              )
              .join('\n\n---\n\n');
            console.log('[DRAFT_API] Successfully fetched company web context.', companyWebContext?.length);
          } else {
            console.warn('[DRAFT_API] Company web search proxy returned success: false or no results.', researchData);
          }
        } else {
          console.error(
            '[DRAFT_API] Failed to call internal research proxy for company search:',
            researchResponse.status,
            researchResponse.statusText
          );
        }
      } catch (researchError: unknown) {
        console.error(
          '[DRAFT_API] Error calling internal research proxy for company search:',
          researchError instanceof Error ? researchError.message : String(researchError)
        );
      }
    }

    // Use sourceUrl if available, otherwise fallback to url
    const jobUrl = OrionOpportunity.sourceUrl || OrionOpportunity.url;

    interface DraftItem {
      draft_content: string;
      context: {
        profileContext: string;
        memoryResults: MemoryPayload[];
        companyWebContext?: string;
      };
    }

    const drafts: DraftItem[] = [];
    for (let i = 0; i < numberOfDrafts; i++) {
      const prompt = `Draft application materials (variation ${i + 1}) for the following job OrionOpportunity, tailored to the user's profile and relevant memories.${companyWebContext ? ' Also use the provided company web context.' : ''}\n\nJob Title: ${OrionOpportunity.title}\nCompany: ${companyOrInstitution}\n${jobUrl ? `Job URL: ${jobUrl}\n` : ''}\nJob Content:\n${OrionOpportunity.content || 'No content provided.'}\n\nInstructions:\nGenerate compelling content suitable for a job application. Focus on highlighting how the user's profile and relevant experiences (from profile and memories) align with the job requirements mentioned in the content. Incorporate relevant details about the company from the provided web context to show genuine interest and tailor the application further. Provide key phrases, bullet points, or a draft paragraph that can be used in a cover letter or application form. Tailor the tone to be professional and enthusiastic.\n\nProvide ONLY the draft content, without any introductory or concluding remarks.`;
      const llmResponseContent = await generateLLMResponse(REQUEST_TYPES.DRAFT_COMMUNICATION, prompt, {
        profileContext: profileContext,
        memoryResults: memoryResults,
        temperature: 0.7 + i * 0.1,
        maxTokens: 1500,
      });

      if (llmResponseContent.success) {
        drafts.push({
          draft_content: llmResponseContent.content,
          context: {
            profileContext,
            memoryResults,
            companyWebContext,
          },
        });
        console.info('[DRAFT_APPLICATION_API] Generated draft', {
          idx: i + 1,
          length: llmResponseContent.content.length,
        });
      } else {
        console.error('[DRAFT_APPLICATION_API] LLM response failed', {
          idx: i + 1,
          error: llmResponseContent.error,
        });
        drafts.push({
          draft_content: `Failed to generate draft: ${llmResponseContent.error || 'Unknown LLM error'}`,
          context: {
            profileContext,
            memoryResults,
            companyWebContext,
          },
        });
      }
    }
    return NextResponse.json({ success: true, drafts, count: drafts.length });
  } catch (error: unknown) {
    console.error('[DRAFT_APPLICATION_API_ERROR]', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred during application drafting.',
      },
      { status: 500 }
    );
  }
}
