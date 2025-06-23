/**
 * @fileoverview Centralized service for managing and fetching user profile data.
 * @description This service now primarily fetches Tomide's structured and unstructured
 *   profile data directly from the Neon PostgreSQL database via Prisma. It implements
 *   client-side caching using `useLocalStorage` for caching to minimize API calls and enhance
 *   application responsiveness. This is a critical step in centralizing user context
 *   in Neon and optimizing data retrieval.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To act as the primary service for retrieving Tomide's comprehensive user profile.
 *   - To fetch profile data from the Neon database using Prisma (`prisma.userProfile`).
 *   - To implement robust client-side caching using `useLocalStorage` for the profile data,
 *     reducing database load and improving UX by serving immediate data.
 *   - To provide comprehensive logging at each stage of the data fetching process.
 *   - To return a consistent `ProfileServiceRawData` or `UserProfileFetchResponse` structure.
 *
 * FILEPATH: `app/profile_service.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/profile/save/route.ts`: This API endpoint is used to save/update the profile data that this service fetches.
 *   - `prisma/schema.prisma`: Defines the `UserProfile` model which this service queries.
 *   - `@/lib/prisma`: Imports the Prisma client instance for database operations.
 *   - `@/lib/logger`: Used for all logging operations within this service.
 *   - `@/lib/types`: Defines `UserProfileData` and `UserProfileFetchResponse` interfaces.
 *   - `app/hooks/useLocalStorage.ts`: Provides the caching mechanism for the client-side profile data.
 *   - `auth.ts`: Used for user authentication to determine the `userId` for profile retrieval (though currently bypassed for testing).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `UserProfile` model exists in the Neon database and is populated.
 *   - Assumes `userId` is available for fetching the correct profile (hardcoded for now due to authentication removal).
 *   - Caching strategy uses `localStorage` with a defined TTL.
 *
 * NOTES:
 *   - This service completely replaces the Notion and external Python service dependencies for profile data.
 *   - The `profileText` field in the `UserProfile` model contains the previously unstructured text dump.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Server-Side Caching**: Consider a more robust server-side caching solution (e.g., Redis) for edge environments.
 *   - **Real-time Updates**: Implement mechanisms for real-time profile updates (e.g., WebSockets) if profile data changes frequently.
 *   - **Granular Local Storage**: Allow more granular control over what parts of the profile are cached locally vs. always fetched.
 *   - **Error Recovery**: More sophisticated error recovery for database connection issues.
 */
import logger from '@/lib/logger';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import { prisma } from '@/lib/prisma';

const LOCAL_STORAGE_KEY = 'orionUserProfile';
const PROFILE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour for local storage cache

/**
 * Defines the structure for the fetched user profile data.
 * It's designed to hold unstructured text from either Notion, local files, or an external service.
 */
export interface ProfileServiceRawData {
  /** The full, concatenated unstructured text from the profile source. */
  profileText: string;
  /** Indicates whether the data came from Notion, local files, or an external service. */
  source: 'neon' | 'cache'; // Updated sources
  // Add other fields from UserProfile model as needed
  name: string | null;
  email: string | null;
  mobile: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  substack: string | null;
  slideshare: string | null;
  medium: string | null;
  discord: string | null;
  merisLabsLinkedin: string | null;
  bioPitchLink: string | null;
  youtube: string | null;
  language: string | null;
  location: string | null;
  id?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastFetchedAt: Date | null | undefined;
}

// Helper to get current userId (temporarily hardcoded)
const getCurrentUserId = () => {
  // In a real application, this would come from an authenticated session
  return 'user_tomide_adeoye_123';
};

/**
 * Fetches user profile data from the Neon database or local storage cache.
 */
export async function fetchUserProfile(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'fetchUserProfile',
    timestamp: new Date().toISOString(),
  };
  logger.info('Attempting to fetch user profile data...', logContext);

  const userId = getCurrentUserId();
  if (!userId) {
    logger.warn('[FETCH_USER_PROFILE][NO_USER_ID] No user ID available to fetch profile.', logContext);
    return { success: false, error: 'No user ID available.', source: 'none' };
  }

  // 1. Check local storage cache first (client-side only)
  if (typeof window !== 'undefined') {
    const cachedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData) as ProfileServiceRawData & { timestamp: number };
        if (Date.now() - parsedCache.timestamp < PROFILE_CACHE_TTL_MS) {
          logger.info('Returning cached user profile data.', {
            ...logContext,
            source: 'cache',
          });
          return {
            success: true,
            profile: parsedCache as unknown as UserProfileData,
            profileText: parsedCache.profileText,
            source: 'cache',
          };
        }
      } catch (error) {
        logger.error('Error parsing cached profile data. Refetching.', { ...logContext, error });
        // If cache is corrupted, clear it
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }

  // 2. Fetch from Neon database (server-side)
  try {
    logger.info('Fetching profile from Neon database.', logContext);
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (userProfile) {
      const profileData: ProfileServiceRawData = {
        source: 'neon',
        ...userProfile, // Include all fields from the Prisma model
      };
      // Cache the data with a timestamp (client-side only)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...profileData, timestamp: Date.now() }));
      }
      logger.success('Successfully fetched profile from Neon and cached.', logContext);
      return {
        success: true,
        profile: userProfile as unknown as UserProfileData,
        profileText: userProfile.profileText,
        source: 'neon',
      };
    } else {
      logger.warn('User profile not found in Neon database for ID.', { ...logContext, userId });
      return { success: false, error: 'User profile not found in database.', source: 'none' };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error fetching user profile from Neon database.', {
      ...logContext,
      error: errorMessage,
      fullError: error,
    });
    return { success: false, error: `Failed to fetch profile: ${errorMessage}`, source: 'error' };
  }
}

export async function getProfileText(): Promise<UserProfileFetchResponse> {
  const logContext = {
    operation: 'getProfileText',
    timestamp: new Date().toISOString(),
  };

  try {
    logger.info('Attempting to retrieve profile text.', logContext);
    const profileData = await fetchUserProfile(); // Now returns UserProfileFetchResponse

    if (profileData.success && profileData.profileText) {
      logger.success('Successfully retrieved profile text.', { ...logContext, source: profileData.source });
      return profileData; // Return the full response
    } else {
      logger.warn('No profile text available after fetching from Neon or cache.', {
        ...logContext,
        error: profileData.error,
      });
      return {
        success: false,
        error: profileData.error || 'No profile text available.',
        source: profileData.source || 'none',
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error in getProfileText.', { ...logContext, error: errorMessage });
    return { success: false, error: `Error retrieving profile text: ${errorMessage}`, source: 'error' };
  }
}
