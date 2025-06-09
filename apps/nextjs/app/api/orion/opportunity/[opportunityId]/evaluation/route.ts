import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES, constructLlmMessages } from '@shared/lib/orion_llm';
import { fetchOpportunityByIdFromNotion, updateNotionOpportunity } from '@shared/lib/notion_service';
import { fetchUserProfile } from '@shared/lib/profile_service'; // Import the new profile service
import { auth } from '@shared/auth';
import { EvaluationOutput } from '@shared/types/opportunity';
import type { MemoryPayload } from '@shared/types/orion'; // Import MemoryPayload type
import { logger } from '@shared/lib/logger';

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
): Promise<NextResponse<EvaluationApiResponse>> { // Use the defined response type
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { opportunityId } = resolvedParams;

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }

  try {
    // Receive optional web context from the frontend
    let frontendCompanyWebContext: string | undefined = undefined;
    try {
      const body = await request.json().catch(() => ({})); // Provide default empty object if parsing fails
      frontendCompanyWebContext = body?.companyWebContext;
      console.log('[EVAL_API][SUCCESS] Parsed request body:', { frontendCompanyWebContext });
    } catch (error) {
      console.warn('[EVAL_API][WARN] Could not parse request body as JSON, proceeding without it.', error);
      // This is not a fatal error, we can proceed without the frontend context
    }

    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error || 'Failed to fetch opportunity details from Notion.' }, { status: 500 });
    }

    const opportunity = opportunityResult.opportunity;
    if (!opportunity) {
      return NextResponse.json({ success: false, error: 'Opportunity not found.' }, { status: 404 });
    }
    // Normalize company/companyOrInstitution for downstream use
    const company = (opportunity.company ?? (opportunity as any).companyOrInstitution ?? '') || '';
    const companyOrInstitution = ((opportunity as any).companyOrInstitution ?? opportunity.company ?? '') || '';
    // Use jobUrl if available, otherwise fallback to url
    const jobUrl = (opportunity as any).jobUrl || opportunity.url;

    // Fetch user profile data
    let profileError: string | null = null;
    const profileData = await fetchUserProfile();
    let profileContext = "User profile data not available.";
    if (profileData) {
      // Dynamically include all fields except 'source'
      const fields = Object.entries(profileData)
        .filter(([k]) => k !== "source")
        .map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v || "N/A"}`)
        .join("\n");
      profileContext = `User Profile Details (source: ${profileData.source || "unknown"}):\n${fields}`;
    } else {
      profileError = "User profile data could not be loaded from Notion or local files. Check Notion API key, URL, and local fallback files.";
    }

    // Fetch relevant memories
    let memoryResults: MemoryPayload[] = []; // Use MemoryPayload type
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Opportunity evaluation context for ${opportunity.title} at ${companyOrInstitution}`, // Tailor memory query
          limit: 5, // Adjust limit as needed
          // Optionally add filters here based on opportunity details or user intent
        }),
      });

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        if (memoryData.success && memoryData.results) {
          memoryResults = memoryData.results; // memoryData.results should be MemoryPayload[]
          console.log('[EVAL_API] Successfully fetched memory results.', memoryResults.length);
        } else {
           console.warn('[EVAL_API] Memory search proxy returned success: false or no results.', memoryData);
        }
      } else {
         console.error('[EVAL_API] Failed to call internal memory search proxy:', memoryResponse.status, memoryResponse.statusText);
      }
    } catch (memoryError: any) {
       console.error('[EVAL_API] Error calling internal memory search proxy:', memoryError);
    }

    // Integrate web research (company overview) and scraping (job URL) by calling the proxy API route
    // Prioritize frontend web context if provided, otherwise perform backend search
    let combinedWebContext: string = frontendCompanyWebContext || "";

    if (!frontendCompanyWebContext) {
      // Only perform backend company search if frontend context was NOT provided
      const webContextParts = [];

      // 1. Fetch company overview using web search
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
               console.error('[EVAL_API] Failed to call research proxy for company search:', companySearchResponse.status, companySearchResponse.statusText);
          } else {
              const searchData = await companySearchResponse.json();
              if (searchData.success && searchData.results && searchData.results.length > 0) {
                   const formattedResults = searchData.results.map((result: any, index: number) =>
                      `Source ${index + 1}: ${result.url || 'N/A'}\nTitle: ${result.title || 'N/A'}\nSnippet: ${result.snippet || 'No snippet'}`
                   ).join('\n\n---\n\n');
                   webContextParts.push(`Company Overview Search Results:\n${formattedResults}`);
                   console.log('[EVAL_API] Successfully fetched backend company web research context.');
              } else {
                  console.warn('[EVAL_API] Backend company research proxy returned success: false or no results.', searchData);
              }
          }

      } catch (companyResearchError: any) {
          console.error('[EVAL_API] Error calling research proxy for backend company search:', companyResearchError);
      }

      // 2. Scrape Job URL if available (always scrape job URL regardless of frontend context)
      if (jobUrl) {
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
                   console.error('[EVAL_API] Failed to call research proxy for URL scraping:', scrapeResponse.status, scrapeResponse.statusText);
              } else {
                  const scrapeData = await scrapeResponse.json();
                  // Assuming the scrape endpoint returns the main text content in results
                  if (scrapeData.success && scrapeData.results) {
                       // Append scraped job URL content to frontend context
                       combinedWebContext += '\n\n---\n\n' + `Job Posting Content (Scraped from ${jobUrl}):\n${scrapeData.results}`;
                       console.log('[EVAL_API] Successfully scraped job URL and appended to frontend context.');
                  } else {
                      console.warn('[EVAL_API] Scrape proxy returned success: false or no results.', scrapeData);
                  }
              }

          } catch (scrapeError: any) {
              console.error('[EVAL_API] Error calling research proxy for URL scraping:', scrapeError);
          }
      }

      // Combine backend web context parts if frontend context was not used
      if (webContextParts.length > 0) {
          combinedWebContext = webContextParts.join('\n\n---\n\n');
      }

    } else {
      // If frontend context was provided, log that we are using it and just scrape the job URL if available
      console.log('[EVAL_API] Using company web context provided from frontend.');

       if (jobUrl) {
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
                   console.error('[EVAL_API] Failed to call research proxy for URL scraping:', scrapeResponse.status, scrapeResponse.statusText);
              } else {
                  const scrapeData = await scrapeResponse.json();
                  // Assuming the scrape endpoint returns the main text content in results
                  if (scrapeData.success && scrapeData.results) {
                       // Append scraped job URL content to frontend context
                       combinedWebContext += '\n\n---\n\n' + `Job Posting Content (Scraped from ${jobUrl}):\n${scrapeData.results}`;
                       console.log('[EVAL_API] Successfully scraped job URL and appended to frontend context.');
                  } else {
                      console.warn('[EVAL_API] Scrape proxy returned success: false or no results.', scrapeData);
                  }
              }

          } catch (scrapeError: any) {
              console.error('[EVAL_API] Error calling research proxy for URL scraping:', scrapeError);
          }
      }
    }

    // Construct the prompt for LLM evaluation using the helper function
    const messages = constructLlmMessages({
      requestType: REQUEST_TYPES.OPPORTUNITY_EVALUATION,
      primaryContext: `Job Title: ${opportunity.title}\nCompany: ${companyOrInstitution}\n${jobUrl ? `Job URL: ${jobUrl}\n` : ''}\nJob Content:\n${opportunity.content ?? 'No content provided.'}\n\nWeb Research and Scraped Context (if available and relevant):\n${combinedWebContext || 'No relevant web context found.'}\n\nProvide a detailed evaluation, including:\n1. A Fit Score (0-100%).\n2. A concise Recommendation (e.g., Strong Fit, Moderate Fit, Limited Fit).\n3. Key Pros: What makes this a good fit based on the profile, JD, and context?\n4. Key Cons: What are the potential challenges or gaps?\n5. Missing Skills/Experience: Specific areas where the profile may be lacking based on the JD and context.\n6. A brief explanation for the overall score, referencing the provided context.\n\nFormat the output as a JSON object with the following keys: fitScorePercentage (number), recommendation (string), pros (string[]), cons (string[]), missingSkills (string[]), scoreExplanation (string).\n`,
      profileContext: profileContext,
      memoryResults: memoryResults,
      // systemContext can be added here if needed
    });

    const llmResponseContent = await generateLLMResponse(
      REQUEST_TYPES.OPPORTUNITY_EVALUATION,
      messages.map(m => `${m.role}: ${m.content}`).join('\n\n'),
      {
        profileContext: profileContext,
        memoryResults: memoryResults,
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!llmResponseContent) {
      return NextResponse.json({ success: false, error: 'LLM failed to generate evaluation.' }, { status: 500 });
    }

    // Attempt to parse the LLM response as JSON
    let evaluation: EvaluationOutput;
    try {
      // Robust extraction/repair step
      let extractedJson = extractFirstJsonObject(llmResponseContent);
      console.log('[EVAL_API][DEBUG] Raw LLM output:', llmResponseContent);
      console.log('[EVAL_API][DEBUG] Extracted JSON for parsing:', extractedJson);
      if (!extractedJson) {
        throw new Error('No JSON object found in LLM response.');
      }
      evaluation = JSON.parse(extractedJson) as EvaluationOutput;
      // Basic validation to ensure parsed object matches expected structure
      if (typeof evaluation.fitScorePercentage !== 'number' || typeof evaluation.recommendation !== 'string') {
           // Add more comprehensive validation here if necessary
           throw new Error('Parsed evaluation data has incorrect structure or missing key fields.');
      }
    } catch (parseError: any) {
      console.error('[EVAL_API][ERROR] Failed to parse LLM evaluation response:', { llmResponseContent, parseError });
      // Return the raw content if parsing fails, or a specific error
      return NextResponse.json({
        success: false,
        error: 'Failed to parse LLM evaluation response.',
        rawContent: llmResponseContent,
        parseError: parseError?.message || parseError?.toString() || 'Unknown parse error',
      }, { status: 500 });
    }

    logger.info('Evaluation generated successfully. Returning to client for local storage.', {
        operation: 'POST /evaluation',
        opportunityId: opportunityId,
    });

    // Return the evaluation results, memory snippets, profile source, and profile error if any
    return NextResponse.json({
      success: true,
      evaluation,
      memoryResults,
      profileSource: profileData?.source || "unknown",
      profileError
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/opportunity/[opportunityId]/evaluation:', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred during evaluation.' }, { status: 500 });
  }
}
