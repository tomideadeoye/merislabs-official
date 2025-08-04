/**
 * @fileoverview API route for performing AI-driven evaluation of a given opportunity against the user's profile and relevant memories.
 * @description This route orchestrates the evaluation process, fetching opportunity details, user profile, and relevant memories (from Qdrant), then leveraging an LLM to generate a comprehensive `EvaluationOutput`. It handles data preparation, LLM invocation, response parsing, and error management, providing a structured assessment for career opportunities.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint (`POST`) for evaluating a specific `Opportunity`.
 *   - To fetch detailed opportunity information from the database.
 *   - To retrieve the user's profile data (from `UserProfileData`).
 *   - To search and integrate relevant contextual memories from the Qdrant vector database.
 *   - To perform web research (company overview, job URL scraping) to enrich the context for the LLM.
 *   - To invoke the `orion_llm` service with a detailed prompt and gathered context to generate an `EvaluationOutput`.
 *   - To robustly parse and validate the LLM's JSON response, including handling markdown code blocks.
 *   - To ensure consistent error handling and logging for all stages of the evaluation process.
 *
 * FILEPATH: `app/api/orion/opportunities/[id]/evaluation/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Provides `NextRequest` and `NextResponse` for API route handling.
 *   - `@/lib/types`: Defines `EvaluationOutput`, `Opportunity`, `UserProfileData`, `ScoredMemoryPoint`, `ApiErrorResponse`, and other relevant types used for data structures.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the route.
 *   - `@/auth`: (Potentially) Used for user authentication and session management. Currently commented out but could be re-integrated.
 *   - `@prisma/client`: Imports the Prisma Client (`PrismaClient`) for interacting with the Neon PostgreSQL database to fetch `Opportunity` data.
 *   - `@/lib/orion_llm`: Provides the `generateLLMResponse` function for interacting with various LLM providers to perform the core evaluation.
 *   - `@/lib/orion_memory`: Provides the `searchMemory` function to retrieve relevant memory chunks from Qdrant, enriching the LLM's context.
 *   - `@/lib/profile_service`: Provides `fetchUserProfile` to retrieve the user's background and skills.
 *   - `@/lib/utils/apiFetcher`: Used to call other internal API routes (e.g., `/api/orion/research/company`, `/api/orion/research`) for web research and content scraping.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/evaluate/page.tsx`: This frontend page consumes this API route to trigger and display the evaluation results.
 *   - `app/lib/opportunity_db_service.ts`: This service is responsible for persisting the `EvaluationOutput` back to the opportunity record after generation.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `id` is provided in the route parameters.
 *   - Assumes LLM responses will generally conform to the `EvaluationOutput` interface, even if some fields might be `null` or empty arrays if no relevant data is generated.
 *   - The `extractFirstJsonObject` utility is crucial for robustly parsing LLM output which often includes markdown or `think` tags.
 *   - User authentication (`userId`) is currently placeholder-driven but can be re-enabled via `auth()` for production.
 *
 * NOTES:
 *   - This API route is a critical component of the "Opportunity Super-Flow," enabling AI-driven insights into career opportunities.
 *   - Extensive logging is implemented at various stages to trace the flow of data, LLM calls, and potential errors.
 *   - The process incorporates multiple context sources: opportunity details, user profile, relevant memories, and real-time web research.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Input Validation**: Implement Zod schemas for `EvaluationRequestBody` to ensure strict validation of incoming request data, providing clear error messages for invalid inputs.
 *   - **Asynchronous Processing**: For very long-running LLM evaluations, consider returning an immediate response with a job ID and processing the evaluation asynchronously (e.g., using a queue), with results accessible via a separate polling endpoint.
 *   - **Fallback Mechanisms**: Enhance fallback for profile/memory/web context fetching (e.g., if a service is down, use cached data or proceed with reduced context).
 *   - **LLM Prompt Optimization**: Continuously refine the system and user prompts to improve the quality, consistency, and adherence of the LLM's `EvaluationOutput`.
 *   - **Error Detail Standardization**: Leverage `errorHandler.ts` more explicitly for all error responses to ensure consistency in structure and messaging, especially for errors from internal service calls.
 *   - **Caching for External Data**: Implement caching (e.g., Redis or in-memory) for frequently requested user profile or web research data to reduce latency and API costs.
 *   - **Test Coverage**: Write comprehensive integration and unit tests for this route, covering various scenarios (success, missing data, LLM failure, parsing errors).
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The `extractFirstJsonObject` utility could be moved to a more generic `utils` file (`app/lib/utils/jsonExtractor.ts` if not already there, or merged into `apiFetcher` if it handles response parsing).
 *   - Potentially abstract the core LLM orchestration logic if similar multi-source context gathering and LLM invocation patterns appear in other API routes.
 */
