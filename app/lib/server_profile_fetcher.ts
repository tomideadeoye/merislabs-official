/**
 * @fileoverview Server-side service for fetching user profile data from local files or external service only. All Notion/placeholder logic has been removed.
 * @description This module handles all server-only operations related to fetching Tomide's unstructured profile text from local text files or an external service. It includes logic for in-memory caching to minimize redundant file reads or API calls. This service MUST ONLY be called from server-side contexts, such as Next.js API routes or Server Components.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Securely fetch user profile data from local files or external service.
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
 *   - The `fetchServerUserProfile` function is *only* to be called from server environments (e.g., API routes, Server Components).
 *
 * NOTES:
 *   - This module encapsulates all sensitive API calls and file system operations, maintaining a clear boundary between server and client code.
 *   - The caching mechanism is per-server instance; for multi-instance deployments, a shared cache (e.g., Redis) would be needed for true global caching.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Distributed Caching**: For production, replace in-memory cache with a distributed caching solution (e.g., Redis) to share cache across multiple serverless instances.
 *   - **Type Safety for `fetchLocalProfileData`**: Ensure `fetchLocalProfileData` returns a type fully compatible with `ProfileServiceRawData`.
 */

import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';

export interface ProfileServiceRawData {
  profileText: string;
  source: 'local' | 'external_service';
}

// In-memory cache for the profile to reduce API calls during a single session
let profileCache: {
  data: ProfileServiceRawData | null;
  timestamp: number;
} | null = null;
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

import { fetchLocalProfileData } from './server_profile_utils';

export async function fetchServerUserProfile(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'fetchServerUserProfile',
    timestamp: new Date().toISOString(),
  };
  logger.info('Attempting to fetch user profile data on server...', logContext);

  // 1. Fallback to in-memory cache if it exists and is still valid
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

  // 2. Fallback to local files (development mode) or external Python service
  try {
    logger.info('Attempting to fetch profile from local files/external service (fallback mode).', logContext);
    const localProfileData = await fetchLocalProfileData(logContext);
    if (localProfileData && localProfileData.success && localProfileData.profileText) {
      const profileData: ProfileServiceRawData = {
        profileText: localProfileData.profileText,
        source: localProfileData.source === 'external_service' ? 'external_service' : 'local',
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
