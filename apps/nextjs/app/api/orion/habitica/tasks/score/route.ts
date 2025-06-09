import { NextRequest, NextResponse } from 'next/server';
import { scoreTask } from '@shared/lib/habitica_client';

/**
 * API route for scoring a Habitica task (marking as complete/incomplete)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken, taskId, direction } = await req.json();

    if (!userId || !apiToken) {
      return NextResponse.json({
        success: false,
        error: 'Habitica User ID and API Token are required'
      }, { status: 400 });
    }

    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID is required'
      }, { status: 400 });
    }

    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({
        success: false,
        error: 'Direction must be either "up" or "down"'
      }, { status: 400 });
    }

    // Score task using the shared client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const result = await scoreTask(taskId, direction);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/tasks/score:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
