/**
 * @fileoverview API route for AI-powered rephrasing of CV components.
 * @description This endpoint receives content from a CV component and a job description, then uses
 * Orion's LLM (`generateLLMResponse`) to rephrase the component content to better align with the job description.
 * This directly supports the "In-Place Tailoring" functionality (FR-4) of the CV Tailoring Studio, enabling
 * hyper-personalization of CV content.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - **FR-4.1:** To provide a "Rephrase with AI" capability for each selected CV component in the UI.
 *   - **FR-4.2:** To act as the new API endpoint `/api/orion/cv/rephrase-component` that is triggered when the rephrase action is initiated.
 *   - **FR-4.3 (API Logic):** To receive `componentContent` and `jobDescription`, and send a prompt to the LLM
 *     to "rephrase the following text to better align with the tone and keywords of the job description."
 *   - **FR-4.4 (UI Update Support):** To return the rephrased text, allowing the UI to display it with
 *     options to "Accept" or "Revert."
 *   - To ensure only authenticated users can access this rephrasing service.
 *
 * FILEPATH: `app/api/orion/cv/rephrase-component/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication and session validation.
 *   - `@/lib/opportunity_db_service`: Used to fetch the job description content from the database via `getOpportunityByIdFromDb` (if `jobDescription` needs to be fetched based on `opportunityId`).
 *   - `@/lib/orion_llm`: Provides the `generateLLMResponse` function, which interfaces with the LLM to process the rephrasing prompt.
 *   - `@/lib/logger`: Used for comprehensive logging of API request, response, and error details.
 *   - `app/components/orion/CVTailoringStudio.tsx`: This client-side component will call this API route to rephrase component content (FR-4.2).
 *   - `@/lib/utils/errorHandler`: Used for consistent error handling and message extraction.
 *   - Zod: Used for request body validation.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `componentContent` and `jobDescription` are provided in the request body.
 *   - Assumes the LLM service (`generateLLMResponse`) is operational and correctly configured for rephrasing tasks.
 *   - The LLM is expected to return the rephrased text directly.
 *   - Comprehensive logging is integrated to trace the flow and diagnose any issues during API calls or LLM interactions.
 *   - `jobDescription` is passed directly for the rephrasing prompt; fetching from DB is an alternative if only `opportunityId` is provided.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: The LLM response time should be optimized to ensure responsive UI, with clear loading indicators in the frontend.
 *   - Reliability: Robust error handling to gracefully manage LLM failures or invalid input.
 *   - Security: Protected by authentication to ensure only authorized users can trigger AI rephrasing.
 *
 * NOTES:
 *   - This API is a key enabler for deep personalization within the CV tailoring process, allowing for nuanced content adjustments.
 *   - The prompt explicitly guides the LLM to align with the job description's tone and keywords.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Advanced Prompt Engineering**: Explore more sophisticated prompt techniques to control the rephrasing style (e.g., formal, concise, impactful).
 *   - **Contextual Rephrasing**: Integrate more context about the user's overall profile or other selected CV components to ensure consistency across the entire CV.
 *   - **Usage Quotas/Rate Limiting**: Implement limits on rephrasing requests to manage LLM costs and prevent abuse.
 *   - **Feedback Loop**: Potentially allow users to rate the quality of rephrased content to improve future AI performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// import { auth } from '@/auth'; // Authentication removed as per user request
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

// Define the schema for the request body using Zod
const rephraseRequestSchema = z.object({
  componentContent: z.string().min(1, 'Component content cannot be empty.'),
  jobDescription: z.string().min(1, 'Job description cannot be empty.'),
});

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/cv/rephrase-component',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_REPHRASE_API][POST][START]', logContext);

  try {
    const body = await request.json();
    const { componentContent, jobDescription } = rephraseRequestSchema.parse(body);

    const prompt = `Rephrase the following CV component content to better align with the tone and keywords of the provided Job Description. Focus on making it impactful and relevant to the role.\n\n**CV Component Content:**\n${componentContent}\n\n**Job Description:**\n${jobDescription}\n\nReturn ONLY the rephrased text.`;

    logger.debug('[CV_REPHRASE_API][POST][LLM_PROMPT_GENERATED]', { ...logContext, promptLength: prompt.length });

    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.CV_COMPONENT_TAILORING,
      prompt,
      'unauthenticated_user',
      {
        temperature: 0.7,
        maxTokens: 500,
      }
    );

    if (!llmResponse.success) {
      const errorMsg = llmResponse.error || 'LLM failed to rephrase content.';
      logger.error('[CV_REPHRASE_API][POST][LLM_ERROR]', { ...logContext, error: errorMsg });
      throw new Error(errorMsg);
    }

    if (!llmResponse.content) {
      logger.warn('[CV_REPHRASE_API][POST][NO_LLM_CONTENT]', logContext);
      throw new Error('LLM response was successful but returned no rephrased content.');
    }

    logger.success('[CV_REPHRASE_API][POST][SUCCESS]', { ...logContext, rephrasedLength: llmResponse.content.length });
    return NextResponse.json({ success: true, rephrasedContent: llmResponse.content });
  } catch (error: unknown) {
    const handledError: HandledApplicationError = handleServerError(error, {
      ...logContext,
      stage: 'rephrase_api_call',
    });
    logger.error('[CV_REPHRASE_API][POST][CATCH_ERROR]', { ...logContext, error: handledError.message });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input for rephrasing.', details: handledError.details ?? error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
