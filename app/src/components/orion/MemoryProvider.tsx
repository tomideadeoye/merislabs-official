'use client';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useMemory } from '@/app/hooks/useMemory'; // Corrected import path for useMemory
import { ScoredMemoryPoint, MemorySearchOptions } from '@/types/orion'; // Corrected import path for types
import type { MemoryPayload } from '@/types/orion';

interface MemoryContextType {
  searchResults: ScoredMemoryPoint[];
  loading: boolean;
  error: string | null;
  search: (query: string, options?: MemorySearchOptions) => Promise<ScoredMemoryPoint[] | undefined>;
  add: (payload: MemoryPayload) => Promise<boolean>;
  clear: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

interface MemoryProviderProps {
  children: ReactNode;
}

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const {
    search: searchMemory,
    add: addMemory,
    results: searchResults,
    isLoading: loading,
    error,
    clearResults,
  } = useMemory();

  const search = useCallback(
    async (query: string, options?: MemorySearchOptions) => {
      return searchMemory(query, options);
    },
    [searchMemory]
  );

  const add = useCallback(
    async (payload: MemoryPayload) => {
      const { text, source_id, type, tags, ...additionalFields } = payload;
      return addMemory(text, source_id, type, tags || [], additionalFields);
    },
    [addMemory]
  );

  const clear = useCallback(() => {
    clearResults();
  }, [clearResults]);

  return (
    <MemoryContext.Provider
      value={{
        searchResults,
        loading,
        error,
        search,
        add,
        clear,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemoryContext = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemoryContext must be used within a MemoryProvider');
  }
  return context;
};
