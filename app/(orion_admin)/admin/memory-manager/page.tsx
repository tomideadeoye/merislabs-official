/**
 * @fileoverview React client component for managing Orion's memory (knowledge base).
 * @description This page serves as the central hub for interacting with Orion's memory system,
 *   allowing users to search, add, and filter memory chunks. It integrates with the Qdrant
 *   vector database via the `MemoryProvider` context and displays real-time status updates
 *   for both memory initialization and user login status.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - **Memory Search**: Provides an interface for semantic search over stored memory points.
 *   - **Memory Filtering**: Enables filtering search results by type and tags for precise retrieval.
 *   - **Add New Memory**: Offers a dedicated component (`DedicatedAddToMemoryFormComponent`) for capturing and adding new information to the knowledge base.
 *   - **Memory Deletion**: Allows users to delete individual memory items.
 *   - **Status Display**: Shows the initialization status of the Qdrant memory backend and the user's current login status.
 *   - **User Feedback**: Provides loading indicators and toast notifications for various operations.
 *
 * FILEPATH: `app/(orion_admin)/admin/memory-manager/page.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/orion/MemoryProvider.tsx`: Consumes the `MemoryContext` for all memory-related state and functions (e.g., `memoryInitialized`, `memoryLoading`, `isLoggedIn`, `handleSearch`).
 *   - `app/components/ui/page-header.tsx`: Renders the page title, description, and dynamic memory/login status indicators, receiving props from this page.
 *   - `app/components/ui/orion/DedicatedAddToMemoryFormComponent.tsx`: Embedded component for adding new memory entries.
 *   - `app/lib/apiClient.ts`: Used implicitly via `useMemoryContext` and direct `fetch` calls for backend API interactions (e.g., `/api/orion/memory/search`, `/api/orion/memory/delete`).
 *   - `app/lib/logger.ts`: Centralized logging utility for comprehensive debugging and tracing of page interactions and data flows.
 *   - `app/lib/constants.ts`: Imports `PageNames` for consistent page titling.
 *   - `app/lib/orion_config.ts`: Accesses `ORION_MEMORY_COLLECTION_NAME` for Qdrant operations.
 *   - `@/components/ui/`: Utilizes various Shadcn UI components (Input, Button, Card, Label, ScrollArea, etc.) for a cohesive UI.
 *   - `lucide-react`: Provides icons (`DatabaseZap`, `Search`, `Loader2`, `AlertTriangle`, `Info`, `PlusCircle`) for visual enhancement.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `MemoryProvider` is correctly configured and provides reliable memory and user profile status.
 *   - Assumes backend API endpoints for memory search, add, and delete operations are accessible and functional.
 *   - User authentication state (`isLoggedIn`) is managed by `MemoryProvider` via `useUserProfile`.
 *   - Environment variables for Qdrant connection are correctly set (managed by the backend and Qdrant Docker container).
 *
 * NOTES:
 *   - **Enhanced User Feedback**: Includes loading states, error displays, and success messages to guide the user.
 *   - **Centralized Status**: The `PageHeader` now acts as a consolidated status display for core application components (login and memory).
 *   - **Modular Design**: Separates concerns by using dedicated components for adding memory and UI elements.
 *   - **Logging**: Extensive `logger.debug` and `logger.info` calls ensure traceability of user interactions and API requests/responses.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Pagination/Infinite Scrolling**: For large search results, implement pagination or infinite scrolling to improve performance and user experience.
 *   - **Advanced Filtering**: Add more complex filtering options (e.g., date range, source, score range) for memory search.
 *   - **Memory Visualization**: Integrate a visual component (like `QuadrantMemoryChunksVisualizer.tsx`) directly on this page to provide an interactive view of memory relationships.
 *   - **Batch Operations**: Allow users to select multiple memory items for bulk deletion or tagging.
 *   - **Error Recovery UI**: Provide more explicit guidance or actions for users when memory initialization fails (e.g., "Check Qdrant status", "Configure .env").
 */
/**
 * INTEGRATION/UX NOTE:
 * As part of this migration, the "Ask Orion" functionality should become a dedicated section within the existing Memory Manager UI, focused solely on asking questions.
 * - The rest of the Memory Manager UI remains dedicated to adding memories and searching for keywords in Qdrant.
 * - If possible, integrate so that users can:
 *     • Search Qdrant for keyword-based results as before,
 *     • AND, at will, ask questions that use selected memories and the LLM response function to answer.
 * - The "Ask" section should be visually and functionally distinct, making it clear that it is for question-asking, while the rest of the UI is for memory management and keyword search.
 * - This ensures users can both retrieve direct keyword matches from Qdrant and leverage LLM-powered answers using selected memory context.
 */
