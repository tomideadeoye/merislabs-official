/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview [This file provides a centralized service for all database operations related to the Agentic Workflow's Task and TaskStep models.]
 * @description [It encapsulates Prisma client interactions for creating, listing, retrieving, and updating tasks and their sequential steps. This separation of concerns ensures clean, reusable, and testable database logic.]
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - [Provide CRUD operations for the 'Task' model.]
 *   - [Provide functionality to add and update 'TaskStep' entries, forming a decision history for each task.]
 *   - [Ensure consistent data handling and error management for task-related database operations.]
 *
 * FILEPATH: `app/lib/task_db_service.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `prisma/schema.prisma`: Defines the 'Task' and 'TaskStep' models used by this service.
 *   - `app/api/orion/tasks/.../route.ts`: API routes will consume these functions to interact with the task database.
 *   - `app/lib/prisma.ts`: Imports the Prisma client instance for database access.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - [Assumes the Prisma client (`@/lib/prisma`) is correctly initialized and connected to the database.]
 *   - [Assumes the 'Task' and 'TaskStep' models exist in the Prisma schema and have been migrated to the database.]
 *   - [The `addStepToTask` function automatically increments `stepNumber` based on the latest existing step for a given task.]
 *
 * NOTES:
 *   - [This service is designed to be the single source of truth for all task database operations, promoting the DRY principle.]
 *   - [COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE]: No immediate consolidation opportunities, but it adheres to the pattern of other `_db_service.ts` files.
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider adding indexing to `taskId` and `stepNumber` in `prisma/schema.prisma` if performance issues arise with large numbers of steps.
 *   - [ERROR HANDLING ROBUSTNESS]: Basic error handling is present, but could be enhanced with more specific error types or retry logic for production use.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - [Implement pagination or advanced filtering for `listTasks` for better performance with many tasks.]
 *   - [Add soft delete functionality for tasks instead of hard deletion.]
 *   - [Introduce more granular logging within each function for detailed operation tracing.]
 */
import { prisma } from '@/lib/prisma';
import { Prisma, Task, TaskStep } from '@prisma/client';
import logger from './logger';

// DRY enum conversion helper
function toEnum<T>(enumObj: Record<string, string>, value: string | null | undefined): T | undefined {
  if (!value) return undefined;
  if (Object.values(enumObj).includes(value)) {
    return value as T;
  }
  return undefined;
}

export const taskDbService = {
  /**
   * Creates a new task in the database.
   * @param data The data for the new task.
   * @returns The created Task object.
   */
  createTask: async (data: Prisma.TaskCreateInput): Promise<Task> => {
    logger.info('Attempting to create a new task.', {
      operation: 'createTask',
      parameters: data,
      userId: data.userId,
    });
    try {
      const newTask = await prisma.task.create({ data });
      logger.info('Successfully created a new task.', {
        operation: 'createTask',
        results: newTask,
        userId: newTask.userId,
      });
      return newTask;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to create task.', {
        operation: 'createTask',
        parameters: { data },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to create task: ${errorMessage}`);
    }
  },

  /**
   * Retrieves a task by its ID, including all its steps as a tree (threaded replies).
   * @param taskId The ID of the task.
   * @returns The Task object with its steps as a tree, or null if not found.
   */
  getTaskWithSteps: async (taskId: string): Promise<(Task & { steps: TaskStep[] }) | null> => {
    logger.info('Attempting to retrieve task with steps (threaded).', {
      operation: 'getTaskWithSteps',
      parameters: { taskId },
    });
    try {
      // Fetch all steps for the task, including parentStepId
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' },
            include: { replies: true },
          },
        },
      });
      if (!task) {
        logger.warn('Task with steps not found.', {
          operation: 'getTaskWithSteps',
          parameters: { taskId },
          validation: 'No record found.',
        });
        return null;
      }
      // Build a tree of steps
      const stepMap: Record<string, any> = {};
      task.steps.forEach((step) => {
        step.replies = [];
        stepMap[step.id] = step;
      });
      const rootSteps: any[] = [];
      task.steps.forEach((step) => {
        if (step.parentStepId) {
          if (stepMap[step.parentStepId]) {
            stepMap[step.parentStepId].replies.push(step);
          }
        } else {
          rootSteps.push(step);
        }
      });
      logger.info('Task with threaded steps retrieved successfully.', {
        operation: 'getTaskWithSteps',
        taskId: task.id,
        rootStepCount: rootSteps.length,
      });
      return { ...task, steps: rootSteps };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to retrieve task with steps (threaded).', {
        operation: 'getTaskWithSteps',
        parameters: { taskId },
        error: errorMessage,
        validation: 'Database read error.',
      });
      throw new Error(`Failed to retrieve task with steps: ${errorMessage}`);
    }
  },

  /**
   * Adds a new step to an existing task, supporting threaded replies via parentStepId.
   * @param taskId The ID of the task to add the step to.
   * @param stepData The data for the new step (prompt, generated options, tool calls, parentStepId).
   * @returns The updated Task object with the new step.
   */
  addStepToTask: async (
    taskId: string,
    stepData: Omit<Prisma.TaskStepCreateInput, 'task' | 'stepNumber'> & { parentStepId?: string }
  ): Promise<Task & { steps: TaskStep[] }> => {
    logger.info('Attempting to add step to task (threaded).', {
      operation: 'addStepToTask',
      parameters: { taskId, stepData },
    });
    try {
      const stepCount = await prisma.taskStep.count({ where: { taskId } });
      // Prepare data for create, omitting parentStepId if not set
      const { parentStepId, ...restStepData } = stepData;
      const createData: any = {
        ...restStepData,
        task: { connect: { id: taskId } },
        stepNumber: stepCount + 1,
      };
      if (parentStepId) {
        createData.parentStepId = parentStepId;
      }
      const createdStep = await prisma.taskStep.create({
        data: createData,
      });
      logger.info('Step added to task successfully (threaded).', {
        operation: 'addStepToTask',
        taskId,
        createdStepId: createdStep.id,
        parentStepId: createdStep.parentStepId,
      });
      // Return the updated task with threaded steps
      return (await taskDbService.getTaskWithSteps(taskId)) as Task & { steps: TaskStep[] };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to add step to task (threaded).', {
        operation: 'addStepToTask',
        parameters: { taskId, stepData },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to add step to task: ${errorMessage}`);
    }
  },

  /**
   * Updates an existing task.
   * @param taskId The ID of the task to update.
   * @param data The data to update the task with.
   * @returns The updated Task object.
   */
  updateTask: async (taskId: string, data: Prisma.TaskUpdateInput): Promise<Task> => {
    logger.info('Attempting to update task.', {
      operation: 'updateTask',
      parameters: { taskId, ...data },
    });
    try {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data,
      });
      logger.info('Task updated successfully.', {
        operation: 'updateTask',
        results: updatedTask,
        taskId: updatedTask.id,
      });
      return updatedTask;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to update task.', {
        operation: 'updateTask',
        parameters: { taskId, data },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to update task: ${errorMessage}`);
    }
  },

  /**
   * Deletes a task by its ID.
   * @param taskId The ID of the task to delete.
   * @returns The deleted Task object.
   */
  deleteTask: async (taskId: string): Promise<Task> => {
    logger.info('Attempting to delete task.', { operation: 'deleteTask', parameters: { taskId } });
    try {
      const deletedTask = await prisma.task.delete({ where: { id: taskId } });
      logger.info('Task deleted successfully.', {
        operation: 'deleteTask',
        results: deletedTask,
        taskId: deletedTask.id,
      });
      return deletedTask;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to delete task.', {
        operation: 'deleteTask',
        parameters: { taskId },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to delete task: ${errorMessage}`);
    }
  },

  /**
   * Retrieves all tasks in the database (no user filtering).
   * @returns An array of Task objects.
   */
  getAllTasks: async (): Promise<Task[]> => {
    logger.info('Attempting to retrieve all tasks (no user filter).', {
      operation: 'getAllTasks',
    });
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc', // Order by creation date, newest first
        },
      });
      logger.info('All tasks retrieved successfully.', {
        operation: 'getAllTasks',
        resultsCount: tasks.length,
      });
      return tasks;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to retrieve all tasks.', {
        operation: 'getAllTasks',
        error: errorMessage,
        validation: 'Database read error.',
      });
      throw new Error(`Failed to retrieve all tasks: ${errorMessage}`);
    }
  },
};
