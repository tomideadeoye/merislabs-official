'use client';
import React, { useState, useEffect } from 'react';
import { checkAllLlmApiKeys } from '@/lib/llm_providers';
import { callSequentialThinking } from '@/lib/orion_llm';
import { CareerMilestone } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, PlusCircle, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { CareerMilestoneProvider } from '@/components/orion/narrative-clarity-studio/CareerMilestoneProvider';
import { NarrativeGenerationForm } from '@/components/orion/narrative-clarity-studio/NarrativeGenerationForm';
import { CareerMilestoneList } from '@/components/orion/narrative-clarity-studio/CareerMilestoneList';
import { CareerMilestoneForm } from '@/components/orion/narrative-clarity-studio/CareerMilestoneForm';

interface LLMAPIKeyStatus {
  modelId: string;
  present: boolean;
  reason?: string;
}

// Removed: These were initial values for ReactFlow nodes/edges, which are currently commented out.
// const initialNodes: Node[] = [];
// const initialEdges: Edge[] = [];

// Removed: This variable was assigned a value but never used.
// const pipelineStages = [
//   'Identified',
//   'Researching',
//   'Evaluating',
//   ''CV Tailoring'',
//   'Application Drafting',
//   'Outreach',
//   'Interview',
//   'Offer/Decision',
// ];

