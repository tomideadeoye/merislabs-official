import { NextRequest, NextResponse } from 'next/server';
import { scoreTask } from '@/lib/habitica_client';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { taskId, direction, userId, apiToken } = body;
    
    if (!taskId || !direction) {
      return NextResponse.json({ success: false, error: 'Task ID and direction are required.' }, { status: 400 });
    }

    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ success: false, error: 'Direction must be "up" or "down".' }, { status: 400 });
    }

    // Score the task in Habitica
    const result = await scoreTask(taskId, direction, userId, apiToken);
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[HABITICA_SCORE_API_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to score Habitica task.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}