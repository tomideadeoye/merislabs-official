/**
 * @fileoverview Service for fetching user profile data.
 * @description This service primarily fetches Tomide's unstructured profile text from a Notion page.
 *   As a fallback, if Notion data is unavailable or inaccessible, it gracefully retrieves the profile
 *   from an external Python profile service. This ensures robust and continuous access to core user context.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To act as the centralized service for retrieving Tomide's comprehensive user profile and personality text.
 *   - To prioritize fetching profile data from the Notion API (using `USER_PROFILE_NOTION_URL`).
 *   - To implement a robust fallback mechanism to fetch profile data from an external Python API (`PYTHON_PROFILE_API_URL`)
 *     if the Notion fetch fails or Notion credentials are not configured.
 *   - To cache fetched profile data in-memory for a defined TTL (`PROFILE_CACHE_TTL_MS`) to minimize redundant API calls.
 *   - To provide comprehensive logging at each stage of the data fetching process for traceability and debugging.
 *   - To return a consistent `ProfileServiceRawData` structure, indicating the source of the data.
 *
 * FILEPATH: `app/profile_service.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/server_profile_utils.ts`: This file is imported by `server_profile_utils.ts` for server-side fetching of profile data.
 *   - `UserProfileData` and `UserProfileFetchResponse` (`@/lib/types`): These interfaces define the expected structure of profile data consumed and returned by this service.
 *   - `logger` (`@/lib/logger`): Used for all logging operations within this service, providing detailed insights into data flow and errors.
 *   - `USER_PROFILE_NOTION_URL` and `NOTION_API_KEY` (Environment Variables): Configures the primary Notion data source.
 *   - `PYTHON_PROFILE_API_URL` (Environment Variable): Configures the fallback external Python service endpoint.
 *   - Notion API (`api.notion.com`): The external API endpoint for fetching Notion page content.
 *   - External Python Profile Service (`http://localhost:8000/get-profile-data`): The external API endpoint for retrieving profile data when Notion is not the source.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `USER_PROFILE_NOTION_URL` points to a Notion *page* (not a database) containing unstructured text for the profile.
 *   - Assumes the Notion API key (`NOTION_API_KEY`) has the necessary permissions to read the specified Notion page.
 *   - Assumes the external Python profile service (if used) is running at the configured `PYTHON_PROFILE_API_URL` (defaulting to `http://localhost:8000/get-profile-data`).
 *   - The Python service is expected to return a JSON object with `profile_text` and `personality_text` fields.
 *   - Caching is implemented to optimize performance for repeated requests within the TTL.
 *   - This service runs on the server-side, handling sensitive API keys securely.
 *
 * NOTES:
 *   - This service is crucial for centralizing user profile context, which is fundamental for personalization across all of Orion's LLM-powered features.
 *   - The dual-source strategy (Notion + External Python Service) provides high availability and flexibility for managing Tomide's core context.
 *   - The `extractNotionPageId` and `extractTextFromBlock` functions ensure robust parsing of Notion block content.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Asynchronous Caching**: Implement persistent caching (e.g., Redis, database) for profile data beyond in-memory, especially for serverless environments.
 *   - **Notion Block Type Expansion**: Extend `extractTextFromBlock` to support more Notion block types (e.g., lists, code blocks) if profile data is structured in complex ways.
 *   - **Health Checks**: Implement health checks for both Notion API and the Python profile service to proactively detect and report outages.
 *   - **API Key Management**: Explore more secure ways to manage API keys, potentially integrating with a secrets management service.
 *   - **Rate Limiting/Circuit Breaker**: Implement rate limiting and circuit breaker patterns for external API calls to prevent abuse or cascading failures.
 *   - **Version Control for Profile**: Potentially integrate with a Git-based system for versioning changes to the local profile text, if that becomes a primary source again.
 */
import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';

/**
 * Defines the structure for the fetched user profile data.
 * It's designed to hold unstructured text from either Notion, local files, or an external service.
 */
