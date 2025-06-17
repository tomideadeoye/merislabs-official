'use client';

import apiClient from '@/lib/apiClient';
import { UserProfileData } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import consolidatedLogger from '@/lib/logger';
import toast from 'react-hot-toast';

const CACHE_KEY = 'userProfile';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook to fetch user profile data using TanStack Query.
 * Fetches data from the /api/orion/profile endpoint with client-side caching
 * via local storage for initial load, then manages state with TanStack Query.
 *
 * @returns An object containing the profile data, loading state, and any errors.
 */
export function useUserProfile() {
  // Function to fetch profile from API
  const fetchProfileFromApi = async (): Promise<UserProfileData> => {
    consolidatedLogger.info('Fetching profile from /api/orion/profile', {
      operation: 'useUserProfile',
      timestamp: new Date().toISOString(),
    });
    const response = await apiClient.get<UserProfileData>('/api/orion/profile');
    if (!response.data) {
      throw new Error('Failed to fetch profile data: Response data is empty.');
    }
    consolidatedLogger.info('Profile fetched successfully from API', {
      operation: 'useUserProfile',
      timestamp: new Date().toISOString(),
    });
    return response.data;
  };

  const queryOptions = {
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Attempt to load from local storage first
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (cachedItem) {
        try {
          const { data, timestamp } = JSON.parse(cachedItem);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            consolidatedLogger.info('Loaded profile from localStorage cache', {
              operation: 'useUserProfile',
              timestamp: new Date().toISOString(),
            });
            return data; // Return cached data if valid and within TTL
          }
        } catch (parseError) {
          consolidatedLogger.error('Error parsing cached profile data, fetching fresh.', {
            operation: 'useUserProfile',
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });
          localStorage.removeItem(CACHE_KEY); // Clear invalid cache
        }
      }
      // If no valid cache, fetch from API
      return await fetchProfileFromApi();
    },
    staleTime: CACHE_TTL_MS, // Data considered fresh for 10 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus for stability
    onSuccess: (data: UserProfileData) => {
      // Store data in local storage and show toast only upon successful fetch and update by TanStack Query
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      consolidatedLogger.info('Profile cached in localStorage after successful API fetch', {
        operation: 'useUserProfile:onSuccess',
        timestamp: new Date().toISOString(),
      });
      toast.success('Profile loaded successfully!');
    },
  };

  const { data: profile, isLoading, error, refetch } = useQuery<UserProfileData, Error>(queryOptions);

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    // This function will primarily handle local state updates or trigger API calls for persistence.
    // For a full implementation, you'd likely have a POST/PATCH API endpoint for updating the profile
    // and then use queryClient.invalidateQueries(['userProfile']) or mutate to update the cache.
    consolidatedLogger.info('Updating profile locally via useUserProfile hook', {
      updates,
      operation: 'useUserProfile:updateProfile',
      timestamp: new Date().toISOString(),
    });

    // Optimistically update local storage and the TanStack Query cache
    const currentProfile = profile; // Use the data from useQuery
    if (currentProfile) {
      const newProfile = { ...currentProfile, ...updates };
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newProfile, timestamp: Date.now() }));
      // Manually update the query cache without a refetch, if desired
      // queryClient.setQueryData(['userProfile'], newProfile);
      consolidatedLogger.info('Profile updated locally and cached.', {
        operation: 'useUserProfile:updateProfile',
        timestamp: new Date().toISOString(),
      });
      toast.success('Profile updated locally!');
    }

    // If you had a backend API to persist updates, you would call it here:
    // try {
    //   await apiClient.patch('/api/orion/profile/update', updates);
    //   refetch(); // Refetch to ensure data is in sync with backend
    //   toast.success('Profile saved to backend!');
    // } catch (backendError) {
    //   consolidatedLogger.error('Failed to save profile to backend', { error: backendError });
    //   toast.error('Failed to save profile to backend.');
    // }
  };

  return { profile, loading: isLoading, error, updateProfile, refetch };
}
