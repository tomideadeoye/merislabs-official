/**
 * @fileoverview API route for creating new tasks in the Orion internal database.
 * @description This route handles the creation of new tasks, allowing users to define
 *   various task types (e.g., TODO, DAILY, HABIT, REWARD, PROJECT, GOAL) and their
 *   associated properties like title, description, priority, and due dates.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a robust API endpoint (`POST`) for adding new tasks to Orion's internal task management system.
 *   - To support different categories of tasks, mirroring (and eventually replacing) Habitica's task types.
 *   - To ensure data integrity through request validation using Zod.
 *   - To integrate seamlessly with the Prisma `Task` model for database persistence.
 *   - To provide comprehensive logging for traceability and debugging.
 *
 * FILEPATH: `app/api/orion/tasks/create/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/prisma`: Provides the Prisma client for database interaction (`prisma.task.create`).
 *   - `@/lib/logger`: Used for structured and context-rich logging.
 *   - `@/generated/prisma`: Imports Prisma generated types like `TaskStatus`, `TaskPriority`, and `TaskType` for type safety.
 *   - `@/lib/utils/errorHandler`: Used for centralized error handling (`handleServerError`).
 *   - `app/(orion_admin)/admin/habitica/page.tsx` (or future internal task management UI): This route will be consumed by frontend components to create new tasks.
 *   - `prisma/schema.prisma`: Defines the `Task` model and `TaskType` enum that this route interacts with.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `userId` will be a hardcoded placeholder (`'unauthenticated_user'`) since authentication has been removed.
 *   - Assumes incoming request body will adhere to the `createTaskSchema` for validation.
 *   - Default values are provided for `status` and `priority` if not explicitly set in the request.
 *   - `TaskType` will default to `TODO` if not provided, allowing for flexible task creation.
 *
 * NOTES:
 *   - This file is a key component in migrating away from external task management systems (like Habitica) towards a fully integrated Orion solution.
 *   - The use of Zod for validation ensures that only well-formed data is processed and stored.
 *   - Detailed logging at each stage aids in monitoring and troubleshooting the task creation process.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **User-specific Tasks**: Once authentication is reintroduced, replace the hardcoded `userId` with the actual authenticated user's ID.
 *   - **Advanced Validation**: Implement more complex validation rules if needed (e.g., custom date formats, specific tag constraints).
 *   - **Task Relationships**: Extend the schema and this route to support relationships between tasks (e.g., parent-child tasks, dependencies).
 *   - **Frontend Integration**: Develop a dedicated UI component that leverages this API for creating and managing internal tasks, replacing the Habitica interface.
 *   - **Webhooks/Integrations**: Consider adding logic to trigger webhooks or integrate with other services upon task creation (e.g., sending notifications).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { handleServerError } from '@/lib/utils/serverErrorHandler';
import { $Enums } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Define the schema for creating a new task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required.'),
  description: z.string().optional().nullable(),
  type: z.nativeEnum($Enums.TaskType).default($Enums.TaskType.TODO),
  priority: z.nativeEnum($Enums.TaskPriority).default($Enums.TaskPriority.MEDIUM),
  status: z.nativeEnum($Enums.TaskStatus).default($Enums.TaskStatus.TODO),
  dueDate: z.string().datetime().optional().nullable(), // ISO date string
});

type CreateTaskInput = z.infer<typeof createTaskSchema>;

export async function POST(req: NextRequest) {
  const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed

  const logContext = {
    route: '/api/orion/tasks/create',
    operation: 'POST',
    timestamp: new Date().toISOString(),
    userId,
  };

  logger.info('[TASK_CREATE_API][START]', logContext);

  try {
    const body = await req.json();
    const validatedData: CreateTaskInput = createTaskSchema.parse(body);

    logger.debug('[TASK_CREATE_API][VALIDATED_DATA]', { ...logContext, validatedData });

    logger.debug('[TASK_CREATE_API][PRISMA_CREATE_DATA]', {
      ...logContext,
      prismaData: {
        id: uuidv4(),
        userId: userId,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type ?? null,
        priority: validatedData.priority,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        steps: { create: [] },
      },
    });

    const newTask = await prisma.task.create({
      data: {
        id: uuidv4(),
        userId: userId,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type ?? null,
        priority: validatedData.priority,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        steps: { create: [] },
      },
    });

    logger.success('[TASK_CREATE_API][SUCCESS]', { ...logContext, taskId: newTask.id });
    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error: unknown) {
    const handledError = handleServerError(error, logContext);
    logger.error('[TASK_CREATE_API][CATCH_ERROR]', {
      ...logContext,
      error: handledError.message,
      details: handledError.details,
    });

    if (error instanceof z.ZodError) {
      logger.warn('[TASK_CREATE_API][VALIDATION_ERROR]', { ...logContext, details: error.errors });
      return NextResponse.json(
        { success: false, error: 'Invalid input data.', details: handledError.details ?? error.errors },
        { status: 400 }
      );
    }
    logger.error('[TASK_CREATE_API][UNEXPECTED_ERROR]', { ...logContext, error: handledError.message });
    return NextResponse.json(
      { success: false, error: handledError.message },
      { status: handledError.statusCode || 500 }
    );
  }
}
