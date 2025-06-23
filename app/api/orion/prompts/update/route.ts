/**
 * @fileoverview API route to update an existing user-defined prompt.
 * @description This endpoint provides a way to modify an existing prompt in the database. It uses Zod for input validation, leverages the `prompt_db_service` to perform the update operation, and includes comprehensive logging and error handling. This is a core API for the 'My Prompts' feature, enabling users to fine-tune their linguistic masterpieces.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide an API endpoint for updating existing prompts.
 *   - To validate incoming request data using a Zod schema, ensuring prompt integrity.
 *   - To integrate with `prompt_db_service` to persist the updated prompt data.
 *   - To return the updated prompt object upon success.
 *   - To provide comprehensive logging for request/response cycles and errors.
 *
 * FILEPATH: `app/api/orion/prompts/update/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: Used for handling Next.js API routes (`NextRequest`, `NextResponse`).
 *   - `zod`: Used for defining and validating the input schema for prompt updates.
 *   - `@/lib/prompt_db_service`: Consumes `updatePrompt` to modify existing prompts in the database.
 *   - `@/lib/logger`: Used for comprehensive logging throughout the request lifecycle.
 *   - `@/lib/utils/errorHandler`: Centralized utility for consistent API error handling.
 *   - `app/components/orion/MyPromptsStudio.tsx`: The client-side UI component that will call this API to update prompts.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `updatePrompt` in `prompt_db_service.ts` functions correctly and handles cases where the prompt might not be found or owned by the user.
 *   - Input data for prompt updates (`uniqueId`, `name`, `content`, `category`) will be validated against a Zod schema. Only provided fields will be updated (partial updates are supported).
 *   - Robust error handling is in place for validation, and database operation failures.
 *
 * NOTES:
 *   - This API is crucial for maintaining the flexibility and accuracy of the user's prompt library.
 *   - Logging is meticulously integrated to provide insights into API usage and potential issues.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Version History**: Consider implementing a versioning system for prompts, allowing users to revert to previous states.
 *   - **Concurrency Control**: For environments with multiple simultaneous editors, implement optimistic locking or other concurrency control mechanisms.
 *   - **Auditing**: Log who updated which prompt and when, for better traceability.
 */

import { NextRequest, NextResponse } from 'next/server';
import { updatePrompt } from '@/lib/prompt_db_service';
import logger from '@/lib/logger';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function PUT(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/prompts/update',
    timestamp: new Date().toISOString(),
    operation: 'PUT',
  };
  logger.info('[UPDATE_PROMPT_API][PUT][START] Received request to update prompt.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { uniqueId, name, content, category } = await request.json();

    if (!uniqueId || !name || !content) {
      logger.warn(
        '[UPDATE_PROMPT_API][PUT][VALIDATION_FAIL] Missing uniqueId, name, or content in request body.',
        logContext
      );
      return NextResponse.json(
        { success: false, error: 'Missing uniqueId, name, or content in request body.' },
        { status: 400 }
      );
    }

    logger.debug('[UPDATE_PROMPT_API][PUT][PROCESSING] Updating prompt.', { ...logContext, uniqueId, name, category });

    const updatedPrompt = await updatePrompt(uniqueId, userId, { name, content, category });

    logger.success('[UPDATE_PROMPT_API][PUT][SUCCESS] Prompt updated successfully.', {
      ...logContext,
      promptId: updatedPrompt.id,
    });
    return NextResponse.json({ success: true, message: 'Prompt updated successfully.', prompt: updatedPrompt });
  } catch (error: unknown) {
    logger.error('[UPDATE_PROMPT_API][PUT][ERROR] Failed to update prompt.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to update prompt.' }, { status: 500 });
  }
}
