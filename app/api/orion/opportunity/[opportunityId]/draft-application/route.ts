/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides an API endpoint to draft personalized application materials (e.g., cover letters, application answers) for a specific job opportunity.
 *   - Leverages Large Language Models (LLMs) to generate drafts based on the job description, user's profile, and relevant memories.
 *   - Integrates with external services for fetching opportunity details, user profiles, and conducting web research for company context.
 *
 * FILEPATH: `app/api/orion/opportunity/[opportunityId]/draft-application/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/auth`: Used for session authentication to ensure authorized access to the API.
 *   - `@/lib/notion_service`: `fetchOpportunityByIdFromNotion` is called to retrieve detailed information about the target opportunity from Notion.
 *   - `@/lib/orion_llm`: `generateLLMResponse` is the core function for interacting with the LLM to generate the application drafts.
 *   - `@/profile_service`: `fetchUserProfile` retrieves the user's personal and professional profile, which is crucial for tailoring the application.
 *   - `@/lib/types/memory`: Imports `ScoredMemoryPoint` for handling memory search results, ensuring type consistency.
 *   - `app/api/orion/memory/search/route.ts`: This internal API is called to fetch relevant memories (contextual information) for the LLM.
 *   - `app/api/orion/research/route.ts`: This internal API is called to perform web research and gather company-specific context for enhanced personalization.
 *   - UI Components (e.g., in `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring`): Frontend components would call this API to initiate the drafting process.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid user session is present and authenticated for API access.
 *   - Expects `opportunityId` as a URL parameter to identify the target opportunity.
 *   - Assumes the Notion service, LLM service, profile service, memory service, and research service are all operational and accessible internally.
 *   - The `numberOfDrafts` parameter allows generating multiple variations of application materials.
 *
 * NOTES:
 *   - Extensive `console.log` statements are used for debugging the flow of data and LLM interactions. These should ideally be replaced with a structured logger (`@/lib/logger.ts`).
 *   - The LLM prompt is carefully constructed to guide the generation process, incorporating all available context (job details, profile, memories, company research).
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Centralized Logging**: Replace `console.log` with `logger` from `@/lib/logger.ts` for consistent, level-based, and context-rich logging.
 *   - **Centralized Error Handling**: Integrate `handleApiError` from `@/lib/utils/errorHandler.ts` for standardized error responses and improved error traceability.
 *   - **Asynchronous Processing**: For very long generation tasks, consider implementing a background job system to prevent API timeouts and provide real-time status updates to the user (e.g., using WebSockets or server-sent events).
 *   - **Customizable LLM Parameters**: Allow more LLM parameters (e.g., `model`, `maxTokens`, `topP`, `frequencyPenalty`, `presencePenalty`) to be customizable by the user or configurable at a system level.
 *   - **Draft Management**: Implement features to save, edit, and compare generated drafts within the application, rather than just returning them in the API response.
 *   - **Test Coverage**: Add comprehensive E2E tests to verify various scenarios, including successful generation, failures in dependencies (Notion, LLM, Memory, Research), and edge cases for input parameters.
 *   - **Prompt Engineering Best Practices**: Continuously refine LLM prompts based on performance and output quality, possibly implementing a prompt templating system.
 *   - **Dynamic Context Length**: Explore ways to dynamically adjust the context provided to the LLM (profile, memories, web context) based on the LLM's token limits and the complexity of the opportunity.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This route effectively consolidates the logic for integrating multiple data sources (Notion, User Profile, Memories, Web Research) and an LLM for a specific task (application drafting).
 *   - Further consolidation could involve creating a generic LLM orchestration service if similar multi-step LLM workflows are needed elsewhere in the application.
 *   - **Centralized API Call Utility**: If there are many internal API calls (e.g., to memory search, research), consider creating a centralized utility function for making authenticated internal API calls to reduce boilerplate.
 */
