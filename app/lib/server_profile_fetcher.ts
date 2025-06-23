/**
 * @fileoverview Server-side service for fetching user profile data from Notion or local files.
 * @description This module handles all server-only operations related to fetching Tomide's unstructured profile text from either a primary Notion page (using Notion API and secret keys) or falling back to local text files. It includes logic for parsing Notion blocks and caching data to minimize external API calls. This service MUST ONLY be called from server-side contexts, such as Next.js API routes or Server Components.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Securely fetch user profile data from Notion, utilizing `process.env` variables for API keys.
 *   - Implement fallback mechanism to retrieve profile data from local files if Notion fetching fails.
 *   - Parse and concatenate text content from Notion blocks into a single profile string.
 *   - Provide an in-memory caching mechanism for fetched profile data to reduce redundant API calls.
 *   - Ensure strict separation of server-side logic, preventing sensitive operations from leaking to the client.
 *
 * FILEPATH: `app/lib/server_profile_fetcher.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/profile/route.ts`: This API route will be the primary consumer of `fetchServerUserProfile`.
 *   - `@/lib/types`: Imports `UserProfileData`, `UserProfileFetchResponse` for type definitions.
 *   - `@/lib/logger`: For comprehensive server-side logging.
 *   - `./server_profile_utils`: Imports `fetchLocalProfileData` for the local file fallback mechanism.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `process.env.USER_PROFILE_NOTION_URL` and `process.env.NOTION_API_KEY` are correctly configured in the server environment.
 *   - The `fetchServerUserProfile` function is *only* to be called from server environments (e.g., API routes, Server Components).
 *   - Notion URLs are expected to contain a valid page ID.
 *   - **DEVELOPMENT NOTE**: For local development and to bypass Notion API authentication, the logic has been modified to prioritize fetching from local files.
 *
 * NOTES:
 *   - This module encapsulates all sensitive API calls and file system operations, maintaining a clear boundary between server and client code.
 *   - The caching mechanism is per-server instance; for multi-instance deployments, a shared cache (e.g., Redis) would be needed for true global caching.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Robust Error Handling**: Implement more granular error handling for Notion API responses (e.g., rate limiting, specific Notion error codes).
 *   - **Distributed Caching**: For production, replace in-memory cache with a distributed caching solution (e.g., Redis) to share cache across multiple serverless instances.
 *   - **Notion Block Parser**: Enhance `extractTextFromBlock` to support more Notion block types (e.g., code blocks, callouts) if needed.
 *   - **Type Safety for `fetchLocalProfileData`**: Ensure `fetchLocalProfileData` returns a type fully compatible with `ProfileServiceRawData`.
 */

import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';

/**
 * Defines the structure for the fetched user profile data.
 * It's designed to hold unstructured text from either Notion or local files.
 */
export interface ProfileServiceRawData {
  /** The full, concatenated unstructured text from the profile source. */
  profileText: string;
  /** Indicates whether the data came from Notion or local files. */
  source: 'notion' | 'local' | 'external_service';
}

/**
 * Represents a simplified Notion block structure for text extraction.
 */
interface NotionTextBlock {
  type: string; // The type of the Notion block (e.g., 'paragraph', 'heading_1', etc.)
  [key: string]: // Index signature for dynamic block content properties
  { rich_text?: { plain_text: string }[] } | string; // Allow 'type' property to be a string
}

/**
 * Represents a simplified Notion API response structure for blocks.
 */
interface NotionBlocksApiResponse {
  results: NotionTextBlock[];
  // Other properties like next_cursor, has_more, etc., can be added if needed
}

/**
 * Extracts a Notion page ID from a given Notion URL.
 * Handles both dashed and non-dashed ID formats.
 */
function extractNotionPageId(url: string): string | null {
  // Regex for 32-character non-dashed ID at the end of a path
  const match = url.match(/[0-9a-fA-F]{32}$/);
  if (match) return match[0];

  // Regex for standard UUID format
  const dashed = url.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  if (dashed) return dashed[0].replace(/-/g, ''); // Return non-dashed version

  return null;
}

/**
 * Extracts plain text from any Notion block type that contains a `rich_text` array.
 */
function extractTextFromBlock(block: NotionTextBlock): string {
  const blockType = block?.type;
  if (!blockType) return '';

  const blockContent = block[blockType];

  // Type guard to ensure blockContent is an object with rich_text before accessing
  if (
    typeof blockContent === 'object' &&
    blockContent !== null &&
    'rich_text' in blockContent &&
    Array.isArray(blockContent.rich_text)
  ) {
    return blockContent.rich_text.map((rt: { plain_text: string }) => rt.plain_text).join('');
  }
  return '';
}

