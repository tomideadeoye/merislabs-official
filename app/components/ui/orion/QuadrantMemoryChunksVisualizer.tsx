import React from 'react';

// GOAL OF FILE|FEATURES|FUNCTIONS: A simple UI component to visualize memory chunks, optionally grouped by a 'quadrant' or category. Useful for debugging or understanding how memory is being segmented/used.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/QuadrantMemoryChunksVisualizer.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by components that process or display memory chunks (e.g., potentially in a debug view or analysis result display - implied).
//   - Receives an array of `MemoryChunk` objects as a prop.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed `MemoryChunk` type is defined elsewhere (e.g., `@/lib/types`). Assumed the `quadrant` property, if present, is a string used for grouping.
//
// OPPORTUNITIES FOR IMPROVEMENT:
//   - **Interactive Visualization**: Transform this into a dynamic, interactive visualization using a library like D3.js, React Flow, or Konva.js to represent semantic relationships between memory chunks.
//   - **Timeline View**: Implement a timeline view to show when memories were indexed and how they evolve over time.
//   - **Filtering & Search within Visualizer**: Add local filtering and search capabilities to explore the visualized chunks more effectively.
//   - **Contextual Actions**: Allow users to click on a memory chunk to view its full details or trigger related actions (e.g., semantic search with that chunk as a query).
//   - **Performance Optimization**: For very large numbers of chunks, implement virtualization or pagination to ensure smooth rendering performance.
//   - **Configurable Grouping**: Allow users to dynamically change how memories are grouped (e.g., by type, tags, source, or custom criteria).
//
// OPPORTUNITIES TO CONSOLIDATE:
//   - If similar visualization patterns emerge for other data types (e.g., ideas, opportunities), consider creating a generic `DataVisualizer` component that can be configured for different datasets.
interface MemoryChunk {
  text: string;
  quadrant?: string; // e.g., "Q1", "Q2", "Q3", "Q4" or a descriptive label
  source?: string; // Add source as an optional string property
}

interface QuadrantMemoryChunksVisualizerProps {
  chunks: MemoryChunk[];
}

/**
 * Visualizes memory chunks grouped by quadrant.
 * If quadrant info is missing, all are shown in a single group.
 */
export const QuadrantMemoryChunksVisualizer: React.FC<QuadrantMemoryChunksVisualizerProps> = ({ chunks }) => {
  // Group by quadrant if available
  const grouped: { [quadrant: string]: MemoryChunk[] } = {};
  chunks.forEach((chunk) => {
    const q = chunk.quadrant || 'Uncategorized';
    if (!grouped[q]) grouped[q] = [];
    grouped[q].push(chunk);
  });

  const quadrantOrder = ['Q1', 'Q2', 'Q3', 'Q4', 'Uncategorized'];

  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-4">Quadrant Memory Chunks Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrantOrder
          .filter((q) => grouped[q] && grouped[q].length > 0)
          .map((q) => (
            <div key={q} className="bg-gray-100 rounded-lg shadow p-4">
              <h4 className="font-semibold text-blue-700 mb-2">{q}</h4>
              <ul className="space-y-2">
                {grouped[q].map((chunk, idx) => (
                  <li key={idx} className="bg-white border border-gray-200 rounded p-2 text-gray-800">
                    <span className="block">{chunk.text}</span>
                    {chunk.source && <span className="block text-xs text-gray-500 mt-1">Source: {chunk.source}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        {/* Render any other quadrants not in the default order */}
        {Object.keys(grouped)
          .filter((q) => !quadrantOrder.includes(q))
          .map((q) => (
            <div key={q} className="bg-gray-100 rounded-lg shadow p-4">
              <h4 className="font-semibold text-blue-700 mb-2">{q}</h4>
              <ul className="space-y-2">
                {grouped[q].map((chunk, idx) => (
                  <li key={idx} className="bg-white border border-gray-200 rounded p-2 text-gray-800">
                    <span className="block">{chunk.text}</span>
                    {chunk.source && <span className="block text-xs text-gray-500 mt-1">Source: {chunk.source}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};
