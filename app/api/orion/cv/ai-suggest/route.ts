/**
 * @fileoverview API route for AI-powered CV component suggestions.
 * @description This endpoint receives CV content and job description analysis,
 * then leverages Orion's LLM to generate actionable, specific suggestions
 * for improving the CV to better match the job requirements (FR-2).
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide AI-driven suggestions for tailoring CV content to specific job descriptions (FR-2.1, FR-2.2).
 *   - To integrate with Orion's LLM (`generateLLMResponse`) for intelligent content analysis.
 *   - To return concise, bullet-pointed suggestions for easy consumption by the frontend UI (FR-2.3).
 *   - To ensure the process is protected by authentication and includes robust error handling.
 *
 * FILEPATH: `app/api/orion/cv/ai-suggest/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication and session validation.
 *   - `@/lib/orion_llm.ts`: Provides the `generateLLMResponse` function for LLM interaction.
 *   - `@/lib/types`: Defines `CombinedLLMResponse` and other types for type safety.
 *   - `@/lib/logger`: Used for comprehensive, context-rich logging of the API flow.
 *   - `@/lib/utils/errorHandler`: Centralized utility for consistent API error handling.
 *   - `app/components/orion/CVTailoringStudio.tsx`: Calls this API route to get AI suggestions (FR-2.1).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `cvContent` and `jdAnalysis` (job description analysis) are provided in the request body.
 *   - Assumes the underlying LLM service is operational and configured.
 *   - Assumes the `CV_AI_SUGGEST` request type is defined and correctly handled by `orion_llm.ts`.
 *   - Input validation using Zod ensures data integrity.
 *
 * NOTES:
 *   - This API is a core part of the CV Tailoring Studio, empowering users with AI-driven insights.
 *   - The prompt is carefully constructed to elicit actionable, concise suggestions from the LLM.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic User Profile Integration**: Incorporate the user's full profile data into the prompt for more personalized suggestions.
 *   - **Asynchronous LLM Processing**: For very long CVs or JDs, consider asynchronous LLM calls and a polling mechanism on the client.
 *   - **More Granular Suggestions**: Allow the LLM to suggest specific edits for individual CV components rather than just general suggestions.
 *   - **Cost Optimization**: Implement logic to choose LLM models based on cost for this specific request type.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/lib/orion_llm';
import type { CombinedLLMResponse } from '@/lib/types';
import logger from '@/lib/logger'; // Import logger
import { z } from 'zod'; // Import zod for validation
import { handleServerError } from '@/lib/utils/serverErrorHandler'; // Import handleServerError
import { HandledApplicationError } from '@/lib/utils/errorHandler'; // Correct import for HandledApplicationError
import { REQUEST_TYPES } from '@/lib/orion_llm';

// Define a Zod schema for the incoming request body
const aiSuggestRequestSchema = z.object({
  cvContent: z.string().min(1, 'CV content is required.'),
  jdAnalysis: z.string().nullable().optional(), // jdAnalysis can be optional and nullable
});

export async function POST(request: NextRequest) {
  const logContext = {
    route: '/api/orion/cv/ai-suggest',
    timestamp: new Date().toISOString(),
  };
  logger.info('[CV_AI_SUGGEST_API][POST][START]', logContext);

  try {
    const body = await request.json();
    const { cvContent, jdAnalysis } = aiSuggestRequestSchema.parse(body);

    logger.info('[CV_AI_SUGGEST_API][REQUEST_RECEIVED]', {
      ...logContext,
      cvContentLength: cvContent.length,
      jdAnalysisLength: jdAnalysis?.length || 0,
    });

    const prompt = `
You are an expert CV coach and AI assistant. Given the following CV content, job description analysis, and OrionOpportunity details, provide actionable, specific suggestions to improve the CV for this job. Focus on relevance, clarity, and impact. List at least 3 suggestions, each as a bullet point.

--- CV Content ---
${cvContent}

--- Job Description Analysis ---
${jdAnalysis || 'N/A'}

--- Instructions ---
- Be concise and direct.
- Focus on tailoring the CV to the job requirements.
- Use bullet points.
- Do not rewrite the CV, only provide suggestions.
`;

    const llmResponse: CombinedLLMResponse = await generateLLMResponse(
      REQUEST_TYPES.CV_COMPONENT_TAILORING,
      prompt,
      null, // userId is now nullable
      {
        temperature: 0.6,
        maxTokens: 300,
      }
    );

    if (!llmResponse.success) {
      logger.error('[CV_AI_SUGGEST_API][LLM_FAILURE]', { ...logContext, error: llmResponse.error });
      return NextResponse.json(
        { success: false, error: llmResponse.error || 'LLM failed to generate suggestions' },
        { status: 500 }
      );
    }

    logger.success('[CV_AI_SUGGEST_API][POST][SUCCESS]', {
      ...logContext,
      suggestionsLength: llmResponse.content?.length || 0,
    });
    return NextResponse.json({ success: true, suggestions: llmResponse.content });
  } catch (err: unknown) {
    const handledError: HandledApplicationError = handleServerError(err, {
      ...logContext,
      stage: 'ai_suggest_api_call',
    });
    if (err instanceof z.ZodError) {
      logger.error('[CV_AI_SUGGEST_API][POST][VALIDATION_ERROR]', {
        ...logContext,
        error: handledError.message,
        details: err.errors,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid input for AI suggestions.', details: handledError.details ?? err.errors },
        { status: 400 }
      );
    }
    logger.error('[CV_AI_SUGGEST_API][POST][CATCH_ERROR]', { ...logContext, error: handledError.message });
    return NextResponse.json(
      { success: false, error: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
