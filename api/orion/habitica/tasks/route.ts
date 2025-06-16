import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/habitica_client';
import type { HabiticaTask } from '@/lib/types';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/habitica/tasks',
    timestamp: new Date().toISOString(),
  };
  try {
    logger.info('[HABITICA_TASKS][START]', logContext);

    const { userId, apiToken } = await req.json();

    // Use env vars if not provided
    const finalUserId = userId || process.env.HABITICA_USER_ID;
    const finalApiToken = apiToken || process.env.HABITICA_API_TOKEN;

    if (!finalUserId || !finalApiToken) {
      logger.warn('[HABITICA_TASKS][VALIDATION_FAIL] Missing userId or apiToken.', { ...logContext });
      return NextResponse.json(
        {
          success: false,
          error: 'Habitica User ID and API Token are required',
        },
        { status: 400 }
      );
    }

    // Fetch all tasks using the shared client
    let allTasks: HabiticaTask[] = [];
    try {
      allTasks = await getTasks(finalUserId, finalApiToken);
      logger.info('[HABITICA_TASKS][FETCHED]', {
        count: allTasks.length,
        ...logContext,
      });
    } catch (fetchErr) {
      logger.error('[HABITICA_TASKS][ERROR_FETCHING]', {
        fetchErr,
        ...logContext,
      });
      throw fetchErr;
    }

    // Filter by type if requested, else return all types
    const todos = allTasks.filter((t) => t.type === 'todo');
    const dailys = allTasks.filter((t) => t.type === 'daily');
    const habits = allTasks.filter((t) => t.type === 'habit');
    const rewards = allTasks.filter((t) => t.type === 'reward');

    logger.info('[HABITICA_TASKS][SUCCESS]', {
      ...logContext,
      todos: todos.length,
      dailys: dailys.length,
      habits: habits.length,
      rewards: rewards.length,
    });

    return NextResponse.json({
      success: true,
      data: { todos, dailys, habits, rewards },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    logger.error('[HABITICA_TASKS][ERROR_OCCURRED]', {
      error: errorMessage,
      stack: errorStack,
      ...logContext,
    });
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
