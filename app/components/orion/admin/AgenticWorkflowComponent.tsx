'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';
import { HandledApplicationError, Message, LLMToolCall, LLMTool } from '@/lib/types';
// import { Task } from '@prisma/client';
import { TaskList } from '@/components/orion/tasks/TaskList';
import { TaskForm } from '@/components/orion/tasks/TaskForm';
import { GamificationStats } from '@/components/orion/tasks/GamificationStats';
import { TaskStepTimeline } from '@/components/orion/tasks/TaskStepTimeline';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui';
import { QuadrantMemoryChunksVisualizer } from '@/components/orion/QuadrantMemoryChunksVisualizer';


import type { ScoredMemoryPoint } from '@/lib/types/memory';
import type { TaskStepWithReplies } from '@/components/orion/tasks/TaskStepTimeline';


interface AgentResponse {
  success: boolean;
  answer?: string;
  error?: string;
  details?: string;
  current_messages?: Message[];
  memoryResults?: unknown[];
}

/**
 * NOTE: Unused memory-related state and handlers (memoryQuery, memoryResults, memoryLoading, memoryError, fetchMemoryHighlights, handleMemorySearch, extraContext, setExtraContext) have been removed for clarity and maintainability. Only state and handlers used for task/step management, agent execution, UI, toasts, and logging remain. See memory-manager/page.tsx for memory features.
 */
