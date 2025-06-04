import { NextRequest, NextResponse } from 'next/server';
import { deleteTask } from '@/lib/habitica_client';

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { userId, apiToken } = await req.json();
    const { taskId } = params;
    if (!userId || !apiToken) {
      return NextResponse.json({ success: false, error: 'Habitica User ID and API Token are required' }, { status: 400 });
    }
    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }
    console.log(`[HABITICA_DELETE_TASK] Attempting to delete task ${taskId} for user ${userId}`);
    const result = await deleteTask(taskId);
    console.log(`[HABITICA_DELETE_TASK] Deleted task ${taskId}`);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[HABITICA_DELETE_TASK_ERROR]', error.message);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete Habitica task.' }, { status: 500 });
  }
}
