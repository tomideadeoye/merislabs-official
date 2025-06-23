/**
 * @fileoverview [This API route is responsible for updating an existing task in the Agentic Workflow system.]
 * @description [It handles incoming PUT requests, extracts the task ID from the URL, validates the update data,
 *   and uses the `taskDbService` to update the task in the database. Comprehensive logging is included for
 *   traceability and debugging. This route currently does NOT require authentication for flexibility in a
 *   personal development environment.]
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - [To provide an endpoint for updating existing 'Task' entries.]
 *   - [To ensure data validation for incoming task update requests.]
 *   - [To integrate with `taskDbService` for seamless database interaction.]
 *
 * FILEPATH: `app/api/orion/tasks/[taskId]/update/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/task_db_service.ts`: Consumes the `updateTask` function from this service to interact with the database.
 *   - `app/lib/logger.ts`: Used for logging operational details, warnings, and errors.
 *   - `@prisma/client` (or `@/generated/prisma`): Provides `Prisma.TaskUpdateInput` for type safety of request body.
 *   - `app/(orion_admin)/admin/agentic-workflow/page.tsx` (Future): This page will likely allow updating tasks.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This route is intended for a single-user, personal environment where explicit authentication is not strictly required.
 *   - The `taskId` from the URL parameter will correctly identify the task to be updated.
 *   - Assumes `taskDbService.updateTask` handles all database-level validation and error propagation effectively.
 *   - Assumes `NextRequest` and `NextResponse` are used for handling API requests and responses.
 *
 * NOTES:
 *   - All logs include operation, parameters, validation, and results for traceability and rapid debugging.
 *   - Uses a `try-catch` block for robust error handling and returns consistent JSON responses.
 *   - IMPORTANT: For production multi-user applications, re-introduce robust authentication and authorization checks.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement `zod` schema validation for `TaskUpdateInput` to provide more granular and user-friendly input validation errors.
 *   - Add more specific error messages for cases like "Task not found."
 *   - Consider partial updates using `PATCH` method if only specific fields are often updated.
 */

import { NextRequest, NextResponse } from 'next/server';
import { taskDbService } from '@/lib/task_db_service'; // For database operations on tasks
import logger from '@/lib/logger'; // For logging
import { Prisma } from '@/generated/prisma'; // For Prisma types, specifically TaskUpdateInput

export async function PUT(request: NextRequest, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  logger.info('Received request to update a task.', {
    operation: 'PUT /api/orion/tasks/[taskId]/update',
    parameters: { taskId },
    sessionId: request.headers.get('x-session-id'),
  });

  // Step 1: Validate taskId.
  // Goal: Ensure a valid taskId is provided in the URL.
  // Logic: Return 400 if taskId is missing.
  if (!taskId) {
    logger.warn('Missing taskId for task update.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      validation: 'Invalid parameters.',
      sessionId: request.headers.get('x-session-id'),
    });
    return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
  }

  // Step 2: Parse the request body.
  // Goal: Extract the task update data from the request.
  // Logic: Use `request.json()` to parse the body. Handle potential JSON parsing errors.
  let taskUpdateData: Prisma.TaskUpdateInput;
  try {
    taskUpdateData = (await request.json()) as Prisma.TaskUpdateInput;
    logger.debug('Request body parsed for task update.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      parameters: { taskId, taskUpdateData },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON body.';
    logger.error('Failed to parse request body for task update.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      error: errorMessage,
      validation: 'Invalid input format.',
      parameters: { taskId },
    });
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  // Step 3: Ensure some data is provided for update.
  // Goal: Prevent empty update operations.
  // Logic: If the parsed data object is empty, return a 400.
  if (Object.keys(taskUpdateData).length === 0) {
    logger.warn('Empty update data provided for task.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      parameters: { taskId, taskUpdateData },
      validation: 'No update data provided.',
    });
    return NextResponse.json({ success: false, error: 'No update data provided' }, { status: 400 });
  }

  // Step 4: Update the task using the database service.
  // Goal: Persist the task changes in the database.
  // Logic: Call `taskDbService.updateTask` and handle any service-level errors, especially if task not found.
  try {
    const updatedTask = await taskDbService.updateTask(taskId, taskUpdateData);
    logger.info('Task updated successfully.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      results: updatedTask,
      taskId: updatedTask.id,
    });
    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    // Check if the error indicates "Record not found" for a more specific response
    const isNotFound = errorMessage.includes('Record to update not found');
    logger.error('Failed to update task via taskDbService.', {
      operation: 'PUT /api/orion/tasks/[taskId]/update',
      error: errorMessage,
      validation: isNotFound ? 'Task not found.' : 'Database service error.',
      parameters: { taskId, taskUpdateData },
    });
    return NextResponse.json(
      { success: false, error: `Failed to update task: ${errorMessage}` },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
