import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';
import { cookies } from 'next/headers';
import { HabiticaTaskCreateData } from '@/types/habitica';

/**
 * GET handler for Habitica tasks
 */
export async function GET(req: NextRequest) {
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
    
    // Get task type from query params
    const url = new URL(req.url);
    const type = url.searchParams.get('type') as 'todos' | 'dailys' | 'habits' | 'rewards' | 'completedTodos' | null;
    
    // Get tasks
    const tasks = await habiticaClient.getTasks(type || undefined);
    
    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error('Error in GET /api/orion/habitica/tasks:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * POST handler to create a new todo
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
    
    // Get task data from request body
    const taskData = await req.json() as HabiticaTaskCreateData;
    
    // Validate required fields
    if (!taskData.text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task text is required' 
      }, { status: 400 });
    }
    
    // Create todo
    const task = await habiticaClient.createTodo(taskData);
    
    if (!task) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create Habitica todo' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/tasks:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}