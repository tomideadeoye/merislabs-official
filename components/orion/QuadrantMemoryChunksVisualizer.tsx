import React from "react";

interface MemoryChunk {
  text: string;
  quadrant?: string; // e.g., "Q1", "Q2", "Q3", "Q4" or a descriptive label
  [key: string]: any;
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
  chunks.forEach(chunk => {
    const q = chunk.quadrant || "Uncategorized";
    if (!grouped[q]) grouped[q] = [];
    grouped[q].push(chunk);
  });

  const quadrantOrder = ["Q1", "Q2", "Q3", "Q4", "Uncategorized"];

  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-4">Quadrant Memory Chunks Used</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrantOrder
          .filter(q => grouped[q] && grouped[q].length > 0)
          .map(q => (
            <div key={q} className="bg-gray-100 rounded-lg shadow p-4">
              <h4 className="font-semibold text-blue-700 mb-2">{q}</h4>
              <ul className="space-y-2">
                {grouped[q].map((chunk, idx) => (
                  <li key={idx} className="bg-white border border-gray-200 rounded p-2 text-gray-800">
                    <span className="block">{chunk.text}</span>
                    {chunk.source && (
                      <span className="block text-xs text-gray-500 mt-1">Source: {chunk.source}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        {/* Render any other quadrants not in the default order */}
        {Object.keys(grouped)
          .filter(q => !quadrantOrder.includes(q))
          .map(q => (
            <div key={q} className="bg-gray-100 rounded-lg shadow p-4">
              <h4 className="font-semibold text-blue-700 mb-2">{q}</h4>
              <ul className="space-y-2">
                {grouped[q].map((chunk, idx) => (
                  <li key={idx} className="bg-white border border-gray-200 rounded p-2 text-gray-800">
                    <span className="block">{chunk.text}</span>
                    {chunk.source && (
                      <span className="block text-xs text-gray-500 mt-1">Source: {chunk.source}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};
