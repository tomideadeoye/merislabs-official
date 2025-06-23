/**
 * @fileoverview API route for tailoring a CV summary using LLM, based on job description analysis and web research context.
 * @description This route orchestrates the process of fetching the original profile summary component, constructing a detailed prompt for the LLM,
 * calling the LLM to generate a tailored summary, and returning the result.
 * It acts as a bridge between the frontend CV tailoring UI and the core LLM capabilities.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a backend endpoint that accepts a CV component ID (specifically for the Profile Summary), job description analysis,
 *     and optional web research context.
 *   - To retrieve the original profile summary content from Notion (or a central DB in the future).
 *   - To intelligently construct an LLM prompt that instructs the model to tailor the summary for a specific job opportunity.
 *   - To invoke the `generateLLMResponse` function to get the AI-tailored summary.
 *   - To return the tailored summary to the frontend for display and further action.
 *
 * FILEPATH: `app/api/orion/cv/tailor-summary/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Core Next.js App Router utilities for handling API requests and responses (`NextRequest`, `NextResponse`).
 *   - `prisma/schema.prisma` & `lib/cv_components_db_service.ts`: Although currently fetching from Notion, this route will eventually integrate with `cv_components_db_service.ts` to fetch CV components from the Neon PostgreSQL database, ensuring data consistency.
 *   - `app/lib/notion_service.ts`: Currently used for `getCVComponentsFromNotion` to retrieve CV data. (Target for future migration to Neon).
 *   - `app/lib/orion_config.ts`: Provides `CV_SUMMARY_TAILORING_REQUEST_TYPE` for classifying LLM requests.
 *   - `app/lib/types.ts`: Defines the `CVComponent` type, ensuring consistent data structures.
 *   - `app/lib/orion_llm.ts`: Contains the `generateLLMResponse` function, which is the core LLM interaction layer.
 *   - `app/lib/logger.ts`: Used for comprehensive, context-rich logging of the entire process, including validation, LLM calls, and error handling.
 *   - `app/lib/utils/errorHandler.ts`: (Opportunity for improvement) Can be integrated for standardized error responses and logging.
 *   - `app/opportunity/[opportunityId]/tailor-content/page.tsx`: The frontend component that calls this API route to generate tailored content.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `component_id` refers to a unique identifier for the Profile Summary component.
 *   - Assumes `jd_analysis` and `web_research_context` provide relevant and structured information for tailoring.
 *   - Assumes the Notion service is accessible and returns CV components in the expected format.
 *   - LLM is available and capable of following detailed tailoring instructions.
 *   - Authentication/authorization is handled at a higher level (middleware).
 *
 * NOTES:
 *   - The logic for fetching CV components from Notion is a candidate for migration to the Neon database (`cv_components_db_service.ts`) to align with the project's long-term data strategy.
 *   - Detailed logging is implemented to track the flow and assist with debugging LLM responses and data retrieval.
 *   - The prompt construction is critical for guiding the LLM's behavior and ensuring relevant output.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Zod Input Validation**: Implement Zod schema validation for the request body (`component_id`, `jd_analysis`, `web_research_context`) to ensure robust input handling and prevent malformed requests.
 *   - **Centralized Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for more consistent and standardized error responses and logging, reducing boilerplate.
 *   - **Database Migration**: Fully transition from `getCVComponentsFromNotion` to `cv_components_db_service.ts` to fetch CV components from Neon, completing the migration from Notion for this data type.
 *   - **Prompt Engineering Flexibility**: Allow more dynamic prompt adjustments (e.g., tone, length, specific keywords to emphasize) via request parameters.
 *   - **Asynchronous LLM Calls**: For potentially long-running LLM calls, consider implementing a mechanism for asynchronous processing and status polling, especially if this becomes part of a larger workflow.
 *   - **Caching**: Cache frequently accessed CV components to reduce database/Notion calls.
 *   - **Rate Limiting**: Implement API rate limiting to prevent abuse or excessive LLM usage.
 *
 */
import { NextRequest, NextResponse } from 'next/server';

import { getCVComponentsFromNotion } from '@/lib/notion_service'; // Import from notion_service
import { CV_SUMMARY_TAILORING_REQUEST_TYPE } from '@/lib/orion_config'; // Import request type
import { CVComponent } from '@/lib/types/cv'; // Explicitly import CVComponent from its defining file
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm'; // Corrected import for generateLLMResponse
import logger from '@/lib/logger'; // Import logger
// Removed: import { auth } from '@/auth'; // Authentication removed as per user request
import { HandledApplicationError, OrionOpportunity, UserProfileData } from '@/lib/types'; // Import HandledApplicationError from types
import { handleServerError } from '@/lib/utils/serverErrorHandler'; // Import handleServerError

/**
 * API route for tailoring a CV summary based on JD analysis using LLM
 */
