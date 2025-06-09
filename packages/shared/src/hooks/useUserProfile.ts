import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { logger } from '../lib/logger';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const CACHE_KEY = 'userProfile';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CacheData {
  profile: UserProfile;
  timestamp: number;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { profile, timestamp }: CacheData = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            logger.info('Using cached user profile');
            setProfile(profile);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data
        logger.info('Fetching fresh user profile');
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setProfile(data);

        // Update cache
        const cacheData: CacheData = {
          profile: data,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        logger.info('User profile fetched and cached successfully');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        logger.error('Failed to fetch user profile', { error });
        setError(error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      logger.info('Updating user profile', { updates });
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updated = await response.json();
      setProfile(updated);

      // Update cache
      const cacheData: CacheData = {
        profile: updated,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      logger.info('User profile updated successfully');
      toast.success('Profile updated');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      logger.error('Failed to update user profile', { error });
      toast.error('Failed to update profile');
      throw error;
    }
  };

  return { profile, loading, error, updateProfile };
}
