/**
 * GOAL OF FILE|FEATURES|FUNCTIONS: Displays the Journal page, allowing users to view recent journal entries fetched from the Qdrant vector database via `MemoryProvider`. Provides UI for browsing past reflections.
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/journal/page.tsx
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(default)/layout.tsx`: Wraps this page with `MemoryProvider`.
 *   - `MemoryProvider` (`@/components/orion/MemoryProvider`): Provides `useMemoryContext` hook.
 *   - `useMemoryContext` (`@/components/orion/MemoryProvider`): Hook for memory interaction (search).
 *   - `JournalEntryWithMemory` (`@/components/orion/JournalEntryWithMemory`): Component for adding new journal entries.
 *   - `MEMORY_TYPES` (`@/lib/orion_config`): Defines journal entry type for filtering.
 *   - `ScoredMemoryPoint` (`@/lib/types`): Defines structure of search results.
 *   - `@/components/ui`: Provides `Card`, `CardContent`, `Badge` for UI.
 *   - `lucide-react`: Provides icons (`CalendarDays`, `Tag`).
 * ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed `MemoryProvider` is available in the layout. Assumed journal entries are stored with `payload.type` as `MEMORY_TYPES.JOURNAL`. `use client` is necessary for hooks.
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: Could integrate Journal entry creation/editing more tightly.
 *   - OPPORTUNITIES FOR IMPROVEMENT: Add pagination, advanced filtering, full-text search, editing/deletion, mood tracking visualizations.
 *   - OPPORTUNITIES TO CONSOLIDATE: Consolidates viewing journal entries from memory.
 */
'use client';

import React, { useEffect } from 'react';
// import JournalLayout from '@/components/layouts/JournalLayout'; // Removed as its location is uncertain
// import { JournalEntryForm } from '../src/components/orion/JournalEntryForm'; // Removed: Defined but never used
import { JournalEntryWithMemory } from '@/components/orion/JournalEntryWithMemory';
// import { MemoryProvider, useMemoryContext } from '../src/components/orion/MemoryProvider'; // Removed: Defined but never used
import { useMemoryContext } from '@/components/orion/MemoryProvider';
// import { useSessionState } from '../src/hooks/useSessionState'; // Removed: Defined but never used
import { ScoredMemoryPoint } from '@/lib/types';
import { MEMORY_TYPES } from '@/lib/orion_config';
import { Card, CardContent, Badge } from '@/components/ui';
import { CalendarDays, Tag } from 'lucide-react';

export default function JournalPage() {
  const { search, searchResults, loading } = useMemoryContext();

  useEffect(() => {
    // Load journal entries when the page loads
    search('', { filter: { must: [{ key: 'payload.type', match: { value: MEMORY_TYPES.JOURNAL } }] }, limit: 10 }); // Using search with type filter
  }, [search]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Journal</h1>

      <div className="grid grid-cols-1 gap-8">
        <JournalEntryWithMemory />

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          {loading ? (
            <p>Loading entries...</p>
          ) : searchResults.length === 0 ? (
            <p>No journal entries found.</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((entry: ScoredMemoryPoint) => (
                <Card key={entry.payload?.source_id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">{entry.payload?.text}</p>

                    <div className="flex flex-wrap items-center text-xs text-gray-400 gap-4">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {entry.payload?.timestamp ? new Date(entry.payload.timestamp).toLocaleString() : 'N/A'}
                      </span>

                      {entry.payload?.mood && <span>Mood: {entry.payload.mood}</span>}

                      {entry.payload?.tags && entry.payload.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <div className="flex flex-wrap gap-1">
                            {entry.payload.tags
                              .filter((tag: string) => tag !== 'journal' && tag !== 'journal_entry')
                              .map((tag: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
