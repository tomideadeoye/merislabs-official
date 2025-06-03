import { generateCircularFlow } from '@/utils/generateCircularFlow';

const pipelineStages = [
  "Identified",
  "Researching",
  "Evaluating",
  "CV Tailoring",
  "Application Drafting",
  "Outreach",
  "Interview",
  "Offer/Decision"
];

export default function NarrativeClarityStudio() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const handleAutoGenerate = () => {
    const { nodes, edges } = generateCircularFlow(pipelineStages);
    setNodes(nodes);
    setEdges(edges);
  };

  return (
    <div style={{ height: 600 }}>
      <div className="mb-4 flex gap-2">
        <button onClick={handleAutoGenerate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Auto-Generate Opportunity Pipeline (Circular)
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
