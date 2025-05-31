import { NextRequest, NextResponse } from 'next/server';
import { HabiticaApiClient } from '@/lib/habitica_client';
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
    
    // Create Habitica client with provided credentials
    const habiticaClient = new HabiticaApiClient({ userId, apiToken });
    
    // Fetch tasks
    const tasks = await habiticaClient.getTasks(type);
    
    // Augment tasks with origin information
    const augmentedTasks = tasks.map(task => {
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