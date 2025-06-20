import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { scoreTask } from '@/lib/habitica_client';

// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { taskId, direction } = body;

    if (!taskId || !direction) {
      return NextResponse.json({ success: false, error: 'Task ID and direction are required.' }, { status: 400 });
    }

    if (direction !== 'up' && direction !== 'down') {
      return NextResponse.json({ success: false, error: 'Direction must be "up" or "down".' }, { status: 400 });
    }

    // Score task using the lib client
    // Note: This uses the client configured with environment variables, not the provided userId/apiToken
    const result = await scoreTask(taskId, direction);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error('[HABITICA_SCORE_API_ERROR]', error instanceof Error ? error.message : 'An unknown error occurred');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to score Habitica task.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
