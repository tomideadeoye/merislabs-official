"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ScoredMemoryPoint, QdrantFilter, JournalEntryNotionInput } from '@/types/orion';
import { JournalEntryDisplay } from './JournalEntryDisplay';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

interface JournalListProps {
  initialLimit?: number;
}

export const JournalList: React.FC<JournalListProps> = ({ initialLimit = 5 }) => {
  const [entries, setEntries] = useState<JournalEntryNotionInput[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchJournalEntries = useCallback(async (currentOffset: number, limit: number) => {
    setIsLoading(true);
    setError(null);
    setHasMore(false);
    try {
      const response = await fetch('/api/orion/journal/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (data.success) {
        const newEntries: JournalEntryNotionInput[] = data.journalEntries || [];
        newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setEntries(newEntries);

        fetchReflectionsForEntries(newEntries);
      } else {
        throw new Error(data.error || 'Failed to fetch journal entries from Notion.');
      }
    } catch (err: any) {
      console.error("Error fetching journal entries:", err);
      setError(err.message || 'An unexpected error occurred.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReflectionsForEntries = async (entries: JournalEntryNotionInput[]) => {
    try {
      const notionPageIds = entries.map(entry => entry.notionPageId).filter(Boolean);

      if (notionPageIds.length === 0) return;

      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "journal_reflection" } },
              { key: "payload.original_entry_id", match: { any_text: notionPageIds } },
            ]
          },
          limit: 100
        })
      });

      const data = await response.json();

      if (data.success && data.results) {
        const newReflections: Record<string, string> = {};
        data.results.forEach((reflection: ScoredMemoryPoint) => {
          if (reflection.payload.original_entry_id && notionPageIds.includes(reflection.payload.original_entry_id)) {
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
          key={entry.notionPageId}
          entry={entry}
          initialReflection={reflections[entry.notionPageId!]}
        />
      ))}
    </div>
  );
};