/**
 * MIGRATION PLAN: Ask Orion → Memory Manager
 *
 * Objective:
 *   Migrate all features, UI, and backend logic from the "ask orion" section (/admin/ask-question)
 *   into the "memory manager" section (/admin/memory-manager), so that all question-asking functionality
 *   is available within the memory manager. After migration, delete the original "ask orion" page and all
 *   related code, and remove its entry from the sidebar.
 *
 * Requirements:
 *   - UI/UX Integration:
 *     • Use the existing "ask orion" UI as a starting point, but update and merge it for consistency with the current memory manager UI/UX style.
 *     • All input formats currently supported by "ask orion" (freeform text, file upload, voice, structured forms, etc.) must be supported in the new memory manager interface.
 *     • The data source selection must be a multi-select UI (e.g., checkboxes), allowing users to select one or more sources to query before submitting a question.
 *     • Only the "memory manager" entry should be visible in the sidebar; remove the "ask orion" entry.
 *   - Functionality:
 *     • All features and functions from "ask orion" must be available in the memory manager, including all question-asking capabilities and any related workflows.
 *     • The user must be able to select from multiple data sources before asking a question. Data sources must include:
 *         - Quadrants database
 *         - Neon Postgres database (with full search implemented now)
 *         - Profile context (from Neon)
 *         - CV component table (from Neon)
 *         - Contacts database (from Neon)
 *         - Option to select the entire database
 *     • The memory manager should call the existing "ask orion" APIs for question-asking functionality.
 *     • Implement full backend support for searching the Neon Postgres database (not just the UI).
 *   - Codebase Changes:
 *     • Delete the original "ask orion" page and all related code after migration is complete.
 *     • Remove the "ask orion" entry from the sidebar navigation.
 *     • Ensure all new/updated code is consistent with the memory manager's code style and structure.
 *   - Access Control:
 *     • No authentication should be required for accessing the new combined memory manager and ask functionality.
 *   - Testing & Validation:
 *     • Ensure all migrated features work as expected within the memory manager.
 *     • Verify that all input formats and data source selections function correctly.
 *     • Confirm that the Neon Postgres search is fully implemented and operational.
 *     • Ensure the "ask orion" page and code are fully removed and the sidebar is updated.
 *
 * Summary of What Will Be Modified, Created, or Deleted:
 *   - Modified:
 *       • app/(orion_admin)/admin/memory-manager/ (UI, logic, and API calls updated to include all "ask orion" features and data source selection)
 *       • Sidebar navigation (remove "ask orion" entry)
 *   - Created:
 *       • Multi-select data source UI in memory manager
 *       • Neon Postgres search backend implementation (if not already present)
 *   - Deleted:
 *       • All files and code related to app/(orion_admin)/admin/ask-question/
 *       • "Ask orion" sidebar entry
 */

