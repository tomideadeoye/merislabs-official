'use client';

// GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.

import { useState, useEffect, useCallback } from 'react';
import { UserProfileData, UserProfileFetchResponse } from '@/lib/types';
import { request } from '@/lib/apiClient'; // Use the enhanced request with retry logic
import logger from '@/lib/logger';
import { useLocalStorage } from './useLocalStorage';

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

interface UseUserProfileResult {
  profile: UserProfileData | null;
  profileText: string | null;
  isLoading: boolean;
  error: string | null;
  source: 'notion' | 'local' | 'external_service' | 'cache' | 'error' | 'none' | 'neon' | null;
  refetch: () => void;
}

const useUserProfile = (): UseUserProfileResult => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileText, setProfileText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<
    'notion' | 'local' | 'external_service' | 'cache' | 'error' | 'none' | 'neon' | null
  >(null);
  const [, setStoredProfileCache] = useLocalStorage<{
    profile: UserProfileData | null;
    profileText: string | null;
    timestamp: number;
  }>(PROFILE_CACHE_KEY, { profile: null, profileText: null, timestamp: 0 });

  const fetchProfile = useCallback(async () => {
    const logContext = { operation: 'fetchUserProfileHook', timestamp: new Date().toISOString() };
    setIsLoading(true);
    setError(null);

    // 1. Attempt to load from local storage (read directly to avoid dependency cycle)
    try {
      const cachedDataString = localStorage.getItem(PROFILE_CACHE_KEY);
      if (cachedDataString) {
        const parsedCachedData = JSON.parse(cachedDataString);
        // Check if the cached data is still valid based on its timestamp
        if (Date.now() - parsedCachedData.timestamp < PROFILE_CACHE_TTL_MS) {
          logger.info('User profile loaded from local storage cache.', { ...logContext, source: 'cache' });
          setProfile(parsedCachedData.profile);
          setProfileText(parsedCachedData.profileText);
          setSource('cache');
          setIsLoading(false);
          return;
        } else {
          logger.warn('Cached user profile is stale, fetching new data.', { ...logContext, source: 'cache_stale' });
        }
      } else {
        logger.info('No user profile found in local storage cache.', { ...logContext, source: 'cache_miss' });
      }
    } catch (e: unknown) {
      const parseError = e instanceof Error ? e.message : String(e);
      logger.error('Error parsing cached user profile from local storage.', {
        ...logContext,
        error: parseError,
        details: e,
        source: 'cache_error',
      });
      // Continue to fetch from API if cache read fails
    }

    // 2. Fetch from API if not in cache or cache is stale/invalid
    try {
      logger.info('Fetching user profile from API endpoint.', { ...logContext, source: 'api_fetch_init' });
      const response = await request<UserProfileFetchResponse>({ url: '/api/orion/profile', method: 'GET' });

      // Log the full response for debugging purposes
      logger.debug('API Response received for user profile:', { ...logContext, apiResponse: response });

      if (response.success && response.profile && response.profile.profileText) {
        setProfile(response.profile);
        setProfileText(response.profile.profileText || null);
        setSource(response.source || null);
        setIsLoading(false);

        // Cache the fresh data
        const dataToCache = {
          profile: response.profile,
          profileText: response.profile.profileText || null,
          timestamp: Date.now(),
        };
        setStoredProfileCache(dataToCache);
        logger.success('Successfully fetched and cached user profile from API.', {
          ...logContext,
          source: response.source,
        });
      } else {
        const errorMessage = response.error || 'Failed to fetch user profile from API.';
        logger.error('API returned an unsuccessful response for user profile.', {
          ...logContext,
          error: errorMessage,
          apiResponse: response,
        });
        setError(errorMessage);
        setSource(response.source || 'error');
        setIsLoading(false);
      }
    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      logger.error('Error fetching user profile from API.', {
        ...logContext,
        error: errorMessage,
        stack: apiError instanceof Error ? apiError.stack : undefined,
        source: 'api_fetch_error',
      });
      setError(`Failed to load profile: ${errorMessage}`);
      setSource('error');
      setIsLoading(false);
    } // Removed storedProfileCache from dependencies to break the cycle
  }, [setStoredProfileCache, setProfile, setProfileText, setSource, setIsLoading, setError]);

  useEffect(() => {
    logger.debug('useUserProfile useEffect triggered, initiating profile fetch.', {
      timestamp: new Date().toISOString(),
    });
    fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    logger.info('Refetching user profile initiated by component.', { timestamp: new Date().toISOString() });
    setIsLoading(true); // Ensure loading state is true on refetch
    fetchProfile();
  }, [fetchProfile]);

  return { profile, profileText, isLoading, error, source, refetch };
};

export default useUserProfile;
