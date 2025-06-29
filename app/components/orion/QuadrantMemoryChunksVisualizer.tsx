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

import { ScoredMemoryPoint } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuadrantMemoryChunksVisualizerProps {
  memoryResults: ScoredMemoryPoint[];
}

export function QuadrantMemoryChunksVisualizer({ memoryResults }: QuadrantMemoryChunksVisualizerProps) {
  if (!memoryResults || memoryResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {memoryResults.map((memory) => (
        <Card key={memory.id} className="border border-gray-700 bg-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-100 flex items-center justify-between">
              Memory: {memory.payload?.title || memory.payload?.type || `Memory ${memory.id.substring(0, 8)}...`}
              <Badge variant="outline" className="ml-2 text-blue-300 border-blue-500">
                Score: {memory.score.toFixed(2)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-300 mb-2">{memory.payload?.text}</p>
            <div className="flex flex-wrap gap-2 text-xs">
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
