import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/habitica_client';
import type { HabiticaTask } from '@/types/habitica';
import { db } from '@/lib/database';

/**
 * API route for fetching Habitica tasks
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken, type } = await req.json();

    if (!userId || !apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Habitica User ID and API Token are required'
      }, { status: 400 });
    }

    // Fetch tasks using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const tasks = await getTasks();

    // Augment tasks with origin information
    const augmentedTasks = tasks.map((task: HabiticaTask) => {
      if (!task._id) return task;

      try {
        const stmt = db.prepare('SELECT orionSourceModule, orionSourceReferenceId, createdAt FROM habitica_task_links WHERE habiticaTaskId = ?');
        const originInfo = stmt.get(task._id);

        return originInfo ? {
          ...task,
          orionOrigin: originInfo
        } : task;
      } catch (dbError: any) {
        console.error(`Error fetching origin for task ${task._id}: ${dbError.message}`);
        return task; // Return original task if DB error
      }
    });

    return NextResponse.json({
      success: true,
      tasks: augmentedTasks
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/tasks:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
