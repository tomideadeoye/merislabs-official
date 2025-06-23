/**
 * @fileoverview Centralized API client configuration with enhanced error handling and retry logic.
 * @description Provides a configured Axios instance with request/response interceptors for consistent error handling, logging, and automatic retry of failed requests. Serves as the foundation for all Orion
API communications.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Standardize API request configuration across the Orion ecosystem
 *   - Implement automatic retry logic for transient errors (429, 5xx)
 *   - Provide rich error categorization (APIError, NetworkError, TimeoutError)
 *   - Enable detailed request/response logging for debugging
 *   - Support Orion's reliability requirements through robust fault tolerance
 *
 * FILEPATH: `app/lib/apiClient.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/logger.ts`: Utilized for structured logging of all API operations
 *   - `app/lib/utils/errorHandler.ts`: Consumes error types defined here for centralized error processing
 *   - All API route handlers: Serve as entry points that leverage this client configuration
 *   - `app/hooks/useOpportunities.ts`: Demonstrates frontend consumption pattern for API interactions
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes NEXT_PUBLIC_API_URL is properly configured in environment variables
 *   - Retry logic assumes backend services implement proper idempotency safeguards
 *   - Timeout values (30s base) optimized for Orion's AI-enhanced processing requirements
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: Error types could be consolidated with `lib/types/errors.ts`
 *   - PERFORMANCE OPTIMIZATIONS: Exponential backoff in retry logic prevents server overload
 *   - ERROR HANDLING ROBUSTNESS: Distinguishes between network errors and business logic errors
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement circuit breaker pattern for cascading failure prevention
 *   - Add request signature for enhanced security
 *   - Introduce request/response validation via Zod schemas
 *   - Add distributed tracing headers for microservices observability
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from '@/lib/logger';

// Custom error types
export class APIError extends Error {
  public status: number;
  public data: unknown;
  public isRetryable: boolean;
  public url?: string;
  public method?: string;

  constructor(message?: string, status?: number, data?: unknown) {
    const finalStatus = status || 500; // Default to 500 if status is not provided
    const defaultMessage = finalStatus ? `Server responded with status ${finalStatus}` : 'API request failed';
    super(message || defaultMessage);

    this.name = 'APIError';
    this.status = finalStatus;
    this.data = data === undefined ? null : data;
    // Determine retryability based on status code
    this.isRetryable =
      this.status === 429 || // Too Many Requests
      this.status === 503 || // Service Unavailable
      this.status === 504 || // Gateway Timeout
      (typeof this.status === 'number' && this.status >= 500);
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Error categorization
const isRetryableError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  return (
    status === 429 || // Too Many Requests
    status === 503 || // Service Unavailable
    status === 504 || // Gateway Timeout
    (typeof status === 'number' && status >= 500) // Any 5xx error
  );
};

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  // DEVELOPMENT NOTE: withCredentials is set to false in development to bypass authentication
  // issues when server-side auth is also bypassed. Re-enable for production and when auth is active.
  withCredentials: false, // Crucial for sending cookies (authentication) with requests
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.info('API Request', {
      url: config.url,
      method: config.method,
      params: config.params,
      payloadSize: JSON.stringify(config.data)?.length || 0,
      headers: Object.keys(config.headers || {}).filter((h) => !h.toLowerCase().includes('auth')),
      correlationId: crypto.randomUUID(),
    });
    return config;
  },
  (error) => {
    logger.error('API Request Error', {
      error: error.message,
      stack: error.stack,
    });
    return Promise.reject(new NetworkError('Failed to send request'));
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.success('API Response', {
      url: response.config.url,
      status: response.status,
      method: response.config.method,
    });
    return response;
  },
  (error: AxiosError) => {
    const isRetryable = isRetryableError(error);

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      const url = error.config?.url;
      const method = error.config?.method;

      // Attempt to stringify data, otherwise use it as is or provide a placeholder
      let responseDataStringified: string | unknown = data;
      try {
        responseDataStringified = typeof data === 'object' && data !== null ? JSON.stringify(data, null, 2) : data;
      } catch (e) {
        responseDataStringified = '[Unserializable Response Data]';
      }

      // logger.error('API Error Response', {
      //   status,
      //   data: responseDataStringified,
      //   url,
      //   method,
      //   isRetryable,
      // });

      // Map common error statuses to user-friendly messages
      const errorMessages: Record<number, string> = {
        400: 'Invalid request. Please check your input.',
        401: 'Authentication required. Please log in.',
        403: 'You do not have permission to perform this action.',
        404: 'The requested resource was not found.',
        429: 'Too many requests. Please try again later.',
        500: 'An unexpected error occurred. Please try again.',
        503: 'Service temporarily unavailable. Please try again later.',
        504: 'Request timed out. Please try again.',
      };

      const message = errorMessages[status] || 'An error occurred while processing your request.';

      const apiError = new APIError(message, status, data);
      apiError.url = url;
      apiError.method = method;
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      // logger.error('API No Response', {
      //   request: error.request,
      //   url: error.config?.url,
      //   method: error.config?.method,
      // });
      return Promise.reject(new NetworkError('No response received from server'));
    } else {
      // Error in request configuration
      // logger.error('API Request Error', {
      //   message: error.message,
      //   stack: error.stack,
      //   url: error.config?.url,
      //   method: error.config?.method,
      // });
      return Promise.reject(new NetworkError('Failed to send request'));
    }
  }
);

// Retry logic for retryable errors
const retryRequest = async <T>(config: AxiosRequestConfig, retries = 3, delay = 1000): Promise<AxiosResponse<T>> => {
  try {
    return await apiClient(config);
  } catch (error: unknown) {
    if (retries === 0 || !(error instanceof APIError) || !error.isRetryable) {
      throw error;
    }

    logger.warn('Retrying request', {
      url: config.url,
      method: config.method,
      retriesLeft: retries,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(config, retries - 1, delay * 2);
  }
};

// Enhanced request method with retry logic
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await retryRequest<T>(config);
    return response.data as T;
  } catch (error: unknown) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new NetworkError('An unexpected error occurred');
  }
};

export { apiClient, request };
export default apiClient;
