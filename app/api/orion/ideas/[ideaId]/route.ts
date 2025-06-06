/**
 * GOAL: Fetch and update ideas and logs using Neon/Postgres.
 * Related: lib/database.ts, prd.md, types/ideas.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
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
    const ideaQuery = 'SELECT * FROM ideas WHERE id = $1';
    const ideaResult = await pool.query(ideaQuery, [ideaId]);
    const ideaRow = ideaResult.rows[0];

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
      briefDescription: ideaRow.briefdescription,
      status: ideaRow.status,
      tags: Array.isArray(ideaRow.tags) ? ideaRow.tags : JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdat,
      updatedAt: ideaRow.updatedat,
      dueDate: ideaRow.duedate,
      priority: ideaRow.priority
    };

    // Fetch idea logs
    const logsQuery = 'SELECT * FROM idea_logs WHERE ideaId = $1 ORDER BY timestamp ASC';
    const logsResult = await pool.query(logsQuery, [ideaId]);
    const logs: IdeaLog[] = logsResult.rows.map((row: any) => ({
      id: row.id,
      ideaId: row.ideaid,
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
    const checkQuery = 'SELECT id FROM ideas WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [ideaId]);
    const existingIdea = checkResult.rows[0];

    if (!existingIdea) {
      return NextResponse.json({
        success: false,
        error: 'Idea not found'
      }, { status: 404 });
    }

    const now = new Date().toISOString();

    // Update idea
    const updateQuery = `
      UPDATE ideas SET
        title = COALESCE($1, title),
        briefDescription = COALESCE($2, briefDescription),
        status = COALESCE($3, status),
        tags = COALESCE($4, tags),
        updatedAt = $5,
        dueDate = COALESCE($6, dueDate),
        priority = COALESCE($7, priority)
      WHERE id = $8
    `;
    await pool.query(updateQuery, [
      title,
      briefDescription,
      status,
      tags ? JSON.stringify(tags) : undefined,
      now,
      dueDate,
      priority,
      ideaId
    ]);

    // If status was updated, create a status change log
    if (status) {
      const statusLogQuery = `
        INSERT INTO idea_logs (
          id, ideaId, timestamp, type, content, author
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(statusLogQuery, [
        uuidv4(),
        ideaId,
        now,
        'status_change',
        `Status updated to: ${status}`,
        'Tomide'
      ]);
    }

    // If a new note was provided, add it to the logs
    if (note && typeof note === 'string' && note.trim()) {
      const noteLogQuery = `
        INSERT INTO idea_logs (
          id, ideaId, timestamp, type, content, author
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await pool.query(noteLogQuery, [
        uuidv4(),
        ideaId,
        now,
        'note',
        note.trim(),
        'Tomide'
      ]);
    }

    // Fetch updated idea
    const updatedIdeaQuery = 'SELECT * FROM ideas WHERE id = $1';
    const updatedIdeaResult = await pool.query(updatedIdeaQuery, [ideaId]);
    const ideaRow = updatedIdeaResult.rows[0];

    // Parse idea data
    const updatedIdea: Idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      briefDescription: ideaRow.briefdescription,
      status: ideaRow.status,
      tags: Array.isArray(ideaRow.tags) ? ideaRow.tags : JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdat,
      updatedAt: ideaRow.updatedat,
      dueDate: ideaRow.duedate,
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
