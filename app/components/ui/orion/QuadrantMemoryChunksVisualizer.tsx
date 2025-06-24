/**
 * @fileoverview A simple UI component to visualize memory chunks, optionally grouped by a 'quadrant' or category.
 * @description This component is designed for debugging and understanding how memory is segmented and utilized within the Orion system. It takes an array of `ScoredMemoryPoint` objects and renders them, grouping them by their `quadrant` property if available.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a clear visual representation of memory chunks retrieved from Qdrant.
 *   - To assist in debugging memory retrieval and classification by showing content grouped by categories (quadrants).
 *   - To make the underlying memory structure more intelligible for development and analysis.
 *
 * FILEPATH: `app/components/ui/orion/QuadrantMemoryChunksVisualizer.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/types/memory.ts`: Imports `ScoredMemoryPoint` for strict type definition of the `chunks` prop.
 *   - `app/components/orion/CVTailoringStudio.tsx`: Consumes this component to display memory results when auto-generating a CV. Specifically, the `chunks` prop receives data from the `autoGenerateMemoryResults` state in `CVTailoringStudio.tsx`.
 *   - Components that interact with Qdrant and return `ScoredMemoryPoint` arrays (e.g., `app/api/orion/memory/search/route.ts`).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `ScoredMemoryPoint` objects are provided as input, containing `payload.text` and `payload.source`.
 *   - The `quadrant` property (within `payload`) is used for grouping, defaulting to 'Uncategorized' if absent.
 *   - The `reduce` method is used for grouping to ensure clear type inference and maintain type safety.
 *
 * NOTES:
 *   - This component focuses on clear data presentation rather than complex interaction.
 *   - Useful for quick visual verification of memory search results and their associated metadata.
 *   - The component handles cases where the 'quadrant' property might be missing by defaulting to 'Uncategorized'.
 *   - It ensures `chunk.payload.source` is properly handled for ReactNode compatibility, explicitly casting to `string` if needed.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Interactive Visualization**: Transform this into a dynamic, interactive visualization using a library like D3.js, React Flow, or Konva.js to represent semantic relationships between memory chunks. This could involve clickable nodes, zoom/pan functionality, and filtering directly within the visualization.
 *   - **Timeline View**: Implement a timeline view to show when memories were indexed, their recency, and how they evolve over time. This could help in understanding the temporal distribution of memory.
 *   - **Filtering & Search within Visualizer**: Add local filtering and search capabilities directly within the visualizer to explore the displayed chunks more effectively based on text content, source, or other payload properties.
 *   - **Contextual Actions**: Allow users to click on a memory chunk to view its full details in a modal, copy its content, or trigger related actions (e.g., performing a new semantic search using that chunk's text as a query, or directly adding it to a journal entry).
 *   - **Performance Optimization**: For very large numbers of chunks (e.g., hundreds or thousands), implement virtualization (e.g., `react-window` or `react-virtualized`) or pagination to ensure smooth rendering performance and prevent UI freezes.
 *   - **Configurable Grouping**: Allow users to dynamically change how memories are grouped (e.g., by type, custom tags, original source, or other user-defined criteria), enhancing the flexibility of analysis.
 *   - **Visual Cues for Score**: Incorporate visual cues (e.g., color intensity, size) based on the `score` property of `ScoredMemoryPoint` to quickly highlight the relevance or confidence of each memory chunk.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - If similar visualization patterns emerge for other data types (e.g., ideas, opportunities, journal entries), consider creating a generic `DataVisualizer` component that can be configured with different data structures and rendering logic to reduce code duplication and maintain consistency.
 *   - This component could potentially be integrated into a broader 'Orion Debugging Dashboard' within the admin section, providing a centralized view for system diagnostics and memory health.
 */
import React from 'react';
import { ScoredMemoryPoint } from '@/lib/types/memory'; // Import ScoredMemoryPoint from its specific file

interface QuadrantMemoryChunksVisualizerProps {
  chunks: ScoredMemoryPoint[]; // Directly use ScoredMemoryPoint array
}

/**
 * Visualizes memory chunks grouped by quadrant.
 * If quadrant info is missing, all are shown in a single group.
 */
export const QuadrantMemoryChunksVisualizer: React.FC<QuadrantMemoryChunksVisualizerProps> = ({ chunks }) => {
  const grouped = new Map<string, ScoredMemoryPoint[]>();

  for (const chunk of chunks) {
    const q = chunk.payload?.quadrant || 'Uncategorized';
    if (!grouped.has(q)) {
      grouped.set(q, []);
    }
    grouped.get(q)!.push(chunk); // Non-null assertion (!) is safe here because we just checked has(q)
  }

  const quadrantOrder = ['Q1', 'Q2', 'Q3', 'Q4', 'Uncategorized'];

  // Convert Map entries to an array for sorting and rendering
  const sortedQuadrants = Array.from(grouped.entries()).sort(([qA], [qB]) => {
    const indexA = quadrantOrder.indexOf(qA);
    const indexB = quadrantOrder.indexOf(qB);

    // Both in quadrantOrder or both not
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA === -1 && indexB === -1) {
      return qA.localeCompare(qB); // Alphabetical for uncategorized
    }
    if (indexA !== -1) {
      return -1; // qA is in order, qB is not, so qA comes first
    }
    return 1; // qB is in order, qA is not, so qB comes first
  });

  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-4">Quadrant Memory Chunks Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedQuadrants.map(([q, chunksInQuadrant]) => (
          <div key={q} className="bg-gray-100 rounded-lg shadow p-4">
            <h4 className="font-semibold text-blue-700 mb-2">{q}</h4>
            <ul className="space-y-2">
              {chunksInQuadrant.map((chunk, idx) => (
                <li key={idx} className="bg-white border border-gray-200 rounded p-2 text-gray-800">
                  <span className="block">{chunk.payload?.text}</span>
                  {chunk.payload?.source && typeof chunk.payload.source === 'string' ? (
                    <span className="block text-xs text-gray-500 mt-1">Source: {String(chunk.payload.source)}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
