/**
 * @fileoverview Service for fetching user profile data.
 * @description This service fetches Tomide's unstructured profile text from a primary Notion page,
 * with a fallback to local text files. It handles caching to minimize API calls and includes comprehensive logging.
 */

import { readFile } from 'fs/promises';
import path from 'path';
/// <reference types="node-fetch" />
import fetch from 'node-fetch';
import { logger } from '@repo/shared/logger';

let readFileImpl: typeof import('fs/promises').readFile | undefined;
let pathImpl: typeof import('path') | undefined;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  readFileImpl = require('fs/promises').readFile;
  pathImpl = require('path');
} else {
  // Stubs for non-Node environments
  readFileImpl = async () => { throw new Error('readFile is not available in this environment.'); };
  pathImpl = { join: () => { throw new Error('path.join is not available in this environment.'); } } as any;
}

/**
 * Defines the structure for the fetched user profile data.
 * It's designed to hold unstructured text from either Notion or local files.
 */
export interface UserProfileData {
  /** The full, concatenated unstructured text from the profile source. */
  profileText: string;
  /** Indicates whether the data came from Notion or local files. */
  source: "notion" | "local";
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
  if (dashed) return dashed[0].replace(/-/g, ""); // Return non-dashed version

  return null;
}

/**
 * Extracts plain text from any Notion block type that contains a `rich_text` array.
 */
function extractTextFromBlock(block: any): string {
  const blockType = block?.type;
  if (!blockType) return '';

  const blockContent = block[blockType];
  if (blockContent?.rich_text && Array.isArray(blockContent.rich_text)) {
    return blockContent.rich_text.map((rt: any) => rt.plain_text).join('');
  }
  return '';
}

// In-memory cache for the profile to reduce API calls during a single session
let profileCache: { data: UserProfileData | null; timestamp: number } | null = null;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches user profile data from a primary source (Notion page with unstructured text)
 * and falls back to local files if the primary source fails.
 */
export async function fetchUserProfile(): Promise<UserProfileData | null> {
  const logContext = { operation: 'fetchUserProfile', timestamp: new Date().toISOString() };
  logger.info('Attempting to fetch user profile data...', logContext);

  // 1. Check in-memory cache first
  if (profileCache && Date.now() - profileCache.timestamp < PROFILE_CACHE_TTL_MS) {
    logger.info('Returning cached user profile data.', { ...logContext, source: profileCache.data?.source });
    return profileCache.data;
  }

  const notionUrl = process.env.USER_PROFILE_NOTION_URL;
  const notionApiKey = process.env.NOTION_API_KEY;

  // 2. Primary Source: Attempt to fetch from Notion
  if (notionUrl && notionApiKey) {
    try {
      logger.info('Primary Source: Attempting to fetch profile from Notion page.', logContext);
      const pageId = extractNotionPageId(notionUrl);
      if (!pageId) {
        throw new Error("Could not extract a valid Notion page ID from USER_PROFILE_NOTION_URL.");
      }

      const notionRes = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
        headers: {
          "Authorization": `Bearer ${notionApiKey}`,
          "Notion-Version": "2022-06-28",
        }
      });

      if (!notionRes.ok) {
        const errorBody = await notionRes.text();
        throw new Error(`Failed to fetch Notion page: ${notionRes.status} ${notionRes.statusText}. Response: ${errorBody}`);
      }

      const notionData = await notionRes.json() as any;

      // REFACTORED: Concatenate text from all supported block types into a single string.
      const allText = notionData.results
        .map((block: any) => extractTextFromBlock(block))
        .join('\n') // Join content from different blocks with a newline
        .trim();

      if (allText) {
        const profileData: UserProfileData = {
          profileText: allText,
          source: "notion",
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
    logger.warn('Notion URL or API Key not set. Attempting local file fallback.', logContext);
  }

  // 3. Fallback Source: Attempt to fetch from local files
  try {
    logger.info('Fallback Source: Attempting local file read for user profile...', logContext);

    // Using process.cwd() should resolve from the root of the running application
    const profileTextPath = pathImpl.join(process.cwd(), 'backend', 'orion_python_backend', 'Tomide_Adeoye_Profile.txt');
    const personalityTextPath = pathImpl.join(process.cwd(), 'backend', 'orion_python_backend', 'Tomide_Adeoye_personality.txt');

    logger.debug('Attempting to read profile files from paths:', { profilePath: profileTextPath, personalityPath: personalityTextPath });

    const profileContent = await readFileImpl(profileTextPath, 'utf-8');
    const personalityContent = await readFileImpl(personalityTextPath, 'utf-8');

    const combinedLocalText = `${profileContent}\n\n---\n\n${personalityContent}`.trim();

    if (combinedLocalText) {
        const profileData: UserProfileData = {
            profileText: combinedLocalText,
            source: "local",
        };
        profileCache = { data: profileData, timestamp: Date.now() };
        logger.success('Successfully fetched profile from local files.', logContext);
        return profileData;
    } else {
        throw new Error("Local profile files were found but are empty.");
    }
  } catch (error) {
    logger.error('Failed to fetch user profile from all sources (Notion and local files). This is a critical context failure.', { ...logContext, error });
    // This will now be the final point of failure if local files are also missing.
    return null;
  }
}
