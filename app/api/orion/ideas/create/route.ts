/**
 * GOAL: API route for creating a new idea in Orion, using Neon/Postgres for cloud scalability, reliability, and auditability.
 * - Persists new ideas and logs to the central Postgres DB.
 * - Absurdly comprehensive logging for every step, with context and error details.
 * - Connects to: lib/database.ts (Postgres pool), types/ideas.d.ts, prd.md (feature doc), tests/e2e.test.ts (tests)
 * - All features preserved from SQLite version, now with improved error handling and observability.
 */

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import type { Idea, IdeaLog } from '@/types/ideas';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const logContext = { route: '/api/orion/ideas/create', timestamp: new Date().toISOString() };
  try {
    console.info('[IDEAS_CREATE][START]', logContext);

    const body = await req.json();
    const { title, briefDescription, tags = [], priority, dueDate } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.warn('[IDEAS_CREATE][VALIDATION_FAIL] Missing or invalid title.', { ...logContext, body });
      return NextResponse.json(
        { success: false, error: 'Idea title is required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Construct new idea object
    const newIdea: Idea = {
      id: uuidv4(),
      title: title.trim(),
      briefDescription: briefDescription?.trim(),
      status: 'raw_spark',
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
      dueDate,
      priority,
    };

    // Insert idea into Postgres
    const insertIdeaSQL = `
      INSERT INTO ideas (
        id, title, briefDescription, status, tags,
        createdAt, updatedAt, dueDate, priority
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9
      )
    `;
    const ideaParams = [
      newIdea.id,
      newIdea.title,
      newIdea.briefDescription,
      newIdea.status,
      JSON.stringify(newIdea.tags),
      newIdea.createdAt,
      newIdea.updatedAt,
      newIdea.dueDate,
      newIdea.priority,
    ];

    try {
      const res = await pool.query(insertIdeaSQL, ideaParams);
      console.info('[IDEAS_CREATE][DB][IDEA_INSERTED]', { ...logContext, rowCount: res.rowCount, ideaId: newIdea.id });
    } catch (dbErr) {
      console.error('[IDEAS_CREATE][DB][ERROR_INSERT_IDEA]', { ...logContext, dbErr, ideaParams });
      throw dbErr;
    }

    // Create initial log entry
    const initialLog: IdeaLog = {
      id: uuidv4(),
      ideaId: newIdea.id,
      timestamp: now,
      type: 'initial_capture',
      content: briefDescription || 'Initial idea captured.',
      author: 'Tomide',
    };

    // Insert log into Postgres
    const insertLogSQL = `
      INSERT INTO idea_logs (
        id, ideaId, timestamp, type, content, author
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      )
    `;
    const logParams = [
      initialLog.id,
      initialLog.ideaId,
      initialLog.timestamp,
      initialLog.type,
      initialLog.content,
      initialLog.author,
    ];

    try {
      const logRes = await pool.query(insertLogSQL, logParams);
      console.info('[IDEAS_CREATE][DB][LOG_INSERTED]', { ...logContext, rowCount: logRes.rowCount, logId: initialLog.id });
    } catch (logDbErr) {
      console.error('[IDEAS_CREATE][DB][ERROR_INSERT_LOG]', { ...logContext, logDbErr, logParams });
      throw logDbErr;
    }

    console.info('[IDEAS_CREATE][SUCCESS] New idea created.', { ...logContext, ideaId: newIdea.id, title: newIdea.title });

    return NextResponse.json({
      success: true,
      message: 'Idea captured successfully!',
      idea: newIdea,
    });
  } catch (error: any) {
    console.error('[IDEAS_CREATE][ERROR]', { ...logContext, error });
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
