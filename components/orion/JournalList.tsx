"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ScoredMemoryPoint, QdrantFilter } from '@/types/orion';
import { JournalEntryDisplay } from './JournalEntryDisplay';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

interface JournalListProps {
  initialLimit?: number;
}

export const JournalList: React.FC<JournalListProps> = ({ initialLimit = 5 }) => {
  const [entries, setEntries] = useState<ScoredMemoryPoint[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchJournalEntries = useCallback(async (currentOffset: number, limit: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Construct filter for journal entries
      const filter: QdrantFilter = {
        must: [
          {
            key: "type",
            match: { value: "journal_entry" },
          },
        ],
      };

      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          collectionName: ORION_MEMORY_COLLECTION_NAME,
          limit: limit,
          filter: filter,
        })
      });

      const data = await response.json();

      if (data.success) {
        const newEntries: ScoredMemoryPoint[] = data.results || [];
        // Sort by timestamp descending
        newEntries.sort((a, b) => new Date(b.payload.timestamp).getTime() - new Date(a.payload.timestamp).getTime());
        
        setEntries(prev => currentOffset === 0 ? newEntries : [...prev, ...newEntries]);
        setOffset(currentOffset + newEntries.length);
        setHasMore(newEntries.length === limit);
        
        // Fetch reflections for new entries
        fetchReflectionsForEntries(newEntries);
      } else {
        throw new Error(data.error || 'Failed to fetch journal entries.');
      }
    } catch (err: any) {
      console.error("Error fetching journal entries:", err);
      setError(err.message || 'An unexpected error occurred.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReflectionsForEntries = async (entries: ScoredMemoryPoint[]) => {
    try {
      // Get all source_ids
      const sourceIds = entries.map(entry => entry.payload.source_id);
      
      // Fetch all reflections in one batch
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "journal_reflection" } }
            ]
          },
          limit: 100 // Adjust as needed
        })
      });

      const data = await response.json();
      
      if (data.success && data.results) {
        // Create a map of original_entry_id to reflection text
        const newReflections: Record<string, string> = {};
        data.results.forEach((reflection: ScoredMemoryPoint) => {
          if (reflection.payload.original_entry_id && sourceIds.includes(reflection.payload.original_entry_id)) {
            newReflections[reflection.payload.original_entry_id] = reflection.payload.text;
          }
        });
        
        setReflections(prev => ({ ...prev, ...newReflections }));
      }
    } catch (error) {
      console.error("Error fetching reflections:", error);
    }
  };

  useEffect(() => {
    fetchJournalEntries(0, initialLimit);
  }, [fetchJournalEntries, initialLimit]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchJournalEntries(offset, initialLimit);
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <p className="ml-2 text-gray-400">Loading journal entries...</p>
      </div>
    );
  }

  if (error && entries.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-800 p-4 rounded-md border border-red-500/50">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">Error loading entries: {error}</p>
        <Button onClick={() => fetchJournalEntries(0, initialLimit)} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (entries.length === 0 && !isLoading) {
    return <p className="text-center text-gray-500 py-10">No journal entries found yet. Start writing!</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">Past Entries</h2>
      {entries.map((entry) => (
        <JournalEntryDisplay 
          key={entry.id} 
          entry={entry} 
          initialReflection={reflections[entry.payload.source_id]}
        />
      ))}
      {hasMore && (
        <div className="text-center mt-6">
          <Button onClick={handleLoadMore} disabled={isLoading} variant="outline" className="bg-gray-700 hover:bg-gray-600">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More Entries
          </Button>
        </div>
      )}
      {!hasMore && entries.length > 0 && (
        <p className="text-center text-sm text-gray-600 mt-6">No more entries to load.</p>
      )}
      {error && entries.length > 0 && (
        <p className="text-center text-sm text-red-400 mt-4">Error loading more entries: {error}</p>
      )}
    </div>
  );
};