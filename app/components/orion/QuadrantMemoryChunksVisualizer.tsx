/**
 * @fileoverview A component to visualize memory chunks from Qdrant, used for debugging and transparency of AI processes.
 * @description This component takes an array of `ScoredMemoryPoint` objects and renders them in a user-friendly format, showing the memory content, score, and source. It helps in understanding which pieces of information the AI leveraged during its operations, such as CV generation or communication drafting.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To visually represent `ScoredMemoryPoint` data.
 *   - To provide insights into the AI's memory retrieval and usage.
 *   - To enhance transparency and debuggability of AI-driven features.
 *
 * FILEPATH: `app/components/orion/QuadrantMemoryChunksVisualizer.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/types/memory.ts`: Defines the `ScoredMemoryPoint` interface that this component consumes.
 *   - `app/components/orion/CVTailoringStudio.tsx`: Passes `ScoredMemoryPoint` data (retrieved during auto-CV generation) to this visualizer.
 *   - `app/components/ui/Card.tsx`, `Badge.tsx`: Uses generic UI components for rendering.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `memoryResults` prop is an array of `ScoredMemoryPoint`.
 *   - Memory payloads contain a `text` field for display and optionally `title` or `type` for source.
 *
 * NOTES:
 *   - This visualizer is crucial for debugging and understanding the AI's contextual reasoning.
 *   - Can be extended to support more detailed visualizations or filtering of memory types.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add search/filter capabilities for memory chunks.
 *   - Implement pagination for large sets of memory results.
 *   - Enhance visual representation (e.g., color-coding by type, graph view).
 */

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ScoredMemoryPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Trash2, Loader2 } from 'lucide-react';

interface MemoryAnalytics {
  total: number;
  avg: number;
  min: number;
  max: number;
}

interface QuadrantMemoryChunksVisualizerProps {
  memoryResults: ScoredMemoryPoint[];
}

export function QuadrantMemoryChunksVisualizer({ memoryResults }: QuadrantMemoryChunksVisualizerProps) {
  // Local state for memory results (to allow local deletion)
  const [localResults, setLocalResults] = useState<ScoredMemoryPoint[]>(memoryResults);
  useEffect(() => {
    setLocalResults(memoryResults);
  }, [memoryResults]);

  // Compute analytics
  const computedAnalytics = useMemo(() => {
    if (!localResults.length) return null;
    const scores = localResults.map((m) => m.score);
    const total = localResults.length;
    const avg = scores.reduce((a, b) => a + b, 0) / total;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return { total, avg, min, max };
  }, [localResults]);

  // Expanded state: all expanded by default
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  useEffect(() => {
    // On mount or when memoryResults change, expand all by default
    const allExpanded: { [id: string]: boolean } = {};
    for (const m of memoryResults) allExpanded[m.id] = true;
    setExpanded(allExpanded);
  }, [memoryResults]);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      console.info('[QuadrantMemoryChunksVisualizer] Toggled expansion', { id, expanded: next[id] });
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this memory item? This cannot be undone.')) {
      console.info('[QuadrantMemoryChunksVisualizer] Delete cancelled', { id });
      return;
    }
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
        setLocalResults((prev) => prev.filter((item) => (item.id || item.payload?.source_id) !== id));
        console.info('[QuadrantMemoryChunksVisualizer] Memory deleted', { id });
      } else {
        setDeleteError(data.error || 'Failed to delete memory item.');
        console.error('[QuadrantMemoryChunksVisualizer] Delete error', { id, error: data.error });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setDeleteError(errorMessage);
      console.error('[QuadrantMemoryChunksVisualizer] Delete exception', { id, error: errorMessage });
    } finally {
      setDeletingId(null);
    }
  };

  if (!localResults || localResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {computedAnalytics && (
        <div className="mb-4 text-sm text-gray-400 flex gap-6">
          <span>Total: {computedAnalytics.total}</span>
          <span>Avg Score: {computedAnalytics.avg.toFixed(2)}</span>
          <span>Min Score: {computedAnalytics.min.toFixed(2)}</span>
          <span>Max Score: {computedAnalytics.max.toFixed(2)}</span>
        </div>
      )}
      {deleteError && (
        <div className="mb-2 bg-red-900/30 border border-red-700 text-red-300 px-4 py-2 rounded-md">
          {deleteError}
        </div>
      )}
      {deleteSuccess && (
        <div className="mb-2 bg-green-900/30 border border-green-700 text-green-300 px-4 py-2 rounded-md">
          {deleteSuccess}
        </div>
      )}
      {localResults.map((memory) => {
        const isOpen = !!expanded[memory.id];
        return (
          <Card key={memory.id} className="border border-gray-700 bg-gray-800 shadow-lg transition-all duration-300">
            <CardHeader
              className="pb-2 cursor-pointer flex items-center justify-between group hover:bg-gray-700/40 transition"
              onClick={() => handleToggle(memory.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  className="mr-2 p-1 rounded-full bg-gray-700 hover:bg-blue-700 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={e => { e.stopPropagation(); handleToggle(memory.id); }}
                >
                  <ChevronDown
                    className={`w-5 h-5 text-blue-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  Memory: {memory.payload?.title || memory.payload?.type || `Memory ${memory.id.substring(0, 8)}...`}
                  <Badge variant="outline" className="ml-2 text-blue-300 border-blue-500">
                    Score: {memory.score.toFixed(2)}
                  </Badge>
                </CardTitle>
                <button
                  type="button"
                  aria-label="Delete memory chunk"
                  className="ml-auto p-1 rounded-full bg-red-700 hover:bg-red-800 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={e => { e.stopPropagation(); handleDelete(memory.id); }}
                  disabled={deletingId === memory.id}
                >
                  {deletingId === memory.id ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent
              className={`pt-0 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <p className="text-sm text-gray-300 mb-2">{memory.payload?.text}</p>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <Badge className="bg-gray-600 text-gray-100">Source Type: {memory.payload?.type}</Badge>
                {memory.payload?.tags &&
                  memory.payload.tags.map((tag) => (
                    <Badge key={tag} className="bg-purple-600 text-purple-100">
                      {tag}
                    </Badge>
                  ))}
                {memory.payload?.id && (
                  <Badge className="bg-green-600 text-green-100">
                    Opportunity ID: {memory.payload.id.substring(0, 8)}...
                  </Badge>
                )}
                {memory.payload?.timestamp && (
                  <Badge className="bg-orange-600 text-orange-100">
                    Indexed: {new Date(memory.payload.timestamp).toLocaleDateString()}
                  </Badge>
                )}
                {/* Show all payload fields for full transparency */}
                {Object.entries(memory.payload || {})
                  .filter(([k]) => !['text', 'title', 'type', 'tags', 'id', 'timestamp'].includes(k))
                  .map(([k, v]) => (
                    <Badge key={k} className="bg-gray-700 text-gray-300">
                      {k}: {String(v)}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
