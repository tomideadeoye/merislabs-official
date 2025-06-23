/**
 * @fileoverview [This API route is responsible for creating new tasks in the Agentic Workflow system.]
 * @description [It handles incoming POST requests, validates the task data,
 *   and uses the `taskDbService` to persist the new task in the database. Comprehensive logging is
 *   included for traceability and debugging. This route currently does NOT require authentication for flexibility in a personal development environment.]
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - [To provide an endpoint for creating new 'Task' entries.]
 *   - [To ensure data validation for incoming task creation requests.]
 *   - [To integrate with `taskDbService` for seamless database interaction.]
 *
 * FILEPATH: `app/api/orion/tasks/create/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/task_db_service.ts`: Consumes the `createTask` function from this service to interact with the database.
 *   - `app/lib/logger.ts`: Used for logging operational details, warnings, and errors.
 *   - `@prisma/client` (or `@/generated/prisma`): Provides `Prisma.TaskCreateInput` for type safety of request body.
 *   - `app/(orion_admin)/admin/agentic-workflow/page.tsx` (Future): This page will likely have a form that calls this API.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This route is intended for a single-user, personal environment where explicit authentication is not strictly required at the API level.
 *   - Assumes `taskDbService.createTask` handles all database-level validation and error propagation effectively.
 *   - Assumes `NextRequest` and `NextResponse` are used for handling API requests and responses.
 *
 * NOTES:
 *   - All logs include operation, parameters, validation, and results for traceability and rapid debugging.
 *   - Uses a `try-catch` block for robust error handling and returns consistent JSON responses.
 *   - IMPORTANT: For production multi-user applications, re-introduce robust authentication and authorization checks.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement `zod` schema validation for `TaskCreateInput` to provide more granular and user-friendly input validation errors.
 *   - Add rate limiting to prevent abuse.
 *   - Enhance error messages to be more specific for different failure scenarios (e.g., database connection issues vs. invalid data).
 */

import { NextRequest, NextResponse } from 'next/server';
// Removed: import { auth } from '@/auth'; // For authentication
import { taskDbService } from '@/lib/task_db_service'; // For database operations on tasks
import logger from '@/lib/logger'; // For logging
import { Prisma } from '@/generated/prisma';


export async function POST(request: NextRequest) {
  // Step 1: No authentication required as per user's request for personal project.
  logger.info('Received request to create a new task (no authentication required).', {
    operation: 'POST /api/orion/tasks/create',
    sessionId: request.headers.get('x-session-id'),
  });

  // Step 2: Parse the request body.
  // Goal: Extract the task data from the request.
  // Logic: Use `request.json()` to parse the body. Handle potential JSON parsing errors.
  let taskData: Prisma.TaskCreateInput;
  try {
    taskData = (await request.json()) as Prisma.TaskCreateInput;
    logger.debug('Request body parsed.', {
      operation: 'POST /api/orion/tasks/create',
      parameters: { taskData },
      // userId: taskData.userId, // userId will come from the taskData itself
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON body.';
    logger.error('Failed to parse request body for task creation.', {
      operation: 'POST /api/orion/tasks/create',
      error: errorMessage,
      validation: 'Invalid input format.',
      // userId: taskData?.userId, // userId might not be available yet
    });
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  // Step 3: Validate incoming task data.
  // Goal: Ensure essential task fields are present and valid, including userId.
  // Logic: Check for `title` and `userId`.
  if (!taskData || !taskData.title || !taskData.userId) {
    logger.warn('Invalid task data provided for creation.', {
      operation: 'POST /api/orion/tasks/create',
      parameters: { taskData },
      validation: 'Missing required fields (title or userId).',
      // userId: taskData?.userId, // userId might be missing
    });
    return NextResponse.json({ success: false, error: 'Invalid task data: Missing title or userId' }, { status: 400 });
  }

  // Step 4: Create the task using the database service.
  // Goal: Persist the new task in the database.
  // Logic: Call `taskDbService.createTask` and handle any service-level errors.
  try {
    const newTask = await taskDbService.createTask(taskData);
    logger.info('Task created successfully.', {
      operation: 'POST /api/orion/tasks/create',
      results: newTask,
      userId: newTask.userId,
    });
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    logger.error('Failed to create task via taskDbService.', {
      operation: 'POST /api/orion/tasks/create',
      error: errorMessage,
      validation: 'Database service error.',
      parameters: { taskData },
      userId: taskData.userId, // userId should be present here for logging
    });
    return NextResponse.json({ success: false, error: `Failed to create task: ${errorMessage}` }, { status: 500 });
  }
}
