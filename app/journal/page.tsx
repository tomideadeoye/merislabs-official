'use client';

import React from 'react';
import { JournalEntryWithMemory } from '@/components/orion/JournalEntryWithMemory';
import { useMemoryContext } from '@/components/orion/MemoryProvider';
import { useEffect } from 'react';
import { MEMORY_TYPES } from '@/lib/orion_config';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageSquare, Tag } from 'lucide-react';

export default function JournalPage() {
  const { findByType, results, isLoading } = useMemoryContext();

  useEffect(() => {
    // Load journal entries when the page loads
    findByType(MEMORY_TYPES.JOURNAL, 10);
  }, [findByType]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Journal</h1>

      <div className="grid grid-cols-1 gap-8">
        <JournalEntryWithMemory />

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          {isLoading ? (
            <p>Loading entries...</p>
          ) : results.length === 0 ? (
            <p>No journal entries found.</p>
          ) : (
            <div className="space-y-4">
              {results.map((entry) => (
                <Card key={entry.payload.source_id} className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">
                      {entry.payload.text}
                    </p>

                    <div className="flex flex-wrap items-center text-xs text-gray-400 gap-4">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(entry.payload.timestamp).toLocaleString()}
                      </span>

                      {entry.payload.mood && (
                        <span>Mood: {entry.payload.mood}</span>
                      )}

                      {entry.payload.tags && entry.payload.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <div className="flex flex-wrap gap-1">
                            {entry.payload.tags
                              .filter(tag => tag !== "journal" && tag !== "journal_entry")
                              .map((tag, i) => (
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
