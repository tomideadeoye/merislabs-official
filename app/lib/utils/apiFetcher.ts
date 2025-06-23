/**
 * FILEPATH: `app/lib/utils/apiFetcher.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides a centralized and standardized utility for making internal API requests within the Orion application.
 *   - Encapsulates common `fetch` logic, response handling, JSON parsing, and structured error reporting.
 *   - Promotes the DRY (Don't Repeat Yourself) principle by eliminating redundant API call boilerplate.
 *   - Integrates with the global `logger` for consistent, context-rich logging of API request lifecycles and errors.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/.../route.ts` files: Consumers of this utility for making requests to other internal API routes (e.g., `/api/orion/research`).
 *   - `@/lib/types`: Relies on `ApiErrorResponse` for structured error reporting and other relevant types.
 *   - `@/lib/logger`: Uses the centralized logger for all informational and error logging.
 *   - `NextRequest`: Used to derive `request.nextUrl.origin` for constructing full internal API URLs.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that all internal API routes return JSON responses.
 *   - Assumes that non-`response.ok` (HTTP status outside 2xx) indicates an error, and the response body (if any) contains error details.
 *   - Provides a generic `T` type parameter for the expected successful response data, allowing for strong typing of API results.
 *   - Automatically includes `Content-Type: application/json` header for `POST` and `PUT` requests.
 *
 * NOTES:
 *   - This utility is crucial for maintaining consistency and robustness across all internal API interactions.
 *   - Future enhancements could include adding support for retries, caching, or more complex request configurations (e.g., multipart/form-data).
 *   - For external API calls (to third-party services), a separate, potentially more specialized utility might be considered.
 */

import { ApiErrorResponse } from '@/lib/types';
import logger from '@/lib/logger';
import { NextRequest } from 'next/server'; // Used for request.nextUrl.origin
import { handleClientError } from './clientErrorHandler'; // Changed from handleApiError
import { toast } from 'react-hot-toast';

interface ApiFetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
  logContext?: Record<string, unknown>;
  origin?: string; // To allow specifying origin for absolute URLs, default to request.nextUrl.origin
}

/**
 * A centralized utility for making internal API requests.
 * @param path - The API path, relative to the origin (e.g., '/api/orion/research/company').
 * @param options - Request options including method, body, headers, and logging context.
 * @returns The parsed JSON response data.
 * @throws {ApiErrorResponse} If the API request fails or returns a non-2xx status.
 */
export async function apiFetcher<T>(path: string, options: ApiFetcherOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body = null,
    headers = {},
    logContext = {},
    origin = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXTAUTH_URL || 'http://localhost:3000', // Determine origin dynamically
  } = options;

  const url = `${origin}${path}`;
  const requestBody = body ? JSON.stringify(body) : undefined;
  const commonHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  logger.info(`[API_FETCHER][REQUEST] Sending ${method} request to ${path}.`, {
    url,
    method,
    body: body ? JSON.stringify(body).substring(0, 200) + '...' : 'N/A',
    ...logContext,
  });

  try {
    const response = await fetch(url, {
      method,
      headers: commonHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      let errorData: unknown = null;
      let rawResponseText: string | null = null;

      try {
        rawResponseText = await response.text();
        errorData = JSON.parse(rawResponseText);
      } catch (jsonOrTextError: unknown) {
        logger.warn('[API_FETCHER][ERROR_PARSE] Could not parse error response as JSON, falling back to raw text.', {
          status: response.status,
          statusText: response.statusText,
          parseError: jsonOrTextError instanceof Error ? jsonOrTextError.message : String(jsonOrTextError),
          rawContentPreview: rawResponseText ? rawResponseText.substring(0, 500) : 'N/A',
          ...logContext,
        });
        errorData = rawResponseText; // Use the raw text as error data
      }

      const errorMessage = `[API_FETCHER][RESPONSE_ERROR] API request to ${path} failed with status ${response.status}: ${response.statusText}.`;
      // Instead of throwing ApiErrorResponse directly, use the handleClientError to log and standardize
      const handledError = handleClientError(
        {
          name: 'ApiError',
          message: errorMessage,
          status: response.status,
          data: errorData,
          rawContent: typeof errorData === 'string' ? errorData : JSON.stringify(errorData),
        },
        { method, url, status: response.status }
      );
      logger.error('[API_FETCHER][ERROR]', {
        ...handledError, // Spread the HandledError properties
        method,
        url,
        status: response.status,
      });
      throw handledError.originalError; // Re-throw the original error after logging and standardization
    }

    const data: T = await response.json();
    logger.info(`[API_FETCHER][SUCCESS] Request to ${path} successful.`, { status: response.status, ...logContext });
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'UnauthorizedError') {
      console.warn('[apiClient][ERROR] Unauthorized access. Redirecting to login.');
      // In a client-side context, `window.location` is safe.
      window.location.href = '/login';
    }
    const handledError = handleClientError(error, {
      method,
      url,
      status: error instanceof Error ? error.name : undefined,
    });
    logger.error('[API_FETCHER][ERROR]', {
      ...handledError, // Spread the HandledError properties
      method,
      url,
      status: error instanceof Error ? error.name : undefined,
    });
    throw handledError.originalError; // Re-throw the original error after logging and standardization
  }
}
