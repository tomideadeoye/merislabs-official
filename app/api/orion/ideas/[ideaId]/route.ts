import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import type { Idea, IdeaLog } from '@/types/ideas';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route for fetching a specific idea and its logs
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  try {
    const { ideaId } = params;
    
    if (!ideaId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Idea ID is required' 
      }, { status: 400 });
    }
    
    // Fetch idea
    const ideaStmt = db.prepare('SELECT * FROM ideas WHERE id = ?');
    const ideaRow = ideaStmt.get(ideaId);
    
    if (!ideaRow) {
      return NextResponse.json({ 
        success: false, 
        error: 'Idea not found' 
      }, { status: 404 });
    }
    
    // Parse idea data
    const idea: Idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      briefDescription: ideaRow.briefDescription,
      status: ideaRow.status,
      tags: JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdAt,
      updatedAt: ideaRow.updatedAt,
      dueDate: ideaRow.dueDate,
      priority: ideaRow.priority
    };
    
    // Fetch idea logs
    const logsStmt = db.prepare('SELECT * FROM idea_logs WHERE ideaId = ? ORDER BY timestamp ASC');
    const logRows = logsStmt.all(ideaId);
    
    // Parse logs
    const logs: IdeaLog[] = logRows.map((row: any) => ({
      id: row.id,
      ideaId: row.ideaId,
      timestamp: row.timestamp,
      type: row.type,
      content: row.content,
      author: row.author
    }));
    
    return NextResponse.json({ 
      success: true, 
      idea,
      logs
    });
  } catch (error: any) {
    console.error(`Error in GET /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * API route for updating an idea
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  try {
    const { ideaId } = params;
    const body = await req.json();
    const { 
      title, 
      briefDescription, 
      status, 
      tags = [], 
      priority, 
      dueDate,
      note
    } = body;
    
    if (!ideaId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Idea ID is required' 
      }, { status: 400 });
    }
    
    // Check if idea exists
    const checkStmt = db.prepare('SELECT id FROM ideas WHERE id = ?');
    const existingIdea = checkStmt.get(ideaId);
    
    if (!existingIdea) {
      return NextResponse.json({ 
        success: false, 
        error: 'Idea not found' 
      }, { status: 404 });
    }
    
    const now = new Date().toISOString();
    
    // Update idea
    const updateStmt = db.prepare(`
      UPDATE ideas SET
        title = COALESCE(@title, title),
        briefDescription = COALESCE(@briefDescription, briefDescription),
        status = COALESCE(@status, status),
        tags = COALESCE(@tagsJson, tags),
        updatedAt = @updatedAt,
        dueDate = COALESCE(@dueDate, dueDate),
        priority = COALESCE(@priority, priority)
      WHERE id = @id
    `);
    
    updateStmt.run({
      id: ideaId,
      title,
      briefDescription,
      status,
      tagsJson: tags ? JSON.stringify(tags) : undefined,
      updatedAt: now,
      dueDate,
      priority
    });
    
    // If status was updated, create a status change log
    if (status) {
      const statusLogStmt = db.prepare(`
        INSERT INTO idea_logs (
          id, ideaId, timestamp, type, content, author
        ) VALUES (
          @id, @ideaId, @timestamp, @type, @content, @author
        )
      `);
      
      statusLogStmt.run({
        id: uuidv4(),
        ideaId,
        timestamp: now,
        type: 'status_change',
        content: `Status updated to: ${status}`,
        author: 'Tomide'
      });
    }
    
    // If a new note was provided, add it to the logs
    if (note && typeof note === 'string' && note.trim()) {
      const noteLogStmt = db.prepare(`
        INSERT INTO idea_logs (
          id, ideaId, timestamp, type, content, author
        ) VALUES (
          @id, @ideaId, @timestamp, @type, @content, @author
        )
      `);
      
      noteLogStmt.run({
        id: uuidv4(),
        ideaId,
        timestamp: now,
        type: 'note',
        content: note.trim(),
        author: 'Tomide'
      });
    }
    
    // Fetch updated idea
    const ideaStmt = db.prepare('SELECT * FROM ideas WHERE id = ?');
    const ideaRow = ideaStmt.get(ideaId);
    
    // Parse idea data
    const updatedIdea: Idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      briefDescription: ideaRow.briefDescription,
      status: ideaRow.status,
      tags: JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdAt,
      updatedAt: ideaRow.updatedAt,
      dueDate: ideaRow.dueDate,
      priority: ideaRow.priority
    };
    
    return NextResponse.json({ 
      success: true, 
      message: 'Idea updated successfully!', 
      idea: updatedIdea 
    });
  } catch (error: any) {
    console.error(`Error in PUT /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}