export const AgenticWorkflowComponent: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [agentMessages, setAgentMessages] = useState<Message[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useState<LLMTool[]>([]);
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);
  const { tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // --- Manual Step Addition State ---
  const [manualStepPrompt, setManualStepPrompt] = useState('');
  const [manualStepOptions, setManualStepOptions] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);
  // --- Save Agent Step State ---
  const [agentStepToSave, setAgentStepToSave] = useState<string | null>(null);
  const [includeMemory, setIncludeMemory] = useState(false);
  const [memoryResults, setMemoryResults] = useState<ScoredMemoryPoint[]>([]);
  const [selectedTaskObj, setSelectedTaskObj] = useState<{ id: string; steps: TaskStepWithReplies[] } | null>(null);

  useEffect(() => {
    // Fetch available tools on mount
    const fetchTools = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; tools: LLMTool[]; error?: string }>(
          '/api/orion/agent/list-tools'
        );
        if (response.data.success) {
          setAvailableTools(response.data.tools);
          // Do NOT auto-select any tools by default
          setSelectedToolNames([]); // Only select when user picks
        } else {
          setError(response.data.error || 'Failed to load tools.');
        }
      } catch {
        setError('Failed to load tools.');
      }
    };
    fetchTools();
  }, []);



  const handleToolSelectionChange = (toolName: string, isChecked: boolean) => {
    setSelectedToolNames(
      isChecked ? [...selectedToolNames, toolName] : selectedToolNames.filter((name) => name !== toolName)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAgentLoading(true);
    setError(null);
    setAgentMessages([]);
    setMemoryResults([]);

    logger.info('[AGENTIC_WORKFLOW][SUBMIT] User submitted query.', { userQuery, selectedToolNames, includeMemory });

    const initialUserMessage: Message = { role: 'user', content: userQuery };
    setAgentMessages([initialUserMessage]);

    try {
      const response = await apiClient.post<AgentResponse>('/api/orion/agent/execute', {
        userQuery,
        selectedTools: selectedToolNames,
        includeMemory,
      });

      if (response.data.success) {
        let messages = response.data.current_messages;
        if (!messages || messages.length === 0) {
          if (response.data.answer) {
            messages = [{ role: 'assistant', content: response.data.answer }];
          } else {
            messages = [];
          }
        }
        setAgentMessages(messages);
        if (response.data.memoryResults && Array.isArray(response.data.memoryResults) && response.data.memoryResults.length > 0) {
          setMemoryResults(response.data.memoryResults as ScoredMemoryPoint[]);
          logger.info('[AGENTIC_WORKFLOW][MEMORY_VISUALIZATION] Displaying memory chunks used by agent.', { count: response.data.memoryResults.length });
        } else {
          setMemoryResults([]);
        }
        logger.success('[AGENTIC_WORKFLOW][SUCCESS] Agent executed successfully.', {
          response: response.data,
        });
      } else {
        const errorMessage = response.data.error || 'Agent execution failed.';
        setError(errorMessage);
        setAgentMessages([
          ...agentMessages,
          {
            role: 'assistant',
            content: `Error: ${errorMessage}${response.data.details ? ` Details: ${response.data.details}` : ''}`,
          },
        ]);
        setMemoryResults([]);
        logger.error('[AGENTIC_WORKFLOW][API_ERROR] Agent API returned an error.', {
          error: errorMessage,
          details: response.data.details,
        });
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof HandledApplicationError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setAgentMessages([...agentMessages, { role: 'assistant', content: `Error: ${errorMessage}` }]);
      setMemoryResults([]);
    } finally {
      setIsAgentLoading(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.tool_calls && message.tool_calls.length > 0) {
      return (
        <div className="space-y-2 mt-2">
          <p className="font-semibold text-purple-300">Agent Tool Call:</p>
          {message.tool_calls.map((toolCall: unknown, idx: number) => (
            <Card key={idx} className="bg-purple-900/30 border-purple-700 text-purple-100 p-3 text-sm">
              <p>
                Function: <strong>{(toolCall as LLMToolCall).function.name}</strong>
              </p>
              <p>
                Arguments: <span>{(toolCall as LLMToolCall).function.arguments}</span>
              </p>
            </Card>
          ))}
        </div>
      );
    } else if (message.role === 'tool' && message.tool_call_id && message.content) {
      return (
        <div className="space-y-2 mt-2">
          <p className="font-semibold text-green-300">Tool Output (ID: {message.tool_call_id}):</p>
          <Card className="bg-green-900/30 border-green-700 text-green-100 p-3 text-sm">
            <pre className="whitespace-pre-wrap">{message.content}</pre>
          </Card>
        </div>
      );
    } else if (message.content) {
      return <pre className="whitespace-pre-wrap">{message.content}</pre>;
    }
    return null;
  };

  // Fetch a single task by ID (with steps)
  const fetchTaskById = async (taskId: string) => {
    try {
      const res = await fetch(`/api/orion/tasks/${taskId}`);
      const data = await res.json();
      if (data.success && data.task) {
        setSelectedTaskObj(data.task);
      }
    } catch {
      // Optionally log error
    }
  };

  // When selectedTaskId changes, fetch the latest task
  useEffect(() => {
    if (selectedTaskId) {
      fetchTaskById(selectedTaskId);
    } else {
      setSelectedTaskObj(null);
    }
  }, [selectedTaskId]);

  // After adding a step, fetch the updated task
  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      toast({ variant: 'destructive', title: 'No Task Selected', description: 'Please select a task first.' });
      return;
    }
    if (!manualStepPrompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt Required', description: 'Step prompt cannot be empty.' });
      return;
    }
    setIsAddingStep(true);
    logger.info('[AGENTIC_WORKFLOW][ADD_STEP][START]', { selectedTaskId, manualStepPrompt, manualStepOptions });
    try {
      const response = await apiClient.post(`/api/orion/tasks/${selectedTaskId}/add-step`, {
        prompt: manualStepPrompt,
        generatedOptions: manualStepOptions ? JSON.parse(manualStepOptions) : [],
      });
      if (response.data.success) {
        toast({ title: 'Step Added', description: 'Step added to task successfully!' });
        setManualStepPrompt('');
        setManualStepOptions('');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        logger.success('[AGENTIC_WORKFLOW][ADD_STEP][SUCCESS]', { selectedTaskId });
        // Fetch updated task
        fetchTaskById(selectedTaskId);
      } else {
        throw new Error(response.data.error || 'Failed to add step.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'Failed to add step.' });
      logger.error('[AGENTIC_WORKFLOW][ADD_STEP][ERROR]', { error });
    } finally {
      setIsAddingStep(false);
    }
  };

  // After saving agent step, fetch the updated task
  const handleSaveAgentStep = async () => {
    if (!selectedTaskId || !agentStepToSave) return;
    setIsAddingStep(true);
    logger.info('[AGENTIC_WORKFLOW][SAVE_AGENT_STEP][START]', { selectedTaskId, agentStepToSave });
    try {
      const response = await apiClient.post(`/api/orion/tasks/${selectedTaskId}/add-step`, {
        prompt: agentStepToSave,
        generatedOptions: [],
      });
      if (response.data.success) {
        toast({ title: 'Agent Step Saved', description: 'Agent-generated step saved to task!' });
        setAgentStepToSave(null);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        logger.success('[AGENTIC_WORKFLOW][SAVE_AGENT_STEP][SUCCESS]', { selectedTaskId });
        // Fetch updated task
        fetchTaskById(selectedTaskId);
      } else {
        throw new Error(response.data.error || 'Failed to save agent step.');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'Failed to save agent step.' });
      logger.error('[AGENTIC_WORKFLOW][SAVE_AGENT_STEP][ERROR]', { error });
    } finally {
      setIsAddingStep(false);
    }
  };

  // --- Detect Agent Step in Messages ---
  useEffect(() => {
    // Find the first agent message with a step suggestion
    const agentStepMsg = agentMessages.find((msg) => msg.role === 'assistant' && msg.content && msg.content.length < 500);
    if (agentStepMsg && agentStepMsg.content) {
      setAgentStepToSave(agentStepMsg.content);
    } else {
      setAgentStepToSave(null);
    }
  }, [agentMessages]);

  // Helper to recursively parse generatedOptions for all steps and their replies
  function parseStepTree(step: unknown): TaskStepWithReplies {
    if (typeof step !== 'object' || step === null) return step as TaskStepWithReplies;
    const s = step as { generatedOptions?: unknown; replies?: unknown[] };
    return {
      ...step,
      generatedOptions:
        Array.isArray(s.generatedOptions)
          ? s.generatedOptions
          : s.generatedOptions
            ? JSON.parse(s.generatedOptions as string)
            : [],
      replies: Array.isArray(s.replies) ? s.replies.map(parseStepTree) : [],
    } as TaskStepWithReplies;
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-purple-400">
        Orion Agentic Workflow
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-300">Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm
                onTaskSavedAction={() => {
                  // Invalidate and refetch tasks
                  queryClient.invalidateQueries({ queryKey: ['tasks'] });
                }}
              />
              <TaskList tasks={tasks} isLoading={tasksLoading} error={tasksError} onTaskSelectAction={setSelectedTaskId} />
            </CardContent>
          </Card>
          <GamificationStats />
        </div>

        <div>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-300">Agent Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userQuery" className="text-gray-300">
                    Your Query:
                  </Label>
                  <Textarea
                    id="userQuery"
                    placeholder="Ask Orion anything..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="bg-gray-900 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Select Tools:</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTools.map((tool) => (
                      <div key={tool.function.name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={tool.function.name}
                          checked={selectedToolNames.includes(tool.function.name)}
                          onChange={(e) => handleToolSelectionChange(tool.function.name, e.target.checked)}
                          className="accent-purple-600"
                        />
                        <label htmlFor={tool.function.name} className="text-sm text-gray-200">
                          {tool.function.name}
                          <span className="text-gray-400 ml-1">({tool.function.description})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Switch id="includeMemory" checked={includeMemory} onCheckedChange={setIncludeMemory} />
                  <Label htmlFor="includeMemory" className="text-gray-300">Include Qdrant Memory in Agent Reasoning</Label>
                </div>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isAgentLoading || !userQuery.trim()}
                >
                  {isAgentLoading ? <Loader /> : 'Execute Agent'}
                </Button>
              </form>

              {error && <p className="text-red-500 mt-4">Error: {error}</p>}

              {agentMessages.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-purple-300">Agent Response:</h3>
                  <div className="space-y-4">
                    {agentMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-900/30' : 'bg-gray-700/50'
                          }`}
                      >
                        <p className="font-semibold capitalize">{message.role}:</p>
                        {renderMessageContent(message)}
                      </div>
                    ))}
                  </div>
                  {/* Memory Chunks Visualization */}
                  {memoryResults.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Memory Chunks Used by Agent</h4>
                      <QuadrantMemoryChunksVisualizer memoryResults={memoryResults} />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedTaskObj && (
            <Card className="bg-gray-800 border-gray-700 mt-8">
              <CardHeader>
                <CardTitle className="text-purple-300">Task Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskStepTimeline
                  steps={Array.isArray(selectedTaskObj.steps) ? selectedTaskObj.steps.map(parseStepTree) : []}
                  id={selectedTaskObj.id}
                />
                {/* Manual Step Addition Form */}
                <form onSubmit={handleAddStep} className="mt-6 space-y-2 bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <Label htmlFor="manualStepPrompt" className="text-gray-300">Add Step Prompt:</Label>
                  <Textarea
                    id="manualStepPrompt"
                    value={manualStepPrompt}
                    onChange={(e) => setManualStepPrompt(e.target.value)}
                    placeholder="Describe the step..."
                    className="bg-gray-800 border-gray-700"
                    disabled={isAddingStep}
                  />
                  <Label htmlFor="manualStepOptions" className="text-gray-300">Generated Options (JSON, optional):</Label>
                  <Textarea
                    id="manualStepOptions"
                    value={manualStepOptions}
                    onChange={(e) => setManualStepOptions(e.target.value)}
                    placeholder='[{"action": "Do X", "justification": "Because..."}]'
                    className="bg-gray-800 border-gray-700"
                    disabled={isAddingStep}
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 mt-2" disabled={isAddingStep || !selectedTaskId}>
                    {isAddingStep ? <Loader /> : 'Add Step'}
                  </Button>
                </form>
                {/* Agent Step Save Button */}
                {agentStepToSave && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button onClick={handleSaveAgentStep} className="bg-green-600 hover:bg-green-700" disabled={isAddingStep}>
                      {isAddingStep ? <Loader /> : 'Save Agent Step to Task'}
                    </Button>
                    <span className="text-gray-400 text-xs">(from agent response)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
