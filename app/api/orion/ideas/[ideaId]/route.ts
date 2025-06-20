/**
 * GOAL: Fetch and update ideas and logs using Neon/Postgres.
 * Related: lib/database.ts, reference.md, types/ideas.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { Idea, IdeaLog } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

type IdeaStatus = 'new' | 'researching' | 'developing' | 'launched' | 'abandoned' | 'raw_spark';
type IdeaLogType = 'status_change' | 'note' | 'llm_brainstorm' | 'initial_capture';

// Helper function to convert database row to Idea
const rowToIdea = (row: Record<string, unknown>): Idea => ({
  id: row.id as string,
  title: row.title as string,
  description: row.description as string,
  status: row.status as IdeaStatus,
  tags: Array.isArray(row.tags) ? row.tags : JSON.parse((row.tags as string) || '[]'),
  createdAt: row.createdat as string,
  updatedAt: row.updatedat as string,
  userId: row.userid as string,
  dueDate: row.duedate as string,
  priority: row.priority as string,
});

// Helper function to convert database row to IdeaLog
const rowToIdeaLog = (row: Record<string, unknown>): IdeaLog => ({
  id: row.id as string,
  ideaId: row.ideaId as string,
  timestamp: row.timestamp as string,
  logType: (row.logType || row.type) as IdeaLogType,
  details: (row.details || `Log entry of type ${row.type}`) as string,
  action: (row.action || `Logged ${row.type}`) as string,
  type: row.type as string,
  content: row.content as string,
  author: row.author as string,
});

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
    const ideaResult = await sql(ideaQuery, [ideaId]);
    const ideaRow = ideaResult[0] ? rowToIdea(ideaResult[0] as unknown as Record<string, unknown>) : null;

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

    // Fetch idea logs
    const logsQuery = 'SELECT * FROM idea_logs WHERE ideaId = $1 ORDER BY timestamp ASC';
    const logsResult = await sql(logsQuery, [ideaId]);
    const logs: IdeaLog[] = logsResult.map((row) => rowToIdeaLog(row as unknown as Record<string, unknown>));

    return NextResponse.json({
      success: true,
      idea: ideaRow,
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
    const checkResult = await sql(checkQuery, [ideaId]);
    const existingIdea = checkResult[0]
      ? { id: (checkResult[0] as unknown as Record<string, unknown>).id as string }
      : null;

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
    await sql(updateQuery, [
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
      await sql(statusLogQuery, [
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
      await sql(noteLogQuery, [uuidv4(), ideaId, now, 'note', note.trim(), 'Add Note', 'note', note.trim(), 'Tomide']);
    }

    // Fetch updated idea
    const updatedIdeaQuery = 'SELECT * FROM ideas WHERE id = $1';
    const updatedIdeaResult = await sql(updatedIdeaQuery, [ideaId]);
    const ideaRow = updatedIdeaResult[0] ? rowToIdea(updatedIdeaResult[0] as unknown as Record<string, unknown>) : null;

    return NextResponse.json({
      success: true,
      idea: ideaRow,
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
