/**
 * @fileoverview Zustand store for managing state related to the Agentic Workflow component.
 * @description This store centralizes the state for user input, agent messages, and other UI-related
 *   states within the Agentic Workflow, promoting better state management and reusability.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a global state for the Agentic Workflow component.
 *   - Manage `userQuery`, `agentMessages`, `isLoading`, `error`, `availableTools`, and other related states.
 *   - Offer actions to update these states consistently across the component.
 *
 * FILEPATH: `app/lib/stores/agentWorkflowStore.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/orion/admin/AgenticWorkflowComponent.tsx`: Consumes this store for its UI and logic.
 *   - `@/lib/types`: Imports relevant types like `Message`, `LLMTool`, etc.
 *   - `zustand`: The core library for state management.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `AgenticWorkflowComponent` will be refactored to use this store.
 *   - The state managed here is primarily for the UI and direct interaction with the agent.
 *
 * NOTES:
 *   - This is the first step in migrating the Agentic Workflow component's local state to Zustand.
 *   - Future improvements can include persisting parts of this state to local storage if needed.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Further categorize and break down the store if it becomes too large.
 *   - Implement persistence for states like `agentMessages` across sessions.
 *   - Add more specific actions for complex state transitions.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, LLMTool } from '@/lib/types';
import { Task } from '@prisma/client';
import { $Enums } from '@/lib/types';
import logger from '@/lib/logger';

interface AgentWorkflowState {
  userQuery: string;
  agentMessages: Message[];
  isLoading: boolean;
  error: string | null;
  availableTools: LLMTool[];
  selectedToolNames: string[];
  numStrategies: number;
  strategiesToSave: Set<string>;
  generatedStrategies: { answer: string; messages: Message[] }[];
  selectedStrategyForRefinement: string | null;
  newTaskTitle: string;
  newTaskDescription: string;
  newTaskRelatedLinks: string;
  newTaskRelatedPhoneNumbers: string;
  newTaskDueDate: string | null;
  shouldCreateTaskFromAgentOutput: boolean;
  relatedMemories: any[]; // Using any[] temporarily, will refine type later
  isMemoriesLoading: boolean;
  memoriesError: string | null;
  // New Task Management States
  tasks: Task[];
  newTaskStatus: Task['status'];
  newTaskPriority: Task['priority'];
  taskLoading: boolean;
  taskError: string | null;
  selectedTaskId: string | null;
  editingTask: Task | null;
  newTaskRelatedContactIds: string; // New state for related contact IDs
}

interface AgentWorkflowActions {
  setUserQuery: (query: string) => void;
  setAgentMessages: (messages: Message[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAvailableTools: (tools: LLMTool[]) => void;
  setSelectedToolNames: (toolNames: string[]) => void;
  setNumStrategies: (num: number) => void;
  setStrategiesToSave: (strategies: Set<string>) => void;
  setGeneratedStrategies: (strategies: { answer: string; messages: Message[] }[]) => void;
  setSelectedStrategyForRefinement: (strategy: string | null) => void;
  setNewTaskTitle: (title: string) => void;
  setNewTaskDescription: (description: string) => void;
  setNewTaskRelatedLinks: (links: string) => void;
  setNewTaskRelatedPhoneNumbers: (numbers: string) => void;
  setNewTaskDueDate: (date: string | null) => void;
  setShouldCreateTaskFromAgentOutput: (should: boolean) => void;
  setRelatedMemories: (memories: any[]) => void; // Using any[] temporarily, will refine type later
  setIsMemoriesLoading: (loading: boolean) => void;
  setMemoriesError: (error: string | null) => void;
  // New Task Management Actions
  setTasks: (tasks: Task[]) => void;
  setNewTaskStatus: (status: Task['status']) => void;
  setNewTaskPriority: (priority: Task['priority']) => void;
  setTaskLoading: (loading: boolean) => void;
  setTaskError: (error: string | null) => void;
  setSelectedTaskId: (id: string | null) => void;
  setEditingTask: (task: Task | null) => void;
  setNewTaskRelatedContactIds: (ids: string) => void; // Setter for new state
  // Reset actions
  resetAgentInteraction: () => void;
  resetTaskCreationForm: () => void;
  resetTaskStates: () => void;
}

const useAgentWorkflowStore = create<AgentWorkflowState & AgentWorkflowActions>()(
  persist(
    (set, get) => ({
      // State
      userQuery: '',
      agentMessages: [],
      isLoading: false,
      error: null,
      availableTools: [],
      selectedToolNames: [],
      numStrategies: 1,
      strategiesToSave: new Set(),
      generatedStrategies: [],
      selectedStrategyForRefinement: null,
      newTaskTitle: '',
      newTaskDescription: '',
      newTaskRelatedLinks: '',
      newTaskRelatedPhoneNumbers: '',
      newTaskDueDate: null,
      shouldCreateTaskFromAgentOutput: false,
      relatedMemories: [],
      isMemoriesLoading: false,
      memoriesError: null,
      // New Task Management States
      tasks: [],
      newTaskStatus: 'TODO',
      newTaskPriority: 'MEDIUM',
      taskLoading: false,
      taskError: null,
      selectedTaskId: null,
      editingTask: null,
      newTaskRelatedContactIds: '', // Initialize new state

      // Actions
      setUserQuery: (userQuery) => set({ userQuery }),
      setAgentMessages: (agentMessages) => set({ agentMessages }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setAvailableTools: (availableTools) => set({ availableTools }),
      setSelectedToolNames: (selectedToolNames) => set({ selectedToolNames }),
      setNumStrategies: (numStrategies) => set({ numStrategies }),
      setStrategiesToSave: (strategiesToSave) => set({ strategiesToSave }),
      setGeneratedStrategies: (generatedStrategies) => set({ generatedStrategies }),
      setSelectedStrategyForRefinement: (selectedStrategyForRefinement) => set({ selectedStrategyForRefinement }),
      setNewTaskTitle: (newTaskTitle) => set({ newTaskTitle }),
      setNewTaskDescription: (newTaskDescription) => set({ newTaskDescription }),
      setNewTaskRelatedLinks: (newTaskRelatedLinks) => set({ newTaskRelatedLinks }),
      setNewTaskRelatedPhoneNumbers: (newTaskRelatedPhoneNumbers) => set({ newTaskRelatedPhoneNumbers }),
      setNewTaskDueDate: (newTaskDueDate) => set({ newTaskDueDate }),
      setShouldCreateTaskFromAgentOutput: (shouldCreateTaskFromAgentOutput) => set({ shouldCreateTaskFromAgentOutput }),
      setRelatedMemories: (relatedMemories) => set({ relatedMemories }),
      setIsMemoriesLoading: (isMemoriesLoading) => set({ isMemoriesLoading }),
      setMemoriesError: (memoriesError) => set({ memoriesError }),
      // New Task Management Actions
      setTasks: (tasks) => set({ tasks }),
      setNewTaskStatus: (newTaskStatus) => set({ newTaskStatus }),
      setNewTaskPriority: (newTaskPriority) => set({ newTaskPriority }),
      setTaskLoading: (taskLoading) => set({ taskLoading }),
      setTaskError: (taskError) => set({ taskError }),
      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
      setEditingTask: (editingTask) => set({ editingTask }),
      setNewTaskRelatedContactIds: (newTaskRelatedContactIds) => set({ newTaskRelatedContactIds }), // Define setter

      resetAgentInteraction: () =>
        set({
          userQuery: '',
          agentMessages: [],
          isLoading: false,
          error: null,
          generatedStrategies: [],
          selectedStrategyForRefinement: null,
          strategiesToSave: new Set(),
          newTaskRelatedLinks: '',
          newTaskRelatedPhoneNumbers: '',
          newTaskDueDate: null,
          shouldCreateTaskFromAgentOutput: false,
          newTaskRelatedContactIds: '', // Clear new field on reset
        }),

      resetTaskCreationForm: () =>
        set({
          newTaskTitle: '',
          newTaskDescription: '',
          newTaskRelatedLinks: '',
          newTaskRelatedPhoneNumbers: '',
          newTaskDueDate: null,
          shouldCreateTaskFromAgentOutput: false,
        }),

      resetTaskStates: () =>
        set({
          tasks: [],
          newTaskStatus: 'TODO',
          newTaskPriority: 'MEDIUM',
          taskLoading: false,
        }),
    }),
    {
      name: 'agent-workflow-store', // unique name
      partialize: (state) => ({
        agentMessages: state.agentMessages,
        availableTools: state.availableTools,
        tasks: state.tasks,
      }),
    }
  )
);

export default useAgentWorkflowStore;
