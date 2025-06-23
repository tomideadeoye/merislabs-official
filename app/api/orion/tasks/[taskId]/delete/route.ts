/**
 * @fileoverview [This API route is responsible for deleting an existing task in the Agentic Workflow system.]
 * @description [It handles incoming DELETE requests, extracts the task ID from the URL,
 *   and uses the `taskDbService` to remove the task from the database. Comprehensive logging is included for
 *   traceability and debugging. This route currently does NOT require authentication for flexibility in a
 *   personal development environment.]
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - [To provide an endpoint for deleting existing 'Task' entries.]
 *   - [To ensure a valid task ID is provided for deletion.]
 *   - [To integrate with `taskDbService` for seamless database interaction.]
 *
 * FILEPATH: `app/api/orion/tasks/[taskId]/delete/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/task_db_service.ts`: Consumes the `deleteTask` function from this service to interact with the database.
 *   - `app/lib/logger.ts`: Used for logging operational details, warnings, and errors.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This route is intended for a single-user, personal environment where explicit authentication is not strictly required.
 *   - The `taskId` from the URL parameter will correctly identify the task to be deleted.
 *   - Assumes `taskDbService.deleteTask` handles all database-level validation and error propagation effectively.
 *   - Assumes `NextRequest` and `NextResponse` are used for handling API requests and responses.
 *
 * NOTES:
 *   - All logs include operation, parameters, validation, and results for traceability and rapid debugging.
 *   - Uses a `try-catch` block for robust error handling and returns consistent JSON responses.
 *   - IMPORTANT: For production multi-user applications, re-introduce robust authentication and authorization checks.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add more specific error messages for cases like "Task not found."
 *   - Consider soft deletes (marking as deleted rather than permanent removal) for data retention policies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { taskDbService } from '@/lib/task_db_service';
import logger from '@/lib/logger';

export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
  const { taskId } = params;

  logger.info('Received request to delete a task.', {
    operation: 'DELETE /api/orion/tasks/[taskId]/delete',
    parameters: { taskId },
    sessionId: request.headers.get('x-session-id'),
  });

  // Step 1: Validate taskId.
  // Goal: Ensure a valid taskId is provided in the URL.
  // Logic: Return 400 if taskId is missing.
  if (!taskId) {
    logger.warn('Missing taskId for task deletion.', {
      operation: 'DELETE /api/orion/tasks/[taskId]/delete',
      validation: 'Invalid parameters.',
      sessionId: request.headers.get('x-session-id'),
    });
    return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
  }

  // Step 2: Delete the task using the database service.
  // Goal: Remove the task from the database.
  // Logic: Call `taskDbService.deleteTask` and handle any service-level errors, especially if task not found.
  try {
    await taskDbService.deleteTask(taskId);
    logger.info('Task deleted successfully.', {
      operation: 'DELETE /api/orion/tasks/[taskId]/delete',
      taskId: taskId,
    });
    return NextResponse.json({ success: true, message: 'Task deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    // Check if the error indicates "Record not found" for a more specific response
    const isNotFound = errorMessage.includes('Record to delete not found');
    logger.error('Failed to delete task via taskDbService.', {
      operation: 'DELETE /api/orion/tasks/[taskId]/delete',
      error: errorMessage,
      validation: isNotFound ? 'Task not found.' : 'Database service error.',
      parameters: { taskId },
    });
    return NextResponse.json(
      { success: false, error: `Failed to delete task: ${errorMessage}` },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
