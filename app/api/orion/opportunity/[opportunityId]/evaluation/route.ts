import { auth } from '@/auth';
import { generateLLMResponse } from '@/lib/llm_providers';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { REQUEST_TYPES } from '@/lib/orion_llm';
import { EvaluationOutput, MemoryPayload } from '@/lib/types';
import { fetchUserProfile } from '@/profile_service';
import logger from '@/lib/logger';

import { NextRequest, NextResponse } from 'next/server';

// Define the response type for the evaluation API
interface EvaluationApiResponse {
  success: boolean;
  evaluation?: EvaluationOutput;
  error?: string;
  rawContent?: string; // For parsing errors
  memoryResults?: MemoryPayload[]; // Add memoryResults to the response type
}

// Utility: Extract first JSON object from a string (removes markdown/code blocks, etc.)
function extractFirstJsonObject(text: string): string | null {
  if (!text) return null;
  // Remove markdown code block wrappers
  const cleaned = text.replace(/```[a-zA-Z]*\n?|```/g, '').trim();
  // Find the first {...} block (non-greedy)
  const match = cleaned.match(/\{[\s\S]*?\}/);
  return match ? match[0] : null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
): Promise<NextResponse<EvaluationApiResponse>> {
  logger.info('[EVAL_API][START] Initiating opportunity evaluation POST request.', {
    opportunityId: params.opportunityId,
    method: request.method,
  });
  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[EVAL_API][AUTH_FAIL] Unauthorized access attempt detected. User session invalid.');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { opportunityId } = resolvedParams;
  logger.debug('[EVAL_API][PARAM_RESOLVED] Opportunity ID resolved from parameters.', { opportunityId });

  if (!opportunityId) {
    logger.error('[EVAL_API][VALIDATION_ERROR] Opportunity ID is missing from the request.', { status: 400 });
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }

  try {
    // Receive optional web context from the frontend
    let frontendCompanyWebContext: string | undefined = undefined;
    try {
      const body = await request.json().catch((error) => {
        logger.warn(
          '[EVAL_API][BODY_PARSE_WARN] Failed to parse request body as JSON. Proceeding without frontend context.',
          {
            error: error instanceof Error ? error.message : String(error),
            originalBody: request.body ? JSON.stringify(request.body) : 'N/A',
          }
        );
        return {}; // Provide default empty object if parsing fails
      });
      frontendCompanyWebContext = body?.companyWebContext;
      logger.info('[EVAL_API][BODY_PARSE_SUCCESS] Successfully parsed request body for frontend company web context.', {
        frontendCompanyWebContext: !!frontendCompanyWebContext,
      });
    } catch (error: unknown) {
      // This outer catch handles unexpected errors during the parsing block, though the inner catch should handle most JSON parsing issues.
      logger.warn('[EVAL_API][WARN] An unexpected error occurred during request body parsing.', {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
    }

    logger.info('[EVAL_API][NOTION_FETCH] Attempting to fetch opportunity details from Notion.', { opportunityId });
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      logger.error('[EVAL_API][NOTION_FETCH_FAIL] Failed to fetch Opportunity details from Notion.', {
        opportunityId,
        error: opportunityResult.error,
      });
      return NextResponse.json(
        {
          success: false,
          error: opportunityResult.error || 'Failed to fetch Opportunity details from Notion.',
        },
        { status: 500 }
      );
    }

    const OrionOpportunity = opportunityResult.OrionOpportunity;
    if (!OrionOpportunity) {
      logger.warn('[EVAL_API][NOTION_NOT_FOUND] Opportunity not found in Notion.', { opportunityId });
      return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
    }
    logger.info('[EVAL_API][NOTION_SUCCESS] Successfully fetched opportunity details.', {
      opportunityId,
      title: OrionOpportunity.title,
    });
    // Normalize company/companyOrInstitution for downstream use
    const companyOrInstitution = (OrionOpportunity.companyOrInstitution ?? OrionOpportunity.company ?? '') || '';
    logger.debug('[EVAL_API][COMPANY_NORMALIZED] Company or institution name normalized.', { companyOrInstitution });
    // Use sourceUrl if available, otherwise fallback to url
    const jobUrl = OrionOpportunity.sourceUrl || OrionOpportunity.url;
    logger.debug('[EVAL_API][JOB_URL_RESOLVED] Job URL resolved.', { jobUrl });

    // Fetch user profile data
    let profileError: string | null = null;
    logger.info('[EVAL_API][PROFILE_FETCH] Attempting to fetch user profile data.');
    const profileData = await fetchUserProfile();
    let profileContext = 'User profile data not available.';
    if (profileData) {
      logger.info('[EVAL_API][PROFILE_SUCCESS] User profile data successfully fetched.');
      // Dynamically include all fields except 'source'
      const fields = Object.entries(profileData)
        .filter(([k]) => k !== 'source')
        .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v || 'N/A'}`)
        .join('\n');
      profileContext = `User Profile Details (source: ${profileData.source || 'unknown'}):\n${fields}`;
    } else {
      profileError =
        'User profile data could not be loaded from Notion or local files. Check Notion API key, URL, and local fallback files.';
      logger.error('[EVAL_API][PROFILE_FAIL] ' + profileError);
    }

    // Fetch relevant memories
    let memoryResults: MemoryPayload[] = []; // Use MemoryPayload type
    logger.info('[EVAL_API][MEMORY_FETCH] Attempting to fetch relevant memories.', {
      opportunityTitle: OrionOpportunity.title,
      company: companyOrInstitution,
    });
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Opportunity evaluation context for ${OrionOpportunity.title} at ${companyOrInstitution}`, // Tailor memory query
          limit: 5, // Adjust limit as needed
          // Optionally add filters here based on Opportunity details or user intent
        }),
      });

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        if (memoryData.success && memoryData.results) {
          memoryResults = memoryData.results; // memoryData.results should be MemoryPayload[]
          logger.info('[EVAL_API][MEMORY_SUCCESS] Successfully fetched memory results.', {
            count: memoryResults.length,
          });
        } else {
          logger.warn('[EVAL_API][MEMORY_NO_RESULTS] Memory search proxy returned success: false or no results.', {
            memoryData,
          });
        }
      } else {
        logger.error('[EVAL_API][MEMORY_PROXY_FAIL] Failed to call internal memory search proxy:', {
          status: memoryResponse.status,
          statusText: memoryResponse.statusText,
        });
      }
    } catch (memoryError: unknown) {
      logger.error('[EVAL_API][MEMORY_ERROR] Error calling internal memory search proxy:', {
        errorMessage: memoryError instanceof Error ? memoryError.message : String(memoryError),
      });
    }

    // Integrate web research (company overview) and scraping (job URL) by calling the proxy API route
    // Prioritize frontend web context if provided, otherwise perform backend search
    let combinedWebContext: string = frontendCompanyWebContext || '';
    logger.info('[EVAL_API][WEB_CONTEXT] Determining web context for evaluation.', {
      usingFrontendContext: !!frontendCompanyWebContext,
    });

    if (!frontendCompanyWebContext) {
      logger.info('[EVAL_API][BACKEND_RESEARCH] Frontend context not provided, performing backend web research.');
      // Only perform backend company search if frontend context was NOT provided
      const webContextParts = [];

      // 1. Fetch company overview using web search
      logger.info('[EVAL_API][COMPANY_SEARCH] Initiating web search for company overview.', {
        company: companyOrInstitution,
      });
      try {
        const companySearchResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': request.headers.get('Authorization'), // Pass down user's auth
          },
          body: JSON.stringify({
            query: `${companyOrInstitution} company overview, mission, values, recent news`,
            type: 'web', // Specify web search
            count: 3, // Limit results to avoid excessive token usage
          }),
        });

        if (!companySearchResponse.ok) {
          logger.error('[EVAL_API][COMPANY_SEARCH_FAIL] Failed to call research proxy for company search:', {
            status: companySearchResponse.status,
            statusText: companySearchResponse.statusText,
          });
        } else {
          const searchData = await companySearchResponse.json();
          logger.debug('[EVAL_API][COMPANY_SEARCH_DATA] Received searchData:', { searchData });
          if (searchData.success && searchData.results && searchData.results.length > 0) {
            logger.debug('[EVAL_API][COMPANY_SEARCH_RESULTS] Processing searchData.results:', {
              results: searchData.results,
            });
            const formattedResults = (
              searchData.results as Array<{ url?: string; title?: string; snippet?: string; text?: string }>
            )
              .map(
                (result: { url?: string; title?: string; snippet?: string; text?: string }, index: number) =>
                  `Source ${index + 1}: ${result.url || 'N/A'}\nTitle: ${
                    result.title || 'N/A'
                  }\nSnippet: ${result.snippet || 'No snippet'}\nContent: ${result.text || 'No content'}`
              )
              .join('\n\n---\n\n');
            webContextParts.push(`Company Overview Search Results:\n${formattedResults}`);
            logger.info(
              '[EVAL_API][COMPANY_SEARCH_SUCCESS] Successfully fetched backend company web research context.',
              { resultCount: searchData.results.length }
            );
          } else {
            logger.warn(
              '[EVAL_API][COMPANY_SEARCH_NO_RESULTS] Backend company research proxy returned success: false or no results.',
              { searchData }
            );
          }
        }
      } catch (companyResearchError: unknown) {
        logger.error('[EVAL_API][COMPANY_SEARCH_ERROR] Error calling research proxy for backend company search:', {
          errorMessage:
            companyResearchError instanceof Error ? companyResearchError.message : String(companyResearchError),
        });
      }

      // 2. Scrape Job URL if available (always scrape job URL regardless of frontend context)
      if (jobUrl) {
        logger.info('[EVAL_API][JOB_URL_SCRAPE] Initiating job URL scraping.', { jobUrl });
        try {
          const scrapeResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': request.headers.get('Authorization'), // Pass down user's auth
            },
            body: JSON.stringify({
              url: jobUrl,
              type: 'scrape', // Specify scrape type
            }),
          });

          if (!scrapeResponse.ok) {
            logger.error('[EVAL_API][JOB_URL_SCRAPE_FAIL] Failed to call research proxy for URL scraping:', {
              status: scrapeResponse.status,
              statusText: scrapeResponse.statusText,
            });
          } else {
            const scrapeData = await scrapeResponse.json();
            // Assuming the scrape endpoint returns the main text content in results
            if (scrapeData.success && scrapeData.results) {
              // Append scraped job URL content to frontend context
              combinedWebContext +=
                '\n\n---\n\n' + `Job Posting Content (Scraped from ${jobUrl}):\n${scrapeData.results}`;
              logger.info(
                '[EVAL_API][JOB_URL_SCRAPE_SUCCESS] Successfully scraped job URL and appended to combined web context.'
              );
            } else {
              logger.warn('[EVAL_API][JOB_URL_SCRAPE_NO_RESULTS] Scrape proxy returned success: false or no results.', {
                scrapeData,
              });
            }
          }
        } catch (scrapeError: unknown) {
          logger.error('[EVAL_API][JOB_URL_SCRAPE_ERROR] Error calling research proxy for URL scraping:', {
            errorMessage: scrapeError instanceof Error ? scrapeError.message : String(scrapeError),
          });
        }
      }

      // Combine backend web context parts if frontend context was not used
      if (webContextParts.length > 0) {
        combinedWebContext = webContextParts.join('\n\n---\n\n');
        logger.debug('[EVAL_API][WEB_CONTEXT_COMBINED] Backend web context parts combined.', {
          length: combinedWebContext.length,
        });
      }
    } else {
      // If frontend context was provided, log that we are using it and just scrape the job URL if available
      logger.info('[EVAL_API][FRONTEND_CONTEXT_USED] Using company web context provided from frontend.');

      if (jobUrl) {
        logger.info(
          '[EVAL_API][FRONTEND_CONTEXT_JOB_URL_SCRAPE] Job URL available, initiating scraping alongside frontend context.',
          { jobUrl }
        );
        try {
          const scrapeResponse = await fetch(`${request.nextUrl.origin}/api/orion/research`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': request.headers.get('Authorization'), // Pass down user's auth
            },
            body: JSON.stringify({
              url: jobUrl,
              type: 'scrape', // Specify scrape type
            }),
          });

          if (!scrapeResponse.ok) {
            logger.error(
              '[EVAL_API][FRONTEND_CONTEXT_JOB_URL_SCRAPE_FAIL] Failed to call research proxy for URL scraping:',
              { status: scrapeResponse.status, statusText: scrapeResponse.statusText }
            );
          } else {
            const scrapeData = await scrapeResponse.json();
            // Assuming the scrape endpoint returns the main text content in results
            if (scrapeData.success && scrapeData.results) {
              // Append scraped job URL content to frontend context
              combinedWebContext +=
                '\n\n---\n\n' + `Job Posting Content (Scraped from ${jobUrl}):\n${scrapeData.results}`;
              logger.info(
                '[EVAL_API][FRONTEND_CONTEXT_JOB_URL_SCRAPE_SUCCESS] Successfully scraped job URL based on frontend context.'
              );
            } else {
              logger.warn(
                '[EVAL_API][FRONTEND_CONTEXT_JOB_URL_SCRAPE_NO_RESULTS] Scrape proxy returned success: false or no results.',
                { scrapeData }
              );
            }
          }
        } catch (scrapeError: unknown) {
          logger.error(
            '[EVAL_API][FRONTEND_CONTEXT_JOB_URL_SCRAPE_ERROR] Error calling research proxy for URL scraping with frontend context:',
            { errorMessage: scrapeError instanceof Error ? scrapeError.message : String(scrapeError) }
          );
        }
      }
    }

    // Define the JSON output format block as a separate string to avoid escaping issues
    const jsonOutputFormat = `\`\`\`json
{
  "alignmentScore": number,
  "keyAlignmentPoints": string[],
  "areasForImprovement": string[],
  "tailoredKeywords": string[]
}
\`\`\``;

    // Construct prompt for LLM
    const prompt = `You are an expert career consultant specializing in helping professionals align their skills and experience with job opportunities. Your task is to analyze the provided user profile, job opportunity details, and any additional context (web research, memory data) to generate a comprehensive evaluation. This evaluation should focus on:\n\n1.  **Alignment Score**: A numerical score from 1-10 (10 being perfect alignment) indicating how well the user's profile aligns with the job opportunity. Only include the number, nothing else.\n2.  **Key Alignment Points**: Bullet points (2-3) highlighting the strongest areas of alignment.\n3.  **Areas for Improvement**: Bullet points (2-3) suggesting specific skills, experiences, or keywords the user could develop or emphasize to better align with similar opportunities.\n4.  **Tailored Keywords**: A list of 5-10 specific keywords or phrases from the job description and your analysis that the user should consider incorporating into their resume/CV or cover letter to improve ATS matching and overall relevance.\n\n\n### User Profile:\n${profileContext}\n\n### Job Opportunity Details:\nTitle: ${OrionOpportunity.title || 'N/A'}\nCompany: ${companyOrInstitution || 'N/A'}\nLocation: ${OrionOpportunity.location || 'N/A'}\nDescription: ${OrionOpportunity.content || 'N/A'}\nOriginal URL: ${OrionOpportunity.url || 'N/A'}\nSource URL: ${OrionOpportunity.sourceUrl || 'N/A'}\n\n### Additional Context:\n${combinedWebContext || 'No additional web research context available.'}\n\n### Relevant Memories:\n${
      memoryResults.length > 0
        ? memoryResults
            .map((m) => `Title: ${m.title || 'No title'}\nContent: ${m.text || 'No content'}`)
            .join('\n\n---\n\n')
        : 'No relevant memories found.'
    }\n\n\n### Output Format:\n${jsonOutputFormat}
`;

    // Log the prompt being sent (optional, for debugging)
    logger.info('[EVAL_API] Sending prompt to LLM for evaluation...');

    // Call LLM for evaluation
    const llmResponse = await generateLLMResponse({
      requestType: REQUEST_TYPES.OPPORTUNITY_EVALUATION,
      prompt,
    });

    if (!llmResponse.success || !llmResponse.response) {
      logger.error('[EVAL_API] LLM generation failed:', { error: llmResponse.error });
      throw new Error(llmResponse.error || 'LLM failed to generate evaluation.');
    }

    // Attempt to parse the LLM response as JSON
    const jsonString = extractFirstJsonObject(llmResponse.response);

    if (!jsonString) {
      logger.error('[EVAL_API] Failed to extract JSON from LLM response:', { response: llmResponse.response });
      throw new Error('LLM response was not in expected JSON format.');
    }

    const evaluation = JSON.parse(jsonString) as EvaluationOutput; // Cast to expected type

    // Return the evaluation output
    return NextResponse.json({
      success: true,
      evaluation,
      rawContent: llmResponse.response, // Include raw content for debugging/display
      memoryResults, // Include memory results in the final response
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[OPPORTUNITY_EVALUATION_API_ERROR]', { errorMessage });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to generate Opportunity evaluation: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
