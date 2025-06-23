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

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';
import { HandledApplicationError, LLMTool, Message, LLMToolCall, Task, TaskStatus, TaskPriority } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pythonApiService } from '@/lib/pythonApiService';
import { QuadrantMemoryChunksVisualizer } from '@/components/orion/QuadrantMemoryChunksVisualizer';
import { Badge } from '@/components/ui/badge';
import { ScoredMemoryPoint } from '@/lib/types/memory';

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
  const [userQuery, setUserQuery] = useState<string>('');
  const [agentMessages, setAgentMessages] = useLocalStorage<Message[]>('agentMessages', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTools, setAvailableTools] = useLocalStorage<LLMTool[]>('availableTools', []);
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);
  const [numStrategies, setNumStrategies] = useState<number>(1);
  const [strategiesToSave, setStrategiesToSave] = useState<Set<string>>(new Set());
  const [generatedStrategies, setGeneratedStrategies] = useState<{ answer: string; messages: Message[] }[]>([]);
  const [selectedStrategyForRefinement, setSelectedStrategyForRefinement] = useState<string | null>(null);

  // Task Management States
  const [tasks, setTasks] = useLocalStorage<Task[]>('orionTasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [taskLoading, setTaskLoading] = useState<boolean>(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [newTaskRelatedLinks, setNewTaskRelatedLinks] = useState<string>('');
  const [newTaskRelatedPhoneNumbers, setNewTaskRelatedPhoneNumbers] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [shouldCreateTaskFromAgentOutput, setShouldCreateTaskFromAgentOutput] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | null>(null);

  // Memory Visualization States
  const [relatedMemories, setRelatedMemories] = useState<ScoredMemoryPoint[]>([]);
  const [isMemoriesLoading, setIsMemoriesLoading] = useState<boolean>(false);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);

  const logContext = { component: 'AgenticWorkflowComponent', userQuery };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const fetchTasks = async () => {
    setTaskLoading(true);
    setTaskError(null);
    logger.info('[TASK_MANAGER][FETCH_TASKS][START] Fetching tasks.');
    try {
      const response = await apiClient.get<TaskApiResponse>(`/api/orion/tasks/list`);
      if (response.data.success && response.data.data) {
        setTasks(response.data.data as Task[]);
        logger.success('[TASK_MANAGER][FETCH_TASKS][SUCCESS] Tasks fetched.', {
          count: (response.data.data as Task[]).length,
        });
      } else {
        setTaskError(response.data.error || 'Failed to fetch tasks.');
        logger.error('[TASK_MANAGER][FETCH_TASKS][ERROR] Failed to fetch tasks.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = 'Failed to fetch tasks: ';
      if (err instanceof HandledApplicationError) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][FETCH_TASKS][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][FETCH_TASKS][UNHANDLED]', { error: err.message, stack: err.stack });
      } else {
        setTaskError(errorMessage + String(err));
        logger.error('[TASK_MANAGER][FETCH_TASKS][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setTaskLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToolSelectionChange = (toolName: string, isChecked: boolean) => {
    setSelectedToolNames((prev) => (isChecked ? [...prev, toolName] : prev.filter((name) => name !== toolName)));
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
      setAgentMessages([initialUserMessage]);
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
        setAgentMessages((prev) => [
          ...prev,
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
      setAgentMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
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
          {message.tool_calls.map((toolCall: LLMToolCall, idx: number) => (
            <Card key={idx} className="bg-purple-900/30 border-purple-700 text-purple-100 p-3 text-sm">
              <p>
                Function: <span className="font-mono font-bold">{toolCall.function.name}</span>
              </p>
              <p>
                Arguments: <span className="font-mono">{toolCall.function.arguments}</span>
              </p>
              {toolCall.id && (
                <p>
                  Call ID: <span className="font-mono text-xs">{toolCall.id}</span>
                </p>
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
    setStrategiesToSave((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(strategyContent);
      } else {
        newSet.delete(strategyContent);
      }
      return newSet;
    });
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
        setAgentMessages((prev) => [
          ...prev,
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
        setAgentMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Error executing strategy: ${errorMessage}${response.data.details ? ` Details: ${response.data.details}` : ''}`,
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
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRADTEGY][UNKNOWN_ERROR]', { error: String(err) });
      }
      setError(errorMessage);
      setAgentMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
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

  // Task Management Functions
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskLoading(true);
    setTaskError(null);
    logger.info('[TASK_MANAGER][CREATE_TASK][START] Attempting to create new task.', {
      newTaskTitle,
      newTaskStatus,
      newTaskPriority,
    });

    if (!newTaskTitle.trim()) {
      setTaskError('Task title cannot be empty.');
      setTaskLoading(false);
      logger.warn('[TASK_MANAGER][CREATE_TASK][VALIDATION_FAIL] Task title empty.');
      return;
    }

    try {
      const taskToCreate = {
        userId: DEFAULT_USER_ID,
        title: newTaskTitle,
        description: newTaskDescription.trim() || null,
        status: newTaskStatus,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
      };
      const response = await apiClient.post<TaskApiResponse>('/api/orion/tasks/create', taskToCreate);
      if (response.data.success && response.data.data) {
        setTasks((prev) => [...prev, response.data.data as Task]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskStatus(TaskStatus.TODO);
        setNewTaskPriority(TaskPriority.MEDIUM);
        setNewTaskDueDate(null);
        logger.success('[TASK_MANAGER][CREATE_TASK][SUCCESS] Task created.', {
          taskId: (response.data.data as Task).id,
        });
      } else {
        setTaskError(response.data.error || 'Failed to create task.');
        logger.error('[TASK_MANAGER][CREATE_TASK][ERROR] Failed to create task.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = 'Failed to create task: ';
      if (err instanceof HandledApplicationError) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][CREATE_TASK][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][CREATE_TASK][UNHANDLED]', { error: err.message, stack: err.stack });
      } else {
        setTaskError(errorMessage + String(err));
        logger.error('[TASK_MANAGER][CREATE_TASK][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setTaskLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    setTaskLoading(true);
    setTaskError(null);
    logger.info('[TASK_MANAGER][UPDATE_TASK][START] Attempting to update task.', { taskId, updates });
    try {
      const response = await apiClient.put<TaskApiResponse>(`/api/orion/tasks/${taskId}/update`, updates);
      if (response.data.success && response.data.data) {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? (response.data.data as Task) : task)));
        logger.success('[TASK_MANAGER][UPDATE_TASK][SUCCESS] Task updated.', {
          taskId: (response.data.data as Task).id,
        });
      } else {
        setTaskError(response.data.error || 'Failed to update task.');
        logger.error('[TASK_MANAGER][UPDATE_TASK][ERROR] Failed to update task.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = 'Failed to update task: ';
      if (err instanceof HandledApplicationError) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][UPDATE_TASK][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][UPDATE_TASK][UNHANDLED]', { error: err.message, stack: err.stack });
      } else {
        setTaskError(errorMessage + String(err));
        logger.error('[TASK_MANAGER][UPDATE_TASK][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setTaskLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTaskLoading(true);
    setTaskError(null);
    logger.info('[TASK_MANAGER][DELETE_TASK][START] Attempting to delete task.', { taskId });
    try {
      const response = await apiClient.delete<TaskApiResponse>(`/api/orion/tasks/${taskId}/delete`);
      if (response.data.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        logger.success('[TASK_MANAGER][DELETE_TASK][SUCCESS] Task deleted.', { taskId });
      } else {
        setTaskError(response.data.error || 'Failed to delete task.');
        logger.error('[TASK_MANAGER][DELETE_TASK][ERROR] Failed to delete task.', { error: response.data.error });
      }
    } catch (err: unknown) {
      const errorMessage = 'Failed to delete task: ';
      if (err instanceof HandledApplicationError) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][DELETE_TASK][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][DELETE_TASK][UNHANDLED]', { error: err.message, stack: err.stack });
      } else {
        setTaskError(errorMessage + String(err));
        logger.error('[TASK_MANAGER][DELETE_TASK][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setTaskLoading(false);
    }
  };

  const handleTaskSelection = async (taskId: string) => {
    setTaskLoading(true);
    setTaskError(null);
    logger.info('[TASK_MANAGER][SELECT_TASK][START] Fetching details for task.', { taskId });
    try {
      // Fetch the task details again to ensure we have the latest steps and other info
      const response = await apiClient.get<TaskApiResponse>(`/api/orion/tasks/${taskId}`);
      if (response.data.success && response.data.data) {
        // Assuming response.data.data is a single Task object here now
        const fetchedTask = response.data.data as Task;
        // Update the tasks array with the fetched task to ensure its steps are current
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === fetchedTask.id ? fetchedTask : task)));
        setSelectedTaskId(taskId);
        logger.success('[TASK_MANAGER][SELECT_TASK][SUCCESS] Task details fetched.', { taskId });

        // Fetch related memories if the task has a description or title that can be used as query
        if (fetchedTask.description || fetchedTask.title) {
          setIsMemoriesLoading(true);
          setMemoriesError(null);
          try {
            const memorySearchResponse = await apiClient.post<{
              success: boolean;
              results?: ScoredMemoryPoint[];
              error?: string;
            }>(
              '/api/orion/memory/search',
              { query: fetchedTask.description || fetchedTask.title, with_vectors: true } // Ensure with_vectors is true
            );
            if (memorySearchResponse.data.success && memorySearchResponse.data.results) {
              setRelatedMemories(memorySearchResponse.data.results);
              logger.success('[MEMORY_SEARCH][SUCCESS] Related memories fetched.', {
                count: memorySearchResponse.data.results.length,
              });
            } else {
              setMemoriesError(memorySearchResponse.data.error || 'Failed to fetch related memories.');
              logger.error('[MEMORY_SEARCH][ERROR] Failed to fetch related memories.', {
                error: memorySearchResponse.data.error,
              });
            }
          } catch (memErr: unknown) {
            const errorMessage = 'Failed to fetch related memories: ';
            if (memErr instanceof HandledApplicationError) {
              setMemoriesError(errorMessage + memErr.message);
              logger.error('[MEMORY_SEARCH][HANDLED]', { error: memErr.message, originalError: memErr });
            } else if (memErr instanceof Error) {
              setMemoriesError(errorMessage + memErr.message);
              logger.error('[MEMORY_SEARCH][UNHANDLED]', { error: memErr.message, stack: memErr.stack });
            } else {
              setMemoriesError(errorMessage + String(memErr));
              logger.error('[MEMORY_SEARCH][UNKNOWN]', { error: String(memErr) });
            }
          } finally {
            setIsMemoriesLoading(false);
          }
        }
      } else {
        setTaskError(response.data.error || 'Failed to fetch task details.');
        logger.error('[TASK_MANAGER][SELECT_TASK][ERROR] Failed to fetch task details.', {
          error: response.data.error,
        });
      }
    } catch (err: unknown) {
      const errorMessage = 'Failed to select task: ';
      if (err instanceof HandledApplicationError) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][SELECT_TASK][HANDLED]', { error: err.message, originalError: err });
      } else if (err instanceof Error) {
        setTaskError(errorMessage + err.message);
        logger.error('[TASK_MANAGER][SELECT_TASK][UNHANDLED]', { error: err.message, stack: err.stack });
      } else {
        setTaskError(errorMessage + String(err));
        logger.error('[TASK_MANAGER][SELECT_TASK][UNKNOWN]', { error: String(err) });
      }
    } finally {
      setTaskLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    // Pre-fill edit form with task details
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || '');
    setNewTaskStatus(task.status);
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null);
    setNewTaskRelatedLinks((task.relatedLinks || []).join(', '));
    setNewTaskRelatedPhoneNumbers((task.relatedPhoneNumbers || []).join(', '));
    logger.info('[TASK_MANAGER][EDIT_TASK] Editing task.', { taskId: task.id });
  };

  const handleCreateTaskFromAgentOutput = async (answer: string) => {
    setNewTaskTitle(answer.substring(0, 50) + '...'); // Take first 50 chars as title
    setNewTaskDescription(answer);
    setNewTaskStatus(TaskStatus.TODO);
    setNewTaskPriority(TaskPriority.MEDIUM);
    setShouldCreateTaskFromAgentOutput(true);
    logger.info('[TASK_MANAGER][CREATE_FROM_AGENT_OUTPUT] Preparing to create task from agent output.');
  };

  // Type guard for LLMToolCall
  function isLLMToolCall(value: any): value is LLMToolCall {
    return (
      typeof value === 'object' &&
      value !== null &&
      'function' in value &&
      typeof value.function === 'object' &&
      value.function !== null &&
      'name' in value.function &&
      'arguments' in value.function &&
      typeof value.function.name === 'string' &&
      typeof value.function.arguments === 'string' &&
      'type' in value &&
      value.type === 'function'
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Agent Output and Strategy Section */}
      <section className="flex-1 w-full bg-slate-800 p-4 rounded-lg shadow-inner overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-white">Agent Output</h2>
        <ScrollArea className="flex-1 pr-4">
          {agentMessages.map((message, index) => (
            <div key={index} className="mb-4">
              {renderMessageContent(message, index)}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center mt-4">
              <Loader className="mr-2" /> <span className="text-white">Orion Agent is thinking...</span>
            </div>
          )}
          {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        </ScrollArea>
        {generatedStrategies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-white">Generated Strategies</h3>
            {generatedStrategies.map((strategy, index) => (
              <Card key={index} className="mb-3 bg-slate-700 text-white">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-300">Strategy {index + 1}:</p>
                  <p className="mt-1 text-md font-medium">{strategy.answer}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                      id={`strategy-${index}`}
                      checked={strategiesToSave.has(strategy.answer)}
                      onCheckedChange={(checked) => {
                        handleStrategySelectionChange(strategy.answer, checked as boolean);
                      }}
                    />
                    <label
                      htmlFor={`strategy-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select to save to memory
                    </label>
                    <Button
                      onClick={() => handleRefineStrategy(strategy.answer)}
                      className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Refine This Strategy
                    </Button>
                    <Button
                      onClick={() => handleExecuteStrategy(strategy.messages)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Execute This Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {strategiesToSave.size > 0 && (
              <Button onClick={handleSaveToMemory} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                Save Selected Strategies to Memory
              </Button>
            )}
          </div>
        )}
      </section>
      {/* Task Management Section */}
      <section className="w-full bg-slate-800 p-4 rounded-lg shadow-inner flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-white">Task Management</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newTaskTitle" className="text-white">
                Task Title
              </Label>
              <Input
                id="newTaskTitle"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter new task title"
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newTaskDescription" className="text-white">
                Task Description
              </Label>
              <Input
                id="newTaskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Enter task description (optional)"
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="newTaskStatus" className="text-white">
                Status
              </Label>
              <Select onValueChange={(value: TaskStatus) => setNewTaskStatus(value)} value={newTaskStatus}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white">
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newTaskPriority" className="text-white">
                Priority
              </Label>
              <Select onValueChange={(value: TaskPriority) => setNewTaskPriority(value)} value={newTaskPriority}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white">
                  {Object.values(TaskPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newTaskDueDate" className="text-white">
                Due Date (Optional)
              </Label>
              <Input
                id="newTaskDueDate"
                type="date"
                value={newTaskDueDate || ''}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="newTaskRelatedLinks" className="text-white">
              Related Links (comma-separated)
            </Label>
            <Input
              id="newTaskRelatedLinks"
              value={newTaskRelatedLinks}
              onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
              placeholder="e.g., https://example.com, https://another.link"
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newTaskRelatedPhoneNumbers" className="text-white">
              Related Phone Numbers (comma-separated)
            </Label>
            <Input
              id="newTaskRelatedPhoneNumbers"
              value={newTaskRelatedPhoneNumbers}
              onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
              placeholder="e.g., +15551234567, +442071234567"
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <Button
            onClick={handleCreateTask}
            disabled={taskLoading || !newTaskTitle.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {taskLoading ? (
              <>
                <Loader className="mr-2" /> Creating Task...
              </>
            ) : (
              'Create New Task'
            )}
          </Button>
          {taskError && <p className="text-red-500 mt-2">Error: {taskError}</p>}
        </div>
        <h3 className="text-lg font-bold mt-8 mb-4 text-white">My Tasks</h3>
        {taskLoading && <Loader className="mr-2" />}{' '}
        {taskLoading && <span className="text-white">Loading Tasks...</span>}
        {taskError && <p className="text-red-500">Error loading tasks: {taskError}</p>}
        {!taskLoading && tasks.length === 0 && <p className="text-white">No tasks found. Create one above!</p>}
        {!taskLoading && tasks.length > 0 && (
          <ScrollArea className="flex-1 h-[300px]">
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-slate-700 text-white shadow-md">
                  <CardHeader>
                    <CardTitle className="text-white flex justify-between items-center">
                      {task.title}
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="bg-slate-600 text-white">
                          {task.status.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500 text-white">
                          {task.priority.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-slate-300">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                    {task.dueDate && (
                      <p className="text-sm text-slate-300">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {task.description && <p className="text-slate-200">{task.description}</p>}
                    {task.relatedLinks && task.relatedLinks.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Related Links:</p>
                        <ul className="list-disc list-inside text-slate-200">
                          {task.relatedLinks.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {task.relatedPhoneNumbers && task.relatedPhoneNumbers.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-slate-300">Related Phone Numbers:</p>
                        <ul className="list-disc list-inside text-slate-200">
                          {task.relatedPhoneNumbers.map((phone, phoneIdx) => (
                            <li key={phoneIdx}>{phone}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        onClick={() => handleTaskSelection(task.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleEditTask(task)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
        {selectedTaskId && selectedTask && (
          <div className="mt-8 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-bold mb-4 text-white">Task Details and Steps: {selectedTask.title}</h3>
            <Button onClick={() => setSelectedTaskId(null)} className="mb-4 bg-gray-600 hover:bg-gray-700 text-white">
              Back to All Tasks
            </Button>
            <Card className="bg-slate-700 text-white shadow-md">
              <CardHeader>
                <CardTitle className="text-white">{selectedTask.title}</CardTitle>
                <p className="text-sm text-slate-300">Status: {selectedTask.status}</p>
                <p className="text-sm text-slate-300">Priority: {selectedTask.priority}</p>
                {selectedTask.dueDate && (
                  <p className="text-sm text-slate-300">Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                )}
                {selectedTask.description && (
                  <p className="text-sm text-slate-200 mt-2">Description: {selectedTask.description}</p>
                )}
                {selectedTask.relatedLinks && selectedTask.relatedLinks.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Related Links:</p>
                    <ul className="list-disc list-inside text-slate-200">
                      {selectedTask.relatedLinks.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedTask.relatedPhoneNumbers && selectedTask.relatedPhoneNumbers.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Related Phone Numbers:</p>
                    <ul className="list-disc list-inside text-slate-200">
                      {selectedTask.relatedPhoneNumbers.map((phone, phoneIdx) => (
                        <li key={phoneIdx}>{phone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <h4 className="text-lg font-semibold mb-3 text-white">Steps:</h4>
                {selectedTask.steps.length === 0 && <p className="text-slate-300">No steps for this task yet.</p>}
                <ScrollArea className="h-[200px] pr-4">
                  {selectedTask.steps.map((stepItem, stepIdx) => (
                    <Card key={stepItem.id} className="mb-3 bg-slate-800 text-white">
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
                              {stepItem.toolCalls.map((toolCall, tcIdx) => {
                                if (isLLMToolCall(toolCall)) {
                                  return (
                                    <li key={tcIdx} className="text-sm">
                                      <strong>{toolCall.function.name}</strong>({toolCall.function.arguments})
                                    </li>
                                  );
                                }
                                return null; // Handle cases where toolCall is not a valid LLMToolCall
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
              </CardContent>
            </Card>
            {editingTask && (
              <div className="mt-8 pt-4 border-t border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-white">Edit Task: {editingTask.title}</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editTaskTitle" className="text-white">
                        Task Title
                      </Label>
                      <Input
                        id="editTaskTitle"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editTaskDescription" className="text-white">
                        Task Description
                      </Label>
                      <Input
                        id="editTaskDescription"
                        value={editingTask.description || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="editTaskStatus" className="text-white">
                        Status
                      </Label>
                      <Select
                        onValueChange={(value: TaskStatus) => setEditingTask({ ...editingTask, status: value })}
                        value={editingTask.status}
                      >
                        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 text-white">
                          {Object.values(TaskStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status
                                .replace(/_/g, ' ')
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editTaskPriority" className="text-white">
                        Priority
                      </Label>
                      <Select
                        onValueChange={(value: TaskPriority) => setEditingTask({ ...editingTask, priority: value })}
                        value={editingTask.priority}
                      >
                        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 text-white">
                          {Object.values(TaskPriority).map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority
                                .replace(/_/g, ' ')
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="editTaskDueDate" className="text-white">
                        Due Date (Optional)
                      </Label>
                      <Input
                        id="editTaskDueDate"
                        type="date"
                        value={editingTask.dueDate ? editingTask.dueDate.toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, dueDate: e.target.value ? new Date(e.target.value) : null })
                        }
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="editTaskRelatedLinks" className="text-white">
                      Related Links (comma-separated)
                    </Label>
                    <Input
                      id="editTaskRelatedLinks"
                      value={(editingTask.relatedLinks || []).join(', ')}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          relatedLinks: e.target.value
                            .split(',')
                            .map((link) => link.trim())
                            .filter((link) => link),
                        })
                      }
                      placeholder="e.g., https://example.com, https://another.link"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editTaskRelatedPhoneNumbers" className="text-white">
                      Related Phone Numbers (comma-separated)
                    </Label>
                    <Input
                      id="editTaskRelatedPhoneNumbers"
                      value={(editingTask.relatedPhoneNumbers || []).join(', ')}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          relatedPhoneNumbers: e.target.value
                            .split(',')
                            .map((phone) => phone.trim())
                            .filter((phone) => phone),
                        })
                      }
                      placeholder="e.g., +15551234567, +442071234567"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateTask(editingTask.id, editingTask)}
                      disabled={taskLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {taskLoading ? (
                        <>
                          <Loader className="mr-2" /> Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button onClick={() => setEditingTask(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                      Cancel
                    </Button>
                  </div>
                  {taskError && <p className="text-red-500 mt-2">Error: {taskError}</p>}
                </div>
              </div>
            )}

            {/* Memory Visualization */}
            <section className="w-full bg-slate-800 p-4 rounded-lg shadow-inner flex flex-col mt-8">
              <h2 className="text-xl font-bold mb-4 text-white">Related Memory Chunks</h2>
              {isMemoriesLoading && <Loader className="mr-2" />}{' '}
              {isMemoriesLoading && <span className="text-white">Loading related memories...</span>}
              {memoriesError && <p className="text-red-500">Error loading memories: {memoriesError}</p>}
              {!isMemoriesLoading && relatedMemories.length === 0 && (
                <p className="text-white">No related memories found for the selected task.</p>
              )}
              {!isMemoriesLoading && relatedMemories.length > 0 && (
                <QuadrantMemoryChunksVisualizer memoryResults={relatedMemories} />
              )}
            </section>
          </div>
        )}
        {/* If shouldCreateTaskFromAgentOutput is true, show form to convert agent output to task */}
        {shouldCreateTaskFromAgentOutput && (
          <div className="mt-8 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-bold mb-4 text-white">Convert Agent Output to Task</h3>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="convertTaskTitle" className="text-white">
                  Task Title
                </Label>
                <Input
                  id="convertTaskTitle"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title from agent output"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="convertTaskDescription" className="text-white">
                  Task Description
                </Label>
                <Textarea
                  id="convertTaskDescription"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Enter task description from agent output"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="convertTaskStatus" className="text-white">
                    Status
                  </Label>
                  <Select onValueChange={(value: TaskStatus) => setNewTaskStatus(value)} value={newTaskStatus}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white">
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="convertTaskPriority" className="text-white">
                    Priority
                  </Label>
                  <Select onValueChange={(value: TaskPriority) => setNewTaskPriority(value)} value={newTaskPriority}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white">
                      {Object.values(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="convertTaskDueDate" className="text-white">
                    Due Date (Optional)
                  </Label>
                  <Input
                    id="convertTaskDueDate"
                    type="date"
                    value={newTaskDueDate || ''}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="convertTaskRelatedLinks" className="text-white">
                  Related Links (comma-separated)
                </Label>
                <Input
                  id="convertTaskRelatedLinks"
                  value={newTaskRelatedLinks}
                  onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
                  placeholder="e.g., https://example.com, https://another.link"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="convertTaskRelatedPhoneNumbers" className="text-white">
                  Related Phone Numbers (comma-separated)
                </Label>
                <Input
                  id="convertTaskRelatedPhoneNumbers"
                  value={newTaskRelatedPhoneNumbers}
                  onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
                  placeholder="e.g., +15551234567, +442071234567"
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTask}
                  disabled={taskLoading || !newTaskTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {taskLoading ? (
                    <>
                      <Loader className="mr-2" /> Creating Task...
                    </>
                  ) : (
                    'Create Task from Output'
                  )}
                </Button>
                <Button
                  onClick={() => setShouldCreateTaskFromAgentOutput(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
