'use client';

import React, { useState } from 'react';
import { useMemory } from '@shared/hooks/useMemory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Tag, Calendar } from 'lucide-react';

type MemorySearchResult = {
  payload: {
    source_id: string;
    type: string;
    text: string;
    timestamp: string;
    tags?: string[];
  };
  score: number;
};

export function MemorySearch() {
  const [query, setQuery] = useState('');
  const { search, results, isLoading, error } = useMemory();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await search(query);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search memories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="space-y-4">
        {results.map((result: MemorySearchResult) => (
          <Card key={result.payload.source_id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-400 flex items-center">
                <Search className="mr-2 h-4 w-4" />
                {result.payload.type}
                <span className="ml-auto text-xs text-gray-400">
                  Score: {result.score.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {result.payload.text}
              </p>

              <div className="mt-2 flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(result.payload.timestamp).toLocaleString()}
              </div>

              {result.payload.tags && result.payload.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <Tag className="h-3 w-3 mr-1 text-gray-400" />
                  {result.payload.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && !isLoading && query && (
          <div className="text-center text-gray-400 py-8">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
