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
import { MemoryChunk } from '@/lib/types';
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

  // Memory Visualization States
  const [relatedMemories, setRelatedMemories] = useState<ScoredMemoryPoint[]>([]);
  const [isMemoriesLoading, setIsMemoriesLoading] = useState<boolean>(false);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);

  const logContext = { component: 'AgenticWorkflowComponent', userQuery };

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
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

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
        logger.error('[AGENTIC_WORKFLOW][EXECUTE_STRATEGY][UNHANDLED_ERROR]', {
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
      };
      const response = await apiClient.post<TaskApiResponse>('/api/orion/tasks/create', taskToCreate);
      if (response.data.success && response.data.data) {
        setTasks((prev) => [...prev, response.data.data as Task]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskStatus(TaskStatus.TODO);
        setNewTaskPriority(TaskPriority.MEDIUM);
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

  const handleTaskSelection = (taskId: string) => {
    setSelectedTaskId(taskId);
    logger.info('[TASK_MANAGER][TASK_SELECTED] Task selected.', { taskId });
  };

  return (
    <>
      <section className="space-y-6 p-4 border border-gray-700 rounded-lg bg-gray-800 text-gray-100">
        <h3 className="text-xl font-semibold">Orion Agentic Workflow & Task Management</h3>

        <div className="space-y-4 border border-gray-700 rounded-lg p-4 bg-gray-900">
          <h4 className="text-lg font-semibold mb-3">Agentic Task Execution</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="userQuery" className="text-gray-300">
                Your Query
              </Label>
              <Input
                id="userQuery"
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g., 'Draft a follow-up email for the Google interview.'"
                className="bg-gray-700 border-gray-600 text-gray-50 focus:ring-purple-500 focus:border-purple-500"
                disabled={isLoading || !!selectedStrategyForRefinement}
              />
            </div>

            <div>
              <Label htmlFor="numStrategies" className="text-gray-300 flex justify-between items-center">
                <span>Number of Strategies to Generate:</span>
                <span className="font-bold text-purple-400">{numStrategies}</span>
              </Label>
              <Slider
                id="numStrategies"
                min={1}
                max={5}
                step={1}
                value={[numStrategies]}
                onValueChange={handleNumStrategiesChange}
                className="w-full mt-2"
                disabled={isLoading || !!selectedStrategyForRefinement}
              />
            </div>

            <div>
              <Label className="text-gray-300">Available Tools:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {availableTools.length > 0 ? (
                  availableTools.map((tool) => (
                    <div key={tool.function.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={tool.function.name}
                        checked={selectedToolNames.includes(tool.function.name)}
                        onCheckedChange={(checked) => handleToolSelectionChange(tool.function.name, checked as boolean)}
                        className="border-gray-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                        disabled={isLoading || !!selectedStrategyForRefinement}
                      />
                      <Label htmlFor={tool.function.name} className="text-sm font-medium text-gray-300 cursor-pointer">
                        {tool.function.name} - {tool.function.description.split('.')[0]}.
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No tools available or still loading...</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="relatedLinks" className="text-gray-300">
                Related Links (comma-separated):
              </Label>
              <Input
                id="relatedLinks"
                placeholder="e.g., https://example.com/doc1, https://example.com/doc2"
                value={newTaskRelatedLinks}
                onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
                className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="relatedPhoneNumbers" className="text-gray-300">
                Related Phone Numbers (comma-separated):
              </Label>
              <Input
                id="relatedPhoneNumbers"
                placeholder="e.g., +15551234567, 07911123456"
                value={newTaskRelatedPhoneNumbers}
                onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
                className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              disabled={isLoading || !userQuery.trim()}
            >
              {isLoading ? <Loader className="mr-2" /> : 'Execute Agent'}
            </Button>
          </form>

          {selectedStrategyForRefinement && (
            <Card className="mt-6 border-purple-700 bg-purple-900/30 text-gray-100">
              <CardHeader>
                <CardTitle className="text-purple-300">Refine Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="refinementText" className="text-gray-300">
                    Edit Strategy:
                  </Label>
                  <Textarea
                    id="refinementText"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Refine the strategy here..."
                    className="bg-gray-700 border-gray-600 text-gray-50 focus:ring-purple-500 focus:border-purple-500 min-h-[100px]"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !userQuery.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    {isLoading ? <Loader className="mr-2" /> : 'Edit & Re-evaluate'}
                  </Button>
                  <Button
                    onClick={handleCancelRefinement}
                    disabled={isLoading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  >
                    Cancel Refinement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="mt-4 border-red-700 bg-red-900/30 text-red-100">
              <CardHeader>
                <CardTitle>Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{error}</p>
              </CardContent>
            </Card>
          )}

          {agentMessages.length > 0 && generatedStrategies.length === 0 && !selectedStrategyForRefinement && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Agent Conversation:</h4>
              <ScrollArea className="h-[400px] border border-gray-700 rounded-md p-4 bg-gray-900">
                <div className="space-y-4">
                  {agentMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.role === 'assistant'
                              ? 'bg-gray-700 text-gray-100'
                              : 'bg-transparent'
                        }`}
                      >
                        {renderMessageContent(message, index)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          <Button
            onClick={handleSaveToMemory}
            disabled={strategiesToSave.size === 0 || isLoading}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Save Selected to Memory
          </Button>

          {generatedStrategies.length > 0 && !selectedStrategyForRefinement && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-200 mb-3">Proposed Strategies:</h4>
              {generatedStrategies.map((strategy, sIdx) => (
                <Card key={sIdx} className="mt-4 bg-gray-800 border-purple-700 text-gray-100">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Strategy {sIdx + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="whitespace-pre-wrap">{strategy.answer}</p>
                    <div className="flex space-x-2 mt-2">
                      {strategy.messages.some((msg) => msg.tool_calls && msg.tool_calls.length > 0) && (
                        <Button
                          onClick={() => handleExecuteStrategy(strategy.messages)}
                          disabled={isLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                        >
                          {isLoading ? <Loader className="mr-2" /> : 'Execute Strategy'}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleRefineStrategy(strategy.answer || '')}
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                      >
                        Refine
                      </Button>
                    </div>
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <h5 className="text-md font-semibold text-gray-300 mb-2">Strategy Details:</h5>
                      <ScrollArea className="h-[200px] border border-gray-600 rounded-md p-3 bg-gray-900">
                        <div className="space-y-3">
                          {strategy.messages.map((msg, msgIdx) => (
                            <div
                              key={msgIdx}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-2 rounded-lg shadow-sm ${
                                  msg.role === 'user'
                                    ? 'bg-blue-700 text-white'
                                    : msg.role === 'assistant'
                                      ? 'bg-gray-600 text-gray-100'
                                      : 'bg-transparent'
                                }`}
                              >
                                {renderMessageContent(msg, msgIdx)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 border border-gray-700 rounded-lg p-4 bg-gray-900">
          <h4 className="text-lg font-semibold mb-3">Task Management</h4>

          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-300">Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-200">Create New Task</h3>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <Input
                      placeholder="Task Title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                    />
                    <Textarea
                      placeholder="Task Description (optional)"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                      className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                    />
                    <Input
                      placeholder="Related Links (comma-separated)"
                      value={newTaskRelatedLinks}
                      onChange={(e) => setNewTaskRelatedLinks(e.target.value)}
                      className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                    />
                    <Input
                      placeholder="Related Phone Numbers (comma-separated)"
                      value={newTaskRelatedPhoneNumbers}
                      onChange={(e) => setNewTaskRelatedPhoneNumbers(e.target.value)}
                      className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
                    />
                    <Select value={newTaskStatus} onValueChange={(value) => setNewTaskStatus(value as TaskStatus)}>
                      <SelectTrigger className="bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace(/_/g, ' ').toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTaskPriority}
                      onValueChange={(value) => setNewTaskPriority(value as TaskPriority)}
                    >
                      <SelectTrigger className="bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                        {Object.values(TaskPriority).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority.replace(/_/g, ' ').toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit" disabled={taskLoading} className="w-full bg-green-600 hover:bg-green-700">
                      {taskLoading ? <Loader className="mr-2" /> : 'Create Task'}
                    </Button>
                  </form>
                  {taskError && <p className="text-red-400 mt-2">Error: {taskError}</p>}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-200">Your Tasks List</h3>
                  {taskLoading ? (
                    <Loader />
                  ) : tasks.length === 0 ? (
                    <p className="text-gray-400">No tasks found. Create one to get started!</p>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {tasks.map((task) => (
                          <Card
                            key={task.id}
                            className={`bg-gray-700 border-gray-600 cursor-pointer ${selectedTaskId === task.id ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}
                            onClick={() => handleTaskSelection(task.id)}
                          >
                            <CardContent className="p-4">
                              <CardTitle className="text-md text-white flex justify-between items-center">
                                <span>{task.title}</span>
                                <Badge
                                  variant="secondary"
                                  className={`bg-opacity-70 ${task.status === TaskStatus.DONE ? 'bg-green-500' : task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-gray-500'}`}
                                >
                                  {task.status}
                                </Badge>
                              </CardTitle>
                              <p className="text-gray-400 text-sm mt-1">{task.description || 'No description.'}</p>
                              <p className="text-gray-500 text-xs mt-2">Priority: {task.priority}</p>
                              <p className="text-gray-500 text-xs">
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex space-x-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateTask(task.id, { status: TaskStatus.DONE });
                                  }}
                                  className="text-green-400 border-green-400 hover:bg-green-900/20"
                                >
                                  Mark Done
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(task.id);
                                  }}
                                  className="text-red-400 border-red-400 hover:bg-red-900/20"
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
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedTaskId && (
            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-300">
                  Related Memories for Selected Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMemoriesLoading ? (
                  <Loader />
                ) : memoriesError ? (
                  <p className="text-red-400">Error loading memories: {memoriesError}</p>
                ) : relatedMemories.length > 0 ? (
                  <QuadrantMemoryChunksVisualizer memoryResults={relatedMemories} />
                ) : (
                  <p className="text-gray-400">No relevant memories found for this task.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
};
