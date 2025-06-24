/**
 * @fileoverview Centralized Zustand store for all Orion task state and logic.
 * @description This file defines the single source of truth for all task data, including the task list, loading/error state, and CRUD actions (fetch, add, update, delete) with robust, context-rich logging. It replaces React Query for task management, enabling instant, optimistic UI updates and full traceability.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Centralize all task state and logic in a single Zustand store.
 *   - Provide robust CRUD actions with optimistic updates and error handling.
 *   - Enable copious, context-rich logging for every operation.
 *   - Support instant UI updates and background server sync.
 *
 * FILEPATH: app/lib/stores/tasksStore.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumed by all components and hooks that need task data or actions.
 *   - Replaces useTasks.ts for state management.
 *   - Uses '@/lib/logger' for logging.
 *   - Interacts with /api/orion/tasks/* endpoints for server sync.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes all API endpoints are operational and return { success, data, error } shape.
 *   - All state transitions are logged for traceability.
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: All task-related hooks/components should use this store.
 *   - PERFORMANCE OPTIMIZATIONS: Optimistic updates, background sync.
 *   - ERROR HANDLING ROBUSTNESS: All errors are logged and surfaced in state.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add background revalidation (interval or React Query integration).
 *   - Add granular loading states per action.
 *   - Add undo/redo for task actions.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import logger from '@/lib/logger';
import { Task, TaskStatus, TaskPriority, TaskType } from '@/lib/types';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>()(
  devtools((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,

    async fetchTasks() {
      set({ isLoading: true, error: null });
      logger.info('[tasksStore][FETCH][START] Fetching tasks from API.');
      try {
        const res = await fetch('/api/orion/tasks/list');
        const data = await res.json();
        if (!data.success) {
          logger.error('[tasksStore][FETCH][ERROR] Failed to fetch tasks.', { error: data.error });
          set({ error: data.error || 'Failed to fetch tasks', isLoading: false });
          return;
        }
        logger.info('[tasksStore][FETCH][SUCCESS] Tasks fetched.', { count: data.data.length });
        set({ tasks: data.data, isLoading: false, error: null });
      } catch (err: any) {
        logger.error('[tasksStore][FETCH][EXCEPTION] Exception fetching tasks.', { error: err?.message || err });
        set({ error: err?.message || 'Failed to fetch tasks', isLoading: false });
      }
    },

    async addTask(task: Partial<Task>) {
      logger.info('[tasksStore][ADD][START] Adding new task.', { task });
      // Optimistic update
      const optimisticTask: Task = {
        ...(typeof task === 'object' && task ? task : {}),
        id: 'optimistic-' + Date.now(),
        userId: '',
        title: task && typeof task === 'object' && 'title' in task && task.title ? task.title : '',
        status: task && typeof task === 'object' && 'status' in task && task.status ? task.status : TaskStatus.TODO,
        priority:
          task && typeof task === 'object' && 'priority' in task && task.priority ? task.priority : TaskPriority.MEDIUM,
        type: task && typeof task === 'object' && 'type' in task && task.type ? task.type : TaskType.TODO,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        relatedLinks: [],
        relatedPhoneNumbers: [],
      };
      set((state: TasksState) => ({ tasks: [...state.tasks, optimisticTask] }));
      try {
        const res = await fetch('/api/orion/tasks/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        const data = await res.json();
        if (!data.success) {
          logger.error('[tasksStore][ADD][ERROR] Failed to add task.', { error: data.error });
          set((state: TasksState) => ({
            tasks: state.tasks.filter((t: Task) => t.id !== optimisticTask.id),
            error: data.error || 'Failed to add task',
          }));
          return;
        }
        logger.info('[tasksStore][ADD][SUCCESS] Task added.', { task: data.data });
        set((state: TasksState) => ({
          tasks: [...state.tasks.filter((t: Task) => t.id !== optimisticTask.id), data.data],
          error: null,
        }));
      } catch (err: any) {
        logger.error('[tasksStore][ADD][EXCEPTION] Exception adding task.', { error: err?.message || err });
        set((state: TasksState) => ({
          tasks: state.tasks.filter((t: Task) => t.id !== optimisticTask.id),
          error: err?.message || 'Failed to add task',
        }));
      }
    },

    async updateTask(task: Partial<Task>) {
      logger.info('[tasksStore][UPDATE][START] Updating task.', { task });
      const prevTasks = get().tasks;
      set((state: TasksState) => ({
        tasks: state.tasks.map((t: Task) => (t.id === task.id ? { ...t, ...task } : t)),
      }));
      try {
        const res = await fetch(`/api/orion/tasks/${task.id}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        const data = await res.json();
        if (!data.success) {
          logger.error('[tasksStore][UPDATE][ERROR] Failed to update task.', { error: data.error });
          set({ tasks: prevTasks, error: data.error || 'Failed to update task' });
          return;
        }
        logger.info('[tasksStore][UPDATE][SUCCESS] Task updated.', { task: data.data });
        set((state: TasksState) => ({
          tasks: state.tasks.map((t: Task) => (t.id === data.data.id ? data.data : t)),
          error: null,
        }));
      } catch (err: any) {
        logger.error('[tasksStore][UPDATE][EXCEPTION] Exception updating task.', { error: err?.message || err });
        set({ tasks: prevTasks, error: err?.message || 'Failed to update task' });
      }
    },

    async deleteTask(taskId: string) {
      logger.info('[tasksStore][DELETE][START] Deleting task.', { taskId });
      const prevTasks = get().tasks;
      set((state: TasksState) => ({ tasks: state.tasks.filter((t: Task) => t.id !== taskId) }));
      try {
        const res = await fetch(`/api/orion/tasks/${taskId}/delete`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!data.success) {
          logger.error('[tasksStore][DELETE][ERROR] Failed to delete task.', { error: data.error });
          set({ tasks: prevTasks, error: data.error || 'Failed to delete task' });
          return;
        }
        logger.info('[tasksStore][DELETE][SUCCESS] Task deleted.', { taskId });
        set((state: TasksState) => ({ error: null }));
      } catch (err: any) {
        logger.error('[tasksStore][DELETE][EXCEPTION] Exception deleting task.', { error: err?.message || err });
        set({ tasks: prevTasks, error: err?.message || 'Failed to delete task' });
      }
    },
  }))
);