export default function NarrativeClarityStudio() {
  // Removed: ReactFlow related state variables as the tab is a placeholder.
  // const [nodes, setNodes] = useState<Node[]>(initialNodes);
  // const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // LLM Health Check State
  const [llmHealth, setLlmHealth] = useState<LLMAPIKeyStatus[]>([]);
  const [llmHealthLoading, setLlmHealthLoading] = useState(true);
  const [llmHealthError, setLlmHealthError] = useState<string | null>(null);

  // Refine these states: they are related to LLM generation features.
  // Leaving them for now as they might be used in other parts of the NarrativeGenerationForm or future features.
  const [llmMarkdown, setLlmMarkdown] = useState('');
  const [markdownEdit, setMarkdownEdit] = useState('');
  const [llmError, setLlmError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [improvementPrompt, setImprovementPrompt] = useState('');

  const [sequentialSteps, setSequentialSteps] = useState<string[]>([]);
  // The 'any' type here needs to be more specific. For now, it's typed as an array of objects potentially containing a 'thought' string.
  const [sequentialRaw, setSequentialRaw] = useState<Array<{ thought: string; [key: string]: unknown }>>([]);
  const [sequentialLoading, setSequentialLoading] = useState(false);
  const [sequentialError, setSequentialError] = useState<string | null>(null);
  const [sequentialThoughtNumber, setSequentialThoughtNumber] = useState(1);
  const [sequentialLastThought, setSequentialLastThought] = useState('');

  const [multiLLM, setMultiLLM] = useState(false);
  const [multiLlmOutputs, setMultiLlmOutputs] = useState<
    Array<{ modelId: string; success: boolean; error?: string; steps?: string[] }>
  >([]);
  const [multiLlmLoading, setMultiLlmLoading] = useState(false);
  const [multiLlmError, setMultiLlmError] = useState<string | null>(null);
  const [llmApiKeys, setLlmApiKeys] = useState<LLMAPIKeyStatus[]>([]);

  const [llmWhy, setLlmWhy] = useState<{ [modelId: string]: string }>({});
  const [llmWhyLoading, setLlmWhyLoading] = useState<{ [modelId: string]: boolean }>({});
  const [sequentialWhy, setSequentialWhy] = useState<{ [idx: number]: string }>({});
  const [sequentialWhyLoading, setSequentialWhyLoading] = useState<{ [idx: number]: boolean }>({});

  // Career Milestones state
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);
  const [isLoadingMilestones, setIsLoadingMilestones] = useState<boolean>(true);
  const [milestonesError, setMilestonesError] = useState<string | null>(null);
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<CareerMilestone | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      setLlmHealthLoading(true);
      setLlmHealthError(null);
      try {
        const res = await fetch('/api/orion/llm/health');
        const data = await res.json();
        if (data.success) {
          setLlmHealth(data.results);
        } else {
          setLlmHealthError('Failed to fetch LLM health');
        }
      } catch (err: unknown) {
        setLlmHealthError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLlmHealthLoading(false);
      }
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    setLlmApiKeys(checkAllLlmApiKeys());
  }, []);

  // Commented out as ReactFlow is currently a placeholder and these functions are unused.
  // const onConnect = useCallback((params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), []);

  const parseMarkdownToSteps = (md: string) => {
    return md
      .split(/\n|\r/)
      .map((s) => s.replace(/^\d+\.|^- /, '').trim())
      .filter(Boolean);
  };

  const handleSequentialThinking = async (input: string, thoughtNumber = 1) => {
    setSequentialLoading(true);
    setSequentialError(null);
    try {
      const result = await callSequentialThinking({
        thought: input,
        nextThoughtNeeded: true,
        thoughtNumber,
        totalThoughts: 5,
      });
      if (result && typeof result === 'object' && 'thought' in result) {
        setSequentialLastThought(result.thought);
        setSequentialThoughtNumber(thoughtNumber);
        setSequentialSteps((prev) => [...prev.slice(0, thoughtNumber - 1), result.thought]);
        setSequentialRaw((prev) => [
          ...prev.slice(0, thoughtNumber - 1),
          result as { thought: string; [key: string]: unknown },
        ]);
      } else {
        setSequentialError('Sequential thinking tool did not return a valid thought.');
      }
    } catch (err: unknown) {
      setSequentialError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSequentialLoading(false);
    }
  };

  const handleLLMGenerate = async () => {
    setLoading(true);
    setLlmError(null);
    setLastPrompt(description);
    setMultiLlmOutputs([]);
    setMultiLlmError(null);
    if (multiLLM) {
      setMultiLlmLoading(true);
      // Get all healthy LLMs
      const healthy = llmApiKeys.filter((k) => k.present).map((k) => k.modelId);
      try {
        const results = await Promise.all(
          healthy.map(async (modelId) => {
            try {
              const res = await fetch('/api/orion/llm/generate-circular-flow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, model: modelId }),
              });
              const data = await res.json();
              return { modelId, ...data };
            } catch (err: unknown) {
              return { modelId, success: false, error: err instanceof Error ? err.message : 'Unknown error' };
            }
          })
        );
        setMultiLlmOutputs(results);
      } catch (err: unknown) {
        setMultiLlmError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setMultiLlmLoading(false);
        setLoading(false);
      }
      return;
    }
    try {
      const res = await fetch('/api/orion/llm/generate-circular-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.steps)) {
        const md = data.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n');
        setLlmMarkdown(md);
        setMarkdownEdit(md);
        // Commented out as ReactFlow is currently a placeholder.
        // const { nodes, edges } = generateCircularFlow(data.steps);
        // setNodes(nodes);
        // setEdges(edges);
      } else {
        setLlmError(data.error || 'Unknown error');
      }
      // Also run sequential thinking (reset sequence)
      setSequentialSteps([]);
      setSequentialRaw([]);
      setSequentialThoughtNumber(1);
      await handleSequentialThinking(description, 1);
    } catch (err: unknown) {
      setLlmError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownSubmit = () => {
    parseMarkdownToSteps(markdownEdit);
    setLlmMarkdown(markdownEdit);
    // Commented out as ReactFlow is currently a placeholder.
    // const { nodes, edges } = generateCircularFlow(steps);
    // setNodes(nodes);
    // setEdges(edges);
  };

  const handleLLMImprove = async () => {
    setLoading(true);
    setLlmError(null);
    try {
      const res = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'NARRATIVE_IMPROVEMENT',
          primaryContext: lastPrompt,
          secondaryContext: markdownEdit,
          improvementPrompt: improvementPrompt,
          temperature: 0.7,
          maxTokens: 1000,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setLlmMarkdown(data.content);
        setMarkdownEdit(data.content);
        parseMarkdownToSteps(data.content);
        // Commented out as ReactFlow is currently a placeholder.
        // const { nodes, edges } = generateCircularFlow(steps);
        // setNodes(nodes);
        // setEdges(edges);
      } else {
        setLlmError(data.error || 'Unknown error');
      }
    } catch (err: unknown) {
      setLlmError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSequentialContinue = async () => {
    setSequentialLoading(true);
    setSequentialError(null);
    try {
      if (!sequentialLastThought) {
        throw new Error('No last thought to continue from.');
      }
      await handleSequentialThinking(sequentialLastThought, sequentialThoughtNumber + 1);
    } catch (err: unknown) {
      setSequentialError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSequentialLoading(false);
    }
  };

  const handleLlmWhy = async (modelId: string, output: string) => {
    setLlmWhyLoading((prev) => ({ ...prev, [modelId]: true }));
    try {
      const res = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'NARRATIVE_EXPLANATION',
          primaryContext: lastPrompt,
          secondaryContext: output,
          temperature: 0.5,
          maxTokens: 500,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setLlmWhy((prev) => ({ ...prev, [modelId]: data.content }));
      } else {
        setLlmWhy((prev) => ({ ...prev, [modelId]: data.error || 'Failed to get explanation.' }));
      }
    } catch (err: unknown) {
      setLlmWhy((prev) => ({ ...prev, [modelId]: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setLlmWhyLoading((prev) => ({ ...prev, [modelId]: false }));
    }
  };

  const handleSequentialWhy = async (idx: number, step: string) => {
    setSequentialWhyLoading((prev) => ({ ...prev, [idx]: true }));
    try {
      const res = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'NARRATIVE_EXPLANATION',
          primaryContext: sequentialSteps.join('\n'), // Context from all sequential thoughts
          secondaryContext: step,
          temperature: 0.5,
          maxTokens: 500,
        }),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setSequentialWhy((prev) => ({ ...prev, [idx]: data.content }));
      } else {
        setSequentialWhy((prev) => ({ ...prev, [idx]: data.error || 'Failed to get explanation.' }));
      }
    } catch (err: unknown) {
      setSequentialWhy((prev) => ({ ...prev, [idx]: err instanceof Error ? err.message : 'Unknown error' }));
    } finally {
      setSequentialWhyLoading((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const fetchCareerMilestones = async () => {
    setIsLoadingMilestones(true);
    setMilestonesError(null);
    try {
      const response = await fetch('/api/orion/career-milestones');
      const data = await response.json();
      if (data.success) {
        const sortedMilestones: CareerMilestone[] = data.milestones.sort(
          (a: CareerMilestone, b: CareerMilestone) => (a.order ?? 0) - (b.order ?? 0)
        );
        setMilestones(sortedMilestones);
        updateGraphWithMilestones(sortedMilestones); // Update graph when milestones change
      } else {
        setMilestonesError(data.error || 'Failed to fetch milestones');
      }
    } catch (err: unknown) {
      setMilestonesError(err instanceof Error ? err.message : 'Error fetching milestones');
      console.error('Error fetching milestones:', err);
    } finally {
      setIsLoadingMilestones(false);
    }
  };

  const handleMilestoneSubmit = async (data: Partial<CareerMilestone>) => {
    setLoading(true);
    setMilestonesError(null);
    try {
      const method = data.unique_id || data.notionPageId ? 'PUT' : 'POST';
      const url =
        data.unique_id || data.notionPageId
          ? `/api/orion/career-milestones/${data.unique_id || data.notionPageId}`
          : '/api/orion/career-milestones';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchCareerMilestones();
        setShowAddMilestoneForm(false);
        setEditingMilestone(null);
      } else {
        throw new Error(result.error || 'Failed to save milestone');
      }
    } catch (err: unknown) {
      setMilestonesError(err instanceof Error ? err.message : 'Error saving milestone');
      console.error('Error saving milestone:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    setLoading(true);
    setMilestonesError(null);
    try {
      const response = await fetch(`/api/orion/career-milestones/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        fetchCareerMilestones();
      } else {
        throw new Error(result.error || 'Failed to delete milestone');
      }
    } catch (err: unknown) {
      setMilestonesError(err instanceof Error ? err.message : 'Error deleting milestone');
      console.error('Error deleting milestone:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorderMilestone = async (id: string, direction: 'up' | 'down') => {
    setLoading(true);
    setMilestonesError(null);
    try {
      const updatedMilestones = milestones.map((m) => ({ ...m })); // Create a deep copy
      const index = updatedMilestones.findIndex((m) => m.notionPageId === id || m.unique_id === id);

      if (index === -1) throw new Error('Milestone not found');

      const currentOrder = updatedMilestones[index].order ?? 0;

      let targetIndex = -1;
      if (direction === 'up' && index > 0) {
        targetIndex = index - 1;
      } else if (direction === 'down' && index < updatedMilestones.length - 1) {
        targetIndex = index + 1;
      }

      if (targetIndex !== -1) {
        // Swap orders
        const targetOrder = updatedMilestones[targetIndex].order ?? 0;
        updatedMilestones[index].order = targetOrder;
        updatedMilestones[targetIndex].order = currentOrder;

        // Sort and update Notion (simplified for example, full reordering might involve more complex logic)
        const reorderedForNotion = updatedMilestones.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const response = await fetch('/api/orion/career-milestones/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            milestones: reorderedForNotion.map((m) => ({ id: m.notionPageId || m.unique_id, order: m.order })),
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          fetchCareerMilestones();
        } else {
          throw new Error(result.error || 'Failed to reorder milestone');
        }
      }
    } catch (err: unknown) {
      setMilestonesError(err instanceof Error ? err.message : 'Error reordering milestone');
      console.error('Error reordering milestone:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGraphWithMilestones = (updatedMilestones: CareerMilestone[]) => {
    updatedMilestones.map((milestone) => ({
      id: (milestone.notionPageId || milestone.unique_id || `temp-id-${Math.random()}`).toString(), // Use notionPageId, unique_id, or a generated temp ID as a string
      data: { label: milestone.title },
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // Placeholder for positioning
      // Add other relevant milestone data here
    }));

    // You might add logic here to create edges based on relationships between milestones if defined

    // Commented out as ReactFlow is currently a placeholder.
    // setNodes((prevNodes) => {
    //   // Merge existing nodes with new nodes, preferring new nodes if IDs conflict
    //   const mergedNodesMap = new Map<string, Node>();
    //   prevNodes.forEach((node) => mergedNodesMap.set(node.id, node));
    //   newNodes.forEach((node) => mergedNodesMap.set(node.id, node));
    //   return Array.from(mergedNodesMap.values()).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    // });
    // setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  return (
    <CareerMilestoneProvider
      submitMilestone={handleMilestoneSubmit}
      deleteMilestone={handleDeleteMilestone}
      reorderMilestone={handleReorderMilestone}
    >
      <div className="space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-100"> Narrative Clarity Studio </h1>

        <Tabs defaultValue="narrative" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="narrative"> Narrative Generation </TabsTrigger>
            <TabsTrigger value="milestones"> Career Milestones </TabsTrigger>
            <TabsTrigger value="pipeline"> Opportunity Pipeline Flow </TabsTrigger>
            <TabsTrigger value="llm-health"> LLM Health Check </TabsTrigger>
          </TabsList>

          <TabsContent value="narrative" className="space-y-6">
            <NarrativeGenerationForm
              description={description}
              setDescription={setDescription}
              handleLLMGenerate={handleLLMGenerate}
              loading={loading}
              llmError={llmError}
            />

            {llmMarkdown && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-2">Generated Narrative Draft</h2>
                <Textarea
                  value={markdownEdit}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMarkdownEdit(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[200px]"
                  placeholder="Generated narrative..."
                />
                <Button onClick={handleMarkdownSubmit} className="mt-2">
                  Apply Changes to Narrative
                </Button>
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="multiLLM"
                    checked={multiLLM}
                    onChange={(e) => setMultiLLM(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor="multiLLM" className="text-gray-300">
                    Generate with multiple LLMs (for comparison)
                  </Label>
                </div>
              </div>
            )}

            {multiLlmLoading && (
              <div className="flex items-center space-x-2 text-gray-400 mt-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating with multiple LLMs...</span>
              </div>
            )}

            {multiLlmError && (
              <div className="flex items-center space-x-2 text-red-500 mt-4">
                <AlertTriangle className="h-5 w-5" />
                <span>Error generating with multiple LLMs: {multiLlmError}</span>
              </div>
            )}

            {multiLlmOutputs.length > 0 && (
              <div className="mt-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-200">Multiple LLM Outputs</h2>
                {multiLlmOutputs.map((output) => (
                  <Card key={output.modelId} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-200">{output.modelId}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {output.success ? (
                        <>
                          <Textarea
                            value={output.steps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || ''}
                            readOnly
                            className="bg-gray-700 border-gray-600 text-gray-200 min-h-[150px]"
                          />
                          <Button
                            onClick={() => handleLlmWhy(output.modelId, output.steps?.join('\n') || '')}
                            disabled={llmWhyLoading[output.modelId]}
                          >
                            {llmWhyLoading[output.modelId] ? 'Getting Explanation...' : 'Why this output?'}
                          </Button>
                          {llmWhy[output.modelId] && (
                            <p className="text-sm text-gray-400 mt-2">{llmWhy[output.modelId]}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-red-400">Error: {output.error || 'Unknown error'}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {sequentialRaw.length > 0 && (
              <div className="mt-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-200">Sequential Thinking Process</h2>
                {sequentialRaw.map((thought, idx) => (
                  <Card key={idx} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-gray-200">Thought {idx + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Textarea
                        value={thought.thought || ''}
                        readOnly
                        className="bg-gray-700 border-gray-600 text-gray-200 min-h-[100px]"
                      />
                      <Button
                        onClick={() => handleSequentialWhy(idx, thought.thought || '')}
                        disabled={sequentialWhyLoading[idx]}
                      >
                        {sequentialWhyLoading[idx] ? 'Getting Explanation...' : 'Why this thought?'}
                      </Button>
                      {sequentialWhy[idx] && <p className="text-sm text-gray-400 mt-2">{sequentialWhy[idx]}</p>}
                    </CardContent>
                  </Card>
                ))}
                {sequentialLoading && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating next thought...</span>
                  </div>
                )}
                {sequentialError && (
                  <p className="text-red-500 text-sm">Error in sequential thinking: {sequentialError}</p>
                )}
                {!sequentialLoading && !sequentialError && sequentialThoughtNumber <= 5 && (
                  <Button onClick={handleSequentialContinue}>Continue Sequential Thinking</Button>
                )}
              </div>
            )}

            {/* ReactFlow graph (placeholder) */}
            <div className="mt-6 h-[500px] w-full border rounded-md hidden">
              <div className="flex items-center justify-center h-full text-gray-500">
                Narrative flow visualization coming soon.
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">Improve Narrative</h2>
              <Textarea
                value={improvementPrompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setImprovementPrompt(e.target.value)}
                placeholder="How can I improve this narrative? e.g., Make it more concise, focus on impact, add more metrics."
                className="bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 min-h-[80px]"
              />
              <Button onClick={handleLLMImprove} disabled={loading} className="mt-2">
                {loading ? 'Improving...' : 'Improve Narrative'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <CareerMilestoneList
              milestones={milestones}
              isLoading={isLoadingMilestones}
              error={milestonesError}
              onEdit={(milestone: CareerMilestone) => {
                setEditingMilestone(milestone);
                setShowAddMilestoneForm(true);
              }}
              onDelete={handleDeleteMilestone}
              onReorder={handleReorderMilestone}
            />
            <Button onClick={() => setShowAddMilestoneForm(true)} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Milestone
            </Button>

            {showAddMilestoneForm && (
              <CareerMilestoneForm
                initialData={editingMilestone || undefined}
                existingMilestonesCount={milestones.length}
                onSubmit={handleMilestoneSubmit}
                onCancel={() => {
                  setShowAddMilestoneForm(false);
                  setEditingMilestone(null);
                }}
              />
            )}
          </TabsContent>

          {/* ReactFlow placeholder content */}
          <TabsContent value="pipeline" className="h-[500px] w-full border rounded-md">
            <div className="flex items-center justify-center h-full text-gray-500">
              Opportunity pipeline visualization coming soon.
            </div>
          </TabsContent>

          <TabsContent value="llm-health" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-200"> LLM API Key Health </h2>
            {llmHealthLoading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking LLM API keys...</span>
              </div>
            )}
            {llmHealthError && (
              <div className="flex items-center space-x-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <span>Error: {llmHealthError}</span>
              </div>
            )}
            {!llmHealthLoading && !llmHealthError && llmHealth.length === 0 && (
              <div className="flex items-center space-x-2 text-yellow-500">
                <Info className="h-5 w-5" />
                <span>No LLM API keys configured or found.</span>
              </div>
            )}
            {!llmHealthLoading && !llmHealthError && llmHealth.length > 0 && (
              <ul className="space-y-2">
                {llmHealth.map((status) => (
                  <li key={status.modelId} className="flex items-center space-x-2">
                    {status.present ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={status.present ? 'text-gray-300' : 'text-red-400'}>
                      {status.modelId}: {status.present ? 'Present' : `Missing (${status.reason || 'Unknown reason'})`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </CareerMilestoneProvider>
  );
}
