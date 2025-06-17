/**
 * GOAL: API route for creating a new idea in Orion, using Neon/Postgres for cloud scalability, reliability, and auditability.
 * - Persists new ideas and logs to the central Postgres DB.
 * - Absurdly comprehensive logging for every step, with context and error details.
 * - Connects to: lib/database.ts (Postgres pool), types/ideas.d.ts, reference.md (feature doc), tests/e2e.test.ts (tests)
 * - All features preserved from SQLite version, now with improved error handling and observability.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import type { Idea, IdeaLog } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  const logContext = {
    route: '/api/orion/ideas/create',
    timestamp: new Date().toISOString(),
  };
  try {
    console.info('[IDEAS_CREATE][START]', logContext);

    // Fetch the session here
    const session = await auth();
    if (!session || !session.user) {
      console.warn('[IDEAS_CREATE][AUTH_FAIL] Unauthorized access attempt.', logContext);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, tags = [], priority, dueDate } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.warn('[IDEAS_CREATE][VALIDATION_FAIL] Missing or invalid title.', { ...logContext, body });
      return NextResponse.json({ success: false, error: 'Idea title is required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Construct new idea object
    const newIdea: Idea = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim(),
      status: 'raw_spark',
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      createdAt: now,
      updatedAt: now,
      userId: session.user.id || '',
      dueDate,
      priority,
    };

    // Insert idea into Postgres
    const insertIdeaSQL = `
      INSERT INTO ideas (
        id, title, description, status, tags,
        createdAt, updatedAt, dueDate, priority, userId
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
    `;
    const ideaParams = [
      newIdea.id,
      newIdea.title,
      newIdea.description,
      newIdea.status,
      JSON.stringify(newIdea.tags),
      newIdea.createdAt,
      newIdea.updatedAt,
      newIdea.dueDate,
      newIdea.priority,
      newIdea.userId,
    ];

    try {
      const res = await query(insertIdeaSQL, ideaParams);
      console.info('[IDEAS_CREATE][DB][IDEA_INSERTED]', {
        ...logContext,
        rowCount: res.rowCount,
        ideaId: newIdea.id,
      });
    } catch (dbErr: unknown) {
      console.error('[IDEAS_CREATE][DB][ERROR_INSERT_IDEA]', {
        ...logContext,
        dbErr: dbErr instanceof Error ? dbErr.message : String(dbErr),
        ideaParams,
      });
      throw dbErr;
    }

    // Create initial log entry
    const initialLog: IdeaLog = {
      id: uuidv4(),
      ideaId: newIdea.id,
      timestamp: now,
      logType: 'initial_capture',
      details: 'Idea initially captured.',
      action: 'CREATE_IDEA',
      type: 'idea_log',
      content: newIdea.description || '',
      author: session.user.email || 'unknown',
    };

    // Insert log into Postgres
    const insertLogSQL = `
      INSERT INTO idea_logs (
        id, ideaId, timestamp, logType, details, action, type, content, author
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      )
    `;
    const logParams = [
      initialLog.id,
      initialLog.ideaId,
      initialLog.timestamp,
      initialLog.logType,
      initialLog.details,
      initialLog.action,
      initialLog.type,
      initialLog.content,
      initialLog.author,
    ];

    try {
      const logRes = await query(insertLogSQL, logParams);
      console.info('[IDEAS_CREATE][DB][LOG_INSERTED]', {
        ...logContext,
        rowCount: logRes.rowCount,
        logId: initialLog.id,
      });
    } catch (logDbErr: unknown) {
      console.error('[IDEAS_CREATE][DB][ERROR_INSERT_LOG]', {
        ...logContext,
        logDbErr: logDbErr instanceof Error ? logDbErr.message : String(logDbErr),
        logParams,
      });
      throw logDbErr;
    }

    console.info('[IDEAS_CREATE][SUCCESS] New idea created.', {
      ...logContext,
      ideaId: newIdea.id,
      title: newIdea.title,
    });

    return NextResponse.json({
      success: true,
      message: 'Idea captured successfully!',
      idea: newIdea,
    });
  } catch (error: unknown) {
    console.error('[IDEAS_CREATE][ERROR]', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
