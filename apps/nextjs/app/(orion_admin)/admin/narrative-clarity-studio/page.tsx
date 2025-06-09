'use client';
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { addEdge, Background, Controls, MiniMap, Edge, Node, Connection } from "reactflow";
import { generateCircularFlow } from '@shared/utils/generateCircularFlow';
import ReactMarkdown from 'react-markdown';
import { callSequentialThinking } from '@shared/lib/orion_tools';
import { checkAllLlmApiKeys } from '@shared/lib/llm_providers';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ValuePropositionForm } from '@/components/orion/ValuePropositionForm';
import { CareerMilestoneForm } from '@/components/orion/CareerMilestoneForm';
import { CareerMilestoneList } from '@/components/orion/CareerMilestoneList';
import { NarrativeGenerationForm } from '@/components/orion/NarrativeGenerationForm';
import { CareerMilestoneProvider } from '@/components/orion/CareerMilestoneContext';
import type { CareerMilestone } from '@shared/types/narrative-clarity';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

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
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // LLM Health Check State
  const [llmHealth, setLlmHealth] = useState<any[]>([]);
  const [llmHealthLoading, setLlmHealthLoading] = useState(true);
  const [llmHealthError, setLlmHealthError] = useState<string | null>(null);

  const [llmMarkdown, setLlmMarkdown] = useState('');
  const [markdownEdit, setMarkdownEdit] = useState('');
  const [llmError, setLlmError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [improvementPrompt, setImprovementPrompt] = useState('');

  const [sequentialSteps, setSequentialSteps] = useState<string[]>([]);
  const [sequentialRaw, setSequentialRaw] = useState<any[]>([]);
  const [sequentialLoading, setSequentialLoading] = useState(false);
  const [sequentialError, setSequentialError] = useState<string | null>(null);
  const [sequentialThoughtNumber, setSequentialThoughtNumber] = useState(1);
  const [sequentialLastThought, setSequentialLastThought] = useState('');

  const [multiLLM, setMultiLLM] = useState(false);
  const [multiLlmOutputs, setMultiLlmOutputs] = useState<any[]>([]);
  const [multiLlmLoading, setMultiLlmLoading] = useState(false);
  const [multiLlmError, setMultiLlmError] = useState<string | null>(null);
  const [llmApiKeys, setLlmApiKeys] = useState<any[]>([]);

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
      } catch (err: any) {
        setLlmHealthError(err.message || 'Unknown error');
      } finally {
        setLlmHealthLoading(false);
      }
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    setLlmApiKeys(checkAllLlmApiKeys());
  }, []);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)), []);

  const parseMarkdownToSteps = (md: string) => {
    return md
      .split(/\n|\r/)
      .map(s => s.replace(/^\d+\.|^- /, '').trim())
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
        setSequentialSteps(prev => [...prev.slice(0, thoughtNumber - 1), result.thought]);
        setSequentialRaw(prev => [...prev.slice(0, thoughtNumber - 1), result]);
      } else {
        setSequentialError('Sequential thinking tool did not return a valid thought.');
      }
    } catch (err: any) {
      setSequentialError(err.message || 'Unknown error');
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
      const healthy = llmApiKeys.filter(k => k.present).map(k => k.modelId);
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
            } catch (err: any) {
              return { modelId, success: false, error: err.message || 'Unknown error' };
            }
          })
        );
        setMultiLlmOutputs(results);
      } catch (err: any) {
        setMultiLlmError(err.message || 'Unknown error');
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
        const { nodes, edges } = generateCircularFlow(data.steps);
        setNodes(nodes);
        setEdges(edges);
      } else {
        setLlmError(data.error || 'Unknown error');
      }
      // Also run sequential thinking (reset sequence)
      setSequentialSteps([]);
      setSequentialRaw([]);
      setSequentialThoughtNumber(1);
      await handleSequentialThinking(description, 1);
    } catch (err: any) {
      setLlmError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownSubmit = () => {
    const steps = parseMarkdownToSteps(markdownEdit);
    setLlmMarkdown(markdownEdit);
    const { nodes, edges } = generateCircularFlow(steps);
    setNodes(nodes);
    setEdges(edges);
  };

  const handleLLMImprove = async () => {
    setLoading(true);
    setLlmError(null);
    setLastPrompt(improvementPrompt);
    try {
      const steps = parseMarkdownToSteps(markdownEdit);
      const res = await fetch('/api/orion/llm/generate-circular-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCycle: steps, improvementPrompt }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.steps)) {
        const md = data.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n');
        setLlmMarkdown(md);
        setMarkdownEdit(md);
        const { nodes, edges } = generateCircularFlow(data.steps);
        setNodes(nodes);
        setEdges(edges);
      } else {
        setLlmError(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setLlmError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Add a button to continue sequential thinking
  const handleSequentialContinue = async () => {
    await handleSequentialThinking(sequentialLastThought, sequentialThoughtNumber + 1);
  };

  // LLM Why handler
  const handleLlmWhy = async (modelId: string, output: string) => {
    setLlmWhyLoading(prev => ({ ...prev, [modelId]: true }));
    try {
      const res = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Explain the reasoning behind this output: ${output}`,
          model: modelId,
        }),
      });
      const data = await res.json();
      setLlmWhy(prev => ({ ...prev, [modelId]: data.content || data.error || 'No explanation.' }));
    } catch (err: any) {
      setLlmWhy(prev => ({ ...prev, [modelId]: err.message || 'Unknown error' }));
    } finally {
      setLlmWhyLoading(prev => ({ ...prev, [modelId]: false }));
    }
  };

  // Sequential Why handler
  const handleSequentialWhy = async (idx: number, step: string) => {
    setSequentialWhyLoading(prev => ({ ...prev, [idx]: true }));
    try {
      const result = await callSequentialThinking({
        thought: `Explain the logic behind this step: ${step}`,
        nextThoughtNeeded: false,
        thoughtNumber: 1,
        totalThoughts: 1,
      });
      setSequentialWhy(prev => ({ ...prev, [idx]: result.thought || 'No explanation.' }));
    } catch (err: any) {
      setSequentialWhy(prev => ({ ...prev, [idx]: err.message || 'Unknown error' }));
    } finally {
      setSequentialWhyLoading(prev => ({ ...prev, [idx]: false }));
    }
  };

  // Fetch career milestones on mount
  useEffect(() => {
    fetchCareerMilestones();
  }, []);

  const fetchCareerMilestones = async () => {
    setIsLoadingMilestones(true);
    setMilestonesError(null);
    try {
      const response = await fetch('/api/orion/narrative/milestones');
      const data = await response.json();
      if (data.success) {
        setMilestones(data.milestones || []);
      } else {
        throw new Error(data.error || 'Failed to fetch career milestones');
      }
    } catch (err: any) {
      console.error('Error fetching career milestones:', err);
      setMilestonesError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingMilestones(false);
    }
  };

  // Handle career milestone form submission
  const handleMilestoneSubmit = async (data: Partial<CareerMilestone>) => {
    try {
      if (editingMilestone?.id) {
        // Update existing milestone
        const response = await fetch(`/api/orion/narrative/milestones?id=${editingMilestone.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
          setMilestones(prev => prev.map(m => m.id === editingMilestone.id ? responseData.milestone : m));
          setEditingMilestone(null);
        } else {
          throw new Error(responseData.error || 'Failed to update career milestone');
        }
      } else {
        // Create new milestone
        const response = await fetch('/api/orion/narrative/milestones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
          setMilestones(prev => [...prev, responseData.milestone]);
          setShowAddMilestoneForm(false);
        } else {
          throw new Error(responseData.error || 'Failed to create career milestone');
        }
      }
    } catch (err: any) {
      console.error('Error saving career milestone:', err);
      throw err;
    }
  };

  // Handle milestone deletion
  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this career milestone?')) return;
    try {
      const response = await fetch(`/api/orion/narrative/milestones?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setMilestones(prev => prev.filter(m => m.id !== id));
        if (editingMilestone?.id === id) {
          setEditingMilestone(null);
        }
      } else {
        throw new Error(data.error || 'Failed to delete career milestone');
      }
    } catch (err: any) {
      console.error('Error deleting career milestone:', err);
      alert(`Error: ${err.message || 'Failed to delete career milestone'}`);
    }
  };

  // Handle milestone reordering
  const handleReorderMilestone = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = milestones.findIndex(m => m.id === id);
    if (currentIndex === -1) return;
    const newMilestones = [...milestones];
    const milestone = newMilestones[currentIndex];
    if (direction === 'up' && currentIndex > 0) {
      const prevMilestone = newMilestones[currentIndex - 1];
      const tempOrder = milestone.order;
      milestone.order = prevMilestone.order;
      prevMilestone.order = tempOrder;
      try {
        await Promise.all([
          fetch(`/api/orion/narrative/milestones?id=${milestone.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: milestone.order })
          }),
          fetch(`/api/orion/narrative/milestones?id=${prevMilestone.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: prevMilestone.order })
          })
        ]);
        newMilestones.sort((a, b) => a.order - b.order);
        setMilestones(newMilestones);
      } catch (err: any) {
        console.error('Error reordering milestones:', err);
        alert(`Error: ${err.message || 'Failed to reorder milestones'}`);
      }
    } else if (direction === 'down' && currentIndex < newMilestones.length - 1) {
      const nextMilestone = newMilestones[currentIndex + 1];
      const tempOrder = milestone.order;
      milestone.order = nextMilestone.order;
      nextMilestone.order = tempOrder;
      try {
        await Promise.all([
          fetch(`/api/orion/narrative/milestones?id=${milestone.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: milestone.order })
          }),
          fetch(`/api/orion/narrative/milestones?id=${nextMilestone.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: nextMilestone.order })
          })
        ]);
        newMilestones.sort((a, b) => a.order - b.order);
        setMilestones(newMilestones);
      } catch (err: any) {
        console.error('Error reordering milestones:', err);
        alert(`Error: ${err.message || 'Failed to reorder milestones'}`);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="flow">
        <TabsList>
          <TabsTrigger value="flow">Narrative Flow</TabsTrigger>
          <TabsTrigger value="value">Value Proposition</TabsTrigger>
          <TabsTrigger value="milestones">Career Milestones</TabsTrigger>
          <TabsTrigger value="generator">Narrative Generator</TabsTrigger>
        </TabsList>
        <TabsContent value="flow">
          {/* LLM Health Check Section */}
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>LLM Health Check</h2>
            {llmHealthLoading && <div>Loading LLM health...</div>}
            {llmHealthError && <div style={{ color: 'red' }}>Error: {llmHealthError}</div>}
            {!llmHealthLoading && !llmHealthError && (
              <ul>
                {llmHealth.map((r, idx) => (
                  <li key={r.model} style={{ color: r.status === 'success' ? 'green' : 'red', marginBottom: 2 }}>
                    <b>{r.model}</b> ({r.provider}): {r.status === 'success' ? 'OK' : `FAIL - ${r.error}`}
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Multi-LLM Toggle */}
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <label style={{ fontWeight: 600, marginRight: 12 }}>
              <input type="checkbox" checked={multiLLM} onChange={e => setMultiLLM(e.target.checked)} /> Ask Multiple LLMs
            </label>
            <span style={{ color: '#888' }}>
              (Run your prompt through all healthy LLMs and compare outputs)
            </span>
          </section>
          {/* Multi-LLM Output Section (vivid, with badges, icons, Why) */}
          {multiLLM && (
            <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
              <h3>Multi-LLM Outputs</h3>
              {multiLlmLoading && <div>Loading outputs from all LLMs...</div>}
              {multiLlmError && <div style={{ color: 'red' }}>Error: {multiLlmError}</div>}
              <div style={{ display: 'flex', gap: 16 }}>
                {multiLlmOutputs.map((out, idx) => (
                  <div
                    key={out.modelId}
                    style={{
                      flex: 1,
                      border: `2px solid ${out.success ? '#4ade80' : '#f87171'}`,
                      borderRadius: 12,
                      padding: 12,
                      background: out.success ? 'linear-gradient(135deg, #e0ffe0 0%, #f0fff0 100%)' : 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)',
                      boxShadow: out.success ? '0 2px 8px #a7f3d0' : '0 2px 8px #fecaca',
                      transition: 'box-shadow 0.2s',
                      position: 'relative',
                    }}
                    title={out.success ? 'LLM output successful' : 'LLM output failed'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#6366f1',
                        color: 'white',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 12,
                        marginRight: 8,
                      }}>{out.modelId}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>({out.provider})</span>
                      {out.success ? <CheckCircle color="#22c55e" style={{ marginLeft: 6 }} /> : <XCircle color="#ef4444" style={{ marginLeft: 6 }} />}
                    </div>
                    {out.success && Array.isArray(out.steps) ? (
                      <ol style={{ marginBottom: 8 }}>
                        {out.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ol>
                    ) : (
                      <div style={{ color: 'red', marginBottom: 8 }}>Error: {out.error || 'Unknown error'}</div>
                    )}
                    {/* Why button and explanation */}
                    {out.success && Array.isArray(out.steps) && (
                      <div>
                        <button
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 12,
                            cursor: 'pointer',
                            marginRight: 6,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'background 0.2s',
                          }}
                          title="Ask for reasoning behind this output"
                          onClick={() => handleLlmWhy(out.modelId, out.steps.join(' '))}
                          disabled={llmWhyLoading[out.modelId]}
                        >
                          <HelpCircle size={14} style={{ marginRight: 4 }} /> Why?
                        </button>
                        {llmWhyLoading[out.modelId] && <span style={{ fontSize: 12, color: '#888' }}>Loading...</span>}
                        {llmWhy[out.modelId] && (
                          <div style={{ marginTop: 6, background: '#f9fafb', borderRadius: 6, padding: 8, fontSize: 13, color: '#334155' }}>
                            <b>Reasoning:</b> {llmWhy[out.modelId]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Consensus/Vote UI (simple version) */}
              {multiLlmOutputs.length > 1 && (
                <div style={{ marginTop: 12 }}>
                  <b>Which output is best?</b>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    {multiLlmOutputs.map((out, idx) => (
                      <button key={out.modelId} style={{ padding: 4, border: '1px solid #888', borderRadius: 4 }} onClick={() => alert(`You selected ${out.modelId}`)}>
                        {out.modelId}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h2>Describe a process to generate a circular flow</h2>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your process (e.g. How to make tea)"
              style={{ width: '100%', marginBottom: 8 }}
            />
            <button onClick={handleLLMGenerate} disabled={loading || !description}>
              {loading ? 'Generating...' : 'Generate Circular Flow'}
            </button>
            {llmError && (
              <div style={{ color: 'red', marginTop: 8 }}>
                <b>Error:</b> {llmError}<br />
                <b>Last Prompt:</b> {lastPrompt}
              </div>
            )}
          </section>
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h3>LLM Output (Markdown)</h3>
            <ReactMarkdown>{llmMarkdown}</ReactMarkdown>
            <textarea
              value={markdownEdit}
              onChange={e => setMarkdownEdit(e.target.value)}
              rows={8}
              style={{ width: '100%', marginTop: 8 }}
            />
            <button onClick={handleMarkdownSubmit} style={{ marginTop: 8 }}>
              Update Flow from Markdown
            </button>
          </section>
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h3>Sequential Thinking Output</h3>
            {sequentialLoading && <div>Loading sequential thinking...</div>}
            {sequentialError && <div style={{ color: 'red' }}>Error: {sequentialError}</div>}
            <ol>
              {sequentialSteps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  {step}
                  <button
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 12,
                      cursor: 'pointer',
                      marginLeft: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                    title="Ask for reasoning behind this step"
                    onClick={() => handleSequentialWhy(idx, step)}
                    disabled={sequentialWhyLoading[idx]}
                  >
                    <HelpCircle size={14} style={{ marginRight: 4 }} /> Why?
                  </button>
                  {sequentialWhyLoading[idx] && <span style={{ fontSize: 12, color: '#888' }}>Loading...</span>}
                  {sequentialWhy[idx] && (
                    <div style={{ marginTop: 4, background: '#f9fafb', borderRadius: 6, padding: 8, fontSize: 13, color: '#334155' }}>
                      <b>Reasoning:</b> {sequentialWhy[idx]}
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <button onClick={handleSequentialContinue} style={{ marginTop: 8 }}>
              Continue Sequential Thinking
            </button>
          </section>
          <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            <h3>Improve with LLM</h3>
            <input
              type="text"
              value={improvementPrompt}
              onChange={e => setImprovementPrompt(e.target.value)}
              placeholder="Suggest an improvement (e.g. Add a review step)"
              style={{ width: '100%', marginBottom: 8 }}
            />
            <button onClick={handleLLMImprove} disabled={loading || !improvementPrompt}>
              {loading ? 'Improving...' : 'Improve Flow with LLM'}
            </button>
          </section>
          <div style={{ height: 300, border: '2px solid #6366f1', borderRadius: 12, marginTop: 16, boxShadow: '0 2px 12px #6366f133' }}>
            <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </TabsContent>
        <TabsContent value="value">
          <ValuePropositionForm />
        </TabsContent>
        <TabsContent value="milestones">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">Your Career Milestones</h2>
            <button
              onClick={() => {
                setShowAddMilestoneForm(!showAddMilestoneForm);
                setEditingMilestone(null);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              {showAddMilestoneForm ? 'Cancel' : 'Add Milestone'}
            </button>
          </div>
          <CareerMilestoneProvider>
            {(showAddMilestoneForm || editingMilestone) && (
              <div className="mb-6">
                <CareerMilestoneForm
                  initialData={editingMilestone || {}}
                  existingMilestonesCount={milestones.length}
                />
              </div>
            )}
            <CareerMilestoneList
              milestones={milestones}
              isLoading={isLoadingMilestones}
              error={milestonesError}
            />
          </CareerMilestoneProvider>
        </TabsContent>
        <TabsContent value="generator">
          <NarrativeGenerationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
