/**
 * @fileoverview API route for evaluating job opportunities, education programs, or project collaborations using LLM.
 * @description This route orchestrates a comprehensive evaluation process by fetching Tomide's profile and relevant memories,
 * constructing a detailed prompt, invoking an LLM to generate an evaluation, and returning a structured JSON response.
 * It serves as the backend for the opportunity evaluation feature in the Orion Admin Dashboard.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint that receives opportunity details from the frontend.
 *   - To dynamically construct an LLM prompt incorporating Tomide's profile, goals, and retrieved past experiences.
 *   - To call an external LLM service to generate a structured evaluation of the opportunity.
 *   - To parse and return the LLM's evaluation in a consistent format (EvaluationOutput).
 *   - To ensure robust authentication and error handling for evaluation requests.
 *
 * FILEPATH: `app/api/orion/opportunity/evaluate/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `ORION_MEMORY_COLLECTION_NAME` and `OPPORTUNITY_EVALUATION_REQUEST_TYPE` from `@/lib` for configuration.
 *   - `OrionOpportunityDetails` and `ScoredMemoryPoint` from `@/lib/types` for type definitions.
 *   - `NextRequest` and `NextResponse` from `next/server` for handling API requests and responses.
 *   - `/api/orion/profile`: Fetches Tomide's static profile context for the LLM prompt.
 *   - `/api/orion/memory/search`: Searches Orion's vector memory for relevant past experiences to enrich the LLM prompt.
 *   - `/api/orion/llm`: The core LLM interaction API route, which this route calls to generate the evaluation.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging throughout the API route.
 *   - `@/lib/utils/errorHandler`: Integrated for centralized and consistent error handling.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid bearer token is provided in the authorization header for security.
 *   - Assumes the LLM service (`/api/orion/llm`) is operational and capable of returning structured JSON.
 *   - Includes fallback static profile context if fetching the dynamic profile fails, ensuring resilience.
 *   - Handles potential wrapping of LLM JSON output in markdown code blocks (`extractFirstJsonObject` for robustness).
 *
 * NOTES:
 *   - This API route is a critical part of Orion's AI capabilities, enabling data-driven decision support for opportunities.
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: This route centralizes the evaluation logic, replacing any ad-hoc evaluation calls.
 *   - **PERFORMANCE OPTIMIZATIONS**: Consider caching LLM responses for frequently evaluated, static opportunity descriptions to reduce latency and API costs.
 *   - **ERROR HANDLING ROBUSTNESS**: Uses `handleApiError` for consistent error responses and detailed logging.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Input Validation**: Implement Zod schema validation for the request body (`opportunityDetails`) to ensure robust input handling and provide clearer client-side errors.
 *   - **Asynchronous Processing**: For very long-running LLM evaluations, consider an asynchronous pattern (e.g., webhook callbacks or polling) to prevent timeouts.
 *   - **User-Specific Memory Filtering**: Enhance memory search by including more user-specific filters (e.g., date ranges, specific tags).
 *   - **Evaluation History**: Persist the generated evaluation results to the database, linking them to the `Opportunity` record, to build an evaluation history.
 */
import { ORION_MEMORY_COLLECTION_NAME, OPPORTUNITY_EVALUATION_REQUEST_TYPE } from '@/lib';
import { OrionOpportunityDetails, ScoredMemoryPoint, EvaluationOutput, EvaluationGapDetail } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger'; // Import logger
import { handleApiError } from '@/lib/utils/errorHandler'; // Import centralized error handler
import { extractFirstJsonObject } from '@/lib/utils/jsonExtractor'; // Import the new utility

/**
 * API route for evaluating opportunities
 */
