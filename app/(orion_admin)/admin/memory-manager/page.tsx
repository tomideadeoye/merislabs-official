"use client";

import React, { useState, useCallback } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames, SessionStateKeys } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { DatabaseZap, Search, Loader2, AlertTriangle, Info, PlusCircle } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ScoredMemoryPoint, QdrantFilter, QdrantFilterCondition } from '@/types/orion';
import { JournalEntryDisplay } from '@/components/orion/JournalEntryDisplay';
import { AddToMemoryForm } from '@/components/orion/DedicatedAddToMemoryFormComponent';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MemoryManagerFeaturePage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ScoredMemoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleSearch = useCallback(async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!searchQuery.trim() && !filterType.trim() && !filterTags.trim()) {
      setError("Please enter a search query, type, or tags to search.");
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    setHasSearched(true);

    try {
      const filterConditions: QdrantFilterCondition[] = [];
      if (filterType.trim()) {
        filterConditions.push({ key: "type", match: { value: filterType.trim() } });
      }
      if (filterTags.trim()) {
        filterTags.split(',').map(tag => tag.trim()).filter(Boolean).forEach(tag => {
          filterConditions.push({ key: "tags", match: { value: tag.toLowerCase() } });
        });
      }

      const filter: QdrantFilter | null = filterConditions.length > 0 ? { must: filterConditions } : null;

      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: searchQuery.trim() || "*",
          collectionName: ORION_MEMORY_COLLECTION_NAME,
          limit: limit,
          filter: filter,
        })
      });

      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results || []);
        if ((data.results || []).length === 0) {
          setError("No results found for your query and filters.");
        }
      } else {
        throw new Error(data.error || 'Failed to search memory.');
      }
    } catch (err: any) {
      console.error("Error searching memory:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterType, filterTags, limit]);

  const handleMemoryAdded = () => {
    // Increment refresh trigger to potentially update UI or show feedback
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteMemory = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await fetch('/api/orion/memory/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      });
      const data = await response.json();
      if (data.success) {
        setDeleteSuccess('Memory item deleted successfully.');
        setSearchResults(prev => prev.filter(item => item.id !== id));
      } else {
        setDeleteError(data.error || 'Failed to delete memory item.');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete memory item.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={PageNames.MEMORY_MANAGER}
        icon={<DatabaseZap className="h-7 w-7" />}
        description="Search, view, and manage Orion&apos;s knowledge base."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />

      {/* Section to Add New Memory Item */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-green-400 flex items-center">
            <PlusCircle className="mr-2 h-6 w-6"/>
            Add New Item to Orion&apos;s Memory
          </CardTitle>
          <CardDescription className="text-gray-400">
            Capture any thought, note, or piece of information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddToMemoryForm onMemoryAdded={handleMemoryAdded} />
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-blue-400 flex items-center">
            <Search className="mr-2 h-6 w-6"/>
            Search Orion&apos;s Memory
          </CardTitle>
          <CardDescription className="text-gray-400">
            Query the knowledge base using semantic search and filters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchQuery" className="text-gray-300">Search Query (Semantic)</Label>
              <Input
                id="searchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filterType" className="text-gray-300">Filter by Type (e.g., journal_entry)</Label>
                <Input
                  id="filterType"
                  type="text"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  placeholder="e.g., journal_entry, general_note"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="filterTags" className="text-gray-300">Filter by Tags (comma-separated)</Label>
                <Input
                  id="filterTags"
                  type="text"
                  value={filterTags}
                  onChange={(e) => setFilterTags(e.target.value)}
                  placeholder="e.g., career, project_x"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="limit" className="text-gray-300">Number of Results</Label>
                <Input
                  id="limit"
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value,10) || 5))}
                  min="1"
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search Memory
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && searchResults.length === 0 && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="ml-2 text-gray-400">Searching memory...</p>
        </div>
      )}

      {error && (
        <div className="my-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md relative flex items-start" role="alert">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Search Error:</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        </div>
      )}

      {!isLoading && !error && searchResults.length === 0 && hasSearched && (
        <div className="my-6 bg-yellow-900/30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-md relative flex items-start" role="alert">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>No results found for your query and filters.</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Search Results ({searchResults.length})</h3>
          <ScrollArea className="h-[calc(100vh-25rem)] md:h-[calc(100vh-20rem)]">
            <div className="space-y-4 pr-3">
              {searchResults.map((result) => {
                const memoryId = result.id || result.payload.source_id;
                return (
                  <div key={memoryId} className="relative group border border-gray-700 rounded-lg bg-gray-900/80 p-4">
                    <JournalEntryDisplay
                      entry={{
                        title: "",
                        date: new Date(result.payload.timestamp),
                        content: result.payload.text,
                        contentType: "Journal",
                        notionPageId: result.payload.source_id,
                        mood: result.payload.mood,
                        tags: result.payload.tags,
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition"
                      disabled={deletingId === memoryId}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this memory item? This cannot be undone.')) {
                          handleDeleteMemory(memoryId);
                        }
                      }}
                    >
                      {deletingId === memoryId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {deleteError && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-md">{deleteError}</div>
          )}
          {deleteSuccess && (
            <div className="mt-4 bg-green-900/30 border border-green-700 text-green-300 px-4 py-2 rounded-md">{deleteSuccess}</div>
          )}
        </div>
      )}
    </div>
  );
}
