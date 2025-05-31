import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';
import { cookies } from 'next/headers';

/**
 * POST handler to score a task (complete a todo)
 */
export async function POST(req: NextRequest) {
  try {
    // Get Habitica credentials from session
    const userId = cookies().get('HABITICA_USER_ID')?.value;
    const apiToken = cookies().get('HABITICA_API_TOKEN')?.value;
    
    if (!userId || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Habitica credentials not found' 
      }, { status: 401 });
    }
    
    // Create Habitica client
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Get task ID and direction from request body
    const body = await req.json();
    const { taskId, direction = 'up' } = body;
    
    // Validate required fields
    if (!taskId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task ID is required' 
      }, { status: 400 });
    }
    
    // Score task
    const result = await habiticaClient.scoreTask(taskId, direction);
    
    if (!result) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to score Habitica task' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/tasks/score:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}