'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS AND FEATURES:

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/ui';
import { PageNames } from '@/lib/constants';
import { DatabaseZap, Search, Loader2, AlertTriangle, Info, PlusCircle, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import type { QdrantFilter, QdrantFilterCondition, ScoredMemoryPoint } from '@/lib/types/memory';
// import { JournalEntryWithMemory } from '@/components/orion/JournalEntryWithMemory';
import { UnifiedSaveToMemoryComponent } from '@/components/ui/orion/UnifiedSaveToMemoryComponent';

import { ScrollArea } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { useMemoryContext } from '@/components/orion/MemoryProvider';
import logger from '@/lib/logger';
import { REQUEST_TYPES } from '@/lib/orion_llm'; // Import REQUEST_TYPES
import { Checkbox } from '@/components/ui';

export default function MemoryManagerFeaturePage() {
  const { memoryInitialized, loading: memoryLoading, error: memoryError } = useMemoryContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterTags, setFilterTags] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ScoredMemoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [currentLlmModel, setCurrentLlmModel] = useState<string | null>(null);

  // State for Ask Orion section
  const [askQuestion, setAskQuestion] = useState('');
  const [askSources, setAskSources] = useState<string[]>([]);
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  // Data source options
  const dataSourceOptions = useMemo(() => [
    { label: 'Quadrants database', value: 'quadrants' },
    { label: 'Neon Postgres database', value: 'neon' },
    { label: 'Profile context', value: 'profile' },
    { label: 'CV component table', value: 'cv' },
    { label: 'Contacts database', value: 'contacts' },
    { label: 'Entire database', value: 'all' },
  ], []);

  useEffect(() => {
    logger.debug('[MemoryManagerFeaturePage] Memory context status update', {
      memoryInitialized,
      memoryLoading,
      memoryError,
    });

    // Fetch current LLM model when component mounts or relevant dependencies change
    const fetchCurrentLlmModel = async () => {
      try {
        // Use a relevant request type for this page, e.g., ASK_QUESTION or MEMORY_INDEXING
        const response = await fetch(`/api/orion/llm/current-model?requestType=${REQUEST_TYPES.MEMORY_INDEXING}`);
        const data = await response.json();
        if (data.success) {
          setCurrentLlmModel(data.currentLlmModel);
          logger.info('[MemoryManagerFeaturePage] Fetched current LLM model', { model: data.currentLlmModel });
        } else {
          logger.error('[MemoryManagerFeaturePage] Failed to fetch current LLM model', { error: data.error });
          setCurrentLlmModel('N/A');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logger.error('[MemoryManagerFeaturePage] Error fetching current LLM model', { error: errorMessage });
        setCurrentLlmModel('N/A');
      }
    };

    fetchCurrentLlmModel();
  }, [memoryInitialized, memoryLoading, memoryError]);

  const handleSearch = useCallback(
    async (event?: React.FormEvent) => {
      if (event) event.preventDefault();
      if (!searchQuery.trim() && !filterType.trim() && !filterTags.trim()) {
        setError('Please enter a search query, type, or tags to search.');
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
          filterConditions.push({ key: 'type', match: { value: filterType.trim() } });
        }
        if (filterTags.trim()) {
          filterTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .forEach((tag) => {
              filterConditions.push({ key: 'tags', match: { value: tag.toLowerCase() } });
            });
        }

        const filter: QdrantFilter | null = filterConditions.length > 0 ? { must: filterConditions } : null;

        // If we have filters but no search query, use a wildcard query
        const finalQueryText = searchQuery.trim() || (filterConditions.length > 0 ? 'all' : '');

        if (!finalQueryText) {
          setError('Search query cannot be empty if no filters are applied.');
          setIsLoading(false);
          setHasSearched(true);
          return;
        }

        const requestBody = {
          query: finalQueryText,
          collectionName: ORION_MEMORY_COLLECTION_NAME,
          limit: limit,
          filter: filter,
        };

        logger.debug('[MemoryManagerFeaturePage] Sending search request', { requestBody });

        const response = await fetch('/api/orion/memory/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        if (data.success) {
          setSearchResults(data.results || []);
        } else {
          throw new Error(data.error || 'Failed to search memory.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error searching memory:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, filterType, filterTags, limit]
  );

  const handleMemoryAdded = () => {
    // Increment refresh trigger to potentially update UI or show feedback
    handleSearch();
  };

  const handleDeleteMemory = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      const response = await fetch('/api/orion/memory/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      const data = await response.json();
      if (data.success) {
        setDeleteSuccess('Memory item deleted successfully.');
        setSearchResults((prev) => prev.filter((item) => (item.id || item.payload?.source_id) !== id));
      } else {
        setDeleteError(data.error || 'Failed to delete memory item.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setDeleteError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAskSourceChange = (value: string, checked: boolean) => {
    setAskSources((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleAskOrion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAskLoading(true);
    setAskError(null);
    setAskAnswer(null);
    logger.info('[MEMORY_MANAGER][ASK_ORION][SUBMIT]', { question: askQuestion, sources: askSources });
    try {
      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: askQuestion, sources: askSources }),
      });

      let data: any = null;
      let isJson = false;
      try {
        // Try to parse JSON only if response is ok and content-type is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          isJson = true;
        } else {
          // Not JSON, treat as error
          const text = await response.text();
          setAskError('Received non-JSON response from server: ' + text.slice(0, 200));
          logger.error('[MEMORY_MANAGER][ASK_ORION][ERROR][NON_JSON]', { text });
          return;
        }
      } catch (parseErr) {
        setAskError('Failed to parse server response as JSON.');
        logger.error('[MEMORY_MANAGER][ASK_ORION][ERROR][PARSE]', { error: parseErr });
        return;
      }

      if (!isJson || !data || typeof data !== 'object') {
        setAskError('Server returned invalid or empty response.');
        logger.error('[MEMORY_MANAGER][ASK_ORION][ERROR][INVALID]', { data });
        return;
      }

      if (response.ok && data.success && data.answer) {
        setAskAnswer(data.answer);
        logger.success('[MEMORY_MANAGER][ASK_ORION][SUCCESS]', { answer: data.answer });
      } else {
        setAskError(data.error || 'Failed to get answer from Orion.');
        logger.error('[MEMORY_MANAGER][ASK_ORION][ERROR]', { error: data.error, data });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setAskError(errorMessage);
      logger.error('[MEMORY_MANAGER][ASK_ORION][EXCEPTION]', { error: errorMessage });
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={PageNames.MEMORY_MANAGER}
        icon={<DatabaseZap className="h-7 w-7" />}
        description="Search, view, and manage Orion's knowledge base."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
        currentLlmModel={currentLlmModel || undefined}
      />

      {/* Ask Orion Section */}
      <Card className="bg-gray-900 border-purple-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-400 flex items-center">
            <HelpCircle className="mr-2 h-6 w-6" />
            Ask Orion a Question
          </CardTitle>
          <CardDescription className="text-gray-400">
            Get answers from Orion using selected data sources and LLM reasoning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAskOrion} className="space-y-4">
            <div>
              <Label htmlFor="askQuestion" className="text-gray-300">
                Your Question
              </Label>
              <Input
                id="askQuestion"
                name="askQuestion"
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ask Orion anything..."
                className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div>
              <Label className="text-gray-300">Select Data Sources</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {dataSourceOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ask-source-${opt.value}`}
                      checked={askSources.includes(opt.value)}
                      onCheckedChange={(checked: boolean) => handleAskSourceChange(opt.value, checked)}
                      className="scale-110"
                    />
                    <Label htmlFor={`ask-source-${opt.value}`} className="text-sm text-gray-200">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={askLoading || !askQuestion.trim() || askSources.length === 0} className="bg-purple-600 hover:bg-purple-700">
              {askLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4" />}Ask Orion
            </Button>
          </form>
          {askError && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-md">
              {askError}
            </div>
          )}
          {askAnswer && (
            <div className="mt-4 bg-purple-900/30 border border-purple-700 text-purple-200 px-4 py-2 rounded-md">
              <strong>Orion says:</strong>
              <div className="mt-2 whitespace-pre-line">{askAnswer}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section to Add New Memory Item */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-green-400 flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" />
            Add New Item to Orion&apos;s Memory
          </CardTitle>
          <CardDescription className="text-gray-400">
            Capture any thought, note, or piece of information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedSaveToMemoryComponent onMemoryAdded={handleMemoryAdded} />
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-blue-400 flex items-center">
            <Search className="mr-2 h-6 w-6" />
            Search Orion&apos;s Memory
          </CardTitle>
          <CardDescription className="text-gray-400">
            Query the knowledge base using semantic search and filters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchQuery" className="text-gray-300">
                Search Query
              </Label>
              <Input
                id="searchQuery"
                name="searchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filterType" className="text-gray-300">
                  Filter Type
                </Label>
                <Input
                  id="filterType"
                  name="filterType"
                  type="text"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  placeholder="e.g., journal_entry, general_note"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="filterTags" className="text-gray-300">
                  Filter Tags
                </Label>
                <Input
                  id="filterTags"
                  name="filterTags"
                  type="text"
                  value={filterTags}
                  onChange={(e) => setFilterTags(e.target.value)}
                  placeholder="e.g., career, project_x"
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="limit" className="text-gray-300">
                  Limit
                </Label>
                <Input
                  id="limit"
                  name="limit"
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value, 10) || 5))}
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
        <div
          className="my-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md relative flex items-start"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Search Error:</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        </div>
      )}

      {!isLoading && !error && searchResults.length === 0 && hasSearched && (
        <div
          className="my-6 bg-yellow-900/30 border border-yellow-700 text-yellow-300 px-4 py-3 rounded-md relative flex items-start"
          role="alert"
        >
          <Info className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <p>No results found for your query and filters. Try a broader search.</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">Search Results ({searchResults.length})</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-3">
              {searchResults.map((result) => {
                if (!result.payload) {
                  logger.warn('[MEMORY_MANAGER][RENDER] Skipping search result due to missing or invalid payload.', {
                    result,
                  });
                  return null; // Don't render this item if payload is missing
                }

                const memoryId =
                  result.id ||
                  (typeof result.payload.source_id === 'string'
                    ? result.payload.source_id
                    : String(result.payload.source_id ?? ''));

                if (!memoryId) {
                  logger.warn('[MEMORY_MANAGER][RENDER] Skipping search result due to missing ID.', { result });
                  return null; // Don't render if no valid ID
                }
                return (
                  <div key={memoryId} className="relative group border border-gray-700 rounded-lg bg-gray-900/80 p-4">
                    <h3 className="text-lg font-semibold text-gray-100">{result.payload.title || 'No Title'}</h3>
                    <p className="text-sm text-gray-300 mt-1">{String(result.content) || 'No Content'}</p>
                    <p className="text-xs text-gray-400 mt-2">Type: {result.payload.type || 'N/A'}</p>
                    {result.payload.tags && result.payload.tags.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Tags: {result.payload.tags.join(', ')}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Score: {result.score?.toFixed(4)}</p>
                    <p className="text-xs text-gray-500 mt-1">Source ID: {memoryId}</p>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition"
                      disabled={deletingId === memoryId}
                      onClick={() => {
                        if (
                          window.confirm('Are you sure you want to delete this memory item? This cannot be undone.')
                        ) {
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
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-md">
              {deleteError}
            </div>
          )}
          {deleteSuccess && (
            <div className="mt-4 bg-green-900/30 border border-green-700 text-green-300 px-4 py-2 rounded-md">
              {deleteSuccess}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
