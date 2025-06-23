/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Service for interacting with the Python backend for AI-powered operations like web search and memory search.
 * @description This service provides a client-side interface to call specific endpoints on the Python backend.
 *   It is designed to bridge the Next.js frontend with the Python FastAPI backend, enabling functionalities
 *   such as real-time web search, URL scraping, memory querying, and stakeholder identification.
 *   This file is crucial for offloading computationally intensive or specialized tasks to the Python environment.
 *
 * It is designed with graceful fallbacks in mind, allowing the application to proceed even if the Python service is unavailable.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To abstract interactions with the Python backend's search capabilities.
 *   - To provide `searchWeb` for real-time web research related to companies or opportunities.
 *   - To provide `searchMemory` for querying Qdrant for relevant personal memories and insights.
 *   - To handle potential errors from the Python service gracefully.
 *   - To provide `scrapeUrl` for extracting content from a given URL.
 *   - To provide `getActiveApplications` for retrieving job application data.
 *   - To provide `createFollowupTask` for managing application follow-up tasks.
 *
 * FILEPATH: `app/lib/pythonApiService.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/opportunity/[opportunityId]/draft-email/route.ts`: Consumes this service to enrich email drafting context.
 *   - `@/lib/logger`: Used for comprehensive logging of API calls and errors.
 *   - `process.env.PYTHON_API_URL`: Relies on this environment variable to determine the Python backend's base URL.
 *   - `app/lib/orion_tools.ts`: New tools defined here will consume methods from this service.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Python backend exposes the specified endpoints (`/search/web`, `/scrape`, `/api/v1/memory/search`, `/api/active-applications`, `/api/create-followup-task`, `/api/find_stakeholders`).
 *   - The service is designed to be tolerant of Python backend unavailability, returning default values.
 *   - API keys/authentication for the Python backend would be handled within the Python service itself or passed securely.
 *
 * NOTES: This file is a critical bridge between the Next.js frontend and the specialized Python backend.
 *   - This service is a placeholder and will need full implementation once the Python backend is finalized.
 *   - It is crucial for enriching the LLM prompts with external, real-time context.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Robust Error Handling**: Implement more sophisticated error handling, including retries and circuit breakers for Python API calls.
 *   - **Type Definitions**: Define specific TypeScript interfaces for the expected responses from the Python backend.
 *   - **Authentication**: If the Python API requires authentication, integrate secure credential passing.
 *   - **Centralized Error Handling**: Integrate with `app/lib/utils/errorHandler.ts` for consistent error reporting.
 *   - **Streaming Responses**: If Python backend offers streaming, integrate that for better performance.
 */

import logger from '@/lib/logger'; // Assuming logger is a default export
import { Stakeholder, FindStakeholdersResponse } from '@/lib/types/networking'; // New: Import Stakeholder and FindStakeholdersResponse interface
import { apiClient } from './apiClient'; // Added import for apiClient
import { handleApiError } from './utils/errorHandler'; // Added import for handleApiError

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000'; // Default to localhost

interface PythonApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function callPythonApi<T>(endpoint: string, payload: unknown): Promise<PythonApiResponse<T>> {
  const fullUrl = `${PYTHON_API_URL}${endpoint}`;
  const logContext = { endpoint, payload };
  logger.info('[pythonApiService][callPythonApi][START]', logContext);

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('[pythonApiService][callPythonApi][HTTP_ERROR]', {
        ...logContext,
        status: response.status,
        errorText,
      });
      return { success: false, error: `HTTP error: ${response.status} - ${errorText}` };
    }

    const data: T = await response.json(); // Cast to T
    logger.success('[pythonApiService][callPythonApi][SUCCESS]', { ...logContext, data });
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
    logger.error('[pythonApiService][callPythonApi][NETWORK_ERROR]', { ...logContext, error: errorMessage });
    return { success: false, error: `Network error: ${errorMessage}` };
  }
}

