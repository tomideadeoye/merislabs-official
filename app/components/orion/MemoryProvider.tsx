import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import logger from '@/lib/logger';
import { ScoredMemoryPoint, MemorySearchOptions, UserProfileData } from '@/lib/types';
import { initializeOrionMemory, findRelevantMemories } from '@/lib/memory';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { getProfileText } from '@/lib/profile_service'; // Assuming this exists or will be created

// Define the shape of the Memory Context
interface MemoryContextType {
  search: (query: string, options?: MemorySearchOptions) => Promise<ScoredMemoryPoint[]>;
  searchResults: ScoredMemoryPoint[];
  loading: boolean;
  error: string | null;
  initializeMemory: () => Promise<void>;
  memoryInitialized: boolean;
  userProfileData: UserProfileData | null;
  loadingProfile: boolean;
  profileError: string | null;
}

// Create the context with a default undefined value
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<ScoredMemoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [memoryInitialized, setMemoryInitialized] = useState<boolean>(false);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Initialize memory backend (Qdrant)
  const initializeMemory = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info('[MemoryProvider] Initializing Orion Memory Backend...', {
      operation: 'initialize_memory',
      collection: ORION_MEMORY_COLLECTION_NAME,
    });
    try {
      await initializeOrionMemory();
      setMemoryInitialized(true);
      logger.success('[MemoryProvider] Orion Memory Backend Initialized/Verified.', {
        operation: 'initialize_memory',
        status: 'success',
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to initialize memory: ${errorMessage}`);
      logger.error('[MemoryProvider] Failed to initialize Orion Memory Backend.', {
        operation: 'initialize_memory',
        status: 'fail',
        error: errorMessage,
      });
      setMemoryInitialized(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    setLoadingProfile(true);
    setProfileError(null);
    logger.info('[MemoryProvider] Fetching user profile data...', { operation: 'fetch_user_profile' });
    try {
      const profile = await getProfileText(); // Assuming getProfileText returns UserProfileData or null
      setUserProfileData(profile);
      logger.success('[MemoryProvider] User profile fetched successfully.', {
        operation: 'fetch_user_profile',
        profileExists: !!profile,
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setProfileError(`Failed to load profile: ${errorMessage}`);
      logger.error('[MemoryProvider] Failed to fetch user profile.', {
        operation: 'fetch_user_profile',
        error: errorMessage,
      });
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // Search function
  const search = useCallback(async (query: string, options?: MemorySearchOptions) => {
    setLoading(true);
    setError(null);
    logger.info('[MemoryProvider] Searching Orion Memory.', { operation: 'search_memory', query, options });
    try {
      const hits = await findRelevantMemories(query, options?.limit || 5, options?.filter);
      setSearchResults(hits);
      logger.success('[MemoryProvider] Memory search completed.', {
        operation: 'search_memory',
        query,
        resultsCount: hits.length,
      });
      return hits;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Error during memory search: ${errorMessage}`);
      logger.error('[MemoryProvider] Failed during memory search.', {
        operation: 'search_memory',
        query,
        error: errorMessage,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  React.useEffect(() => {
    if (!memoryInitialized) {
      initializeMemory();
    }
    fetchUserProfile();
  }, [initializeMemory, fetchUserProfile, memoryInitialized]);

  const contextValue = React.useMemo(
    () => ({
      search,
      searchResults,
      loading,
      error,
      initializeMemory,
      memoryInitialized,
      userProfileData,
      loadingProfile,
      profileError,
    }),
    [
      search,
      searchResults,
      loading,
      error,
      initializeMemory,
      memoryInitialized,
      userProfileData,
      loadingProfile,
      profileError,
    ]
  );

  return <MemoryContext.Provider value={contextValue}>{children}</MemoryContext.Provider>;
};

export const useMemoryContext = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemoryContext must be used within a MemoryProvider');
  }
  return context;
};
