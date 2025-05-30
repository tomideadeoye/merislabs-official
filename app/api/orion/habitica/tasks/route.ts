import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/habitica_client';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'habits' | 'dailys' | 'todos' | 'rewards' | undefined;
    
    // Get user credentials from query parameters or session
    const userId = searchParams.get('userId') || undefined;
    const apiToken = searchParams.get('apiToken') || undefined;
    
    // Fetch tasks from Habitica
    const tasks = await getTasks(type, userId, apiToken);
    
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error('[HABITICA_TASKS_API_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Habitica tasks.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}