export const pythonApiService = {
  /**
   * Searches the web using the Python backend.
   * @param query The search query.
   * @returns A string summary of search results or an empty string on error/no results.
   */
  searchWeb: async (query: string): Promise<string> => {
    const logContext = { operation: 'searchWeb', query };
    logger.info('[pythonApiService][searchWeb][START]', logContext);
    try {
      const result = await callPythonApi<{ summary: string }>('/search/web', { query }); // Matches FastAPI endpoint
      if (
        result.success &&
        typeof result.data === 'object' &&
        result.data !== null &&
        'summary' in result.data &&
        typeof result.data.summary === 'string'
      ) {
        logger.success('[pythonApiService][searchWeb][SUCCESS]', {
          ...logContext,
          summaryLength: result.data.summary.length,
        });
        return result.data.summary; // Assuming Python returns { summary: "..." }
      } else if (result.success && typeof result.data === 'string') {
        return result.data; // Fallback if Python returns raw string
      }
      logger.warn('[pythonApiService][searchWeb][NO_SUMMARY]', { query, result });
      return 'No relevant web search results found.';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][searchWeb][ERROR]', { ...logContext, error: errorMessage });
      return 'Failed to fetch web search results.';
    }
  },

  /**
   * Scrapes the text content from a single provided URL using the Python backend.
   * @param url The URL to scrape.
   * @returns The scraped text content or an error message.
   */
  scrapeUrl: async (url: string): Promise<string> => {
    const logContext = { operation: 'scrapeUrl', url };
    logger.info('[pythonApiService][scrapeUrl][START]', logContext);
    try {
      const result = await callPythonApi<{ content: string }>('/scrape', { url }); // Matches FastAPI endpoint
      if (
        result.success &&
        typeof result.data === 'object' &&
        result.data !== null &&
        'content' in result.data &&
        typeof result.data.content === 'string'
      ) {
        logger.success('[pythonApiService][scrapeUrl][SUCCESS]', {
          ...logContext,
          contentLength: result.data.content.length,
        });
        return result.data.content; // Assuming Python returns { content: "..." }
      }
      logger.warn('[pythonApiService][scrapeUrl][NO_CONTENT]', { url, result });
      return 'No content scraped from the URL.';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][scrapeUrl][ERROR]', { ...logContext, error: errorMessage });
      return 'Failed to scrape URL.';
    }
  },

  /**
   * Searches Qdrant memory via the Python backend.
   * @param query The memory search query.
   * @param limit The maximum number of memory points to return.
   * @returns A string summary of memory results or an empty string on error/no results.
   */
  searchMemory: async (query: string, limit = 5): Promise<string> => {
    const logContext = { operation: 'searchMemory', query, limit };
    logger.info('[pythonApiService][searchMemory][START]', logContext);
    try {
      const result = await callPythonApi<{ results: { payload: { text: string } }[] }>('/api/v1/memory/search', {
        query,
        limit,
      });

      if (
        result.success &&
        typeof result.data === 'object' &&
        result.data !== null &&
        'results' in result.data &&
        Array.isArray(result.data.results) &&
        result.data.results.length > 0
      ) {
        return result.data.results.map((m) => m.payload.text).join('\n\n');
      }
      logger.warn('[pythonApiService][searchMemory][NO_RESULTS]', { ...logContext, result });
      return 'No relevant personal memories found.';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][searchMemory][ERROR]', { ...logContext, error: errorMessage });
      return 'Failed to fetch personal memories.';
    }
  },

  /**
   * Retrieves a list of active job applications from the Python backend.
   * @returns An array of job opportunities or an empty array on error/no results.
   */
  getActiveApplications: async (): Promise<any[]> => {
    const logContext = { operation: 'getActiveApplications' };
    logger.info('[pythonApiService][getActiveApplications][START]', logContext);
    try {
      const result = await callPythonApi<any[]>('/api/active-applications', {}); // Matches FastAPI endpoint
      if (result.success && Array.isArray(result.data)) {
        logger.success('[pythonApiService][getActiveApplications][SUCCESS]', {
          ...logContext,
          count: result.data.length,
        });
        return result.data;
      }
      logger.warn('[pythonApiService][getActiveApplications][NO_DATA]', { ...logContext, result });
      return [];
    } catch (error: unknown) {
      logger.error('[pythonApiService][getActiveApplications][ERROR]', {
        ...logContext,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  },

  /**
   * Creates a follow-up task for a job application using the Python backend.
   * @param payload The payload containing opportunity_id, type, and optional notes.
   * @returns A success message or an error.
   */
  createFollowupTask: async (payload: { opportunity_id: string; type: string; notes?: string }): Promise<string> => {
    const logContext = { operation: 'createFollowupTask', payload };
    logger.info('[pythonApiService][createFollowupTask][START]', logContext);
    try {
      const result = await callPythonApi<{ message: string }>('/api/create-followup-task', payload); // Matches FastAPI endpoint
      if (result.success && result.data && 'message' in result.data) {
        logger.success('[pythonApiService][createFollowupTask][SUCCESS]', {
          ...logContext,
          result: result.data.message,
        });
        return result.data.message;
      }
      logger.warn('[pythonApiService][createFollowupTask][FAILURE]', { ...logContext, result });
      return result.error || 'Failed to create follow-up task.';
    } catch (error: unknown) {
      logger.error('[pythonApiService][createFollowupTask][ERROR]', {
        ...logContext,
        error: error instanceof Error ? error.message : String(error),
      });
      return 'Failed to create follow-up task due to an error.';
    }
  },

  /**
   * @function findStakeholders
   * @description Finds relevant stakeholders using the Python backend.
   * @param payload The payload containing companyName and roles.
   */
  findStakeholders: async (payload: {
    companyName: string;
    roles?: string[]; // Changed from role?: string; removed count, opportunityId, userId
  }): Promise<PythonApiResponse<FindStakeholdersResponse>> => {
    const logContext = { operation: 'findStakeholders', payload };
    logger.info('[pythonApiService][findStakeholders][START]', logContext);
    try {
      const result = await callPythonApi<FindStakeholdersResponse>('/api/find_stakeholders', {
        companyName: payload.companyName,
        roles: payload.roles, // Pass roles as an array
      });

      if (result.success && result.data) {
        logger.success('[pythonApiService][findStakeholders][SUCCESS]', {
          ...logContext,
          count: result.data.stakeholders.length,
        });
        return result;
      } else if (result.error) {
        logger.warn('[pythonApiService][findStakeholders][API_ERROR_MESSAGE]', { ...logContext, error: result.error });
        return { success: false, error: result.error };
      } else {
        logger.warn('[pythonApiService][findStakeholders][NO_DATA_FOUND]', { ...logContext, result });
        return { success: false, error: 'No stakeholders found.' };
      }
    } catch (error: unknown) {
      logger.error('[pythonApiService][findStakeholders][ERROR]', {
        ...logContext,
        error: handleApiError(error),
      });
      return { success: false, error: 'Failed to fetch stakeholders due to an unexpected error.' };
    }
  },

  /**
   * @function scrapeWithAiohttp
   * @description Calls the Python backend to scrape a single URL using aiohttp.
   * @param url The URL to scrape.
   * @param body_only Whether to return only the body content.
   * @param retries Number of retries.
   * @param delay Delay between retries.
   * @param timeout Request timeout.
   * @returns The scraped content.
   */
  scrapeWithAiohttp: async (
    url: string,
    body_only?: boolean,
    retries?: number,
    delay?: number,
    timeout?: number
  ): Promise<string> => {
    const logContext = { operation: 'scrapeWithAiohttp', url };
    logger.info('[pythonApiService][scrapeWithAiohttp][START]', logContext);
    try {
      const result = await callPythonApi<{ content: string }>('/utils/scrape_with_aiohttp', {
        url,
        body_only,
        retries,
        delay,
        timeout,
      });
      if (result.success && result.data && 'content' in result.data) {
        logger.success('[pythonApiService][scrapeWithAiohttp][SUCCESS]', {
          ...logContext,
          contentLength: result.data.content.length,
        });
        return result.data.content;
      }
      logger.warn('[pythonApiService][scrapeWithAiohttp][NO_CONTENT]', { ...logContext, result });
      return 'No content scraped with aiohttp.';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][scrapeWithAiohttp][ERROR]', { ...logContext, error: errorMessage });
      return 'Failed to scrape with aiohttp due to an error.';
    }
  },

  /**
   * @function scrapeMultiple
   * @description Calls the Python backend to scrape multiple URLs.
   * @param urls A list of URLs to scrape.
   * @param use_selenium Whether to use Selenium for scraping.
   * @param body_only Whether to return only the body content.
   * @param browser Which browser to use if Selenium is enabled.
   * @param headless Whether to run the browser in headless mode.
   * @returns The scraped content.
   */
  scrapeMultiple: async (
    urls: string[],
    use_selenium?: boolean,
    body_only?: boolean,
    browser?: string,
    headless?: boolean
  ): Promise<any[]> => {
    const logContext = { operation: 'scrapeMultiple', urls };
    logger.info('[pythonApiService][scrapeMultiple][START]', logContext);
    try {
      const result = await callPythonApi<any[]>('/utils/scrape_multiple', {
        urls,
        use_selenium,
        body_only,
        browser,
        headless,
      });
      if (result.success && Array.isArray(result.data)) {
        logger.success('[pythonApiService][scrapeMultiple][SUCCESS]', { ...logContext, count: result.data.length });
        return result.data;
      }
      logger.warn('[pythonApiService][scrapeMultiple][NO_DATA]', { ...logContext, result });
      return [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][scrapeMultiple][ERROR]', { ...logContext, error: errorMessage });
      return [];
    }
  },

  /**
   * @function searchAndExtractWebContext
   * @description Calls the Python backend to perform a Google search and extract web context.
   * @param query The search query.
   * @param num_results The number of results to extract context from.
   * @returns The extracted web context.
   */
  searchAndExtractWebContext: async (query: string, num_results?: number): Promise<string> => {
    const logContext = { operation: 'searchAndExtractWebContext', query };
    logger.info('[pythonApiService][searchAndExtractWebContext][START]', logContext);
    try {
      const result = await callPythonApi<{ context: string }>('/utils/search_and_extract_web_context', {
        query,
        num_results,
      });
      if (result.success && result.data && 'context' in result.data) {
        logger.success('[pythonApiService][searchAndExtractWebContext][SUCCESS]', {
          ...logContext,
          contentLength: result.data.context.length,
        });
        return result.data.context;
      }
      logger.warn('[pythonApiService][searchAndExtractWebContext][NO_CONTEXT]', { ...logContext, result });
      return 'No web context found.';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][searchAndExtractWebContext][ERROR]', { ...logContext, error: errorMessage });
      return 'Failed to search and extract web context due to an error.';
    }
  },

  /**
   * @function googleSearch
   * @description Calls the Python backend to perform a raw Google search.
   * @param query The search query.
   * @param max_results The maximum number of search results to return.
   * @returns The Google search results.
   */
  googleSearch: async (query: string, max_results?: number): Promise<any[]> => {
    const logContext = { operation: 'googleSearch', query };
    logger.info('[pythonApiService][googleSearch][START]', logContext);
    try {
      const result = await callPythonApi<any[]>('/utils/google_search', { query, max_results });
      if (result.success && Array.isArray(result.data)) {
        logger.success('[pythonApiService][googleSearch][SUCCESS]', { ...logContext, count: result.data.length });
        return result.data;
      }
      logger.warn('[pythonApiService][googleSearch][NO_RESULTS]', { ...logContext, result });
      return [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[pythonApiService][googleSearch][ERROR]', { ...logContext, error: errorMessage });
      return [];
    }
  },

  /**
   * @function sendEmail
   * @description Sends an email using the internal email service.
   * @param to The recipient's email address.
   * @param subject The subject of the email.
   * @param body The body content of the email.
   * @param attachments Optional list of attachment URLs or paths.
   * @returns The result of the email sending operation.
   */
  sendEmail: async (to: string, subject: string, body: string, attachments?: string[]): Promise<any> => {
    const logContext = { operation: 'sendEmail', to, subject };
    logger.info('[INTERNAL_SERVICE] Sending email.', { ...logContext });
    try {
      // Assuming app/api/orion/email/send/route.ts handles the actual email sending
      const response = await apiClient.post('/api/orion/email/send', { to, subject, body, attachments });
      logger.success('[INTERNAL_SERVICE] Email sent successfully.', { ...logContext, responseData: response.data });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      logger.error('[INTERNAL_SERVICE] Failed to send email.', {
        ...logContext,
        error: handleApiError(error),
      });
      throw new Error(`Failed to send email: ${handleApiError(error)}`);
    }
  },

  /**
   * Calls the Python backend to generate sentence-transformer embeddings for a list of texts.
   * @param texts A list of texts to be embedded.
   * @returns An object containing success status, embeddings, or an error message.
   */
  generateEmbeddings: async (texts: string[]) => {
    // Implementation of generateEmbeddings method
  },
};
