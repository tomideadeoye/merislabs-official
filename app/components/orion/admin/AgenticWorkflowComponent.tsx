/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Agentic Workflow
 * @description This component provides a user interface for interacting with Orion's agentic capabilities,
 *   allowing users to submit natural language queries and view the agent's step-by-step execution, tool usage,
 *   and final responses. It integrates with the `/api/orion/agent/execute` endpoint for core agent execution
 *   and `/api/orion/agent/list-tools` to dynamically fetch available tools.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a dynamic and engaging input field for user queries to the AI agent.
 *   - Allow users to select which specific tools the agent should have access to for a given task, enhancing control and transparency.
 *   - Dynamically fetch and display the list of available tools from the backend via `/api/orion/agent/list-tools`.
 *   - Trigger the agent execution process via the `/api/orion/agent/execute` API, sending the user's natural language query and selected tools.
 *   - Display real-time loading states to inform the user about the agent's activity.
 *   - Present intermediate agent messages, including detailed tool calls and their outputs, along with the final answer in a clear, readable format.
 *   - Robustly handle and display any errors that occur during agent execution or API communication,
 *     providing informative feedback to the user and logging comprehensive details.
 *   - Incorporate comprehensive logging for all user interactions, API calls, agent responses, and tool operations
 *     to ensure traceability and aid in debugging.
 * there should be steps, like history/updates on tasks, how far it has gone.
 * THE agent manages the tasks and provide strategies to complete the tasks using different models of thinking.
 * MIGRATE FULLY TO ZUSTAND
 *
 * FILEPATH: `app/components/orion/admin/AgenticWorkflowComponent.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/agentic-workflow/page.tsx`: This is the parent page that renders and embeds this component,
 *     making it accessible within the Orion Admin dashboard.
 *   - `app/api/orion/agent/execute/route.ts`: This is the primary backend API endpoint that this component interacts with.
 *     It sends user queries and `selectedTools` here and receives the agent's orchestrated responses and message history.
 *   - `app/api/orion/agent/list-tools/route.ts`: This new backend API endpoint is called on component mount to retrieve the list of available tools and their descriptions.
 *   - `app/lib/orion_tools.ts`: While not directly imported here, the backend `execute` route utilizes the tools
 *     defined in this file (e.g., `searchOrionMemoryTool`, `createHabiticaTodoTool`, `callSequentialThinkingTool`)
 *     to fulfill agent requests. The agent's output displayed in this component will reflect the results of these tools.
 *   - `@/components/ui/input.tsx`: Provides the styled input field for user queries.
 *   - `@/components/ui/button.tsx`: Used for the "Execute Agent" action button.
 *   - `@/components/ui/textarea.tsx`: Displays the agent's responses and messages.
 *   - `@/components/ui/loader.tsx`: Indicates loading states during agent execution.
 *   - `@/components/ui/checkbox.tsx`: Used for selecting available tools.
 *   - `@/components/ui/scroll-area.tsx`: Ensures agent conversation can be scrolled.
 *   - `@/components/ui/card.tsx`: Provides structured display for tool calls and outputs.
 *   - `@/lib/apiClient.ts`: Manages all HTTP requests to the backend API, including error handling and retries.
 *   - `@/lib/logger.ts`: Centralized client-side logging utility for detailed operational insights.
 *   - `@/lib/types/index.ts`: Defines shared TypeScript interfaces and types, such as `Message`, `LLMTool`, `LLMToolCall`, and `HandledApplicationError`,
 *     ensuring type safety across the application.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the `/api/orion/agent/execute` endpoint is fully operational, correctly processes agent queries and `selectedTools`,
 *     and returns responses in the `AgentResponse` format, including `success`, `answer`, `error`, `details`, and `current_messages`.
 *   - Assumes the `/api/orion/agent/list-tools` endpoint is operational and returns an array of `LLMTool` objects.
 *   - Error messages received from the backend API are designed to be user-friendly where possible,
 *     and `HandledApplicationError` provides a standardized structure for error handling.
 *   - The agent's response `current_messages` array will contain a chronological sequence of interactions, including `user`, `assistant`, and `tool` roles.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:**
 *     - Consider abstracting the core chat interface logic into a reusable `ChatInterface` component if
 *       similar AI interaction patterns emerge in other features (e.g., a general LLM chat). This would allow for a consistent UX for AI interactions.
 *     - The display of agent responses could be enhanced by a rich text renderer if the agent starts
 *       returning structured markdown or rich content, which is a common output for LLM-powered agents.
 *   - **PERFORMANCE OPTIMIZATIONS:**
 *     - For very long-running agent executions, explore implementing server-sent events (SSE) or WebSockets
 *       to stream real-time intermediate steps and partial responses, improving perceived performance and user engagement.
 *     - Implement optimistic UI updates for quick feedback when a query is submitted.
 *   - **ERROR HANDLING ROBUSTNESS:**
 *     - Enhance the error display to differentiate more clearly between network connectivity issues,
 *       backend API errors, specific LLM-related failures, and tool execution failures, providing more targeted troubleshooting guidance.
 *     - Implement an automated error reporting mechanism (e.g., Sentry, LogRocket) for production environments to capture and analyze client-side errors.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   - **Enhanced UI for Agent Steps:** Develop a more sophisticated UI that can display each agent step (thought, tool call, tool output, new observation) separately and visually distinctively (e.g., using collapsible sections, distinct message bubbles, or a Mermaid diagram for flow). This would provide much greater transparency into the agent's thought process and reasoning.
 *   - **Pre-defined Agentic Workflows:** Introduce a feature where users can select from a library
 *     of pre-configured agentic workflows or prompts (e.g., "Summarize recent project progress using memory," "Draft a response to email X using my memory and profile," "Analyze market trends for company Y"). This would simplify common tasks and allow for complex operations with a single click.
 *   - **Agent History & Recall:** Implement a persistent history for agent interactions, allowing users
 *     to review past queries, responses, and tool uses within the memory system. This could integrate with the Orion journal or dedicated agent logs.
 *   - **User Feedback Mechanism:** Add a simple feedback mechanism (e.g., thumbs up/down, comment box) to allow users to rate the agent's performance on specific tasks, aiding in continuous improvement and model fine-tuning.
 *   - **Integration with Other Orion Modules:** Enable the agent to directly interact with and manipulate data within other
 *     Orion modules beyond just memory and Habitica (e.g., creating journal entries, updating opportunities, triggering CV tailoring, generating reports, managing contacts). This would require expanding `orion_tools.ts` and corresponding backend APIs.
 *   - **Dynamic Context Provisioning:** Allow users to dynamically attach additional context
 *     (e.g., a specific document, a web page URL, a file from local-files) to their agent queries to enrich the agent's understanding and enable more powerful tasks. This could involve file uploads or URL inputs.
 *   - **Tool Management UI:** Create a dedicated UI within System Settings or a similar area for managing and configuring agent tools, allowing for easy enabling/disabling, adding new tools, and editing tool parameters.
 *   - **Cost Estimation/Tracking:** Provide users with an estimated cost of agent execution (e.g., based on LLM tokens and tool usage) for transparency, especially for longer or more complex tasks.
 */

