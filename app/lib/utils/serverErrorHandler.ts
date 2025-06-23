import logger from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HandledApplicationError, AppErrorContext } from './errorHandler';

/**
 * Centralized error handler for server-side errors, including Prisma-specific errors.
 * This function categorizes, logs, and provides a standardized error object.
 *
 * @param error The raw error object caught.
 * @param context Additional context to include in logs (e.g., URL, method, opportunityId).
 * @returns A standardized HandledApplicationError object.
 */
export function handleServerError(error: unknown, context: AppErrorContext = {}): HandledApplicationError {
  let message: string;
  let status: number | undefined;
  let data: unknown;
  let isRetryable: boolean | undefined;
  let errorType: string;

  // Add a unique ID for each error for easier traceability in logs
  const errorId = `server_err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const logContext = { errorId, ...context, operation: 'handleServerError' };

  if (error instanceof PrismaClientKnownRequestError) {
    const prismaError = error as PrismaClientKnownRequestError;
    message = `Database Error: ${prismaError.message}`;
    status = 500;
    errorType = 'DATABASE_ERROR';
    isRetryable = true;

    logger.error(`[SERVER_ERROR_HANDLER][DATABASE_ERROR] ${message}`, {
      ...logContext,
      errorCode: prismaError.code,
      meta: prismaError.meta,
      clientVersion: prismaError.clientVersion,
      stack: prismaError.stack,
    });
  } else if (error instanceof Error) {
    message = `Server Error: ${error.message}`;
    status = 500; // Default to 500 for server errors
    errorType = 'SERVER_ERROR';

    logger.error(`[SERVER_ERROR_HANDLER][GENERIC_ERROR] ${message}`, {
      ...logContext,
      errorDetails: error.message,
      stack: error.stack,
    });
  } else {
    message = 'An unknown server error occurred.';
    status = 500;
    errorType = 'UNKNOWN_SERVER_ERROR';

    logger.error(`[SERVER_ERROR_HANDLER][UNKNOWN_ERROR] ${message}`, {
      ...logContext,
      errorDetails: String(error),
    });
  }

  return new HandledApplicationError(message, {
    status,
    data,
    isRetryable,
    type: errorType,
    originalError: error,
    logContext,
  });
}
