'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMemory } from '@repo/sharedhooks/useMemory';
import { ScoredMemoryPoint, MemorySearchOptions } from '@repo/shared/memory';

interface MemoryContextType {
  search: (query: string, options?: MemorySearchOptions) => Promise<ScoredMemoryPoint[]>;
  add: (text: string, sourceId: string, type: string, tags?: string[], additionalFields?: Record<string, any>) => Promise<boolean>;
  findByType: (type: string, limit?: number) => Promise<ScoredMemoryPoint[]>;
  findByTag: (tag: string, limit?: number) => Promise<ScoredMemoryPoint[]>;
  results: ScoredMemoryPoint[];
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
  clearError: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({ children }: { children: ReactNode }) {
  const memory = useMemory();
  console.info("[MemoryProvider] Initializing MemoryProvider context.");
  return (
    <MemoryContext.Provider value={memory}>
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemoryContext() {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    console.error('[MemoryProvider] useMemoryContext called outside of MemoryProvider!');
    throw new Error('useMemoryContext must be used within a MemoryProvider');
  }
  console.info('[MemoryProvider] useMemoryContext consumed successfully.');
  return context;
}
