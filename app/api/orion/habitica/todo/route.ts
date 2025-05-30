import { NextRequest, NextResponse } from 'next/server';
import { createTodo } from '@/lib/habitica_client';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, notes, date, priority, tags, userId, apiToken } = body;
    
    if (!text || typeof text !== 'string' || text.trim() === "") {
      return NextResponse.json({ success: false, error: 'Task text cannot be empty.' }, { status: 400 });
    }

    // Create todo in Habitica
    const todo = await createTodo(
      text, 
      { notes, date, priority, tags }, 
      userId, 
      apiToken
    );
    
    return NextResponse.json({ success: true, todo });
  } catch (error: any) {
    console.error('[HABITICA_TODO_API_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to create Habitica todo.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}