import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import type { Idea, IdeaLog } from '@/types/ideas';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route for creating a new idea
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, briefDescription, tags = [], priority, dueDate } = body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Idea title is required' 
      }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    // Create new idea
    const newIdea: Idea = {
      id: uuidv4(),
      title: title.trim(),
      briefDescription: briefDescription?.trim(),
      status: 'raw_spark',
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
      dueDate,
      priority
    };
    
    // Insert idea into database
    const stmt = db.prepare(`
      INSERT INTO ideas (
        id, title, briefDescription, status, tags, 
        createdAt, updatedAt, dueDate, priority
      ) VALUES (
        @id, @title, @briefDescription, @status, @tagsJson, 
        @createdAt, @updatedAt, @dueDate, @priority
      )
    `);
    
    stmt.run({
      ...newIdea,
      tagsJson: JSON.stringify(newIdea.tags)
    });
    
    // Create initial log entry
    const initialLog: IdeaLog = {
      id: uuidv4(),
      ideaId: newIdea.id,
      timestamp: now,
      type: 'initial_capture',
      content: briefDescription || 'Initial idea captured.',
      author: 'Tomide'
    };
    
    // Insert log into database
    const logStmt = db.prepare(`
      INSERT INTO idea_logs (
        id, ideaId, timestamp, type, content, author
      ) VALUES (
        @id, @ideaId, @timestamp, @type, @content, @author
      )
    `);
    
    logStmt.run(initialLog);
    
    console.log(`[IDEAS_API] New idea created: ${newIdea.id} - ${newIdea.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Idea captured successfully!', 
      idea: newIdea 
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/ideas/create:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}