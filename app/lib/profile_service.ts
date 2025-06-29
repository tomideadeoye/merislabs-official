/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Service for fetching user profile data.
 * @description This service fetches Tomide's unstructured profile text from a primary WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES page,
 * with a fallback to local text files. It handles caching to minimize API calls and includes comprehensive logging.
 *profile sources - cv components from neon postgres, WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES profile.
 *
 * DEVELOPMENT NOTE: This is a client-side service that relies on the server-side `/api/orion/profile` endpoint.
 * Authentication bypasses for development are handled on the server-side (e.g., `app/lib/server_profile_fetcher.ts`).
 * This file itself does not contain strict authentication checks.
 */

import logger from '@/lib/logger';
import { UserProfileFetchResponse } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';

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
