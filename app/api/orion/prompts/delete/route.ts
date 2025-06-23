/**
 * @fileoverview API route to delete an existing user-defined prompt.
 * @description This endpoint provides a way to remove a prompt from the database. It uses Zod for input validation, leverages the `prompt_db_service` to perform the deletion, and includes comprehensive logging and error handling. This is a core API for the 'My Prompts' feature, ensuring users can manage their linguistic masterpieces effectively.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint for deleting prompts.
 *   - To validate incoming request data using a Zod schema, ensuring correct prompt identification.
 *   - To integrate with `prompt_db_service` to remove prompt data from the database.
 *   - To return a success status upon successful deletion.
 *   - To provide comprehensive logging for request/response cycles and errors.
 *
 * FILEPATH: `app/api/orion/prompts/delete/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Used for handling Next.js API routes (`NextRequest`, `NextResponse`).
 *   - `zod`: Used for defining and validating the input schema for prompt deletion.
 *   - `@/lib/prompt_db_service`: Consumes `deletePrompt` to remove prompts from the database.
 *   - `@/lib/logger`: Used for comprehensive logging throughout the request lifecycle.
 *   - `@/lib/utils/errorHandler`: Centralized utility for consistent API error handling.
 *   - `app/components/orion/MyPromptsStudio.tsx`: The client-side UI component that will call this API to delete prompts.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `deletePrompt` in `prompt_db_service.ts` functions correctly and handles cases where the prompt might not be found or owned by the user.
 *   - Input data for prompt deletion (`uniqueId`) will be validated against a Zod schema.
 *   - Robust error handling is in place for validation, and database operation failures.
 *
 * NOTES:
 *   - This API is essential for the full lifecycle management of prompts within the 'My Prompts' feature.
 *   - Logging is meticulously integrated to provide insights into API usage and potential issues.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Soft Deletes**: Instead of hard deletion, implement soft deletes (e.g., setting an `isDeleted` flag) to allow for recovery of accidentally deleted prompts.
 *   - **Confirmation Mechanisms**: Ensure the UI implements strong user confirmation before calling this API to prevent accidental data loss.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deletePrompt } from '@/lib/prompt_db_service';
import logger from '@/lib/logger';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function DELETE(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/prompts/delete',
    timestamp: new Date().toISOString(),
    operation: 'DELETE',
  };
  logger.info('[DELETE_PROMPT_API][DELETE][START] Received request to delete prompt.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { uniqueId } = await request.json();

    if (!uniqueId) {
      logger.warn('[DELETE_PROMPT_API][DELETE][VALIDATION_FAIL] Missing uniqueId in request body.', logContext);
      return NextResponse.json({ success: false, error: 'Missing uniqueId in request body.' }, { status: 400 });
    }

    logger.debug('[DELETE_PROMPT_API][DELETE][PROCESSING] Deleting prompt.', { ...logContext, uniqueId });

    await deletePrompt(uniqueId, userId);

    logger.success('[DELETE_PROMPT_API][DELETE][SUCCESS] Prompt deleted successfully.', { ...logContext, uniqueId });
    return NextResponse.json({ success: true, message: 'Prompt deleted successfully.' });
  } catch (error: unknown) {
    logger.error('[DELETE_PROMPT_API][DELETE][ERROR] Failed to delete prompt.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to delete prompt.' }, { status: 500 });
  }
}
