import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';
import type { HabiticaTaskCreationParams } from '@/types/habitica';

/**
 * API route for creating a new Habitica task
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, apiToken, task } = await req.json();
    
    if (!userId || !apiToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Habitica User ID and API Token are required' 
      }, { status: 400 });
    }
    
    if (!task || !task.text || !task.type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Task text and type are required' 
      }, { status: 400 });
    }
    
    // Create Habitica client with provided credentials
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Create task
    const taskParams: HabiticaTaskCreationParams = {
      text: task.text,
      type: task.type,
      notes: task.notes,
      date: task.date,
      priority: task.priority,
      tags: task.tags
    };
    
    const createdTask = await habiticaClient.createTask(taskParams);
    
    return NextResponse.json({ 
      success: true, 
      task: createdTask 
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/habitica/tasks/create:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}