// In-memory cache for the profile to reduce API calls during a single session
let profileCache: {
  data: ProfileServiceRawData | null;
  timestamp: number;
} | null = null;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Import the server-side utility for local file fetching
import { fetchLocalProfileData } from './server_profile_utils';

/**
 * Fetches user profile data from a primary source (Notion page with unstructured text)
 * and falls back to local files if the primary source fails.
 * This function is intended for server-side execution ONLY.
 *
 * DEVELOPMENT NOTE: For local development and to bypass Notion API authentication,
 * fetching from local files is prioritized or made the sole method.
 * Re-enable Notion API fetch for production environments.
 */
export async function fetchServerUserProfile(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'fetchServerUserProfile',
    timestamp: new Date().toISOString(),
  };
  logger.info('Attempting to fetch user profile data on server...', logContext);

  // 1. Primary Source (Notion): Attempt to fetch from Notion
  const notionUrl = process.env.USER_PROFILE_NOTION_URL;
  const notionApiKey = process.env.NOTION_API_KEY;
  if (notionUrl && notionApiKey) {
    try {
      logger.info('Primary Source: Attempting to fetch profile from Notion page on server.', logContext);
      const pageId = extractNotionPageId(notionUrl);
      if (!pageId) {
        throw new Error('Could not extract a valid Notion page ID from USER_PROFILE_NOTION_URL.');
      }

      const notionRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
        headers: {
          Authorization: `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (!notionRes.ok) {
        const errorBody = await notionRes.text();
        throw new Error(
          `Failed to fetch Notion page: ${notionRes.status} ${notionRes.statusText}. Response: ${errorBody}`
        );
      }

      const notionData: NotionBlocksApiResponse = (await notionRes.json()) as NotionBlocksApiResponse;

      const allText = notionData.results
        .map((block) => extractTextFromBlock(block))
        .join('\n')
        .trim();

      if (allText) {
        const profileData: ProfileServiceRawData = {
          profileText: allText,
          source: 'notion',
        };
        profileCache = { data: profileData, timestamp: Date.now() };
        logger.success('Successfully fetched and parsed profile from Notion on server.', logContext);
        return {
          success: true,
          profile: profileData as unknown as UserProfileData,
          profileText: allText,
          source: 'notion',
        };
      } else {
        logger.warn(
          'Notion page was fetched but contained no parsable text content. Attempting fallback on server.',
          logContext
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error fetching/parsing user profile from Notion on server. Attempting fallback.', {
        ...logContext,
        error: errorMessage,
        details: error,
      });
    }
  }

  // 2. Fallback to in-memory cache if it exists and is still valid
  if (profileCache && Date.now() - profileCache.timestamp < PROFILE_CACHE_TTL_MS) {
    logger.info('Returning cached user profile data from server cache.', {
      ...logContext,
      source: profileCache.data?.source,
    });
    if (profileCache.data) {
      return {
        success: true,
        profile: profileCache.data as unknown as UserProfileData,
        profileText: profileCache.data.profileText,
        source: profileCache.data.source,
      };
    } else {
      return { success: false, error: 'Cached data is null.' };
    }
  }

  // 3. Fallback to local files (development mode) or external Python service
  try {
    logger.info('Attempting to fetch profile from local files/external service (fallback mode).', logContext);
    const localProfileData = await fetchLocalProfileData(logContext);
    if (localProfileData && localProfileData.success && localProfileData.profileText) {
      const profileData: ProfileServiceRawData = {
        profileText: localProfileData.profileText,
        source: localProfileData.source === 'external_service' ? 'external_service' : 'local', // Correctly assign source
      };
      profileCache = { data: profileData, timestamp: Date.now() };
      logger.success(`Successfully fetched profile from ${profileData.source} source.`, logContext);
      return {
        success: true,
        profile: profileData as unknown as UserProfileData,
        profileText: localProfileData.profileText,
        source: profileData.source,
      };
    } else {
      logger.warn('No local profile data or external service data found.', logContext);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error fetching user profile from local files/external service.', {
      ...logContext,
      error: errorMessage,
      details: error,
    });
  }

  // If nothing succeeded, return failure.
  logger.error('Failed to fetch user profile after all attempts.', logContext);
  return { success: false, error: 'Failed to fetch user profile from any configured source.' };
}
