/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Service for fetching user profile data.
 * @description This service fetches Tomide's unstructured profile text from a primary Notion page,
 * with a fallback to local text files. It handles caching to minimize API calls and includes comprehensive logging.
 *profile sources - cv components from neon postgres, notion profile.
 *
 * DEVELOPMENT NOTE: This is a client-side service that relies on the server-side `/api/orion/profile` endpoint.
 * Authentication bypasses for development are handled on the server-side (e.g., `app/lib/server_profile_fetcher.ts`).
 * This file itself does not contain strict authentication checks.
 */

import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';

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
 * Extracts a Notion page ID from a given Notion URL.
 * Handles both dashed and non-dashed ID formats.
 */
// NOTE: These helper functions are now unused in this client-side service,
// but are kept here in case they are re-needed for client-side parsing of *already fetched* data.
// The server-side fetching now uses the same logic.
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
function extractTextFromBlock(block: any): string {
  const blockType = block?.type;
  if (!blockType) return '';

  const blockContent = block[blockType];

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

// In-memory cache for the profile is now handled on the server-side route.

/**
 * Fetches user profile data from the /api/orion/profile API route.
 * This function is intended for client-side execution ONLY.
 */
export async function fetchUserProfile(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'fetchUserProfile',
    timestamp: new Date().toISOString(),
  };
  logger.info('Attempting to fetch user profile data from API route...', logContext);

  try {
    const response = await apiClient.get<UserProfileFetchResponse>('/api/orion/profile');

    if (response.data?.success) {
      logger.success('Successfully fetched profile from API route.', logContext);
      return response.data;
    } else {
      logger.warn('Failed to fetch profile from API route.', {
        ...logContext,
        error: response.data?.error || 'Unknown error from API route',
      });
      return { success: false, error: response.data?.error || 'Failed to fetch profile.' };
    }
  } catch (error: any) {
    const errorMessage = error.message || 'An unexpected error occurred during API call.';
    logger.error('Error fetching user profile from API route.', {
      ...logContext,
      error: errorMessage,
      details: error.stack,
    });
    return { success: false, error: errorMessage };
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
      return {
        success: true,
        profile: rawProfile,
        profileText: rawProfileResponse.profileText, // Pass through the profileText from the API
        source: rawProfileResponse.source, // Pass through the source from the API
      };
    } else {
      logger.warn('[ProfileService] getProfileText failed to get raw profile data.', {
        operation: 'getProfileText',
        error: rawProfileResponse.error,
      });
      return { success: false, error: rawProfileResponse.error };
    }
  } catch (error: any) {
    logger.error('[ProfileService] getProfileText encountered an error.', {
      operation: 'getProfileText',
      error: error.message,
    });
    return { success: false, error: error.message };
  }
}
