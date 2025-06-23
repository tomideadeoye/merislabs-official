/**
 * @fileoverview Provides a centralized context for Orion's memory management functionalities.
 * @description This file defines the `MemoryProvider` component, which uses React Context to expose
 *   functions and state related to memory operations (searching, adding, finding by type/tag) across
 *   the application. It integrates with the Qdrant vector database via `@/lib/memory.ts` and manages
 *   loading states, errors, and the initialization status of the memory backend. It also provides
 *   user profile data to indicate login status.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - **Memory Context**: Establish a global context for accessing memory-related state and functions.
 *   - **Qdrant Integration**: Initialize and interact with the Qdrant vector database for memory storage and retrieval.
 *   - **Search Functionality**: Provide a `search` function to find relevant memories based on a query.
 *   - **Add Memory**: Allow adding new memory points with associated metadata.
 *   - **Categorized Retrieval**: Enable finding memories by specific types or tags.
 *   - **Loading and Error Management**: Manage and expose loading states and errors for memory operations.
 *   - **Login Status Indicator**: Expose a `isLoggedIn` flag derived from user profile data to indicate authentication status.
 *
 * FILEPATH: `app/components/orion/MemoryProvider.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/memory.ts`: Core functions for interacting with the Qdrant API (e.g., `initializeOrionMemory`, `findRelevantMemories`, `addMemory`).
 *   - `app/lib/orion_config.ts`: Defines `ORION_MEMORY_COLLECTION_NAME` and other configuration constants.
 *   - `app/lib/types.ts`: Imports `ScoredMemoryPoint`, `MemorySearchOptions`, and `UserProfileData` for type definitions.
 *   - `app/lib/logger.ts`: Centralized logging utility for tracing memory operations and debugging.
 *   - `app/hooks/useUserProfile.ts`: Custom React hook used to fetch and provide the current user's profile data, essential for determining `isLoggedIn` status.
 *   - `react-hot-toast`: Used for displaying user-friendly notifications related to memory operations and errors.
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: Consumes this `MemoryContext` to provide UI for memory management.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Qdrant service is running and accessible at the configured endpoint.
 *   - Assumes environment variables required for Qdrant connection are correctly set.
 *   - The `useUserProfile` hook provides reliable user authentication status based on the session.
 *   - Error messages are user-friendly and actionable.
 *
 * NOTES:
 *   - **Contextual Logging**: Comprehensive logging is implemented for each memory operation, including start, success, and error states, along with relevant parameters.
 *   - **User Feedback**: Toast notifications provide immediate feedback to the user on the status of memory operations.
 *   - **Login Indicator**: The `isLoggedIn` property in `MemoryContext` allows any consuming component to easily check the user's authentication status, enabling conditional rendering of UI elements or features.
 *   - **Scalability**: The `useCallback` hook is used to memoize functions, preventing unnecessary re-renders of consuming components.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement more granular error handling for specific Qdrant error codes.
 *   - Introduce a mechanism for users to clear individual memory points or entire collections.
 *   - Add pagination or infinite scrolling for large search results.
 *   - Integrate with a more robust authentication system to replace reliance on `useUserProfile` for login status.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import logger from '@/lib/logger';
import { ScoredMemoryPoint, MemorySearchOptions, UserProfileData } from '@/lib/types';
import {
  initializeOrionMemory,
  findRelevantMemories,
  addMemory,
  findMemoriesByType,
  findMemoriesByTag,
} from '@/lib/memory';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import useUserProfile from '@/hooks/useUserProfile';
import toast from 'react-hot-toast';

// Define the shape of the Memory Context
interface MemoryContextType {
  search: (query: string, options?: MemorySearchOptions) => Promise<ScoredMemoryPoint[]>;
  searchResults: ScoredMemoryPoint[];
  loading: boolean;
  error: string | null;
  initializeMemory: () => Promise<void>;
  memoryInitialized: boolean;
  userProfileData: UserProfileData | null | undefined;
  loadingProfile: boolean | undefined;
  profileError: string | Error | null | undefined;
  addMemory: (
    text: string,
    sourceId: string,
    type: string,
    tags?: string[],
    additionalFields?: Record<string, unknown>
  ) => Promise<boolean>;
  findByType: (type: string, limit?: number) => Promise<ScoredMemoryPoint[]>;
  findByTag: (tag: string, limit?: number) => Promise<ScoredMemoryPoint[]>;
  clearResults: () => void;
  clearError: () => void;
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

  // Import and use the existing useUserProfile hook
  const { profile: userProfileData, isLoading: loadingProfile, error: profileError } = useUserProfile();

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
      toast.error(`Qdrant Connection Error: ${errorMessage.replace('Failed to initialize Qdrant memory: ', '')}`);
      setMemoryInitialized(false);
    } finally {
      setLoading(false);
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

  // Add memory function
  const addMemoryItem = useCallback(
    async (
      text: string,
      sourceId: string,
      type: string,
      tags: string[] = [],
      additionalFields: Record<string, unknown> = {}
    ) => {
      setLoading(true);
      setError(null);
      logger.info('[MemoryProvider] Adding memory item.', {
        operation: 'add_memory',
        sourceId,
        type,
        tags,
      });

      try {
        const response = await addMemory(text, sourceId, type, tags, additionalFields);

        if (!response.success) {
          setError(response.error || 'Unknown error adding memory');
          logger.error('[MemoryProvider] Failed to add memory.', {
            operation: 'add_memory',
            error: response.error,
          });
          return false;
        }

        logger.success('[MemoryProvider] Memory added successfully.', {
          operation: 'add_memory',
          sourceId,
        });
        return true;
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Error adding memory: ${errorMessage}`);
        logger.error('[MemoryProvider] Exception during add memory.', {
          operation: 'add_memory',
          error: errorMessage,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Find memories by type
  const findByType = useCallback(async (type: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    logger.info('[MemoryProvider] Finding memories by type.', {
      operation: 'find_by_type',
      type,
      limit,
    });

    try {
      const response = await findMemoriesByType(type, limit);

      if (response.success && response.results) {
        setSearchResults(response.results);
        logger.success('[MemoryProvider] Found memories by type.', {
          operation: 'find_by_type',
          type,
          resultsCount: response.results.length,
        });
        return response.results;
      } else {
        setError(response.error || 'Unknown error finding memories by type');
        logger.error('[MemoryProvider] Failed to find memories by type.', {
          operation: 'find_by_type',
          type,
          error: response.error,
        });
        return [];
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Error finding memories by type: ${errorMessage}`);
      logger.error('[MemoryProvider] Exception during find by type.', {
        operation: 'find_by_type',
        type,
        error: errorMessage,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Find memories by tag
  const findByTag = useCallback(async (tag: string, limit: number = 10) => {
    setLoading(true);
    setError(null);
    logger.info('[MemoryProvider] Finding memories by tag.', { operation: 'find_by_tag', tag, limit });

    try {
      const response = await findMemoriesByTag(tag, limit);

      if (response.success && response.results) {
        setSearchResults(response.results);
        logger.success('[MemoryProvider] Found memories by tag.', {
          operation: 'find_by_tag',
          tag,
          resultsCount: response.results.length,
        });
        return response.results;
      } else {
        setError(response.error || 'Unknown error finding memories by tag');
        logger.error('[MemoryProvider] Failed to find memories by tag.', {
          operation: 'find_by_tag',
          tag,
          error: response.error,
        });
        return [];
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Error finding memories by tag: ${errorMessage}`);
      logger.error('[MemoryProvider] Exception during find by tag.', {
        operation: 'find_by_tag',
        tag,
        error: errorMessage,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    logger.debug('[MemoryProvider] Clearing search results.');
    setSearchResults([]);
  }, []);

  const clearError = useCallback(() => {
    logger.debug('[MemoryProvider] Clearing error state.');
    setError(null);
  }, []);

  // Initialize on mount
  React.useEffect(() => {
    if (!memoryInitialized) {
      initializeMemory();
    }
  }, [initializeMemory, memoryInitialized]);

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
      addMemory: addMemoryItem,
      findByType,
      findByTag,
      clearResults,
      clearError,
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
      addMemoryItem,
      findByType,
      findByTag,
      clearResults,
      clearError,
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
