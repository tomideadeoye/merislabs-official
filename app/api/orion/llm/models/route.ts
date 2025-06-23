/**
 * @fileoverview API route for fetching a list of available LLM models.
 * @description This endpoint provides a static (for now) or dynamically fetched list of LLM model names
 *   that can be used by the application for various LLM-powered features.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a `GET` endpoint to retrieve available LLM model identifiers.
 *   - Ensure consistency and easy management of supported models across the application.
 *
 * FILEPATH: `app/api/orion/llm/models/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/ui/orion/DraftCommunicationForm.tsx`: Consumes this endpoint to populate the model selection dropdown.
 *   - `app/api/orion/llm/route.ts`: (Future) Might use this list to validate selected models.
 *   - `@/lib/logger`: Used for logging API requests and responses.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - For simplicity, the list of models is currently hardcoded. In a production environment,
 *     this list might be fetched from an external LLM provider's API or a configuration service.
 *   - This endpoint is publicly accessible as it only provides a list of model identifiers.
 *
 * NOTES:
 *   - This file provides a centralized place to manage the list of LLM models.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Model Fetching**: Integrate with actual LLM provider APIs (e.g., OpenAI, Anthropic)
 *     to dynamically fetch available models rather than using a hardcoded list.
 *   - **Model Metadata**: Include additional metadata for each model (e.g., capabilities, cost,
 *     context window size) to allow more informed selection on the frontend.
 *   - **Caching**: Implement caching for the model list if it's dynamically fetched to reduce API calls.
 */

import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function GET() {
  const logContext = {
    route: '/api/orion/llm/models',
    operation: 'GET',
    timestamp: new Date().toISOString(),
  };

  logger.info('[LLM_MODELS_API][GET][START] Received request to fetch available LLM models.', logContext);

  try {
    // For now, return a hardcoded list of models.
    // In a real application, this would fetch from an LLM provider's API or a configuration service.
    const models = [
      'gpt-4o',
      'gpt-4o-mini',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'gemini-1.5-pro',
      'llama3-8b-8192',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
    ];

    logger.success('[LLM_MODELS_API][GET][SUCCESS] Available LLM models fetched successfully.', {
      ...logContext,
      modelCount: models.length,
    });
    return NextResponse.json({ success: true, models });
  } catch (error: unknown) {
    logger.error('[LLM_MODELS_API][GET][ERROR] Failed to fetch LLM models.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch LLM models.' }, { status: 500 });
  }
}
