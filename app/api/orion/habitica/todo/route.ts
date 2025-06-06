/**
 * GOAL: Create Habitica todo via API, link to Orion source, and log all actions for traceability.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/habitica_client.ts, lib/database.ts, prd.md
 */
import { NextRequest, NextResponse } from 'next/server';
import { createTask } from '@/lib/habitica_client';
import { auth } from '@/auth';
import { pool } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      userId,
      apiToken,
      taskData,
      orionSourceModule,
      orionSourceReferenceId
    } = body;

    if (!userId || !apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Habitica User ID and API Token are required'
      }, { status: 400 });
    }

    if (!taskData || !taskData.text || typeof taskData.text !== 'string' || taskData.text.trim() === "") {
      return NextResponse.json({
        success: false,
        error: 'Task text cannot be empty.'
      }, { status: 400 });
    }

    // Create todo in Habitica using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const newHabiticaTask = await createTask({
      text: taskData.text,
      type: 'todo',
      notes: taskData.notes,
      priority: taskData.priority,
      tags: taskData.tags
    });

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
          new Date().toISOString()
        ];
        await pool.query(insertQuery, values);

        console.info(`[HABITICA_TODO_API] Link saved for Habitica task ${newHabiticaTask._id} to Orion source ${orionSourceModule}:${orionSourceReferenceId}`);
      } catch (dbError: any) {
        console.error(`[HABITICA_TODO_API] Failed to save task link to Neon/Postgres: ${dbError.message}`);
        // Non-critical for task creation itself, so continue
      }
    }

    return NextResponse.json({ success: true, todo: newHabiticaTask });
  } catch (error: any) {
    console.error('[HABITICA_TODO_API_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to create Habitica todo.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
