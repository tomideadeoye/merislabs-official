'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMemory } from '@/hooks/useMemory';
import { ScoredMemoryPoint, MemorySearchOptions } from '@/lib/memory';

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
  
  return (
    <MemoryContext.Provider value={memory}>
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemoryContext() {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error('useMemoryContext must be used within a MemoryProvider');
  }
  return context;
}