/**
 * GOAL: API route for fetching ideas from Neon/Postgres for Orion.
 * - Replaces SQLite for cloud scalability, reliability, and performance.
 * - Returns all ideas, with optional status and tag filtering.
 * - Absurdly comprehensive logging for every step, including query construction, execution, and error handling.
 * - Related: lib/database.ts (Postgres pool), types/ideas.d.ts (Idea type), prd.md (feature documentation).
 * - All features preserved, no logic lost in migration.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@repo/shared/lib/postgres';
import { logger } from '@repo/shared/lib/logger';
import type { Idea } from '@repo/shared/types/ideas';

export const dynamic = 'force-dynamic';

/**
 * API route for fetching ideas
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const tagParam = searchParams.get('tag');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    // Validate query parameters
    const schema = z.object({
      status: z
        .enum(['raw_spark', 'fleshing_out', 'researching', 'prototyping', 'on_hold', 'archived', 'completed'])
        .optional(),
      tag: z.string().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    });

    const parseResult = schema.safeParse({
      status: statusParam,
      tag: tagParam,
      page: pageParam,
      limit: limitParam,
    });

    if (!parseResult.success) {
      logger.warn('Invalid query parameters', { error: parseResult.error.format() });
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { status, tag, page, limit } = parseResult.data;
    logger.info('Request received', { status, tag, page, limit });

    let pgQuery = 'SELECT * FROM ideas';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (status) {
      pgQuery += ` WHERE status = $${paramIndex++}`;
      queryParams.push(status);
    }

    pgQuery += ` ORDER BY "updatedAt" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    queryParams.push(limit);
    queryParams.push((page - 1) * limit);

    logger.debug('Constructed SQL query', { pgQuery, queryParams });

    const result = await query<Idea>(pgQuery, queryParams);
    const ideas: Idea[] = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description, // Use 'description' as per updated Idea interface
      status: row.status,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.createdat,
      updatedAt: row.updatedat,
      userId: row.userid, // Include userId
      dueDate: row.duedate, // Include dueDate
      priority: row.priority, // Include priority
    }));

    const filteredIdeas = tag
      ? ideas.filter((idea) => idea.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()))
      : ideas;

    logger.info('Returning ideas', { count: filteredIdeas.length });

    return NextResponse.json({
      success: true,
      ideas: filteredIdeas,
    });
  } catch (error: unknown) {
    logger.error('Request failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
