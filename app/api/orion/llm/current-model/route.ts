/**
 * @fileoverview API route for retrieving the currently active LLM model based on request type.
 * @description This endpoint leverages the `selectPrimaryModelForRequestType` function from `orion_llm.ts`
 *   to determine the optimal LLM model for a given request, considering user preferences, hardcoded defaults,
 *   and model health checks. It provides a way for client-side components to display the model in use.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - `GET /api/orion/llm/current-model`: Returns the ID of the primary LLM model selected for a specific request type.
 *   - Ensure accurate model selection by integrating with the core LLM logic.
 *   - Provide robust error handling and logging.
 *
 * FILEPATH: `app/api/orion/llm/current-model/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/orion_llm.ts`: Imports `selectPrimaryModelForRequestType` and `checkAllLlmApiKeys` to determine the active model.
 *   - `@/lib/logger.ts`: Used for structured logging of API requests and responses.
 *   - `@/auth`: Imports the NextAuth.js `auth` function for user authentication.
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: Will consume this API endpoint to display the current LLM model.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes user authentication is handled by NextAuth.js and `session.user.id` is available.
 *   - The `requestType` query parameter is provided and valid.
 *   - The `selectPrimaryModelForRequestType` function correctly determines the primary model.
 *
 * NOTES:
 *   - This endpoint centralizes the logic for determining the active LLM model, preventing duplication of logic on the client-side.
 *   - Logging helps in debugging model selection issues.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Caching**: Implement caching for frequently requested `requestType`s to reduce redundant model selection logic execution.
 *   - **Input Validation**: Add more robust validation for the `requestType` query parameter.
 *   - **Detailed Model Info**: Extend the response to include more details about the selected model (e.g., provider, cost info) if needed by the UI.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { selectPrimaryModelForRequestType, checkAllLlmApiKeys, REQUEST_TYPES } from '@/lib/orion_llm';

interface LogContextType {
  route: string;
  timestamp: string;
  operation?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/llm/current-model',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[CURRENT_LLM_MODEL_API][GET][START] Received request to fetch current LLM model.', logContext);

  const { searchParams } = new URL(request.url);
  const requestType = searchParams.get('requestType');

  if (!requestType) {
    logger.warn('[CURRENT_LLM_MODEL_API][GET][VALIDATION_FAIL] Missing requestType query parameter.', logContext);
    return NextResponse.json({ success: false, error: 'Missing requestType query parameter.' }, { status: 400 });
  }

  // Optional: Validate requestType against known types in REQUEST_TYPES
  const isValidRequestType = Object.values(REQUEST_TYPES).includes(
    requestType as (typeof REQUEST_TYPES)[keyof typeof REQUEST_TYPES]
  );
  if (!isValidRequestType) {
    logger.warn('[CURRENT_LLM_MODEL_API][GET][VALIDATION_FAIL] Invalid requestType provided.', {
      ...logContext,
      requestType,
    });
    return NextResponse.json({ success: false, error: `Invalid requestType: ${requestType}` }, { status: 400 });
  }

  // Explicitly assert the type of requestType after validation
  const validatedRequestType = requestType as (typeof REQUEST_TYPES)[keyof typeof REQUEST_TYPES];

  try {
    const healthyModels = checkAllLlmApiKeys()
      .filter((key) => key.present)
      .map((key) => key.modelId);

    if (healthyModels.length === 0) {
      logger.error('[CURRENT_LLM_MODEL_API][GET][ERROR] No healthy LLM models available.', logContext);
      return NextResponse.json({ success: false, error: 'No healthy LLM models available.' }, { status: 500 });
    }

    const currentLlmModel = await selectPrimaryModelForRequestType(validatedRequestType, healthyModels);

    logger.success('[CURRENT_LLM_MODEL_API][GET][SUCCESS] Current LLM model fetched successfully.', {
      ...logContext,
      currentLlmModel,
    });
    return NextResponse.json({ success: true, currentLlmModel });
  } catch (error: unknown) {
    logger.error('[CURRENT_LLM_MODEL_API][GET][ERROR] Failed to fetch current LLM model.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch current LLM model.' }, { status: 500 });
  }
}