import { NextRequest, NextResponse } from 'next/server';
import { EvaluationOutput, ScoredMemoryPoint, UserProfileData, ApiErrorResponse } from '@/lib/types';
import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm'; // Assuming REQUEST_TYPES is defined
import { searchMemory } from '@/lib/orion_memory';
import { fetchUserProfile } from '@/lib/profile_service'; // Corrected import path for fetchUserProfile
import { apiFetcher } from '@/lib/utils/apiFetcher'; // Import the new apiFetcher utility


// Temporary placeholder userId as auth is removed. This should be replaced with proper authentication.
const TEMP_USER_ID = 'default_orion_user_id';

interface EvaluationApiResponse {
    success: boolean;
    evaluation?: EvaluationOutput;
    error?: string | ApiErrorResponse; // Adjusted to allow ApiErrorResponse
    rawContent?: string; // For parsing errors
    memoryResults?: ScoredMemoryPoint[]; // Add memoryResults to the response type
}

interface EvaluationRequestBody {
    id: string;
    userProfile: UserProfileData;
    relevantMemories?: ScoredMemoryPoint[];
}

// Utility: Extract first JSON object from a string (removes markdown/code blocks, etc.)
function extractFirstJsonObject(text: string): string | null {
    if (!text) return null;

    // First, try to extract content within a 'json' markdown code block
    const jsonBlockMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
        return jsonBlockMatch[1].trim();
    }

    // If no 'json' block, try to find any markdown code block
    const genericBlockMatch = text.match(/```[a-zA-Z]*\n([\s\S]*?)\n```/);
    if (genericBlockMatch && genericBlockMatch[1]) {
        return genericBlockMatch[1].trim();
    }

    // Fallback: try to find the first {...} block (non-greedy, after stripping potential <think> tags)
    const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*?\}/);
    return match ? match[0] : null;
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<EvaluationApiResponse>> {
    const { id: routeId } = params; // Destructure early
    const logContext = {
        id: routeId,
        method: request.method,
        route: '/api/orion/opportunity/[id]/evaluation',
        timestamp: new Date().toISOString(),
    };

    logger.info('[EVAL_API][START] Initiating opportunity evaluation POST request.', logContext);

    // Removed authentication check as requested by the user
    // const session = await auth();
    // if (!session || !session.user) {
    //   logger.warn('[EVAL_API][AUTH_FAIL] Unauthorized access attempt detected. User session invalid.', logContext);
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        logger.info('[EVAL_API][BODY_PARSE][START] Attempting to parse request body as JSON.', logContext);
        const rawBody = await request.text(); // Read raw body as text
        let body: EvaluationRequestBody;

        try {
            body = JSON.parse(rawBody); // Manually parse to catch errors with raw content
        } catch (jsonError: unknown) {
            logger.error('[EVAL_API][BODY_PARSE][ERROR] Failed to parse JSON request body.', {
                ...logContext,
                errorMessage: jsonError instanceof Error ? jsonError.message : String(jsonError),
                rawRequestBody: rawBody.substring(0, 1000), // Log first 1000 chars of raw body for debugging
                stack: jsonError instanceof Error ? jsonError.stack : undefined,
            });
            return NextResponse.json({ success: false, error: 'Invalid JSON in request body.' }, { status: 400 });
        }

        const { id: bodyid, userProfile, relevantMemories } = body;

        logger.info('[EVAL_API][BODY_PARSE][SUCCESS]', {
            ...logContext,
            bodyid: bodyid,
            userProfileProvided: !!userProfile,
            memoriesCount: relevantMemories?.length || 0,
        });

        // Validate that the id from the route params matches the one in the request body
        if (routeId !== bodyid) {
            logger.warn('[EVAL_API][ID_MISMATCH]', {
                ...logContext,
                routeId: routeId,
                bodyid: bodyid,
                message: 'Opportunity ID in route parameters does not match ID in request body.',
            });
            return NextResponse.json({ success: false, error: 'Opportunity ID mismatch' }, { status: 400 });
        }

        // Fetch the opportunity from the database
        logger.info('[EVAL_API][DB_FETCH_OPPORTUNITY][START] Fetching opportunity from database.', logContext);
        const opportunity = await prisma.opportunity.findUnique({
            where: { id: routeId },
            select: {
                id: true,
                title: true,
                company: true,
                type: true,
                status: true,
                content: true, // maps to description
                url: true,
                tags: true, // maps to requirements
                dateIdentified: true,
                notes: true,
                contactPerson: true,
                contactEmail: true,
                stage: true,
                attachments: true,
                relatedEvaluationId: true,
                sourceUrl: true,
                nextActionDate: true,
                priority: true,
                tailoredCv: true,
                deadline: true,
                location: true,
                salary: true,
                contact: true,
                position: true,
                lastStatusUpdate: true,
                applicationMaterialIds: true,
                createdAt: true,
                updatedAt: true,
                evaluationResult: true, // For evaluationOutput
                tailoredCvId: true,
                stakeholders: {
                    select: {
                        id: true,
                        name: true,
                        title: true,
                        email: true,
                        linkedinUrl: true,
                    },
                },
                applicationDrafts: {
                    select: {
                        id: true,
                        type: true,
                        content: true,
                    },
                },
            },
        });

        if (!opportunity) {
            logger.warn('[EVAL_API][OPP_NOT_FOUND]', { ...logContext, id: routeId });
            return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
        }
        logger.info('[EVAL_API][DB_FETCH_OPPORTUNITY][SUCCESS]', {
            ...logContext,
            opportunityTitle: opportunity.title,
        });

        // Use fullOpportunity from this point onward
        let profileData = userProfile; // Use profile from body by default
        let profileContext = 'User profile data not available.'; // Declare profileContext here

        if (!profileData) {
            logger.info('[EVAL_API][PROFILE_FETCH] Attempting to fetch user profile data from source service.', logContext);
            try {
                const fetchedProfile = await fetchUserProfile();
                if (fetchedProfile && fetchedProfile.profile) {
                    profileData = fetchedProfile.profile; // Assign the profile object directly
                    logger.info('[EVAL_API][PROFILE_SUCCESS] User profile data successfully fetched from service.', logContext);
                } else {
                    logger.warn('[EVAL_API][PROFILE_FAIL] User profile data could not be loaded from service.', {
                        ...logContext,
                        errorDetails: fetchedProfile?.error || 'Unknown profile fetch error',
                    });
                    // Optionally, throw an error or return a specific response if profile is critical
                }
            } catch (profileFetchError: unknown) {
                logger.error('[EVAL_API][PROFILE_ERROR] Error fetching user profile from service.', {
                    ...logContext,
                    errorMessage: profileFetchError instanceof Error ? profileFetchError.message : String(profileFetchError),
                    stack: profileFetchError instanceof Error ? profileFetchError.stack : undefined,
                });
                // Continue without profile data if it's not critical for this flow, or re-throw
            }
        }

        if (!profileData || !profileData.backgroundSummary) {
            logger.warn(
                '[EVAL_API][PROFILE_INCOMPLETE] User profile data is incomplete or missing background summary, proceeding with caution.',
                logContext
            );
            // Decide whether to proceed or return an error based on feature criticality
        }

        profileContext = profileData
            ? `User Profile Details (source: ${profileData.source || 'body/unknown'}):\nName: ${profileData.name}\nBackground Summary: ${profileData.backgroundSummary || 'N/A'}\nKey Skills: ${(profileData.keySkills || []).join(', ') || 'N/A'}\nGoals: ${(profileData.goals || []).join(', ') || 'N/A'}\nValues: ${(profileData.values || []).join(', ') || 'N/A'}\nLocation: ${profileData.location || 'N/A'}`
            : 'User profile data not available.';

        let memoryResults: ScoredMemoryPoint[] = relevantMemories || []; // Use relevantMemories from body if provided
        if (memoryResults.length === 0 && opportunity.title && opportunity.company) {
            logger.info('[EVAL_API][MEMORY_FETCH] Attempting to fetch relevant memories via search service.', {
                opportunityTitle: opportunity.title,
                company: opportunity.company,
                ...logContext,
            });
            try {
                const searchResponse = await searchMemory(
                    `Opportunity evaluation context for ${opportunity.title} at ${opportunity.company} `,
                    {
                        limit: 5,
                    }
                );

                if (searchResponse.success && searchResponse.results) {
                    memoryResults = searchResponse.results;
                    logger.info('[EVAL_API][MEMORY_SUCCESS] Successfully fetched memory results via search service.', {
                        count: memoryResults.length,
                        ...logContext,
                    });
                } else {
                    logger.warn('[EVAL_API][MEMORY_NO_RESULTS] Memory search service returned no results or failure.', {
                        searchResponse,
                        ...logContext,
                    });
                }
            } catch (memoryError: unknown) {
                logger.error('[EVAL_API][MEMORY_ERROR] Error calling memory search service.', {
                    errorMessage: memoryError instanceof Error ? memoryError.message : String(memoryError),
                    stack: memoryError instanceof Error ? memoryError.stack : undefined,
                    ...logContext,
                });
            }
        }

        // Integrate web research (company overview) and scraping (job URL)
        let combinedWebContext: string = ''; // Initialize as empty string

        logger.info('[EVAL_API][WEB_CONTEXT] Determining web context for evaluation.', logContext);

        const webContextParts = [];

        // 1. Fetch company overview using web search
        if (opportunity.company) {
            logger.info('[EVAL_API][COMPANY_SEARCH] Initiating web search for company overview.', {
                company: opportunity.company,
                ...logContext,
            });
            try {
                const companySearchData = await apiFetcher<{
                    success: boolean;
                    results?: { content: string }[];
                    error?: string;
                }>('/api/orion/research/company', {
                    method: 'POST',
                    body: { query: opportunity.company },
                    logContext: { subOperation: 'company_search', ...logContext },
                });

                if (companySearchData.success && companySearchData.results && companySearchData.results.length > 0) {
                    const companyContext = companySearchData.results.map((r) => r.content).join('\n\n');
                    webContextParts.push(`Company Overview for ${opportunity.company}: \n${companyContext} `);
                    logger.info('[EVAL_API][COMPANY_SEARCH_SUCCESS] Successfully fetched company overview.', logContext);
                } else {
                    webContextParts.push(`No relevant company overview found for ${opportunity.company}.`);
                    logger.warn('[EVAL_API][COMPANY_SEARCH_NO_RESULTS] No company overview results found.', {
                        companySearchData,
                        ...logContext,
                    });
                }
            } catch (companySearchError: unknown) {
                const errorDetails =
                    companySearchError instanceof Error ? companySearchError.message : String(companySearchError);
                webContextParts.push(`Error fetching company overview for ${opportunity.company}: ${errorDetails} `);
                logger.error('[EVAL_API][COMPANY_SEARCH_ERROR] Error fetching company overview.', {
                    errorMessage: errorDetails,
                    stack: companySearchError instanceof Error ? companySearchError.stack : undefined,
                    ...logContext,
                });
            }
        }

        // 2. Scrape job URL for additional context
        const jobUrl = opportunity.sourceUrl || opportunity.url; // Use sourceUrl if available
        if (jobUrl) {
            logger.info('[EVAL_API][JOB_SCRAPE] Attempting to scrape job URL for additional context.', {
                jobUrl,
                ...logContext,
            });
            try {
                const scrapeData = await apiFetcher<{ success: boolean; content?: string; error?: string }>(
                    '/api/orion/research',
                    {
                        method: 'POST',
                        body: { url: jobUrl },
                        logContext: { subOperation: 'job_scrape', ...logContext },
                    }
                );

                if (scrapeData.success && scrapeData.content) {
                    webContextParts.push(`Job Details from ${jobUrl}:${scrapeData.content.substring(0, 1000)}...`); // Limit length
                    logger.info('[EVAL_API][JOB_SCRAPE_SUCCESS] Successfully scraped job URL.', { url: jobUrl, ...logContext });
                } else {
                    webContextParts.push(`No content scraped from ${jobUrl}.`);
                    logger.warn('[EVAL_API][JOB_SCRAPE_NO_CONTENT] No content scraped from job URL.', {
                        scrapeData,
                        ...logContext,
                    });
                }
            } catch (scrapeError: unknown) {
                const errorDetails = scrapeError instanceof Error ? scrapeError.message : String(scrapeError);
                webContextParts.push(`Error scraping job URL ${jobUrl}: ${errorDetails} `);
                logger.error('[EVAL_API][JOB_SCRAPE_ERROR] Error scraping job URL.', {
                    errorMessage: errorDetails,
                    stack: scrapeError instanceof Error ? scrapeError.stack : undefined,
                    ...logContext,
                });
            }
        }

        combinedWebContext = webContextParts.join('\n\n');
        if (!combinedWebContext) {
            logger.info('[EVAL_API][NO_WEB_CONTEXT] No web context generated after backend research.', logContext);
            combinedWebContext = 'No relevant web research context available.';
        }

        logger.debug('[EVAL_API][WEB_CONTEXT_FINALIZED] Final combined web context length and sample.', {
            contextLength: combinedWebContext.length,
            contextSample: combinedWebContext.substring(0, 100) + '...',
            ...logContext,
        });

        // Prepare and call LLM for evaluation
        const systemPrompt = `
          As Orion's AI, your task is to analyze the provided Opportunity and applicant profile.
          You will generate a comprehensive evaluation output in JSON format(EvaluationOutput interface).

          Evaluation criteria:
        1. Overall Fit: How well does the applicant's profile, memories, and experience align with the opportunity?
        2. Strengths: What are the key areas where the applicant excels relative to the opportunity ?
          3. Gaps: What are potential skill / experience gaps ? How can these be addressed(e.g., transferable skills, rapid learning ability) ?
            4. Strategic Next Steps: What immediate actions should Tomide take(e.g., tailor CV, research more, network) ?
              5. Alignment Highlights: Specific points where the applicant's profile and memories directly match the opportunity's needs.
            6. Risk / Reward Analysis: Potential rewards if pursued, potential risks if pursued, time investment, financial considerations, career impact.

          Consider the provided web research context to infer company culture, recent projects, or specific needs mentioned online.
          Structure your output strictly as a JSON object adhering to the EvaluationOutput interface.
          Do not include any other text or markdown outside the JSON block.
          Output only the JSON.

          Strictly adhere to the EvaluationOutput interface schema, ensuring all fields are present and correctly typed.For arrays, ensure they are empty arrays if no relevant data is found.Ensure all strings are actual strings and not null or undefined.
        `;

        const userPrompt = `
          Opportunity(Job Description, etc.):
          ${JSON.stringify(opportunity, null, 2)}

          Applicant Profile:
          ${profileContext}

          Relevant Memories:
          ${memoryResults
                .map((m: ScoredMemoryPoint) => {
                    if (!m.payload) return '';
                    return `Memory Content: ${m.payload.text || 'N/A'}\nSource: ${m.payload.source_id || 'N/A'}\nType: ${m.payload.type || 'N/A'}\nTimestamp: ${m.payload.timestamp ? new Date(m.payload.timestamp).toLocaleDateString() : 'N/A'}`;
                })
                .filter(Boolean)
                .join('\n\n---\n\n')}

          Web Research Context:
          ${combinedWebContext}

          Generate the EvaluationOutput as a JSON object.
        `;

        logger.info('[EVAL_API][LLM_CALL] Calling LLM for opportunity evaluation.', {
            llmPromptLength: systemPrompt.length + userPrompt.length,
            ...logContext,
        });
        const llmResponse = await generateLLMResponse(
            REQUEST_TYPES.OPPORTUNITY_EVALUATION,
            userPrompt, // primaryContext
            TEMP_USER_ID, // userId
            {
                systemContext: systemPrompt,
                profileContext: userProfile?.profileText ?? '', // Ensure profileText is not null
                memoryResults: relevantMemories,
                temperature: 0.7,
                maxTokens: 1500,
            }
        );

        if (!llmResponse.success) {
            logger.error('[EVAL_API][LLM_FAIL] LLM response indicates failure.', {
                ...logContext,
                error: llmResponse.error || 'Unknown LLM failure',
                rawContent: llmResponse.content, // Pass the raw content here
            });
            return NextResponse.json(
                {
                    success: false,
                    error: llmResponse.error || 'Failed to get a valid LLM evaluation.',
                    rawContent: llmResponse.content, // Return raw content in API response
                },
                { status: 500 }
            );
        }

        // Parse LLM response
        logger.info('[EVAL_API][LLM_PARSE] Attempting to parse LLM response.', logContext);

        // Log the raw LLM content before parsing for debugging
        logger.debug('[EVAL_API][RAW_LLM_CONTENT]', { ...logContext, rawContent: llmResponse.content });

        const jsonString = extractFirstJsonObject(llmResponse.content);

        if (!jsonString) {
            logger.error('[EVAL_API][JSON_PARSE_FAIL] No JSON object found in LLM response after extraction.', {
                rawContent: llmResponse.content,
                ...logContext,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        name: 'ParsingError',
                        message: 'LLM response did not contain a valid JSON object after extraction.',
                        rawContent: llmResponse.content,
                    },
                },
                { status: 500 }
            );
        }

        let evaluationResult: EvaluationOutput;
        try {
            const parsedContent = JSON.parse(jsonString);
            evaluationResult = parsedContent as EvaluationOutput;

            // Additional validation/transformation if needed due to LLM variability
            // For example, if gaps can be strings or objects, ensure they are consistently objects here
            if (Array.isArray(evaluationResult.gaps)) {
                evaluationResult.gaps = evaluationResult.gaps.map((gap) => {
                    if (typeof gap === 'string') {
                        return { gap: gap, solution: 'N/A' }; // Default solution if only string is provided
                    } else {
                        return gap; // Already an object
                    }
                });
            }
            // Apply similar logic for strengths and alignmentHighlights if they also show variability

            logger.info('[EVAL_API][JSON_PARSE_SUCCESS] Successfully parsed LLM response into EvaluationOutput.', logContext);
        } catch (parseError: unknown) {
            logger.error('[EVAL_API][JSON_PARSE_ERROR] Failed to parse LLM response JSON.', {
                jsonString: jsonString,
                parseError: parseError instanceof Error ? parseError.message : String(parseError),
                ...logContext,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        name: 'JSONParsingError',
                        message: `Failed to parse LLM response into EvaluationOutput: ${parseError instanceof Error ? parseError.message : String(parseError)} `,
                        rawContent: jsonString,
                    },
                },
                { status: 500 }
            );
        }

        // Handle cases where fitScorePercentage might not be directly returned by LLM
        if (evaluationResult.fitScorePercentage === undefined && evaluationResult.overallFitScore !== undefined) {
            evaluationResult.fitScorePercentage = evaluationResult.overallFitScore; // Corrected to overallFitScore
            logger.debug('[EVAL_API][FIT_SCORE_FALLBACK] Setting fitScorePercentage from overallFitScore.', logContext);
        }

        opportunity.evaluationResult = JSON.parse(JSON.stringify(evaluationResult));

        logger.info('[EVAL_API][SUCCESS] Opportunity evaluation completed successfully.', {
            evaluationId: routeId,
            ...logContext,
        });
        return NextResponse.json(
            { success: true, evaluation: evaluationResult, memoryResults },
            { status: 200 } // Explicitly set status to 200 for success
        );
    } catch (error: unknown) {
        logger.error('[EVAL_API][UNEXPECTED_ERROR] An unexpected error occurred during opportunity evaluation.', {
            errorMessage: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            ...logContext,
        });
        return NextResponse.json(
            {
                success: false,
                error: {
                    name: error instanceof Error ? error.name : 'UnknownError',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
                    stack: error instanceof Error ? error.stack : undefined,
                    rawContent: JSON.stringify(error), // Include raw content of the error for debugging
                },
            },
            { status: 500 }
        );
    }
}