export interface ProfileServiceRawData {
  /** The full, concatenated unstructured text from the profile source. */
  profileText: string;
  /** Indicates whether the data came from Notion, local files, or an external service. */
  source: 'notion' | 'local' | 'external_service';
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
function extractTextFromBlock(block: { type: string; [key: string]: unknown }): string {
  const blockType = block?.type;
  if (!blockType) return '';

  const blockContent = block[blockType] as { rich_text?: { plain_text: string }[] };
  if (blockContent?.rich_text && Array.isArray(blockContent.rich_text)) {
    return blockContent.rich_text.map((rt) => rt.plain_text).join('');
  }
  return '';
}

// In-memory cache for the profile to reduce API calls during a single session
let profileCache: {
  data: ProfileServiceRawData | null;
  timestamp: number;
} | null = null;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches user profile data from a primary source (Notion page with unstructured text)
 * and falls back to an external Python service if the primary source fails.
 */
export async function fetchUserProfile(): Promise<ProfileServiceRawData | null> {
  const logContext = {
    operation: 'fetchUserProfile',
    timestamp: new Date().toISOString(),
  };
  logger.info('Attempting to fetch user profile data...', logContext);

  // 1. Check in-memory cache first
  if (profileCache && Date.now() - profileCache.timestamp < PROFILE_CACHE_TTL_MS) {
    logger.info('Returning cached user profile data.', {
      ...logContext,
      source: profileCache.data?.source,
    });
    return profileCache.data;
  }

  const notionUrl = process.env.USER_PROFILE_NOTION_URL;
  const notionApiKey = process.env.NOTION_API_KEY;
  const pythonProfileApiUrl = process.env.PYTHON_PROFILE_API_URL || 'http://localhost:8000/get-profile-data';

  // 2. Primary Source: Attempt to fetch from Notion
  if (notionUrl && notionApiKey) {
    try {
      logger.info('Primary Source: Attempting to fetch profile from Notion page.', logContext);
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

      const notionData = (await notionRes.json()) as { results: { type: string; [key: string]: unknown }[] };

      // REFACTORED: Concatenate text from all supported block types into a single string.
      const allText = notionData.results
        .map((block) => extractTextFromBlock(block))
        .join('\n') // Join content from different blocks with a newline
        .trim();

      if (allText) {
        const profileData: ProfileServiceRawData = {
          profileText: allText,
          source: 'notion',
        };
        profileCache = { data: profileData, timestamp: Date.now() };
        logger.success('Successfully fetched and parsed profile from Notion.', logContext);
        return profileData;
      } else {
        logger.warn('Notion page was fetched but contained no parsable text content. Attempting fallback.', logContext);
      }
    } catch (error) {
      logger.error('Error fetching/parsing user profile from Notion. Attempting fallback.', { ...logContext, error });
    }
  } else {
    logger.warn('Notion URL or API Key not set. Attempting external service fallback.', logContext);
  }

  // 3. Fallback Source: Attempt to fetch from external Python service
  if (pythonProfileApiUrl) {
    try {
      logger.info('Fallback Source: Attempting to fetch user profile from external Python service.', logContext);

      const response = await fetch(pythonProfileApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Consider adding a timeout for robustness
        // signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || `Failed to fetch profile: ${response.statusText}`);
      }

      const data: { profile_text: string; personality_text: string } = await response.json();

      const combinedProfileText = `${data.profile_text}\n\n---\n\n${data.personality_text}`.trim();

      if (combinedProfileText) {
        const profileData: ProfileServiceRawData = {
          profileText: combinedProfileText,
          source: 'external_service',
        };
        profileCache = { data: profileData, timestamp: Date.now() };
        logger.success('Successfully fetched profile from external Python service.', logContext);
        return profileData;
      } else {
        logger.warn('External profile service returned no content.', logContext);
        throw new Error('External profile service returned no content.');
      }
    } catch (error: unknown) {
      logger.error('Error fetching user profile from external Python service. This is a critical context failure.', {
        ...logContext,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  logger.error(
    'Failed to fetch user profile from all sources (Notion and external service). This is a critical context failure.',
    { ...logContext }
  );
  return null;
}

export async function getProfileText(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'getProfileText',
    timestamp: new Date().toISOString(),
  };

  try {
    logger.info('Attempting to retrieve profile text.', logContext);
    const profileData = await fetchUserProfile();

    if (profileData && profileData.profileText) {
      logger.success('Successfully retrieved profile text.', { ...logContext, source: profileData.source });
      return {
        success: true,
        profileText: profileData.profileText,
        profile: { profileText: profileData.profileText, source: profileData.source } as unknown as UserProfileData,
        source: profileData.source,
      };
    } else {
      logger.warn('No profile text available after fetching from all sources.', logContext);
      return { success: false, error: 'No profile text available.', source: 'none' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error in getProfileText.', { ...logContext, error: errorMessage });
    return { success: false, error: `Error retrieving profile text: ${errorMessage}`, source: 'error' };
  }
}
