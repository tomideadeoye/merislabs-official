import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import logger from '@/lib/logger';
import { Task, TaskStatus, TaskPriority, TaskType } from '@/lib/types';

export function useTasks() {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      logger.info('[useTasks][FETCH][START] Fetching tasks from API.');
      const res = await fetch('/api/orion/tasks/list');
      const data = await res.json();
      if (!data.success) {
        logger.error('[useTasks][FETCH][ERROR] Failed to fetch tasks.', { error: data.error });
        throw new Error(data.error || 'Failed to fetch tasks');
      }
      logger.info('[useTasks][FETCH][SUCCESS] Tasks fetched.', { count: data.data.length });
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const addTask = useMutation({
    mutationFn: async (task) => {
      logger.info('[useTasks][ADD][START] Adding new task.', { task });
      const res = await fetch('/api/orion/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (!data.success) {
        logger.error('[useTasks][ADD][ERROR] Failed to add task.', { error: data.error });
        throw new Error(data.error || 'Failed to add task');
      }
      logger.info('[useTasks][ADD][SUCCESS] Task added.', { task: data.data });
      return data.data;
    },
    onMutate: async (newTask: Partial<Task>) => {
      logger.info('[useTasks][ADD][ON_MUTATE] Optimistically adding task.', { newTask });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      const optimisticTask: Task = {
        ...(typeof newTask === 'object' && newTask ? newTask : {}),
        id: 'optimistic-' + Date.now(),
        userId: '',
        title: newTask && typeof newTask === 'object' && 'title' in newTask && newTask.title ? newTask.title : '',
        status:
          newTask && typeof newTask === 'object' && 'status' in newTask && newTask.status
            ? newTask.status
            : TaskStatus.TODO,
        priority:
          newTask && typeof newTask === 'object' && 'priority' in newTask && newTask.priority
            ? newTask.priority
            : TaskPriority.MEDIUM,
        type:
          newTask && typeof newTask === 'object' && 'type' in newTask && newTask.type ? newTask.type : TaskType.TODO,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [],
        relatedLinks: [],
        relatedPhoneNumbers: [],
      };
      queryClient.setQueryData(['tasks'], (old: unknown) => {
        const arr = Array.isArray(old) ? old.filter((t): t is Task => !!t && typeof t === 'object' && 'id' in t) : [];
        return [...arr, optimisticTask];
      });
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      logger.error('[useTasks][ADD][ON_ERROR] Reverting optimistic add.', { err, newTask });
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      logger.info('[useTasks][ADD][ON_SETTLED] Invalidating tasks query.');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (task) => {
      logger.info('[useTasks][UPDATE][START] Updating task.', { task });
      const res = await fetch(`/api/orion/tasks/${task.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (!data.success) {
        logger.error('[useTasks][UPDATE][ERROR] Failed to update task.', { error: data.error });
        throw new Error(data.error || 'Failed to update task');
      }
      logger.info('[useTasks][UPDATE][SUCCESS] Task updated.', { task: data.data });
      return data.data;
    },
    onMutate: async (updatedTask: Partial<Task>) => {
      logger.info('[useTasks][UPDATE][ON_MUTATE] Optimistically updating task.', { updatedTask });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: unknown) => {
        const arr = Array.isArray(old) ? old.filter((t): t is Task => !!t && typeof t === 'object' && 'id' in t) : [];
        return arr.map((task: Task) => (task.id === updatedTask.id ? ({ ...task, ...updatedTask } as Task) : task));
      });
      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      logger.error('[useTasks][UPDATE][ON_ERROR] Reverting optimistic update.', { err, updatedTask });
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      logger.info('[useTasks][UPDATE][ON_SETTLED] Invalidating tasks query.');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId) => {
      logger.info('[useTasks][DELETE][START] Deleting task.', { taskId });
      const res = await fetch(`/api/orion/tasks/${taskId}/delete`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) {
        logger.error('[useTasks][DELETE][ERROR] Failed to delete task.', { error: data.error });
        throw new Error(data.error || 'Failed to delete task');
      }
      logger.info('[useTasks][DELETE][SUCCESS] Task deleted.', { taskId });
      return taskId;
    },
    onMutate: async (taskId) => {
      logger.info('[useTasks][DELETE][ON_MUTATE] Optimistically deleting task.', { taskId });
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: unknown) => {
        const arr = Array.isArray(old) ? old.filter((t): t is Task => !!t && typeof t === 'object' && 'id' in t) : [];
        return typeof taskId === 'string' ? arr.filter((task: Task) => task.id !== taskId) : arr;
      });
      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      logger.error('[useTasks][DELETE][ON_ERROR] Reverting optimistic delete.', { err, taskId });
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      logger.info('[useTasks][DELETE][ON_SETTLED] Invalidating tasks query.');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { tasks, isLoading, error, addTask, updateTask, deleteTask };
}