export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/cv/tailor-summary',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_SUMMARY_API][START] Initiating CV summary tailoring request.', logContext);
  try {
    // Removed authentication check as per user's request
    // const session = await auth(); // Get session
    // if (!session || !session.user || !session.user.id) {
    //   logger.warn('[CV_SUMMARY_API][AUTH_FAIL] Unauthorized access attempt.', logContext);
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }
    // (logContext as { user?: string }).user = session.user.id; // Removed user ID from log context

    const body = await req.json();
    const { component_id, jd_analysis, web_research_context } = body;

    if (!component_id || !jd_analysis) {
      logger.warn('[CV_SUMMARY_API][VALIDATION_FAIL] Missing required parameters.', {
        ...logContext,
        component_id: !!component_id,
        jd_analysis: !!jd_analysis,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Component ID and JD analysis are required',
        },
        { status: 400 }
      );
    }

    logger.info('[CV_SUMMARY_API][FETCH_COMPONENTS] Fetching CV components from Notion.', {
      ...logContext,
      component_id,
    });
    // Fetch the specific component (assuming it's the profile summary)
    const allComponents = await getCVComponentsFromNotion();
    const summaryComponent = allComponents.find(
      (comp: CVComponent) => comp.uniqueId === component_id && comp.type === 'Profile Summary'
    );

    if (!summaryComponent) {
      logger.warn('[CV_SUMMARY_API][COMPONENT_NOT_FOUND] Profile Summary component not found.', {
        ...logContext,
        component_id,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Profile Summary component not found with provided ID.',
        },
        { status: 404 }
      );
    }
    if (summaryComponent.content === null || summaryComponent.content === undefined) {
      logger.warn('[CV_SUMMARY_API][EMPTY_CONTENT] Profile Summary component has no primary content.', {
        ...logContext,
        component_id,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Profile Summary component has no primary content.',
        },
        { status: 400 }
      );
    }

    const originalSummaryContent =
      typeof summaryComponent.content === 'string'
        ? summaryComponent.content
        : JSON.stringify(summaryComponent.content);

    // Construct the prompt for the LLM
    const prompt = `You are an expert CV writer. Tailor the following profile summary to be highly relevant to the provided job description analysis and company. Focus on aligning my skills and experience with the job requirements and the company's context. \n\n**Original Profile Summary:**\n${originalSummaryContent}\n\n**Job Description Analysis:**\n${jd_analysis}\n\n${
      web_research_context ? `**Relevant Web Research Context (Company Info, etc.):**\n${web_research_context}\n\n` : ''
    }**Instructions:**\nWrite a compelling and concise profile summary (4-5 sentences) based on the original summary, the job description analysis, and web research context. Highlight the most relevant experiences and skills. Maintain a professional tone. Provide ONLY the tailored summary, without any introductory or concluding remarks.`;

    logger.info('[CV_SUMMARY_API][LLM_CALL] Sending summary tailoring prompt to LLM.', {
      ...logContext,
      component_id,
      promptLength: prompt.length,
    });

    // Call the LLM
    try {
      const llmContent = await generateLLMResponse(
        CV_SUMMARY_TAILORING_REQUEST_TYPE, // Use specific request type
        prompt, // Pass the constructed prompt
        null, // userId is now nullable
        {
          temperature: 0.7,
          maxTokens: 200,
        }
      );
      // Safely access length from llmContent.content if it's a successful response
      let tailoredContentLength = 0;
      if (llmContent.success) {
        tailoredContentLength = llmContent.content.length;
      }
      logger.success('[CV_SUMMARY_API][LLM_SUCCESS] LLM successfully tailored summary.', {
        ...logContext,
        component_id,
        tailoredContentLength: tailoredContentLength,
      });
      return NextResponse.json({ success: true, tailored_content: llmContent });
    } catch (err: unknown) {
      const handledError = handleServerError(err, { ...logContext, stage: 'llm_call' }); // Use handleServerError
      logger.error('[CV_SUMMARY_API][LLM_FAIL] LLM failed to tailor summary.', {
        ...logContext,
        component_id,
        errorMessage: handledError.message,
        stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
      });
      return NextResponse.json(
        { success: false, error: handledError.message, details: handledError.details },
        { status: handledError.statusCode || 500 }
      );
    }
  } catch (error: unknown) {
    const handledError = handleServerError(error, { ...logContext, stage: 'cv_summary_api_route' }); // Use handleServerError
    logger.error('[CV_SUMMARY_API][FATAL_ERROR] Error in CV summary tailoring API.', {
      ...logContext,
      errorMessage: handledError.message,
      stack: handledError.originalError instanceof Error ? handledError.originalError.stack : undefined,
    });
    return NextResponse.json(
      { success: false, error: handledError.message, details: handledError.details },
      { status: handledError.statusCode || 500 }
    );
  }
}
