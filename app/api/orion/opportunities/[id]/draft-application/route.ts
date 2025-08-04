/**
 * @fileoverview API route for drafting application materials (e.g., cover letters) for a specific opportunity.
 * @description This route orchestrates the generation of application drafts by combining various data sources:
 *   opportunity details from the database, the user's profile, relevant memories from Qdrant, and real-time
 *   web research context (company news, job URL scraping). It then leverages an LLM to produce
 *   tailored application drafts, ensuring a highly personalized and effective output.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint (`POST`) for generating application drafts based on an `Opportunity`.
 *   - To fetch comprehensive opportunity details using `getOpportunityByIdFromDb`.
 *   - To retrieve the current user's profile data via `fetchUserProfile`.
 *   - To gather relevant contextual memories from Qdrant using `searchMemory`.
 *   - To perform real-time web research (company news, job URL scraping) via the `pythonApiService`.
 *   - To invoke the `orion_llm` service to generate personalized application drafts.
 *   - To ensure robust error handling and logging at each stage of the drafting process.
 *
 * FILEPATH: `app/api/orion/opportunities/[id]/draft-application/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Provides `NextRequest` and `NextResponse` for API route handling.
 *   - `@/auth`: Used for user authentication and session management.
 *   - `@/lib/opportunity_db_service`: Provides `getOpportunityByIdFromDb` to fetch opportunity details.
 *   - `@/lib/profile_service`: Provides `fetchUserProfile` to retrieve user profile data.
 *   - `@/lib/pythonApiService`: Interfaces with the Python backend for web search and memory search (Qdrant).
 *   - `@/lib/orion_llm`: Provides `generateLLMResponse` for interacting with the LLM to draft applications.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the route.
 *   - `@/lib/types`: Defines `UserProfileData`, `LLMResponseFailure`, `ScoredMemoryPoint`, `ResearchSnippet`, and `HandledApplicationError`.
 *   - `@/lib/utils/serverErrorHandler`: Used for centralized server-side error handling (`handleServerError`).
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/page.tsx` (or similar client component): This frontend page would likely consume this API to trigger application drafting.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid `id` is present in the route parameters.
 *   - Assumes the user is authenticated and `session.user.id` is available.
 *   - The Python backend services (`searchWeb`, `searchMemory`) are expected to be operational.
 *   - The LLM service is expected to return structured JSON for application drafts.
 *
 * NOTES:
 *   - **Recent Fix**: The `HandledApplicationError` properties (`status` and `data`) were updated to `statusCode` and `details` respectively, aligning with the `HandledApplicationError` class definition in `app/lib/utils/errorHandler.ts`. This resolved type errors related to accessing non-existent properties on the error object.
 *   - **Error Handling**: Implements graceful degradation for external service failures (e.g., Python API), allowing the LLM call to proceed with available context.
 *   - The `llmResponse.structuredResponse` is expected to conform to the `ApplicationDraftOutput` interface.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Input Validation**: Implement Zod schema validation for the request body (e.g., `tailoredCvMarkdown`, `userInstructions`) to ensure data integrity.
 *   - **Asynchronous Drafting**: For very long drafts or complex LLM calls, consider implementing asynchronous processing with a job ID for status tracking.
 *   - **LLM Prompt Optimization**: Continuously refine the LLM prompt to improve the quality and relevance of generated application drafts.
 *   - **More Draft Options**: Allow users to specify desired length, tone, or specific sections for the application drafts.
 *   - **Integration with Document Generation**: After drafting, provide functionality to convert the markdown draft into a downloadable PDF or other document formats.
 *   - **Automated Feedback Loop**: Implement a system for users to rate or provide feedback on generated drafts, which could be used to fine-tune the LLM or improve prompt engineering.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { pythonApiService } from '@/lib/pythonApiService';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';
import { LLMResponseFailure, ScoredMemoryPoint } from '@/lib/types';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { HandledApplicationError } from '@/lib/utils/errorHandler'; // Correct import for HandledApplicationError
import { Opportunity } from '@prisma/client';








interface ApplicationDraftOutput {
    drafts: {
        type: 'cover_letter' | 'email' | 'linkedin_message';
        content: string;
        strategicAngle: string;
    }[];
}

interface ApplicationDraftRequest {
    tailoredCvMarkdown: string;
    userInstructions?: string;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    // Removed authentication as per user's request
    // const session = await auth();
    // if (!session || !session.user || !session.user.id) {
    //   logger.warn('[DRAFT_APPLICATION_API][POST][AUTH_FAIL] Unauthorized access attempt.', {
    //     route: '/api/orion/opportunity/[id]/draft-application',
    //     id: params.id,
    //   });
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    const userId = 'unauthenticated_user'; // Always use 'unauthenticated_user' as authentication is removed
    const logContext = {
        route: '/api/orion/opportunity/[id]/draft-application',
        id: params.id,
        userId,
        timestamp: new Date().toISOString(),
    };

    logger.info('[DRAFT_APPLICATION_API][POST][START]', logContext);

    try {
        const { tailoredCvMarkdown, userInstructions } = (await request.json()) as ApplicationDraftRequest;

        if (!tailoredCvMarkdown || tailoredCvMarkdown.trim().length === 0) {
            logger.warn('[DRAFT_APPLICATION_API][INPUT_VALIDATION_FAIL] tailoredCvMarkdown is empty.', logContext);
            return NextResponse.json({ success: false, error: 'Tailored CV markdown content is required.' }, { status: 400 });
        }

        // 1. Fetch Opportunity
        logger.info('[DRAFT_APPLICATION_API][FETCH_OPPORTUNITY] Fetching opportunity details.', logContext);
        const opportunityResult = await getOpportunityByIdFromDb(params.id);

        let opportunity: Opportunity;
        if (opportunityResult === null) {
            logger.error('[DRAFT_APPLICATION_API][OPPORTUNITY_NOT_FOUND] Opportunity not found in DB.', logContext);
            return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
        } else if (opportunityResult instanceof HandledApplicationError) {
            logger.error('[DRAFT_APPLICATION_API][OPPORTUNITY_FETCH_ERROR]', {
                ...logContext,
                error: opportunityResult.message,
                details: opportunityResult.details,
            });
            return NextResponse.json(
                { success: false, error: opportunityResult.message, details: opportunityResult.details },
                { status: (opportunityResult.statusCode as number) || 500 }
            );
        } else {
            opportunity = opportunityResult;
        }

        // 2. Fetch User Profile
        logger.info('[DRAFT_APPLICATION_API][FETCH_USER_PROFILE] Fetching user profile.', logContext);
        const userProfileResponse = await fetchUserProfile();
        if (!userProfileResponse.success || !userProfileResponse.profileText) {
            logger.error('[DRAFT_APPLICATION_API][PROFILE_FETCH_ERROR] User profile not found or incomplete.', {
                ...logContext,
                error: userProfileResponse.error || 'Unknown profile fetch error',
            });
            throw new Error('User profile not found or incomplete. Cannot generate application.');
        }
        const userProfileText = userProfileResponse.profileText;

        // 3. Gather Web Research Context (Company News)
        logger.info('[DRAFT_APPLICATION_API][WEB_RESEARCH] Initiating web research for company news.', logContext);
        
        

        // 4. Gather Relevant Memories
        logger.info('[DRAFT_APPLICATION_API][MEMORY_SEARCH] Searching for relevant memories.', logContext);
        let memoryResults: ScoredMemoryPoint[] = [];
        try {
            const memorySearchRes = await pythonApiService.searchMemory(
                `experiences relevant to ${opportunity.title} at ${opportunity.company}`
            );
            if (typeof memorySearchRes === 'string' && memorySearchRes.trim().length > 0) {
                try {
                    const parsedMemoryRes: ScoredMemoryPoint[] = JSON.parse(memorySearchRes);
                    if (parsedMemoryRes && parsedMemoryRes.length > 0) {
                        memoryResults = parsedMemoryRes;
                        logger.info('[DRAFT_APPLICATION_API][MEMORY_SEARCH_SUCCESS] Relevant memories retrieved.', {
                            ...logContext,
                            memoryCount: memoryResults.length,
                        });
                    } else {
                        logger.warn(
                            '[DRAFT_APPLICATION_API][MEMORY_SEARCH_EMPTY] No relevant memories found after parsing.',
                            logContext
                        );
                    }
                } catch (jsonParseError) {
                    logger.error(
                        '[DRAFT_APPLICATION_API][MEMORY_SEARCH_JSON_PARSE_ERROR] Failed to parse memory search results.',
                        {
                            ...logContext,
                            error: (jsonParseError as Error).message,
                            rawContent: memorySearchRes,
                        }
                    );
                }
            } else {
                logger.warn(
                    "[DRAFT_APPLICATION_API][MEMORY_SEARCH_EMPTY] No relevant memories found or it's not a string.",
                    logContext
                );
            }
        } catch (memoryError: unknown) {
            logger.error('[DRAFT_APPLICATION_API][MEMORY_SEARCH_ERROR] Error fetching memories.', {
                ...logContext,
                error: memoryError instanceof Error ? memoryError.message : String(memoryError),
            });
            // Proceed without memories if it fails
        }

        // 5. Construct LLM Prompt
        logger.info('[DRAFT_APPLICATION_API][LLM_PROMPT] Constructing LLM prompt.', logContext);
        const systemPrompt = `
      You are Tomide Adeoye, an expert strategist and career professional. Your task is to draft highly effective
      application materials (cover letters, emails, or LinkedIn messages) for a given job opportunity.
      Focus on highlighting key skills, experiences, and achievements that align with the job description.
      Integrate personal insights from the provided profile and memories, and leverage company context.
      The goal is to secure an interview.

      You MUST respond with a JSON array of objects. Each object in the array represents a draft and MUST have the following properties:
      - "type": "cover_letter" | "email" | "linkedin_message" (choose the most appropriate type for the context)
      - "content": string (the full draft content in a professional, ready-to-use format)
      - "strategicAngle": string (a concise, one-sentence explanation of the key strategy behind this draft)

      Example of desired JSON output:
      [
        {
          "type": "cover_letter",
          "content": "Dear [Hiring Manager], ...",
          "strategicAngle": "Highlights transferable skills and past project successes directly relevant to the role."
        },
        {
          "type": "linkedin_message",
          "content": "Hi [Contact Name], I saw your post...",
          "strategicAngle": "Leverages mutual connections and expresses genuine interest in company's recent achievements."
        }
      ]

      Generate at least two distinct drafts if possible, each with a different strategic angle.
      Ensure the content is compelling, concise, and professional.
      Do NOT include any other text or markdown outside the JSON array.
    `;

        const userPrompt = `
      **Opportunity Details:**
      - Title: ${opportunity.title ?? 'N/A'}
      - Company: ${opportunity.company ?? 'N/A'}
      - Job Description: ${opportunity.content ?? 'No description provided.'}
      - URL: ${opportunity.url ?? 'N/A'}

      **My Tailored CV (highlights for relevance):**
      ${tailoredCvMarkdown}

      **My Specific Instructions for this Draft:**
      ${userInstructions || 'No specific instructions provided. Be creative and strategic.'}
    `;

        // 6. Call LLM
        logger.info('[DRAFT_APPLICATION_API][CALL_LLM] Calling LLM for application drafting.', logContext);
        const llmResponse = await generateLLMResponse(REQUEST_TYPES.DRAFT_COMMUNICATION, userPrompt, userId, {
            systemContext: systemPrompt,
            profileContext: userProfileText,
            memoryResults: memoryResults,
            responseFormat: 'json_object',
            temperature: 0.7,
            maxTokens: 1500,
        });

        if (!llmResponse.success) {
            const llmErrorMessage = (llmResponse as LLMResponseFailure).error || 'LLM failed to generate drafts.';
            logger.error('[DRAFT_APPLICATION_API][LLM_FAIL]', {
                ...logContext,
                error: llmErrorMessage,
                rawContent: llmResponse.content,
            });
            return NextResponse.json(
                { success: false, error: llmErrorMessage, details: llmResponse.content },
                { status: 500 }
            );
        }

        // For REQUEST_TYPES.DRAFT_COMMUNICATION, the structured response is in llmResponse.content and needs parsing
        let draftsOutput: ApplicationDraftOutput;
        try {
            if (!llmResponse.content) {
                throw new Error('LLM response content is empty for DRAFT_COMMUNICATION.');
            }
            draftsOutput = { drafts: JSON.parse(llmResponse.content) as ApplicationDraftOutput['drafts'] };
            // Basic validation of the LLM's structured response
            if (!draftsOutput || !Array.isArray(draftsOutput.drafts) || draftsOutput.drafts.length === 0) {
                logger.error('[DRAFT_APPLICATION_API][LLM_PARSE_FAIL] LLM returned malformed or empty drafts array.', {
                    ...logContext,
                    parsedOutput: draftsOutput,
                    rawContent: llmResponse.content,
                });
                return NextResponse.json(
                    { success: false, error: 'LLM returned malformed or empty drafts. Please try again or refine instructions.' },
                    { status: 500 }
                );
            }
            if (draftsOutput.drafts.some((d) => !d.type || !d.content || !d.strategicAngle)) {
                logger.error('[DRAFT_APPLICATION_API][LLM_PARSE_FAIL] LLM returned drafts with missing properties.', {
                    ...logContext,
                    parsedOutput: draftsOutput,
                    rawContent: llmResponse.content,
                });
                return NextResponse.json(
                    { success: false, error: 'LLM returned drafts with missing type, content, or strategicAngle.' },
                    { status: 500 }
                );
            }
        } catch (parseError: unknown) {
            const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error';
            logger.error('[DRAFT_APPLICATION_API][JSON_PARSE_ERROR]', {
                ...logContext,
                error: errorMessage,
                llmContent: llmResponse.content,
            });
            return NextResponse.json(
                { success: false, error: `Failed to parse LLM response: ${errorMessage}` },
                { status: 500 }
            );
        }

        logger.success('[DRAFT_APPLICATION_API][POST][SUCCESS] Application drafts generated.', {
            ...logContext,
            draftCount: draftsOutput.drafts.length,
        });
        return NextResponse.json({ success: true, drafts: draftsOutput.drafts });
    } catch (error: unknown) {
        const handledError = handleServerError(error, logContext);
        logger.error('[DRAFT_APPLICATION_API][POST][CATCH_ERROR] An unexpected error occurred.', {
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
