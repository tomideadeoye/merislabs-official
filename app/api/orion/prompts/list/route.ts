/**
 * @fileoverview API route to list all user-defined prompts.
 * @description This endpoint provides a secure and authenticated way to retrieve all prompts associated with the authenticated user from the database. It leverages the `prompt_db_service` to fetch the data and ensures proper logging and error handling. This is a core API for the 'My Prompts' feature, allowing users to view their saved linguistic masterpieces.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a read-only API endpoint for fetching a user's prompts.
 *   - To integrate with `prompt_db_service` to retrieve prompt data.
 *   - To return prompt data in a structured JSON format.
 *   - To provide comprehensive logging for request/response cycles and errors.
 *
 * FILEPATH: `app/api/orion/prompts/list/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Used for handling Next.js API routes (`NextRequest`, `NextResponse`).
 *   - `@/lib/prompt_db_service`: Consumes `getAllPromptsByUserId` to fetch prompts from the database.
 *   - `@/lib/logger`: Used for comprehensive logging throughout the request lifecycle.
 *   - `@/lib/utils/errorHandler`: Centralized utility for consistent API error handling.
 *   - `app/components/orion/MyPromptsStudio.tsx`: The client-side UI component that will call this API to display prompts.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `getAllPromptsByUserId` in `prompt_db_service.ts` functions correctly.
 *   - The API will return an empty array if no prompts are found for the user, rather than an error.
 *   - Robust error handling is in place to gracefully manage unexpected issues during data fetching or authentication.
 *
 * NOTES:
 *   - This API is a foundational element for the 'My Prompts' UI, enabling the display of user-specific prompt data.
 *   - Logging is meticulously integrated to provide insights into API usage and potential issues.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Pagination and Filtering**: Implement query parameters for pagination, sorting, and filtering to handle a large number of prompts efficiently.
 *   - **Zod Validation**: Introduce Zod schemas for request validation (e.g., for query parameters if pagination/filtering is added).
 *   - **Caching**: Implement server-side caching for frequently accessed prompts to improve performance and reduce database load.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllPromptsByUserId } from '@/lib/prompt_db_service';
import logger from '@/lib/logger';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function GET() {
  const logContext: LogContextType = {
    route: '/api/orion/prompts/list',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[LIST_PROMPTS_API][GET][START] Received request to list prompts.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    logger.debug('[LIST_PROMPTS_API][GET][PROCESSING] Fetching prompts for user.', logContext);

    const prompts = await getAllPromptsByUserId(userId);

    logger.success('[LIST_PROMPTS_API][GET][SUCCESS] Prompts fetched successfully.', {
      ...logContext,
      count: prompts.length,
    });
    return NextResponse.json({ success: true, prompts });
  } catch (error: unknown) {
    logger.error('[LIST_PROMPTS_API][GET][ERROR] Failed to fetch prompts.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch prompts.' }, { status: 500 });
  }
}
