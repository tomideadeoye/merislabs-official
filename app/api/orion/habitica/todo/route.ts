/**
 * GOAL: Create Habitica todo via API, link to Orion source, and log all actions for traceability.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/habitica_client.ts, lib/database.ts, reference.md
 */
import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
import logger from '@/lib/logger';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/habitica_client'; // Import specific functions
// import { authConfig } from '@/lib/auth';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/habitica/todo',
    timestamp: new Date().toISOString(),
    operation: 'GET',
  };
  logger.info('[HABITICA_TODO_API][GET][START] Received request to fetch Habitica todos.', logContext);

  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const habiticaUserId = process.env.HABITICA_USER_ID; // Assuming these are configured globally
    const habiticaApiToken = process.env.HABITICA_API_TOKEN;

    if (!habiticaUserId || !habiticaApiToken) {
      logger.error('[HABITICA_TODO_API][GET][CONFIG_ERROR] Habitica API credentials not configured.', logContext);
      return NextResponse.json({ success: false, error: 'Habitica API credentials not configured.' }, { status: 500 });
    }

    logger.debug('[HABITICA_TODO_API][GET][PROCESSING] Fetching todos from Habitica.', logContext);

    const allTasks = await getTasks(habiticaUserId, habiticaApiToken);
    const todos = allTasks.filter((task) => task.type === 'todo');

    logger.success('[HABITICA_TODO_API][GET][SUCCESS] Habitica todos fetched successfully.', {
      ...logContext,
      count: todos.length,
    });
    return NextResponse.json({ success: true, todos });
  } catch (error: unknown) {
    logger.error('[HABITICA_TODO_API][GET][ERROR] Failed to fetch Habitica todos.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to fetch Habitica todos.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/habitica/todo',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[HABITICA_TODO_API][POST][START] Received request to create a Habitica todo.', logContext);

  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { text, notes, priority } = await request.json();

    if (!text) {
      logger.warn('[HABITICA_TODO_API][POST][VALIDATION_FAIL] Missing text for new todo.', logContext);
      return NextResponse.json({ success: false, error: 'Todo text is required.' }, { status: 400 });
    }

    const habiticaUserId = process.env.HABITICA_USER_ID;
    const habiticaApiToken = process.env.HABITICA_API_TOKEN;

    if (!habiticaUserId || !habiticaApiToken) {
      logger.error('[HABITICA_TODO_API][POST][CONFIG_ERROR] Habitica API credentials not configured.', logContext);
      return NextResponse.json({ success: false, error: 'Habitica API credentials not configured.' }, { status: 500 });
    }

    logger.debug('[HABITICA_TODO_API][POST][PROCESSING] Creating todo in Habitica.', { ...logContext, text, priority });

    // Use createTask function directly
    const newTodo = await createTask(
      {
        text,
        type: 'todo',
        notes,
        priority,
      },
      habiticaUserId,
      habiticaApiToken
    );

    logger.success('[HABITICA_TODO_API][POST][SUCCESS] Habitica todo created successfully.', {
      ...logContext,
      todoId: newTodo._id,
    });
    return NextResponse.json({ success: true, todo: newTodo });
  } catch (error: unknown) {
    logger.error('[HABITICA_TODO_API][POST][ERROR] Failed to create Habitica todo.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to create Habitica todo.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/habitica/todo',
    timestamp: new Date().toISOString(),
    operation: 'PUT',
  };
  logger.info('[HABITICA_TODO_API][PUT][START] Received request to update a Habitica todo.', logContext);

  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      logger.warn('[HABITICA_TODO_API][PUT][VALIDATION_FAIL] Missing id or updates for todo.', logContext);
      return NextResponse.json({ success: false, error: 'Todo ID and updates are required.' }, { status: 400 });
    }

    const habiticaUserId = process.env.HABITICA_USER_ID;
    const habiticaApiToken = process.env.HABITICA_API_TOKEN;

    if (!habiticaUserId || !habiticaApiToken) {
      logger.error('[HABITICA_TODO_API][PUT][CONFIG_ERROR] Habitica API credentials not configured.', logContext);
      return NextResponse.json({ success: false, error: 'Habitica API credentials not configured.' }, { status: 500 });
    }

    logger.debug('[HABITICA_TODO_API][PUT][PROCESSING] Updating todo in Habitica.', { ...logContext, id, updates });

    // Use updateTask function directly
    const updatedTodo = await updateTask(id, updates, habiticaUserId, habiticaApiToken);

    logger.success('[HABITICA_TODO_API][PUT][SUCCESS] Habitica todo updated successfully.', {
      ...logContext,
      todoId: updatedTodo._id,
    });
    return NextResponse.json({ success: true, todo: updatedTodo });
  } catch (error: unknown) {
    logger.error('[HABITICA_TODO_API][PUT][ERROR] Failed to update Habitica todo.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to update Habitica todo.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/habitica/todo',
    timestamp: new Date().toISOString(),
    operation: 'DELETE',
  };
  logger.info('[HABITICA_TODO_API][DELETE][START] Received request to delete a Habitica todo.', logContext);

  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const { id } = await request.json();

    if (!id) {
      logger.warn('[HABITICA_TODO_API][DELETE][VALIDATION_FAIL] Missing id for todo to delete.', logContext);
      return NextResponse.json({ success: false, error: 'Todo ID is required.' }, { status: 400 });
    }

    const habiticaUserId = process.env.HABITICA_USER_ID;
    const habiticaApiToken = process.env.HABITICA_API_TOKEN;

    if (!habiticaUserId || !habiticaApiToken) {
      logger.error('[HABITICA_TODO_API][DELETE][CONFIG_ERROR] Habitica API credentials not configured.', logContext);
      return NextResponse.json({ success: false, error: 'Habitica API credentials not configured.' }, { status: 500 });
    }

    logger.debug('[HABITICA_TODO_API][DELETE][PROCESSING] Deleting todo in Habitica.', { ...logContext, id });

    // Use deleteTask function directly
    await deleteTask(id, habiticaUserId, habiticaApiToken);

    logger.success('[HABITICA_TODO_API][DELETE][SUCCESS] Habitica todo deleted successfully.', {
      ...logContext,
      todoId: id,
    });
    return NextResponse.json({ success: true, message: 'Todo deleted successfully.' });
  } catch (error: unknown) {
    logger.error('[HABITICA_TODO_API][DELETE][ERROR] Failed to delete Habitica todo.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to delete Habitica todo.' }, { status: 500 });
  }
}