'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';
import {
  HandledApplicationError,
  LLMTool,
  Message,
  LLMToolCall,
  Task,
  TaskStatus,
  TaskPriority,
  TaskStep,
} from '@/lib/types';
import { QuadrantMemoryChunksVisualizer } from '@/components/orion/QuadrantMemoryChunksVisualizer';
import { Badge } from '@/components/ui/badge';
import { MemorySearchResponse } from '@/lib/types/memory';
import { TaskStepTimeline } from '@/components/orion/tasks/TaskStepTimeline';
import useAgentWorkflowStore from '@/lib/stores/agentWorkflowStore';
import { useTasks } from '@/hooks/useTasks';
import '@/components/ui/glitter-border.css';

interface AgentResponse {
  success: boolean;
  answer?: string;
  error?: string;
  details?: string;
  current_messages?: Message[];
  strategies?: { answer: string; messages: Message[] }[];
}

interface TaskApiResponse {
  success: boolean;
  data?: Task | Task[];
  error?: string;
}

// Default user ID for a personal, non-authenticated project
const DEFAULT_USER_ID = 'personal_user';

export const AgenticWorkflowComponent: React.FC = () => {
  const {
    userQuery,
    setUserQuery,
    agentMessages,
    setAgentMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    availableTools,
    setAvailableTools,
    selectedToolNames,
    setSelectedToolNames,
    numStrategies,
    setNumStrategies,
    strategiesToSave,
    setStrategiesToSave,
    generatedStrategies,
    setGeneratedStrategies,
    selectedStrategyForRefinement,
    setSelectedStrategyForRefinement,
    newTaskTitle,
    setNewTaskTitle,
    newTaskDescription,
    setNewTaskDescription,
    newTaskRelatedLinks,
    setNewTaskRelatedLinks,
    newTaskRelatedPhoneNumbers,
    setNewTaskRelatedPhoneNumbers,
    newTaskDueDate,
    setNewTaskDueDate,
    shouldCreateTaskFromAgentOutput,
    setShouldCreateTaskFromAgentOutput,
    relatedMemories,
    setRelatedMemories,
    isMemoriesLoading,
    setIsMemoriesLoading,
    memoriesError,
    setMemoriesError,
    selectedTaskId,
    setSelectedTaskId,
    editingTask,
    setEditingTask,
    newTaskStatus,
    setNewTaskStatus,
    newTaskPriority,
    setNewTaskPriority,
  } = useAgentWorkflowStore();

  const { tasks, isLoading: taskLoading, error: taskError, addTask } = useTasks();

  const logContext = { component: 'AgenticWorkflowComponent', userQuery };

  const selectedTask = tasks.find((t: import('@/lib/types').Task) => t.id === selectedTaskId);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; tools: LLMTool[]; error?: string }>(
          '/api/orion/agent/list-tools'
        );
        if (response.data.success) {
          setAvailableTools(response.data.tools);
          setSelectedToolNames(response.data.tools.map((tool) => tool.function.name));
          logger.info('[AGENTIC_WORKFLOW][TOOLS_FETCH_SUCCESS] Available tools fetched.', {
            toolCount: response.data.tools.length,
          });
        } else {
          logger.error('[AGENTIC_WORKFLOW][TOOLS_FETCH_ERROR] Failed to fetch available tools.', {
            error: response.data.error,
          });
          setError(response.data.error || 'Failed to load tools.');
        }
      } catch (err: unknown) {
        const errorMessage = 'Failed to fetch available tools: ';
        if (err instanceof HandledApplicationError) {
          setError(errorMessage + err.message);
          logger.error('[AGENTIC_WORKFLOW][TOOLS_FETCH_ERROR][HANDLED]', { error: err.message, originalError: err });
        } else if (err instanceof Error) {
          setError(errorMessage + err.message);
          logger.error('[AGENTIC_WORKFLOW][TOOLS_FETCH_ERROR][UNHANDLED]', { error: err.message, stack: err.stack });
        } else {
          setError(errorMessage + String(err));
          logger.error('[AGENTIC_WORKFLOW][TOOLS_FETCH_ERROR][UNKNOWN]', { error: String(err) });
        }
      }
    };
    fetchTools();
  }, [setAvailableTools]);

  // Type guard for LLMToolCall
  function isLLMToolCall(value: unknown): value is LLMToolCall {
    return (
      typeof value === 'object' &&
      value !== null &&
      'function' in value &&
      typeof (value as { function: unknown }).function === 'object' &&
      (value as { function: { name: unknown } }).function !== null &&
      'name' in (value as { function: { name: unknown } }).function &&
      typeof (value as { function: { name: string } }).function.name === 'string'
    );
  }

  const handleToolSelectionChange = (toolName: string, isChecked: boolean) => {
    setSelectedToolNames(
      isChecked ? [...selectedToolNames, toolName] : selectedToolNames.filter((name) => name !== toolName)
    );
  };

  const handleNumStrategiesChange = (value: number[]) => {
    setNumStrategies(value[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAgentMessages([]);
    setGeneratedStrategies([]);

    let queryToSend = userQuery;
    if (selectedStrategyForRefinement) {
      queryToSend = selectedStrategyForRefinement;
      setSelectedStrategyForRefinement(null);
    }

    logger.info('[AGENTIC_WORKFLOW][SUBMIT] User submitted query.', { ...logContext, queryToSend });

    const initialUserMessage: Message = { role: 'user', content: queryToSend };
    if (numStrategies === 1) {
      setAgentMessages([initialUserMessage]);
    } else {
      setAgentMessages([...agentMessages, initialUserMessage]);
    }

    try {
      const response = await apiClient.post<AgentResponse>('/api/orion/agent/execute', {
        userQuery: queryToSend,
        selectedTools: selectedToolNames,
        numOptions: numStrategies,
        relatedLinks: newTaskRelatedLinks
          .split(',')
          .map((link) => link.trim())
          .filter((link) => link.length > 0),
        relatedPhoneNumbers: newTaskRelatedPhoneNumbers
          .split(',')
          .map((phone) => phone.trim())
          .filter((phone) => phone.length > 0),
      });

      if (response.data.success) {
        if (response.data.strategies && response.data.strategies.length > 0) {
          setGeneratedStrategies(response.data.strategies);
          setAgentMessages([]);
          logger.success('[AGENTIC_WORKFLOW][SUCCESS] Agent generated multiple strategies.', {
            numStrategies: response.data.strategies.length,
            ...logContext,
          });
        } else {
          setAgentMessages(response.data.current_messages || []);
          logger.success('[AGENTIC_WORKFLOW][SUCCESS] Agent executed successfully.', {
            ...logContext,
            response: response.data,
          });
          // Automatically create a task if the option is enabled and there's an answer
          if (shouldCreateTaskFromAgentOutput && response.data.answer) {
            await handleCreateTaskFromAgentOutput(response.data.answer);
          }
        }
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
          ...logContext,
          error: errorMessage,
          details: response.data.details,
        });
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof HandledApplicationError) {
        errorMessage = err.message;
        logger.error('[AGENTIC_WORKFLOW][HANDLED_ERROR]', { ...logContext, error: errorMessage, originalError: err });
      } else if (err instanceof Error) {
        errorMessage = err.message;
        logger.error('[AGENTIC_WORKFLOW][UNHANDLED_ERROR]', { error: errorMessage, stack: err.stack });
      } else {
        logger.error('[AGENTIC_WORKFLOW][UNKNOWN_ERROR]', { error: String(err) });
      }
      setError(errorMessage);
      setAgentMessages([...agentMessages, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
      logger.info('[AGENTIC_WORKFLOW][COMPLETE] Agent execution process finished.', logContext);
    }
  };

  const renderMessageContent = (message: Message, index: number) => {
    if (message.tool_calls && message.tool_calls.length > 0) {
      return (
        <div className="space-y-2 mt-2">
          <p className="font-semibold text-purple-300">Agent Tool Call:</p>
          {message.tool_calls.map((toolCall: unknown, idx: number) => (
            <Card key={idx} className="bg-purple-900/30 border-purple-700 text-purple-100 p-3 text-sm">
              {isLLMToolCall(toolCall) && (
                <>
                  <p>
                    Function: <strong>{toolCall.function.name}</strong>
                  </p>
                  <p>
                    Arguments: <span>{toolCall.function.arguments}</span>
                  </p>
                  {toolCall.id && (
                    <p>
                      Call ID: <span className="font-mono text-xs">{toolCall.id}</span>
                    </p>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      );
    } else if (message.role === 'tool' && message.tool_call_id && message.content) {
      return (
        <div className="space-y-2 mt-2">
          <p className="font-semibold text-green-300">Tool Output (ID: {message.tool_call_id}):</p>
          <Card className="bg-green-900/30 border-green-700 text-green-100 p-3 text-sm">
            <pre className="whitespace-pre-wrap font-mono text-xs">{message.content}</pre>
          </Card>
        </div>
      );
    } else if (message.content) {
      return (
        <>
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.role === 'assistant' && (
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id={`save-strategy-${index}`}
                checked={strategiesToSave.has(message.content || '')}
                onCheckedChange={(checked) => handleStrategySelectionChange(message.content || '', checked as boolean)}
              />
              <label htmlFor={`save-strategy-${index}`} className="text-sm font-medium leading-none text-gray-300">
                Save to Memory
              </label>
            </div>
          )}
        </>
      );
    }
    return null;
  };

  const handleStrategySelectionChange = (strategyContent: string, isChecked: boolean) => {
    const newSet = new Set(strategiesToSave);
    if (isChecked) {
      newSet.add(strategyContent);
    } else {
      newSet.delete(strategyContent);
    }
    setStrategiesToSave(newSet);
  };

  const handleSaveToMemory = async () => {
    setIsLoading(true);
    setError(null);
    logger.info('[AGENTIC_WORKFLOW][SAVE_TO_MEMORY] Attempting to save selected strategies to memory.', {
      strategyCount: strategiesToSave.size,
    });

    const userId = DEFAULT_USER_ID;

    try {
      if (!userId) {
        throw new Error('User ID is not available. Cannot save to memory.');
      }

      for (const strategyContent of Array.from(strategiesToSave)) {
        const response = await apiClient.post('/api/orion/memory/add-memory', {
          text: strategyContent,
          source_id: 'agentic_workflow_strategy',
          type: 'strategy',
          tags: ['agentic_workflow', 'strategy'],
          userId: userId,
        });

        if (!response.data.success) {
          throw new Error(`Failed to save strategy to memory: ${response.data.error}`);
        }
        logger.success('[AGENTIC_WORKFLOW][SAVE_TO_MEMORY] Strategy saved successfully.', {
          strategyContent: strategyContent.substring(0, 50) + '...',
        });
      }
      setStrategiesToSave(new Set());
      alert('Selected strategies saved to memory!');
    } catch (err: unknown) {
      const errorMessage = 'Failed to save strategies to memory: ';
      if (err instanceof HandledApplicationError) {
        setError(errorMessage + err.message);
        logger.error('[AGENTIC_WORKFLOW][SAVE_TO_MEMORY][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setError(errorMessage + err.message);
        logger.error('[AGENTIC_WORKFLOW][SAVE_TO_MEMORY][UNHANDLED]', { error: errorMessage, stack: err.stack });
      } else {
        setError(errorMessage + String(err));
        logger.error('[AGENTIC_WORKFLOW][SAVE_TO_MEMORY][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteStrategy = async (strategyMessages: Message[]) => {
    setIsLoading(true);
    setError(null);
    logger.info('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY] Attempting to execute a proposed strategy.', {
      strategyMessagesLength: strategyMessages.length,
    });

    let toolCallToExecute: LLMToolCall | undefined;

    for (const message of strategyMessages) {
      if (message.tool_calls && message.tool_calls.length > 0) {
        toolCallToExecute = message.tool_calls[0];
        break;
      }
    }

    if (!toolCallToExecute) {
      setError('No executable tool call found in this strategy.');
      setIsLoading(false);
      logger.warn('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY] No tool call found to execute.', { strategyMessages });
      return;
    }

    try {
      const response = await apiClient.post<AgentResponse>('/api/orion/agent/execute', {
        preDeterminedToolCall: toolCallToExecute,
      });

      if (response.data.success) {
        setGeneratedStrategies([]);
        setAgentMessages([
          ...agentMessages,
          { role: 'assistant', content: '--- Executing Proposed Strategy ---' },
          ...(response.data.current_messages || []),
          { role: 'assistant', content: '--- Strategy Execution Complete ---' },
        ]);
        logger.success('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY] Strategy executed successfully.', {
          response: response.data,
        });
      } else {
        const errorMessage = response.data.error || 'Strategy execution failed.';
        setError(errorMessage);
        setAgentMessages([
          ...agentMessages,
          {
            role: 'assistant',
            content: `Error: ${errorMessage}${response.data.details ? ` Details: ${response.data.details}` : ''}`,
          },
        ]);
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][API_ERROR]', {
          error: errorMessage,
          details: response.data.details,
        });
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred during strategy execution.';
      if (err instanceof HandledApplicationError) {
        errorMessage = err.message;
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][HANDLED_ERROR]', {
          error: errorMessage,
          originalError: err,
        });
      } else if (err instanceof Error) {
        errorMessage = err.message;
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][UNHANDLED]', {
          error: errorMessage,
          stack: err.stack,
        });
      } else {
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][UNKNOWN_ERROR]', { error: String(err) });
      }
      setError(errorMessage);
      setAgentMessages([...agentMessages, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
      logger.info('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][COMPLETE]');
    }
  };

  const handleRefineStrategy = (strategyContent: string) => {
    setSelectedStrategyForRefinement(strategyContent);
    setUserQuery(strategyContent);
    setGeneratedStrategies([]);
    setAgentMessages([]);
    setError(null);
    logger.info('[AGENTIC_WORKFLOW][REFINE_STRATEGY] Entering refinement mode.', {
      strategyContent: strategyContent.substring(0, 50) + '...',
    });
  };

  const handleCancelRefinement = () => {
    setSelectedStrategyForRefinement(null);
    setUserQuery('');
    setGeneratedStrategies([]);
    setAgentMessages([]);
    setError(null);
    logger.info('[AGENTIC_WORKFLOW][REFINE_STRATEGY] Exiting refinement mode.');
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      logger.warn('[TASK_MANAGER][UPDATE_TASK][NOT_IMPLEMENTED] Update task is not yet implemented in useTasks.');
      setError('Task update is not yet supported.');
      return;
    } else {
      logger.info('[TASK_MANAGER][CREATE_TASK][START] Attempting to create new task.', {
        newTaskTitle,
        newTaskStatus,
        newTaskPriority,
      });
      if (!newTaskTitle.trim()) {
        setError('Task title cannot be empty.');
        logger.warn('[TASK_MANAGER][CREATE_TASK][VALIDATION_FAIL] Task title empty.');
        return;
      }
      try {
        await addTask.mutateAsync({
          title: newTaskTitle,
          description: newTaskDescription,
          status: newTaskStatus,
          priority: newTaskPriority,
          relatedLinks: newTaskRelatedLinks
            .split(',')
            .map((link: string) => link.trim())
            .filter((link: string) => link.length > 0),
          relatedPhoneNumbers: newTaskRelatedPhoneNumbers
            .split(',')
            .map((phone: string) => phone.trim())
            .filter((phone: string) => phone.length > 0),
          dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
        } as any);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskRelatedLinks('');
        setNewTaskRelatedPhoneNumbers('');
        setNewTaskDueDate(null);
        logger.success('[TASK_MANAGER][CREATE_TASK][SUCCESS] Task created.');
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        logger.error('[TASK_MANAGER][CREATE_TASK][ERROR]', { error: err });
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    logger.warn('[TASK_MANAGER][DELETE_TASK][NOT_IMPLEMENTED] Delete task is not yet implemented in useTasks.');
    setError('Task deletion is not yet supported.');
  };

  const handleTaskSelection = async (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = tasks.find((t: import('@/lib/types').Task) => t.id === taskId);
    if (task && task.title) {
      setIsMemoriesLoading(true);
      setMemoriesError(null);
      try {
        logger.info('[MEMORY_SEARCH][START] Searching memories for selected task.', { taskId, taskTitle: task.title });
        const memoryResponse = await apiClient.post<MemorySearchResponse>(`/api/orion/memory/search`, {
          query: task.title,
          limit: 5,
        });
        if (memoryResponse.data.success && memoryResponse.data.results) {
          setRelatedMemories(memoryResponse.data.results);
          logger.success('[MEMORY_SEARCH][SUCCESS] Memories found for task.', {
            taskId,
            count: memoryResponse.data.results.length,
          });
        } else {
          setMemoriesError(memoryResponse.data.error || 'Failed to search memories.');
          logger.error('[MEMORY_SEARCH][ERROR] Failed to search memories for task.', {
            taskId,
            error: memoryResponse.data.error,
          });
        }
      } catch (err: unknown) {
        const errorMessage = 'Failed to search memories: ';
        if (err instanceof HandledApplicationError) {
          setMemoriesError(errorMessage + err.message);
          logger.error('[MEMORY_SEARCH][HANDLED]', { error: err.message, originalError: err });
        } else if (err instanceof Error) {
          setMemoriesError(errorMessage + err.message);
          logger.error('[MEMORY_SEARCH][UNHANDLED]', { error: err.message, stack: err.stack });
        } else {
          setMemoriesError(errorMessage + String(err));
          logger.error('[MEMORY_SEARCH][UNKNOWN]', { error: String(err) });
        }
      } finally {
        setIsMemoriesLoading(false);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || '');
    setNewTaskStatus(task.status);
    setNewTaskPriority(task.priority);
    setNewTaskRelatedLinks(task.relatedLinks ? task.relatedLinks.join(',') : '');
    setNewTaskRelatedPhoneNumbers(task.relatedPhoneNumbers ? task.relatedPhoneNumbers.join(',') : '');
    setNewTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null);
  };

  const handleCreateTaskFromAgentOutput = async (answer: string) => {
    logger.info('[TASK_MANAGER][CREATE_FROM_AGENT_OUTPUT] Creating task from agent output.', { answer });
    setNewTaskTitle(answer.substring(0, 100)); // Take first 100 chars as title
    setNewTaskDescription(answer);
    setNewTaskRelatedLinks('');
    setNewTaskRelatedPhoneNumbers('');
    setNewTaskDueDate(null);
    setShouldCreateTaskFromAgentOutput(false);
    // Manually trigger the task submission to create the task
    await handleSubmitTask({ preventDefault: () => {} } as React.FormEvent);
    logger.success('[TASK_MANAGER][CREATE_FROM_AGENT_OUTPUT][SUCCESS]', { answer: answer.substring(0, 50) + '...' });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white p-6 space-y-8 overflow-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-400 drop-shadow-lg tracking-wide">
        Orion Agentic Workflow
      </h1>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-1 min-w-0">
          <Card className="bg-gray-800 border-none shadow-2xl rounded-2xl">
            <CardHeader className="rounded-t-2xl bg-gradient-to-r from-purple-900/60 to-gray-800/80">
              <CardTitle className="text-purple-200 text-2xl font-bold tracking-wider">Agent Interaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row md:space-x-6 md:items-end space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <Label htmlFor="userQuery" className="text-gray-300 text-base font-semibold mb-1 block">
                      Your Query:
                    </Label>
                    <Textarea
                      id="userQuery"
                      placeholder="Ask Orion anything... (e.g., plan my day, research AI trends, draft an email)"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px] rounded-lg shadow-sm transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-3 md:space-y-0 md:ml-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="createTaskFromOutput"
                        checked={shouldCreateTaskFromAgentOutput}
                        onCheckedChange={(checked: boolean) => setShouldCreateTaskFromAgentOutput(checked)}
                        className="scale-110"
                      />
                      <label htmlFor="createTaskFromOutput" className="text-sm font-medium leading-none text-gray-300">
                        Create a task from agent&apos;s final output
                      </label>
                    </div>
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-12 rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-purple-400 focus:outline-none w-full md:w-auto mt-4 mb-2"
                      disabled={isLoading || !userQuery.trim()}
                    >
                      {isLoading ? (
                        <Loader className="animate-spin h-5 w-5 text-white" />
                      ) : selectedStrategyForRefinement ? (
                        'Refine Strategy'
                      ) : (
                        'Execute Agent'
                      )}
                    </Button>
                    {selectedStrategyForRefinement && (
                      <Button
                        type="button"
                        onClick={handleCancelRefinement}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-gray-400 focus:outline-none w-full md:w-auto mt-2"
                      >
                        Cancel Refinement
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-base font-semibold">Select Tools:</Label>
                  <div className="flex items-center mb-2">
                    <Button
                      type="button"
                      className={`glitter-border mr-4 px-6 py-2 rounded-full font-bold shadow-md transition-all duration-200 bg-purple-700 hover:bg-purple-800 text-white border-none focus:ring-2 focus:ring-purple-400 focus:outline-none`}
                      onClick={() => {
                        if (selectedToolNames.length === availableTools.length && availableTools.length > 0) {
                          setSelectedToolNames([]);
                          logger.info('[AGENTIC_WORKFLOW][TOOLS_UNSELECT_ALL]', {
                            operation: 'unselect_all',
                            user: DEFAULT_USER_ID,
                            toolCount: availableTools.length,
                          });
                        } else {
                          setSelectedToolNames(availableTools.map((tool) => tool.function.name));
                          logger.info('[AGENTIC_WORKFLOW][TOOLS_SELECT_ALL]', {
                            operation: 'select_all',
                            user: DEFAULT_USER_ID,
                            toolCount: availableTools.length,
                          });
                        }
                      }}
                      disabled={availableTools.length === 0}
                    >
                      {selectedToolNames.length === availableTools.length && availableTools.length > 0
                        ? 'Unselect All'
                        : 'Select All'}
                    </Button>
                    <span className="text-xs text-gray-400">({selectedToolNames.length} selected)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableTools.map((tool) => (
                      <div key={tool.function.name} className="flex items-center space-x-3">
                        <Checkbox
                          id={tool.function.name}
                          checked={selectedToolNames.includes(tool.function.name)}
                          onCheckedChange={(checked: boolean) => handleToolSelectionChange(tool.function.name, checked)}
                          className="scale-110"
                        />
                        <Label htmlFor={tool.function.name} className="text-sm font-medium leading-none text-gray-300">
                          {tool.function.name}{' '}
                          <span className="text-gray-500 text-xs">({tool.function.description})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-6 md:items-end space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <Label htmlFor="numStrategies" className="text-gray-300 text-base font-semibold mb-1 block">
                      Number of Strategies to Generate (1-5):
                    </Label>
                    <Select value={String(numStrategies)} onValueChange={(value) => setNumStrategies(Number(value))}>
                      <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg">
                        <SelectValue placeholder="Select a number" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white rounded-lg">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)} className="focus:bg-gray-700">
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="relatedLinks" className="text-gray-300 text-base font-semibold mb-1 block">
                      Related Links (comma-separated):
                    </Label>
                    <Input
                      id="relatedLinks"
                      placeholder="e.g., https://example.com/doc1, https://example.com/doc2"
                      value={newTaskRelatedLinks}
                      onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="relatedPhoneNumbers" className="text-gray-300 text-base font-semibold mb-1 block">
                      Related Phone Numbers (comma-separated):
                    </Label>
                    <Input
                      id="relatedPhoneNumbers"
                      placeholder="e.g., +15551234567, +442079460123"
                      value={newTaskRelatedPhoneNumbers}
                      onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg"
                    />
                  </div>
                </div>
              </form>

              {error && <p className="text-red-500 mt-4 text-center">Error: {error}</p>}

              {generatedStrategies.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-purple-300">Proposed Strategies:</h3>
                  {generatedStrategies.map((strategy, index) => (
                    <Card key={index} className="bg-gray-700 border-gray-600 shadow-md">
                      <CardContent className="p-4">
                        <p className="text-white whitespace-pre-wrap">{strategy.answer}</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            onClick={() => handleRefineStrategy(strategy.answer)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Refine
                          </Button>
                          <Button
                            onClick={() => handleExecuteStrategy(strategy.messages)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Execute
                          </Button>
                          <Button
                            onClick={() =>
                              handleStrategySelectionChange(strategy.answer, !strategiesToSave.has(strategy.answer))
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {strategiesToSave.has(strategy.answer) ? 'Deselect' : 'Select for Memory'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {strategiesToSave.size > 0 && (
                    <Button
                      onClick={handleSaveToMemory}
                      className="w-full bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-4"
                      disabled={isLoading}
                    >
                      Save Selected Strategies to Memory ({strategiesToSave.size})
                    </Button>
                  )}
                </div>
              )}

              {agentMessages.length > 0 && generatedStrategies.length === 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-purple-300">Agent Response:</h3>
                  <ScrollArea className="h-[400px] w-full rounded-md border border-gray-700 p-4 bg-gray-800">
                    {agentMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-900/30 text-blue-100 self-end' : message.role === 'assistant' ? 'bg-green-900/30 text-green-100 self-start' : 'bg-gray-700/50 text-gray-100'}`}
                      >
                        <p className="font-semibold mb-1 capitalize">{message.role}:</p>
                        {renderMessageContent(message, index)}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 min-w-0">
          <Card className="bg-gray-800 border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-purple-300">Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTask} className="space-y-4 mb-6">
                <Input
                  type="text"
                  placeholder="New Task Title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <Textarea
                  placeholder="Task Description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <Input
                  type="text"
                  placeholder="Related Links (comma-separated, optional)"
                  value={newTaskRelatedLinks}
                  onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <Input
                  type="text"
                  placeholder="Related Phone Numbers (comma-separated, optional)"
                  value={newTaskRelatedPhoneNumbers}
                  onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <Input
                  type="date"
                  value={newTaskDueDate || ''}
                  onChange={(e) => setNewTaskDueDate(e.target.value || null)}
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <div className="flex items-center space-x-4">
                  <Select value={newTaskStatus} onValueChange={(value: TaskStatus) => setNewTaskStatus(value)}>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status} className="focus:bg-gray-700">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={newTaskPriority} onValueChange={(value: TaskPriority) => setNewTaskPriority(value)}>
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-600 text-white">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {Object.values(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority} className="focus:bg-gray-700">
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={taskLoading || !newTaskTitle.trim()}
                >
                  {taskLoading ? (
                    <Loader className="animate-spin h-5 w-5 text-white" />
                  ) : editingTask ? (
                    'Update Task'
                  ) : (
                    'Add Task'
                  )}
                </Button>
                {editingTask && (
                  <Button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mt-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>

              {taskError && (
                <p className="text-red-500 mt-4 text-center">
                  Error:{' '}
                  {typeof taskError === 'string'
                    ? taskError
                    : taskError instanceof Error
                      ? taskError.message
                      : JSON.stringify(taskError)}
                </p>
              )}

              <h3 className="text-xl font-semibold text-purple-300 mb-4">My Tasks:</h3>
              {taskLoading && tasks.length === 0 ? (
                <div className="flex justify-center items-center h-20">
                  <Loader className="animate-spin h-8 w-8 text-purple-500" />
                </div>
              ) : tasks.length === 0 ? (
                <p className="text-gray-400 text-center">No tasks found. Add a new task above!</p>
              ) : (
                <ScrollArea className="h-[400px] w-full rounded-md border border-gray-700 p-4 bg-gray-800">
                  {tasks.map((task: import('@/lib/types').Task) => (
                    <Card key={task.id} className="mb-3 bg-gray-700 border-gray-600 shadow-md">
                      <CardHeader className="flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-white text-lg">{task.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTaskSelection(task.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          >
                            Select
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {task.description && <p className="text-gray-300 mb-2">{task.description}</p>}
                        <div className="flex items-center space-x-2 text-sm mb-2">
                          <Badge
                            className={`px-2 py-1 rounded-full ${task.status === TaskStatus.DONE ? 'bg-green-500' : task.status === TaskStatus.IN_PROGRESS ? 'bg-yellow-500' : 'bg-gray-500'}`}
                          >
                            {task.status}
                          </Badge>
                          <Badge
                            className={`px-2 py-1 rounded-full ${task.priority === TaskPriority.HIGH ? 'bg-red-500' : task.priority === TaskPriority.MEDIUM ? 'bg-orange-500' : 'bg-blue-500'}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.dueDate && (
                          <p className="text-gray-400 text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        )}
                        {task.relatedLinks && task.relatedLinks.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-300">Related Links:</p>
                            <ul className="list-disc list-inside text-gray-400 text-sm">
                              {(task.relatedLinks as string[]).map((link: string, linkIdx: number) => (
                                <li key={linkIdx}>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-400 hover:text-blue-600"
                                  >
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {task.relatedPhoneNumbers && task.relatedPhoneNumbers.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-300">Related Phone Numbers:</p>
                            <ul className="list-disc list-inside text-gray-400 text-sm">
                              {(task.relatedPhoneNumbers as string[]).map((phone: string, phoneIdx: number) => (
                                <li key={phoneIdx}>{phone}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedTaskId && (
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-300">Agent Steps for Selected Task: {selectedTask?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader className="animate-spin h-8 w-8 text-purple-500" />
              </div>
            ) : selectedTask?.steps && selectedTask.steps.length > 0 ? (
              <ScrollArea className="h-[400px] w-full rounded-md border border-gray-700 p-4 bg-gray-800">
                {selectedTask.steps.map((stepItem: TaskStep, index: number) => (
                  <Card key={index} className="mb-3 bg-gray-700 border-gray-600 shadow-md">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold">Step {stepItem.stepNumber}:</p>
                      <p className="mt-1 text-slate-200">{stepItem.prompt}</p>
                      {stepItem.chosenAction && (
                        <p className="mt-1 text-sm text-purple-300">Action: {stepItem.chosenAction}</p>
                      )}
                      {stepItem.chosenJustification && (
                        <p className="mt-1 text-sm text-purple-300">Justification: {stepItem.chosenJustification}</p>
                      )}
                      {stepItem.toolCalls && stepItem.toolCalls.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-slate-300">Tool Calls:</p>
                          <ul className="list-disc list-inside text-slate-200">
                            {stepItem.toolCalls.map((toolCall: unknown, tcIdx: number) => {
                              if (isLLMToolCall(toolCall)) {
                                return (
                                  <li key={tcIdx} className="text-sm">
                                    <strong>{toolCall.function.name}</strong>({toolCall.function.arguments})
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        </div>
                      )}
                      {stepItem.finalLog && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold text-slate-300">Final Log:</p>
                          <pre className="bg-slate-900 p-2 rounded text-xs overflow-auto text-slate-100">
                            {JSON.stringify(stepItem.finalLog, null, 2)}
                          </pre>
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-2">
                        Created: {new Date(stepItem.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-gray-400 text-center">No agent steps recorded for this task.</p>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTaskId && selectedTask && (selectedTask.title || selectedTask.description) && (
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-purple-300">Related Memories for Task</CardTitle>
          </CardHeader>
          <CardContent>
            {isMemoriesLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader className="animate-spin h-8 w-8 text-purple-500" />
              </div>
            ) : memoriesError ? (
              <p className="text-red-500 text-center">Error fetching memories: {memoriesError}</p>
            ) : relatedMemories.length > 0 ? (
              <QuadrantMemoryChunksVisualizer memoryResults={relatedMemories} />
            ) : (
              <p className="text-gray-400 text-center">No related memories found for this task.</p>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTaskId && (
        <Card className="bg-gray-800 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-300">Task Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Generate New Steps for Task</h3>
            <Textarea
              placeholder="Enter a prompt or note for generating next steps (e.g., 'What should I do next to finish this?')"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rows={3}
              className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
            />
            <Button
              onClick={async () => {
                logger.info('[TASK_MANAGER][GENERATE_STEPS][START]', { taskId: selectedTaskId, prompt: userQuery });
                try {
                  const response = await apiClient.post<TaskApiResponse>(
                    `/api/orion/tasks/${selectedTaskId}/generate-steps`,
                    {
                      prompt: userQuery,
                      numOptions: 3,
                    }
                  );

                  if (response.data.success) {
                    // setTaskLoading(true);
                    // setTaskError(null);
                  } else {
                    // setTaskError(response.data.error || 'Failed to generate steps.');
                    logger.error('[TASK_MANAGER][GENERATE_STEPS][ERROR]', {
                      taskId: selectedTaskId,
                      error: response.data.error,
                    });
                  }
                } catch (err: unknown) {
                  const errorMessage = 'Failed to generate steps: ';
                  if (err instanceof HandledApplicationError) {
                    // setTaskError(errorMessage + err.message);
                    logger.error('[TASK_MANAGER][GENERATE_STEPS][HANDLED]', {
                      error: err.message,
                      originalError: err,
                    });
                  } else if (err instanceof Error) {
                    // setTaskError(errorMessage + err.message);
                    logger.error('[TASK_MANAGER][GENERATE_STEPS][UNHANDLED]', {
                      error: err.message,
                      stack: err.stack,
                    });
                  } else {
                    // setTaskError(errorMessage + String(err));
                    logger.error('[TASK_MANAGER][GENERATE_STEPS][UNKNOWN]', { error: String(err) });
                  }
                }
              }}
              disabled={!selectedTaskId || !userQuery.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Generate Next Steps with AI
            </Button>
            {/* {taskError && <p className="text-red-400 mt-2">Error: {taskError}</p>} */}

            <h3 className="text-lg font-semibold text-gray-200 mt-6">Existing Steps</h3>
            <ScrollArea className="h-[400px] pr-4">
              {selectedTaskId &&
                (() => {
                  const selectedTask = tasks.find((t: import('@/lib/types').Task) => t.id === selectedTaskId);
                  if (selectedTask?.steps) {
                    return <TaskStepTimeline steps={selectedTask.steps} />;
                  } else {
                    return <p className="text-gray-400">No steps found for this task.</p>;
                  }
                })()}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
