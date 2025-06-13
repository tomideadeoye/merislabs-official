import { useState, useCallback } from 'react';
import {
  searchMemory,
  addMemory,
  findMemoriesByType,
  findMemoriesByTag,
  ScoredMemoryPoint,
  MemorySearchOptions
} from '../src/lib/memory';

/**
 * Hook for interacting with the memory system
 */
export function useMemory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScoredMemoryPoint[]>([]);

  /**
   * Search memory
   */
  const search = useCallback(async (
    query: string,
    options?: MemorySearchOptions
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchMemory(query, options);

      if (response.success && response.results) {
        setResults(response.results);
        return response.results;
      } else {
        setError(response.error || 'Unknown error');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Error searching memory');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a memory
   */
  const add = useCallback(async (
    text: string,
    sourceId: string,
    type: string,
    tags: string[] = [],
    additionalFields: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await addMemory(text, sourceId, type, tags, additionalFields);

      if (!response.success) {
        setError(response.error || 'Unknown error');
      }

      return response.success;
    } catch (err: any) {
      setError(err.message || 'Error adding memory');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Find memories by type
   */
  const findByType = useCallback(async (type: string, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await findMemoriesByType(type, limit);

      if (response.success && response.results) {
        setResults(response.results);
        return response.results;
      } else {
        setError(response.error || 'Unknown error');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Error finding memories by type');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Find memories by tag
   */
  const findByTag = useCallback(async (tag: string, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await findMemoriesByTag(tag, limit);

      if (response.success && response.results) {
        setResults(response.results);
        return response.results;
      } else {
        setError(response.error || 'Unknown error');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Error finding memories by tag');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    search,
    add,
    findByType,
    findByTag,
    results,
    isLoading,
    error,
    clearResults: () => setResults([]),
    clearError: () => setError(null)
  };
}