export async function POST(req: NextRequest) {
  const logContext = { route: '/api/orion/opportunity/evaluate', method: 'POST' };
  logger.info('[EVAL_API][START]', logContext);

  // Get the token from the authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('[EVAL_API][UNAUTHORIZED]', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const opportunityDetails: OrionOpportunityDetails = await req.json();
    logger.debug('[EVAL_API][PAYLOAD]', { ...logContext, opportunityDetails });

    // Validate required fields
    if (!opportunityDetails.title || !opportunityDetails.content || !opportunityDetails.type) {
      logger.error('[EVAL_API][VALIDATION_ERROR]', { ...logContext, message: 'Missing required opportunity details.' });
      const handledError = handleApiError(
        new Error('Missing required opportunity details: title, description, and type.'),
        {
          ...logContext,
          status: 400,
        }
      );
      return NextResponse.json(
        { success: false, error: handledError.message, details: handledError.data },
        { status: handledError.status || 500 }
      );
    }

    // Fetch Tomide's profile context
    let profileContext = '';
    try {
      const profileResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/orion/profile`);
      profileContext = await profileResponse.text();
      logger.info('[EVAL_API][PROFILE_FETCH_SUCCESS]', logContext);
    } catch (error: unknown) {
      logger.error('[EVAL_API][PROFILE_FETCH_ERROR]', {
        ...logContext,
        error: error instanceof Error ? error.message : String(error),
      });
      profileContext =
        'Tomide is an analytical systems thinker with a background in law and a strong interest in product management, process improvement, and technology (especially FinTech/LegalTech). Key skills include: Python, TypeScript, Next.js, systems design, LLM integration, data analysis. He aims for roles with growth, stability, low direct coding, and relocation potential to US/CA/UK/EU+. Core values: Freedom, Logic, Growth, Stability, Creation.';
      logger.warn('[EVAL_API][PROFILE_FALLBACK]', logContext);
    }

    // Fetch relevant past experiences from memory
    let pastExperiencesContext = 'No specific past experiences retrieved from memory for this evaluation.';
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const memorySearchResponse = await fetch(`${baseUrl}/api/orion/memory/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Experiences, decisions, or outcomes related to ${opportunityDetails.type} like "${opportunityDetails.title}" or involving skills relevant to this opportunity.`,
          collectionName: ORION_MEMORY_COLLECTION_NAME,
          limit: 5,
        }),
      });

      const memoryData = await memorySearchResponse.json();

      if (memoryData.success && memoryData.results && memoryData.results.length > 0) {
        pastExperiencesContext =
          'Relevant Past Experiences/Reflections from Memory:\n' +
          memoryData.results
            .map(
              (item: ScoredMemoryPoint, i: number) =>
                `${i + 1}. (Source: ${item.payload.source_id}, Type: ${item.payload.type}): "${item.payload.text.substring(0, 200)}..."`
            )
            .join('\n');
        logger.info('[EVAL_API][MEMORY_SEARCH_SUCCESS]', { ...logContext, resultsCount: memoryData.results.length });
      }
    } catch (error: unknown) {
      logger.error('[EVAL_API][MEMORY_SEARCH_ERROR]', {
        ...logContext,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Construct prompt for LLM
    const evaluationPrompt = `
# Opportunity Evaluation Task\n\nYou are Orion, an AI Life-Architecture System. Your task is to evaluate the following Opportunity against Tomide's profile, goals, and past experiences.\n\n## Tomide's Profile & Goals:\n${profileContext}\n\n## Relevant Past Experiences:\n${pastExperiencesContext}\n\n## Opportunity Details:\nTitle: ${opportunityDetails.title}\nType: ${opportunityDetails.type}\n${opportunityDetails.url ? `URL: ${opportunityDetails.url}` : ''}\nDescription:\n"""\n${opportunityDetails.content}\n"""\n\n## Evaluation Instructions:\nPlease provide a structured evaluation in JSON format with the following fields:\n\n1. "overallFitScore": An estimated percentage (0-100) of how well Tomide's profile, skills, and goals align with this Opportunity.\n2. "summary": A concise paragraph providing an overall summary of the evaluation.\n3. "strengths": An array of objects, where each object has a "title" (string) and "reasoning" (string), listing key points of strong alignment. If the LLM produces a simple string, convert it to this format. Example: [{"title": "Strong Analytical Skills", "reasoning": "Demonstrated in past projects."}]\n4. "gaps": An array of objects, where each object has a "gap" (string) and "solution" (string), identifying potential gaps, missing qualifications, or areas of concern. If the LLM produces a simple string, convert it to this format. Example: [{"gap": "No API automation experience", "solution": "Take a Selenium course."}]\n5. "suggestedCvComponents": An array of objects, where each object has a "component" (string) and "reasoning" (string), listing specific CV components Tomide should consider highlighting or creating.\n6. "suggestedNextSteps": An array of strings with 2-3 concrete, actionable next steps Tomide could take based on the recommendation.\n7. "alignmentHighlights": An array of objects, where each object has a "title" (string) and "reasoning" (string), listing key points of strong alignment that are distinct from general strengths. If the LLM produces a simple string, convert it to this format.\n8. "riskRewardAnalysis": An object with optional keys ("potentialRewards", "potentialRisks", "timeInvestment", "financialConsiderations", "careerImpact"), each containing a string or array of strings explaining aspects of the Opportunity falling into that category.\n9. "recommendation": Your overall recommendation string ('Pursue', 'Delay & Prepare', 'Reject', 'Consider Further').\n10. "reasoning": A concise paragraph explaining the rationale behind your recommendation and fit score. (Note: this is a duplicate field for clarity, consider consolidating with 'summary').\n\nAnalyze thoroughly, referencing Tomide's desire for growth, stability, low-direct-coding (for job roles), relocation potential, and ROI (for education/career). Be realistic and strategic.\n\n## Output Format:\nProvide your evaluation as a valid JSON object with the structure described above. Do not include any additional text or explanations outside the JSON object.
`;

    // Call LLM for evaluation
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const llmResponse = await fetch(`${baseUrl}/api/orion/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: OPPORTUNITY_EVALUATION_REQUEST_TYPE,
        primaryContext: evaluationPrompt,
        temperature: 0.3,
        maxTokens: 2000,
      }),
    });

    const llmData = await llmResponse.json();
    logger.debug('[EVAL_API][LLM_RAW_RESPONSE]', { ...logContext, llmData });

    if (!llmData.success || !llmData.content) {
      logger.error('[EVAL_API][LLM_RESPONSE_ERROR]', { ...logContext, error: llmData.error || 'No content from LLM' });
      const handledError = handleApiError(new Error(llmData.error || 'Failed to generate Opportunity evaluation'), {
        ...logContext,
        status: 500,
      });
      return NextResponse.json(
        { success: false, error: handledError.message, details: handledError.data },
        { status: handledError.status || 500 }
      );
    }

    let evaluation: EvaluationOutput;
    try {
      const jsonString = extractFirstJsonObject(llmData.content);
      if (!jsonString) {
        logger.error('[EVAL_API][JSON_EXTRACTION_FAIL] No JSON object found in LLM response after extraction.', {
          rawContent: llmData.content,
          ...logContext,
        });
        const handledError = handleApiError(
          new Error('LLM response did not contain a valid JSON object after extraction.'),
          {
            ...logContext,
            rawContent: llmData.content,
            status: 500,
          }
        );
        return NextResponse.json(
          { success: false, error: handledError.message, details: handledError.data },
          { status: handledError.status || 500 }
        );
      }

      const parsedEvaluation = JSON.parse(jsonString) as EvaluationOutput;

      // Apply robust mapping for strengths, gaps, and alignmentHighlights
      parsedEvaluation.strengths = (parsedEvaluation.strengths || []).map((s: any) =>
        typeof s === 'string' ? { title: s, reasoning: 'N/A' } : s
      );
      parsedEvaluation.gaps = (parsedEvaluation.gaps || []).map((g: any) =>
        typeof g === 'string' ? { gap: g, solution: 'N/A' } : g
      );
      parsedEvaluation.alignmentHighlights = (parsedEvaluation.alignmentHighlights || []).map((ah: any) =>
        typeof ah === 'string' ? { title: ah, reasoning: 'N/A' } : ah
      );

      evaluation = parsedEvaluation;
      logger.info('[EVAL_API][JSON_PARSE_SUCCESS]', logContext);
      return NextResponse.json({ success: true, evaluation });
    } catch (parseError: unknown) {
      logger.error('[EVAL_API][JSON_PARSE_ERROR]', {
        ...logContext,
        parseError: parseError instanceof Error ? parseError.message : String(parseError),
        rawContent: llmData.content,
      });
      const handledError = handleApiError(
        new Error(
          `Failed to parse LLM response JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`
        ),
        {
          ...logContext,
          rawContent: llmData.content,
          status: 500,
        }
      );
      return NextResponse.json(
        { success: false, error: handledError.message, details: handledError.data },
        { status: handledError.status || 500 }
      );
    }
  } catch (error: unknown) {
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      { success: false, error: handledError.message, details: handledError.data },
      { status: handledError.status || 500 }
    );
  }
}
