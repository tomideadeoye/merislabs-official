'use server';

import logger from '@/lib/logger';
import { UserProfileFetchResponse, UserProfileData } from '@/lib/types';

/**
 * @fileoverview Server-side utility for fetching user profile data from the external Python profile service.
 * @description This module is strictly server-side and communicates with the Python backend to retrieve
 *   Tomide's comprehensive profile and personality data.
 */

interface ProfileServiceRawData {
  profileText: string;
  source: 'notion' | 'local' | 'external_service';
}

/**
 * Fetches user profile data from the external Python profile service.
 * This function should only be called in a server environment.
 */
export async function fetchLocalProfileData(logContext: any): Promise<UserProfileFetchResponse> {
  try {
    logger.info('Attempting to fetch user profile from external Python service...', logContext);

    const externalServiceUrl = process.env.PYTHON_PROFILE_API_URL || 'http://localhost:8000/get-profile-data';

    logger.debug('Attempting to fetch profile from URL:', {
      ...logContext,
      url: externalServiceUrl,
    });

    const response = await fetch(externalServiceUrl, {
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
      logger.success('Successfully fetched profile from external Python service.', logContext);
      return {
        success: true,
        profile: profileData as unknown as UserProfileData, // Cast as UserProfileData
        profileText: combinedProfileText,
        source: 'external_service',
      };
    } else {
      logger.warn('External profile service returned no content.', logContext);
      return { success: false, error: 'No content found in external profile service.', source: 'external_service' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to fetch user profile from external Python service. This is a critical context failure.', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: `Failed to fetch profile from external service: ${errorMessage}`,
      source: 'external_service',
    };
  }
}
