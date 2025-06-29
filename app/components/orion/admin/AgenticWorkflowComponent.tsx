'use client';

import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';
import { HandledApplicationError, Message, LLMToolCall, LLMTool } from '@/lib/types';
import { Task, TaskStep } from '@prisma/client';
import { TaskList } from '@/components/orion/tasks/TaskList';
import { TaskForm } from '@/components/orion/tasks/TaskForm';
import { GamificationStats } from '@/components/orion/tasks/GamificationStats';
import { TaskStepTimeline } from '@/components/orion/tasks/TaskStepTimeline';
import { useTasks } from '@/hooks/useTasks';

// --- Memory Search Types ---
interface MemoryHighlight {
  id: string;
  score: number;
  content: string;
  payload: Record<string, any>;
}

interface AgentResponse {
  success: boolean;
  answer?: string;
  error?: string;
  details?: string;
  current_messages?: Message[];
}

export const AgenticWorkflowComponent: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [agentMessages, setAgentMessages] = useState<Message[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useState<LLMTool[]>([]);
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);

  // --- Context Enrichment State ---
  const [extraContext, setExtraContext] = useState('');
  const { tasks, addTask, updateTask, deleteTask, isLoading: tasksLoading, error: tasksError } = useTasks();
  const queryClient = useQueryClient();

  // --- Memory Search State ---
  const [memoryQuery, setMemoryQuery] = useState('');
  const [memoryResults, setMemoryResults] = useState<MemoryHighlight[]>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [memoryError, setMemoryError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available tools on mount
    const fetchTools = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; tools: LLMTool[]; error?: string }>(
          '/api/orion/agent/list-tools'
        );
        if (response.data.success) {
          setAvailableTools(response.data.tools);
          setSelectedToolNames(response.data.tools.map((tool) => tool.function.name)); // Default: all selected
        } else {
          setError(response.data.error || 'Failed to load tools.');
        }
      } catch (err) {
        setError('Failed to load tools.');
      }
    };
    fetchTools();
  }, []);

  const selectedTask = tasks.find((t: Task) => t.id === selectedTaskId);

  // --- Memory Search Effect: Auto-query on task selection ---
  useEffect(() => {
    if (selectedTask) {
      const defaultQuery = selectedTask.title || selectedTask.description || '';
      setMemoryQuery(defaultQuery);
      if (defaultQuery) {
        fetchMemoryHighlights(defaultQuery);
      }
    } else {
      setMemoryResults([]);
      setMemoryQuery('');
      setMemoryError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTaskId]);

  // --- Memory Search Function ---
  const fetchMemoryHighlights = async (query: string) => {
    setMemoryLoading(true);
    setMemoryError(null);
    try {
      const response = await apiClient.post('/api/orion/memory/search', {
        query,
        limit: 8,
        minScore: 0.6,
      });
      if (response.data.success) {
        setMemoryResults(response.data.results || []);
      } else {
        setMemoryError(response.data.error || 'Memory search failed.');
        setMemoryResults([]);
      }
    } catch (err: any) {
      setMemoryError(err.message || 'Memory search failed.');
      setMemoryResults([]);
    } finally {
      setMemoryLoading(false);
    }
  };

  // --- Memory Search Handler ---
  const handleMemorySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (memoryQuery.trim()) {
      fetchMemoryHighlights(memoryQuery.trim());
    }
  };

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

    logger.info('[AGENTIC_WORKFLOW][SUBMIT] User submitted query.', { userQuery, selectedToolNames, extraContext });

    const initialUserMessage: Message = { role: 'user', content: userQuery };
    setAgentMessages([initialUserMessage]);

    try {
      const response = await apiClient.post<AgentResponse>('/api/orion/agent/execute', {
        userQuery,
        selectedTools: selectedToolNames,
        extraContext,
      });

      if (response.data.success) {
        setAgentMessages(response.data.current_messages || []);
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
                onTaskSaved={() => {
                  // Invalidate and refetch tasks
                  queryClient.invalidateQueries({ queryKey: ['tasks'] });
                }}
              />
              <TaskList tasks={tasks} isLoading={tasksLoading} error={tasksError} onTaskSelect={setSelectedTaskId} />
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
                </div>
              )}
            </CardContent>
          </Card>

          {selectedTask && (
            <Card className="bg-gray-800 border-gray-700 mt-8">
              <CardHeader>
                <CardTitle className="text-purple-300">Task Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskStepTimeline
                  steps={
                    Array.isArray(selectedTask.steps)
                      ? selectedTask.steps.map((step: any) => ({
                        ...step,
                        generatedOptions:
                          Array.isArray(step.generatedOptions)
                            ? step.generatedOptions
                            : step.generatedOptions
                              ? JSON.parse(step.generatedOptions as string)
                              : [],
                        replies: step.replies
                          ? step.replies.map((reply: any) => ({
                            ...reply,
                            generatedOptions:
                              Array.isArray(reply.generatedOptions)
                                ? reply.generatedOptions
                                : reply.generatedOptions
                                  ? JSON.parse(reply.generatedOptions as string)
                                  : [],
                          }))
                          : [],
                      }))
                      : []
                  }
                  id={selectedTask.id}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
