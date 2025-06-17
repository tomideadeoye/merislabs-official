/**
 * GOAL: Fetch and update ideas and logs using Neon/Postgres.
 * Related: lib/database.ts, reference.md, types/ideas.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { Idea, IdeaLog } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route for fetching a specific idea and its logs
 */
export async function GET(request: NextRequest, { params }: { params: { ideaId: string } }) {
  try {
    const { ideaId } = params;

    if (!ideaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID is required',
          message: 'Idea ID is required to fetch a specific idea and its logs.',
        },
        { status: 400 }
      );
    }

    // Fetch idea
    const ideaQuery = 'SELECT * FROM ideas WHERE id = $1';
    const ideaResult = await query(ideaQuery, [ideaId]);
    const ideaRow = ideaResult.rows[0];

    if (!ideaRow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea not found',
          message: `Idea with ID ${ideaId} not found.`,
        },
        { status: 404 }
      );
    }

    // Parse idea data
    const idea: Idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      description: ideaRow.description,
      status: ideaRow.status,
      tags: Array.isArray(ideaRow.tags) ? ideaRow.tags : JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdat,
      updatedAt: ideaRow.updatedat,
      userId: ideaRow.userid,
      dueDate: ideaRow.duedate,
      priority: ideaRow.priority,
    };

    // Fetch idea logs
    const logsQuery = 'SELECT * FROM idea_logs WHERE ideaId = $1 ORDER BY timestamp ASC';
    const logsResult = await query(logsQuery, [ideaId]);
    const logs: IdeaLog[] = logsResult.rows.map((row: IdeaLog) => ({
      id: row.id,
      ideaId: row.ideaId,
      timestamp: row.timestamp,
      logType: row.logType || row.type,
      details: row.details || `Log entry of type ${row.type}`,
      action: row.action || `Logged ${row.type}`,
      type: row.type,
      content: row.content,
      author: row.author,
    }));

    return NextResponse.json({
      success: true,
      idea,
      logs,
    });
  } catch (error: unknown) {
    console.error(`Error in GET /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to fetch idea ${params.ideaId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

/**
 * API route for updating an idea
 */
export async function PUT(request: NextRequest, { params }: { params: { ideaId: string } }) {
  try {
    const { ideaId } = params;
    const body = await request.json();
    const { title, description, status, tags = [], priority, dueDate, note } = body;

    if (!ideaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID is required',
          message: 'Idea ID is required to update the idea.',
        },
        { status: 400 }
      );
    }

    // Check if idea exists
    const checkQuery = 'SELECT id FROM ideas WHERE id = $1';
    const checkResult = await query(checkQuery, [ideaId]);
    const existingIdea = checkResult.rows[0];

    if (!existingIdea) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea not found',
          message: `Idea with ID ${ideaId} not found for update.`,
        },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Update idea
    const updateQuery = `
      UPDATE ideas SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        tags = COALESCE($4, tags),
        updatedAt = $5,
        dueDate = COALESCE($6, dueDate),
        priority = COALESCE($7, priority)
      WHERE id = $8
    `;
    await query(updateQuery, [
      title,
      description,
      status,
      tags ? JSON.stringify(tags) : undefined,
      now,
      dueDate,
      priority,
      ideaId,
    ]);

    // If status was updated, create a status change log
    if (status) {
      const statusLogQuery = `
        INSERT INTO idea_logs (
          id, "ideaId", timestamp, "logType", details, action, type, content, author
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await query(statusLogQuery, [
        uuidv4(),
        ideaId,
        now,
        'status_change',
        `Status updated to: ${status}`,
        'Status Change',
        'status_change',
        `Status updated to: ${status}`,
        'Tomide',
      ]);
    }

    // If a new note was provided, add it to the logs
    if (note && typeof note === 'string' && note.trim()) {
      const noteLogQuery = `
        INSERT INTO idea_logs (
          id, "ideaId", timestamp, "logType", details, action, type, content, author
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;
      await query(noteLogQuery, [
        uuidv4(),
        ideaId,
        now,
        'note',
        note.trim(),
        'Add Note',
        'note',
        note.trim(),
        'Tomide',
      ]);
    }

    // Fetch updated idea
    const updatedIdeaQuery = 'SELECT * FROM ideas WHERE id = $1';
    const updatedIdeaResult = await query(updatedIdeaQuery, [ideaId]);
    const ideaRow = updatedIdeaResult.rows[0];

    // Parse idea data
    const updatedIdea: Idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      description: ideaRow.description,
      status: ideaRow.status,
      tags: Array.isArray(ideaRow.tags) ? ideaRow.tags : JSON.parse(ideaRow.tags || '[]'),
      createdAt: ideaRow.createdat,
      updatedAt: ideaRow.updatedat,
      userId: ideaRow.userid,
      dueDate: ideaRow.duedate,
      priority: ideaRow.priority,
    };

    return NextResponse.json({
      success: true,
      idea: updatedIdea,
    });
  } catch (error: unknown) {
    console.error(`Error in PUT /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to update idea ${params.ideaId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
