/**
 * GOAL: Create Habitica todo via API, link to Orion source, and log all actions for traceability.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/habitica_client.ts, lib/database.ts, reference.md
 */
import { createTask } from '@/lib/habitica_client';
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/database';
import logger from '@/lib/logger';
import type { HabiticaTask } from '@/lib/types';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    logger.warn('[HABITICA_TODO_API][UNAUTHORIZED] Attempt to create todo without authentication.');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, apiToken, taskData, orionSourceModule, orionSourceReferenceId } = body;

    logger.info('[HABITICA_TODO_API][REQUEST_RECEIVED]', {
      user: session.user.id,
      taskText: taskData?.text,
      orionSourceModule,
      orionSourceReferenceId,
    });

    if (!userId || !apiToken) {
      logger.warn('[HABITICA_TODO_API][VALIDATION_FAIL] Missing userId or apiToken.', {
        user: session.user.id,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Habitica User ID and API Token are required',
        },
        { status: 400 }
      );
    }

    if (!taskData || !taskData.text || typeof taskData.text !== 'string' || taskData.text.trim() === '') {
      logger.warn('[HABITICA_TODO_API][VALIDATION_FAIL] Task text cannot be empty.', {
        user: session.user.id,
        taskData: taskData,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Task text cannot be empty.',
        },
        { status: 400 }
      );
    }

    // Create todo in Habitica using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const newHabiticaTask: HabiticaTask = await createTask(
      {
        text: taskData.text,
        type: 'todo',
        notes: taskData.notes,
        priority: taskData.priority,
        tags: taskData.tags,
      },
      userId,
      apiToken
    );

    // Store the link between Habitica task and Orion source if provided
    if (newHabiticaTask && newHabiticaTask._id && orionSourceModule && orionSourceReferenceId) {
      try {
        const insertQuery = `
          INSERT INTO habitica_task_links (
            id, habiticaTaskId, orionSourceModule, orionSourceReferenceId, orionTaskText, createdAt
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [
          uuidv4(),
          newHabiticaTask._id,
          orionSourceModule,
          orionSourceReferenceId,
          taskData.text,
          new Date().toISOString(),
        ];
        await query(insertQuery, values);

        logger.info(
          `[HABITICA_TODO_API] Link saved for Habitica task ${newHabiticaTask._id} to Orion source ${orionSourceModule}:${orionSourceReferenceId}`,
          {
            habiticaTaskId: newHabiticaTask._id,
            orionSourceModule,
            orionSourceReferenceId,
          }
        );
      } catch (dbError: unknown) {
        const dbErrorMessage = dbError instanceof Error ? dbError.message : String(dbError);
        logger.error(`[HABITICA_TODO_API] Failed to save task link to Neon/Postgres: ${dbErrorMessage}`, {
          dbError,
          user: session.user.id,
          habiticaTaskId: newHabiticaTask._id,
          orionSourceModule,
          orionSourceReferenceId,
        });
        // Non-critical for task creation itself, so continue
      }
    }

    logger.success('[HABITICA_TODO_API][SUCCESS] Habitica todo created and linked.', {
      user: session.user.id,
      habiticaTaskId: newHabiticaTask._id,
      taskText: newHabiticaTask.text,
    });
    return NextResponse.json({ success: true, todo: newHabiticaTask });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    logger.error('[HABITICA_TODO_API_ERROR]', {
      error: errorMessage,
      stack: errorStack,
      user: session.user.id,
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create Habitica todo.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
