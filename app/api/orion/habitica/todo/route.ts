import { NextRequest, NextResponse } from 'next/server';
import { createTask } from '@/lib/habitica_client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
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
        const linkStmt = db.prepare(`
          INSERT INTO habitica_task_links (
            id, habiticaTaskId, orionSourceModule, orionSourceReferenceId, orionTaskText, createdAt
          ) VALUES (
            @id, @habiticaTaskId, @orionSourceModule, @orionSourceReferenceId, @orionTaskText, @createdAt
          )
        `);

        linkStmt.run({
          id: uuidv4(),
          habiticaTaskId: newHabiticaTask._id,
          orionSourceModule,
          orionSourceReferenceId,
          orionTaskText: taskData.text,
          createdAt: new Date().toISOString()
        });

        console.log(`[HABITICA_TODO_API] Link saved for Habitica task ${newHabiticaTask._id} to Orion source ${orionSourceModule}:${orionSourceReferenceId}`);
      } catch (dbError: any) {
        console.error(`[HABITICA_TODO_API] Failed to save task link to local DB: ${dbError.message}`);
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
