/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a centralized and standardized error handling utility for the Orion project.
 *   - Categorizes various types of errors (API, Network, Client, Unknown) and logs them with rich context.
 *   - Returns a consistent `HandledError` object, simplifying error propagation and display in the UI.
 *   - Ensures all errors are traceable with a unique ID and relevant context for rapid debugging and monitoring.
 *
 * FILEPATH: `app/lib/utils/errorHandler.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/logger.ts`: Integrates with the global logger for consistent error logging across the application.
 *   - `@/lib/apiClient.ts`: Imports `APIError` and `NetworkError` to specifically handle errors originating from API calls.
 *   - API Routes (`app/api/orion/.../route.ts`): Many API routes utilize `handleApiError` to process and return standardized error responses to the frontend.
 *   - UI Components (e.g., in `app/components/orion/...`): Frontend components can consume the `HandledError` object to display user-friendly error messages and manage error states.
 *   - `app/lib/opportunity_db_service.ts`: Now uses `handleApiError` for consistent error handling during database operations.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `APIError` and `NetworkError` custom error classes are correctly defined and used for API-related failures.
 *   - The `context` parameter allows for injecting additional, operation-specific details into the error logs, enhancing debuggability.
 *   - A unique `errorId` is generated for each handled error to facilitate tracing across logs and systems.
 *
 * NOTES:
 *   - The `handleApiError` function acts as a single point of truth for error processing, reducing boilerplate and ensuring uniformity in error management.
 *   - It distinguishes between different error types to provide more specific logging and potentially different client-side handling.
 *   - Sensitive error details are logged server-side but not necessarily exposed directly to the client, adhering to security best practices.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Custom Error Types**: For more granular control and clearer semantics, consider defining custom error classes (e.g., `QdrantError`, `PythonBackendError`) that extend `HandledError`. This could allow `handleApiError` to perform more specific actions or return richer error details based on the error type.
 *   - **Error Reporting Integration**: Integrate with a dedicated error monitoring service (e.g., Sentry, Bugsnag) to automatically capture and report production errors.
 *   - **User Feedback**: Develop a more robust user notification system (e.g., toast messages, error banners) that consumes `HandledError` to display contextual and actionable feedback to the user.
 *   - **Retry Mechanisms**: Enhance `isRetryable` logic and potentially integrate with a global retry policy for certain types of transient network or API errors.
 *   - **Granular Error Types**: Introduce more granular custom error types for specific business logic failures beyond general API/Network errors.
 *   - **Zod Integration**: If `Zod` is used for input validation, `handleApiError` could be extended to specifically process and format validation errors.
 *   - **Test Coverage**: Add comprehensive unit tests to `handleApiError` to ensure it correctly categorizes, logs, and formats errors for all expected scenarios.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This file already serves as a consolidation point for error handling logic. Further consolidation would involve ensuring all parts of the application (both frontend and backend) consistently use this utility for error management.
 */
import logger from '@/lib/logger';
import { APIError, NetworkError } from '@/lib/apiClient'; // Correct import for APIError and NetworkError

interface AppErrorContext {
  [key: string]: any;
}

export interface HandledError {
  message: string;
  status?: number;
  data?: any;
  isRetryable?: boolean;
  type: 'API_ERROR' | 'NETWORK_ERROR' | 'CLIENT_ERROR' | 'UNKNOWN_ERROR';
  originalError: unknown;
  logContext: AppErrorContext;
}

/**
 * Centralized error handler for API and network errors.
 * This function categorizes, logs, and provides a standardized error object.
 *
 * @param error The raw error object caught from an API call (e.g., AxiosError, Error).
 * @param context Additional context to include in logs (e.g., URL, method, opportunityId).
 * @returns A standardized HandledError object.
 */
export function handleApiError(error: unknown, context: AppErrorContext = {}): HandledError {
  let message: string;
  let status: number | undefined;
  let data: any;
  let isRetryable: boolean | undefined;
  let errorType: HandledError['type'];

  // Add a unique ID for each error for easier traceability in logs
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const logContext = { errorId, ...context, operation: 'handleApiError' };

  if (error instanceof APIError) {
    const apiError = error as APIError; // Explicitly cast to APIError
    message = apiError.message;
    status = apiError.status;
    data = apiError.data;
    isRetryable = apiError.isRetryable;
    errorType = 'API_ERROR';

    logger.error(`[ERROR_HANDLER][API_ERROR] ${message}`, {
      ...logContext,
      status,
      data,
      url: apiError.url,
      method: apiError.method,
      isRetryable,
      stack: apiError.stack,
    });
  } else if (error instanceof NetworkError) {
    const networkError = error as NetworkError; // Explicitly cast to NetworkError
    message = `Network Error: ${networkError.message}`;
    status = 500; // General status for network issues
    errorType = 'NETWORK_ERROR';

    logger.error(`[ERROR_HANDLER][NETWORK_ERROR] ${message}`, {
      ...logContext,
      errorDetails: networkError.message,
      stack: networkError.stack,
    });
  } else if (error instanceof Error) {
    const generalError = error as Error; // Explicitly cast to Error
    message = `Client Error: ${generalError.message}`;
    status = undefined; // Or a specific client-side error code if applicable
    errorType = 'CLIENT_ERROR';

    logger.error(`[ERROR_HANDLER][CLIENT_ERROR] ${message}`, {
      ...logContext,
      errorDetails: generalError.message,
      stack: generalError.stack,
    });
  } else {
    message = 'An unknown error occurred.';
    status = undefined;
    errorType = 'UNKNOWN_ERROR';

    logger.error(`[ERROR_HANDLER][UNKNOWN_ERROR] ${message}`, {
      ...logContext,
      errorDetails: String(error),
    });
  }

  return {
    message,
    status,
    data,
    isRetryable,
    type: errorType,
    originalError: error,
    logContext,
  };
}
