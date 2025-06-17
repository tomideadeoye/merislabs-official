/**
 * @fileoverview Service for fetching user profile data.
 * @description This service fetches Tomide's unstructured profile text from a primary Notion page,
 * with a fallback to local text files. It handles caching to minimize API calls and includes comprehensive logging.
 */

import fetch from 'node-fetch';
import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

let fsPromises: typeof import('fs/promises');
let path: typeof import('path');

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  // Dynamically import Node.js built-in modules
  import('fs/promises').then((mod) => (fsPromises = mod));
  import('path').then((mod) => (path = mod));
}

/**
 * Defines the structure for the fetched user profile data.
 * It's designed to hold unstructured text from either Notion or local files.
 */
export interface ProfileServiceRawData {
  /** The full, concatenated unstructured text from the profile source. */
  profileText: string;
  /** Indicates whether the data came from Notion or local files. */
  source: 'notion' | 'local';
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

/**
 * Fetches user profile data from a primary source (Notion page with unstructured text)
 * and falls back to local files if the primary source fails.
 */
export async function fetchUserProfile(): Promise<UserProfileFetchResponse> {
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
    // Convert cached ProfileServiceRawData to UserProfileFetchResponse
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

  const notionUrl = process.env.USER_PROFILE_NOTION_URL;
  const notionApiKey = process.env.NOTION_API_KEY;

  // Configure custom agents to prevent Node.js DEP0016 warning with older Node versions
  // This helps ensure compatibility and stability in deployment environments.
  const httpAgent = new HttpAgent({ keepAlive: true });
  const httpsAgent = new HttpsAgent({ keepAlive: true });

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
        agent: (url: URL) => (url.protocol === 'http:' ? httpAgent : httpsAgent), // Use custom agents
      });

      if (!notionRes.ok) {
        const errorBody = await notionRes.text();
        throw new Error(
          `Failed to fetch Notion page: ${notionRes.status} ${notionRes.statusText}. Response: ${errorBody}`
        );
      }

      const notionData: NotionBlocksApiResponse = (await notionRes.json()) as NotionBlocksApiResponse;

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
        return {
          success: true,
          profile: profileData as unknown as UserProfileData,
          profileText: allText,
          source: 'notion',
        };
      } else {
        logger.warn('Notion page was fetched but contained no parsable text content. Attempting fallback.', logContext);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Error fetching/parsing user profile from Notion. Attempting fallback.', {
        ...logContext,
        error: errorMessage,
      });
    }
  } else {
    logger.warn('Notion URL or API Key not set. Attempting local file fallback.', logContext);
  }

  // 3. Fallback Source: Attempt to fetch from local files
  try {
    logger.info('Fallback Source: Attempting local file read for user profile...', logContext);

    // Using process.cwd() should resolve from the root of the running application
    // Ensure fsPromises and path are initialized before use
    if (!fsPromises || !path) {
      throw new Error('Node.js file system modules are not available.');
    }

    const profileTextPath = path.join(process.cwd(), 'backend', 'orion_python_backend', 'Tomide_Adeoye_Profile.txt');
    const personalityTextPath = path.join(
      process.cwd(),
      'backend',
      'orion_python_backend',
      'Tomide_Adeoye_personality.txt'
    );

    logger.debug('Attempting to read profile files from paths:', {
      profilePath: profileTextPath,
      personalityPath: personalityTextPath,
    });

    const profileContent = await fsPromises.readFile(profileTextPath, 'utf-8');
    const personalityContent = await fsPromises.readFile(personalityTextPath, 'utf-8');

    const combinedLocalText = `${profileContent}\n\n---\n\n${personalityContent}`.trim();

    if (combinedLocalText) {
      const profileData: ProfileServiceRawData = {
        profileText: combinedLocalText,
        source: 'local',
      };
      profileCache = { data: profileData, timestamp: Date.now() };
      logger.success('Successfully fetched profile from local files.', logContext);
      return {
        success: true,
        profile: profileData as unknown as UserProfileData,
        profileText: combinedLocalText,
        source: 'local',
      };
    } else {
      logger.warn('Local profile files were read but contained no content.', logContext);
      return { success: false, error: 'No content found in local profile files.', source: 'local' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to fetch user profile from local files. This is a critical context failure.', {
      ...logContext,
      error: errorMessage,
    });
    return { success: false, error: `Failed to fetch profile from local files: ${errorMessage}`, source: 'local' };
  }
}

/**
 * Retrieves user profile text and structures it into UserProfileData.
 * This function integrates with `fetchUserProfile` and transforms the raw text.
 * @returns A promise that resolves to UserProfileData or null.
 */
export async function getProfileText(): Promise<UserProfileFetchResponse> {
  logger.info('[ProfileService] getProfileText called.', { operation: 'getProfileText' });
  try {
    const rawProfileResponse = await fetchUserProfile();
    if (rawProfileResponse.success && rawProfileResponse.profile) {
      const rawProfile = rawProfileResponse.profile;
      // For now, we'll just put the entire profileText into a 'summary' field.
      // In a real application, you might parse this into more structured fields.
      const profileData: UserProfileData = {
        id: 'user-profile-default',
        name: 'Tomide Adeoye',
        email: 'tomide.adeoye@example.com',
        bio: rawProfile.profileText || '', // Populate bio with full text
        skills: [], // Initialize as empty array
        experience: [], // Initialize as empty array
        education: [], // Initialize as empty array
        interests: [], // Initialize as empty array
        values: [], // Initialize as empty array
        goals: [], // Initialize as empty array
        socialLinks: [], // Initialize as empty array
        contactInfo: {}, // Initialize as empty object
        summary: rawProfile.profileText ? rawProfile.profileText.substring(0, 500) + '...' : '', // Truncate for example
        profileText: rawProfile.profileText,
        source: rawProfile.source,
        backgroundSummary: rawProfile.backgroundSummary,
        keySkills: rawProfile.keySkills,
        location: rawProfile.location,
      };
      return { success: true, profile: profileData, profileText: profileData.profileText, source: profileData.source };
    } else {
      // If fetchUserProfile failed or returned no profile, propagate the error/failure
      return rawProfileResponse; // This will contain success: false and an error message
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[ProfileService] Error in getProfileText.', {
      operation: 'getProfileText',
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
}
