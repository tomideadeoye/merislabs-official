"use client";

import apiClient from "@/lib/apiClient";
import { UserProfileData } from "@/types/orion";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";


const CACHE_KEY = "userProfile";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Custom hook to fetch user profile data, with caching in local storage.
 * Fetches data from the /api/orion/profile endpoint.
 *
 * @returns An object containing the profile data, loading state, and any errors.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check local storage for cached data
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (cachedItem) {
        const { data, timestamp } = JSON.parse(cachedItem);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          console.info("Loaded profile from localStorage cache", {
            operation: "useUserProfile",
            timestamp: new Date().toISOString(),
          });
          setProfile(data);
          setLoading(false);
          return;
        }
      }

      console.info("Fetching profile from /api/orion/profile", {
        operation: "useUserProfile",
        timestamp: new Date().toISOString(),
      });
      const response = await apiClient.get<UserProfileData>('/api/orion/profile');
      if (response.data) {
        setProfile(response.data);
        // Cache the new data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: response.data, timestamp: Date.now() })
        );
        console.info("Profile cached in localStorage", {
          operation: "useUserProfile",
          timestamp: new Date().toISOString(),
        });
        toast.success("Profile loaded successfully");
      } else {
        const errorMsg = "Failed to fetch profile data";
        setError(new Error(errorMsg));
        console.error(errorMsg, {
          operation: "useUserProfile",
          timestamp: new Date().toISOString(),
        });
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "An unexpected error occurred";
      setError(new Error(errorMsg));
      console.error("Error fetching profile", {
        operation: "useUserProfile",
        error: errorMsg,
        timestamp: new Date().toISOString(),
      });
      toast.error(`Failed to load profile: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const updateProfile = useCallback(async (updates: Partial<UserProfileData>) => {
    // This is a stub for updating user profile data locally or via an API
    console.info("Updating profile locally", { updates, operation: "useUserProfile", timestamp: new Date().toISOString() });
    setProfile(prevProfile => {
      if (!prevProfile) return null;
      const newProfile = { ...prevProfile, ...updates };
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newProfile, timestamp: Date.now() }));
      return newProfile;
    });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, updateProfile };
}
