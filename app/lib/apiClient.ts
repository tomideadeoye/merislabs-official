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
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.info('API Request', {
      url: config.url,
      method: config.method,
      params: config.params,
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

      logger.error('API Error Response', {
        status,
        data: responseDataStringified,
        url,
        method,
        isRetryable,
      });

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
      logger.error('API No Response', {
        request: error.request,
        url: error.config?.url,
        method: error.config?.method,
      });
      return Promise.reject(new NetworkError('No response received from server'));
    } else {
      // Error in request configuration
      logger.error('API Request Error', {
        message: error.message,
        stack: error.stack,
        url: error.config?.url,
        method: error.config?.method,
      });
      return Promise.reject(new NetworkError('Failed to send request'));
    }
  }
);

// Retry logic for retryable errors
const retryRequest = async <T>(config: AxiosRequestConfig, retries = 3, delay = 1000): Promise<AxiosResponse<T>> => {
  try {
    return await apiClient(config);
  } catch (error) {
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
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new NetworkError('An unexpected error occurred');
  }
};

export { apiClient, request };
export default apiClient;