import { auth } from '@/auth';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchUserProfile } from '@/profile_service';
import { ScoredMemoryPoint } from '@/lib/types/memory';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { handleApiError } from '@/lib/utils/errorHandler';

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
    logger.warn('[DRAFT_APPLICATION_API][VALIDATION_FAIL] Opportunity ID is required.', {
      route: '/api/orion/opportunity/[opportunityId]/draft-application',
      opportunityId,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: false, error: 'OrionOpportunity ID is required.' }, { status: 400 });
  }

  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/draft-application',
    opportunityId,
    timestamp: new Date().toISOString(),
  };

  try {
    const reqBody = await request.json().catch(() => ({}));
    const numberOfDrafts = Math.max(1, Math.min(Number(reqBody.numberOfDrafts) || 3, 5));

    // Fetch OrionOpportunity details
    logger.debug('[DRAFT_APPLICATION_API][FETCH_OPPORTUNITY] Fetching opportunity details.', logContext);
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      logger.error('[DRAFT_APPLICATION_API][FETCH_OPPORTUNITY_FAIL] Failed to fetch opportunity details.', {
        ...logContext,
        error: opportunityResult.error,
      });
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }

    // Normalize company/companyOrInstitution for downstream use
    const OrionOpportunity = opportunityResult.OrionOpportunity;
    if (!OrionOpportunity) {
      logger.warn('[DRAFT_APPLICATION_API][OPPORTUNITY_NOT_FOUND] OrionOpportunity not found for ID.', logContext);
      return NextResponse.json({ success: false, error: 'OrionOpportunity not found.' }, { status: 404 });
    }
    const companyOrInstitution = OrionOpportunity.companyOrInstitution || OrionOpportunity.company || '';
    logger.debug('[DRAFT_APPLICATION_API][OPPORTUNITY_DETAILS]', {
      ...logContext,
      title: OrionOpportunity.title,
      company: companyOrInstitution,
    });

    // Fetch user profile data
    logger.debug('[DRAFT_APPLICATION_API][FETCH_PROFILE] Fetching user profile.', logContext);
    const profileData = await fetchUserProfile();
    const profileContext = profileData
      ? `User Profile Details:\n${profileData?.profileText || 'No profile data available.'}`
      : 'User profile data not available.';
    logger.debug('[DRAFT_APPLICATION_API][PROFILE_STATUS]', { ...logContext, hasProfileData: !!profileData });

    // Fetch relevant memories
    let memoryResults: ScoredMemoryPoint[] = [];
    logger.debug('[DRAFT_APPLICATION_API][FETCH_MEMORIES] Fetching relevant memories.', logContext);
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
          logger.info('[DRAFT_APPLICATION_API] Successfully fetched memory results.', {
            ...logContext,
            count: memoryResults.length,
          });
        } else {
          logger.warn('[DRAFT_APPLICATION_API] Memory search proxy returned success: false or no results.', {
            ...logContext,
            memoryData,
          });
        }
      } else {
        logger.error('[DRAFT_APPLICATION_API] Failed to call internal memory search proxy:', {
          ...logContext,
          status: memoryResponse.status,
          statusText: memoryResponse.statusText,
        });
      }
    } catch (memoryError: unknown) {
      logger.error('[DRAFT_APPLICATION_API] Error calling internal memory search proxy:', {
        ...logContext,
        error: memoryError instanceof Error ? memoryError.message : String(memoryError),
        originalError: memoryError,
      });
    }

    // Fetch relevant company web context
    let companyWebContext: string | undefined;
    if (companyOrInstitution) {
      logger.debug('[DRAFT_APPLICATION_API][FETCH_WEB_CONTEXT] Fetching company web context.', logContext);
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
            logger.info('[DRAFT_APPLICATION_API] Successfully fetched company web context.', {
              ...logContext,
              length: companyWebContext?.length,
            });
          } else {
            logger.warn('[DRAFT_APPLICATION_API] Company web search proxy returned success: false or no results.', {
              ...logContext,
              researchData,
            });
          }
        } else {
          logger.error('[DRAFT_APPLICATION_API] Failed to call internal research proxy for company search:', {
            ...logContext,
            status: researchResponse.status,
            statusText: researchResponse.statusText,
          });
        }
      } catch (researchError: unknown) {
        logger.error('[DRAFT_APPLICATION_API] Error calling internal research proxy for company search:', {
          ...logContext,
          error: researchError instanceof Error ? researchError.message : String(researchError),
          originalError: researchError,
        });
      }
    }

    // Use sourceUrl if available, otherwise fallback to url
    const jobUrl = OrionOpportunity.sourceUrl || OrionOpportunity.url;

    interface DraftItem {
      draft_content: string;
      context: {
        profileContext: string;
        memoryResults: ScoredMemoryPoint[];
        companyWebContext?: string;
      };
    }

    const drafts: DraftItem[] = [];
    for (let i = 0; i < numberOfDrafts; i++) {
      const prompt = `Draft application materials (variation ${i + 1}) for the following job OrionOpportunity, tailored to the user's profile and relevant memories.${companyWebContext ? ' Also use the provided company web context.' : ''}\n\nJob Title: ${OrionOpportunity.title}\nCompany: ${companyOrInstitution}\n${jobUrl ? `Job URL: ${jobUrl}\n` : ''}\nJob Content:\n${OrionOpportunity.content || 'No content provided.'}\n\nInstructions:\nGenerate compelling content suitable for a job application. Focus on highlighting how the user's profile and relevant experiences (from profile and memories) align with the job requirements mentioned in the content. Incorporate relevant details about the company from the provided web context to show genuine interest and tailor the application further. Provide key phrases, bullet points, or a draft paragraph that can be used in a cover letter or application form. Tailor the tone to be professional and enthusiastic.\n\nProvide ONLY the draft content, without any introductory or concluding remarks.`;
      logger.debug('[DRAFT_APPLICATION_API][LLM_PROMPT_GENERATION] Generating LLM response.', {
        ...logContext,
        draftIndex: i + 1,
        promptLength: prompt.length,
      });
      const llmResponseContent = await generateLLMResponse(
        REQUEST_TYPES.DRAFT_COMMUNICATION,
        prompt,
        session.user.id!,
        {
          profileContext: profileContext,
          memoryResults: memoryResults,
          temperature: 0.7 + i * 0.1,
          maxTokens: 1500,
        }
      );

      if (llmResponseContent.success) {
        drafts.push({
          draft_content: llmResponseContent.content,
          context: {
            profileContext,
            memoryResults,
            companyWebContext,
          },
        });
        logger.info('[DRAFT_APPLICATION_API] Generated draft successfully.', {
          ...logContext,
          draftIndex: i + 1,
          length: llmResponseContent.content.length,
        });
      } else {
        logger.error('[DRAFT_APPLICATION_API] LLM response failed', {
          ...logContext,
          draftIndex: i + 1,
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
    logger.success('[DRAFT_APPLICATION_API][SUCCESS] Application drafts generated successfully.', {
      ...logContext,
      draftsCount: drafts.length,
    });
    return NextResponse.json({ success: true, drafts, count: drafts.length });
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.data,
      },
      { status: handledError.status || 500 }
    );
  }
}
