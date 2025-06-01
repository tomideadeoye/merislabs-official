"use client";

import { useState, useEffect } from 'react';

export interface OpportunityMemory {
  id: string;
  content: string;
  timestamp: string;
  type: 'note' | 'evaluation' | 'highlight';
}

export function useOpportunityMemory(opportunityId: string) {
  const [memories, setMemories] = useState<OpportunityMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMemory = async (memory: Omit<OpportunityMemory, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      const newMemory: OpportunityMemory = {
        ...memory,
        id: `mem_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      setMemories(prev => [...prev, newMemory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add memory');
    } finally {
      setLoading(false);
    }
  };

  const removeMemory = async (memoryId: string) => {
    try {
      setLoading(true);
      setMemories(prev => prev.filter(m => m.id !== memoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove memory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load memories for the opportunity
    // This would typically fetch from an API
    setMemories([]);
  }, [opportunityId]);

  return {
    memories,
    loading,
    error,
    addMemory,
    removeMemory,
  };
}
