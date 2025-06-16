'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { Button } from '@/ui/components/ui';
import { Loader2, AlertTriangle } from 'lucide-react';
import { JournalEntryNotionInput, ScoredMemoryPoint } from '@/types/orion';
import { JournalEntryDisplay } from 'components/orion/JournalEntryDisplay';

export const JournalList: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntryNotionInput[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJournalEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orion/journal/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error('Error fetching journal entries:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchReflectionsForEntries = async (entries: JournalEntryNotionInput[]) => {
    try {
      const notionPageIds = entries.map((entry) => entry.notionPageId).filter(Boolean);

      if (notionPageIds.length === 0) return;

      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryText: '*',
          filter: {
            must: [
              { key: 'type', match: { value: 'journal_reflection' } },
              { key: 'payload.original_entry_id', match: { any_text: notionPageIds } },
            ],
          },
          limit: 100,
        }),
      });

      const data = await response.json();

      if (data.success && data.results) {
        const newReflections: Record<string, string> = {};
        data.results.forEach((reflection: ScoredMemoryPoint) => {
          const entryId = reflection.payload.original_entry_id;
          if (entryId && notionPageIds.includes(entryId)) {
            newReflections[entryId] = reflection.payload.text;
          }
        });

        setReflections((prev) => ({ ...prev, ...newReflections }));
      }
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error fetching reflections:', errorMessage);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

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
        <Button onClick={() => fetchJournalEntries()} variant="outline" className="mt-4">
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
