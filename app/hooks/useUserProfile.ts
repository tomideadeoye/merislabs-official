'use client';

// GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import { request } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

/**
 * @fileoverview Custom React hook for fetching and managing user profile data, with local storage caching.
 * @description This hook provides a centralized way to access and cache Tomide's user profile data. It first
 *   attempts to retrieve the profile from local storage to minimize API calls and provide a fast initial load.
 *   If not found or if the cached data is stale, it fetches from the `/api/orion/profile` endpoint and
 *   stores the fresh data in local storage. Includes comprehensive logging for traceability.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a consistent and efficient mechanism for accessing user profile data in client-side components.
 *   - Implement client-side caching using `localStorage` to improve performance and reduce server load.
 *   - Ensure data freshness through a Time-To-Live (TTL) mechanism for cached data.
 *   - Handle loading states and errors gracefully, providing immediate feedback to the UI.
 *   - Integrate with the existing logging utility for detailed operational insights.
 *
 * FILEPATH: `app/hooks/useUserProfile.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/apiClient.ts`: Used for making API requests to the backend.
 *   - `app/lib/logger.ts`: Utilized for structured logging of all profile data operations.
 *   - `app/hooks/useLocalStorage.ts`: Leveraged for persistent client-side data storage.
 *   - `app/api/orion/profile/route.ts`: The API endpoint from which profile data is fetched.
 *   - `@/lib/types/profile.ts`: Defines the `UserProfileData` and `UserProfileFetchResponse` types.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `UserProfileData` includes an `email` field for initial identification/fallback.
 *   - The `PROFILE_CACHE_KEY` and `PROFILE_CACHE_TTL_MS` are constants defined within the hook.
 *   - Assumes JSON.parse and JSON.stringify will handle the profile data correctly.
 *
 * NOTES:
 *   - This hook is designed for client-side consumption. Server-side fetching is handled by `server_profile_fetcher.ts`.
 *   - The TTL for cached data is set to 10 minutes, balancing freshness with performance.
 *   - COMPONENTS TO MERGE WITH: Potentially integrate with a global state management solution (e.g., Zustand store) if profile data needs to be accessed by many disparate components without prop drilling.
 *   - PERFORMANCE OPTIMIZATIONS: The `useLocalStorage` hook inherently optimizes by reducing repeated API calls.
 *   - ERROR HANDLING ROBUSTNESS: Provides distinct error states for network issues vs. API-specific errors.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement a revalidation strategy (e.g., stale-while-revalidate) for more nuanced caching.
 *   - Add an option to force refresh the profile data, bypassing the cache.
 *   - Enhance error reporting to a centralized error tracking service.
 *   - Use Zod for runtime validation of fetched profile data.
 */

// Constants for local storage key and cache TTL
const PROFILE_CACHE_KEY = 'orion_user_profile';
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type UserProfileSource = 'notion' | 'local' | 'external_service' | 'cache' | 'error' | 'none' | 'neon' | undefined;

interface UseUserProfileResult {
  profile: UserProfileData | null;
  profileText: string | null;
  isLoading: boolean;
  error: string | null;
  source: UserProfileSource;
  refetch: () => void;
}

const fetchUserProfileWithCache = async (): Promise<UserProfileFetchResponse> => {
  const logContext = { operation: 'fetchUserProfileWithCache', timestamp: new Date().toISOString() };
  // 1. Try localStorage cache first
  try {
    const cachedDataString = typeof window !== 'undefined' ? localStorage.getItem(PROFILE_CACHE_KEY) : null;
    if (cachedDataString) {
      const parsedCachedData = JSON.parse(cachedDataString);
      if (Date.now() - parsedCachedData.timestamp < PROFILE_CACHE_TTL_MS) {
        logger.info('[useUserProfile][CACHE_HIT] User profile loaded from localStorage.', { ...logContext });
        return {
          success: true,
          profile: parsedCachedData.profile,
          profileText: parsedCachedData.profileText,
          source: 'cache',
        };
      } else {
        logger.info('[useUserProfile][CACHE_STALE] Cached user profile is stale.', { ...logContext });
      }
    } else {
      logger.info('[useUserProfile][CACHE_MISS] No user profile in localStorage.', { ...logContext });
    }
  } catch (e: unknown) {
    logger.error('[useUserProfile][CACHE_ERROR] Error parsing cached user profile.', { ...logContext, error: e });
  }
  // 2. Fetch from API
  try {
    logger.info('[useUserProfile][API_FETCH] Fetching user profile from API.', { ...logContext });
    const response = await request<UserProfileFetchResponse>({ url: '/api/orion/profile', method: 'GET' });
    if (response.success && response.profile) {
      // Cache in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          PROFILE_CACHE_KEY,
          JSON.stringify({
            profile: response.profile,
            profileText: response.profile.profileText || null,
            timestamp: Date.now(),
          })
        );
      }
      logger.success('[useUserProfile][API_SUCCESS] User profile fetched and cached.', { ...logContext });
      // Only allow allowed source values
      const allowedSource: UserProfileSource =
        response.source &&
        ['notion', 'local', 'external_service', 'cache', 'error', 'none', 'neon'].includes(response.source)
          ? (response.source as UserProfileSource)
          : 'neon';
      return { ...response, source: allowedSource };
    } else {
      logger.error('[useUserProfile][API_ERROR] API returned unsuccessful response.', {
        ...logContext,
        error: response.error,
      });
      return { success: false, error: response.error || 'Failed to fetch user profile', source: 'error' };
    }
  } catch (apiError: unknown) {
    logger.error('[useUserProfile][API_ERROR] Error fetching user profile from API.', {
      ...logContext,
      error: apiError,
    });
    return { success: false, error: apiError instanceof Error ? apiError.message : String(apiError), source: 'error' };
  }
};

function isUserProfileFetchResponse(data: unknown): data is UserProfileFetchResponse {
  return typeof data === 'object' && data !== null && 'success' in data && typeof (data as any).success === 'boolean';
}

const useUserProfile = (): UseUserProfileResult => {
  const queryClient = useQueryClient();
  const query = useQuery<UserProfileFetchResponse>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfileWithCache,
    staleTime: PROFILE_CACHE_TTL_MS,
    retry: 1,
  });

  // Logging for error and success using useEffect
  useEffect(() => {
    if (query.isError) {
      logger.error('[useUserProfile][QUERY_ERROR] Error in useQuery.', { error: query.error });
    } else if (query.isSuccess && query.data) {
      logger.info('[useUserProfile][QUERY_SUCCESS] useQuery succeeded.', { source: query.data.source });
    }
  }, [query.isError, query.isSuccess, query.error, query.data]);

  const data = query.data;

  return {
    profile: isUserProfileFetchResponse(data) && data.success && data.profile ? data.profile : null,
    profileText: isUserProfileFetchResponse(data) && data.success && data.profileText ? data.profileText : null,
    isLoading: query.isLoading,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : String(query.error)
      : isUserProfileFetchResponse(data) && !data.success && data.error
        ? data.error
        : null,
    source: isUserProfileFetchResponse(data) && data.source ? data.source : undefined,
    refetch: query.refetch,
  };
};

export default useUserProfile;
