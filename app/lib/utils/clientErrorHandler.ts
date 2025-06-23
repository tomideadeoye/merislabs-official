/**
 * @fileoverview Client-side error handling utility for the Orion project.
 * @description This utility provides a centralized function to handle and categorize errors that occur in the browser environment.
 *   It is designed to be client-safe, meaning it avoids any Node.js-specific imports or functionalities,
 *   ensuring it can be bundled and executed without issues in the browser.
 *   It transforms raw errors into a consistent `HandledError` object for easier consumption by UI components (e.g., ErrorBoundary).
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a client-compatible error handling function (`handleClientError`).
 *   - To categorize common client-side errors (API, Network, General JavaScript errors, Unknown).
 *   - To return a standardized `HandledError` object, making error display and logging consistent on the frontend.
 *   - To be used specifically by client components and client-side utilities that need error processing.
 *
 * FILEPATH: `app/lib/utils/clientErrorHandler.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/logger.ts`: Integrates with the shared logger for consistent error logging (ensure the logger itself is client-safe or handles client-side logging appropriately).
 *   - `@/lib/apiClient.ts`: Imports `APIError` and `NetworkError` to specifically handle errors originating from client-side API calls. (Ensure `apiClient.ts` does not have server-only dependencies).
 *   - `app/components/ErrorBoundary.tsx`: This component will be updated to use `handleClientError` for robust client-side error display.
 *   - `app/lib/utils/errorHandler.ts`: The server-side counterpart, which will continue to handle server-specific errors (e.g., Prisma errors) and should *not* be imported on the client.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `APIError` and `NetworkError` custom error classes (if used) are also client-safe.
 *   - The `context` parameter allows for injecting additional, operation-specific details into the error logs.
 *   - A unique `errorId` is generated for each handled error for traceability.
 *
 * NOTES:
 *   - This file is crucial for maintaining a clean separation between client and server concerns in error handling.
 *   - It focuses on graceful degradation on the client, providing user-friendly messages while logging technical details.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **More Specific Client Error Types**: Introduce more granular custom error types for specific client-side scenarios (e.g., validation errors, form submission errors) if needed.
 *   - **User Notification Integration**: Implement a dedicated UI notification system (e.g., toast, banner) that consumes the `HandledError` object from this utility.
 *   - **Client-Side Monitoring**: Integrate with client-side error monitoring services (e.g., Sentry's browser SDK) to capture unhandled exceptions and processed errors.
 */

'use client';

import logger, { LogContext } from '@/lib/logger';
import { APIError, NetworkError } from '@/lib/apiClient'; // Assuming these are client-safe

interface AppErrorContext extends LogContext {
  [key: string]: unknown;
}

export interface HandledError {
  message: string;
  status?: number;
  data?: unknown;
  isRetryable?: boolean;
  type: 'API_ERROR' | 'NETWORK_ERROR' | 'CLIENT_ERROR' | 'UNKNOWN_ERROR';
  originalError: unknown;
  logContext: AppErrorContext;
  name?: string;
  details?: unknown;
}

/**
 * Centralized error handler for client-side errors.
 * This function categorizes, logs, and provides a standardized error object for the browser environment.
 *
 * @param error The raw error object caught on the client-side.
 * @param context Additional context to include in logs (e.g., component name, user action).
 * @returns A standardized HandledError object.
 */
export function handleClientError(error: unknown, context: AppErrorContext = {}): HandledError {
  let message: string;
  let status: number | undefined;
  let data: unknown;
  let isRetryable: boolean | undefined;
  let errorType: HandledError['type'];

  const errorId = `client_err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const logContext: AppErrorContext = { errorId, ...context, operation: 'handleClientError' };

  if (error instanceof APIError) {
    const apiError = error as APIError;
    message = apiError.message;
    status = apiError.status;
    data = apiError.data;
    isRetryable = apiError.isRetryable;
    errorType = 'API_ERROR';

    // logger.error(`[CLIENT_ERROR_HANDLER][API_ERROR] ${message}`, {
    //   ...logContext,
    //   status,
    //   data,
    //   url: apiError.url,
    //   method: apiError.method,
    //   isRetryable,
    //   stack: apiError.stack,
    // });
    logContext.disableConsole = true; // Disable console logging for this API error
  } else if (error instanceof NetworkError) {
    const networkError = error as NetworkError;
    message = `Network Error: ${networkError.message}`;
    status = 500;
    errorType = 'NETWORK_ERROR';

    // logger.error(`[CLIENT_ERROR_HANDLER][NETWORK_ERROR] ${message}`, {
    //   ...logContext,
    //   errorDetails: networkError.message,
    //   stack: networkError.stack,
    // });
  } else if (error instanceof Error) {
    const generalError = error as Error;
    message = `Client Error: ${generalError.message}`;
    status = undefined;
    errorType = 'CLIENT_ERROR';

    // logger.error(`[CLIENT_ERROR_HANDLER][CLIENT_ERROR] ${message}`, {
    //   ...logContext,
    //   errorDetails: generalError.message,
    //   stack: generalError.stack,
    // });
  } else {
    message = 'An unknown client error occurred.';
    status = undefined;
    errorType = 'UNKNOWN_ERROR';

    // logger.error(`[CLIENT_ERROR_HANDLER][UNKNOWN_ERROR] ${message}`, {
    //   ...logContext,
    //   errorDetails: String(error),
    // });
  }

  return {
    message,
    status,
    data,
    isRetryable,
    type: errorType,
    originalError: error,
    logContext,
    name: error instanceof Error ? error.name : undefined,
    details: error instanceof Error ? error.message : undefined,
  };
}

/**
 * Type guard to check if an unknown error is a HandledError for client-side.
 * @param error The unknown error to check.
 * @returns True if the error is a HandledError, false otherwise.
 */
export function isHandledError(error: unknown): error is HandledError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'type' in error &&
    'originalError' in error &&
    'logContext' in error
  );
}
