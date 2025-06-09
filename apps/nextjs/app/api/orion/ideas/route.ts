/**
 * GOAL: API route for fetching ideas from Neon/Postgres for Orion.
 * - Replaces SQLite for cloud scalability, reliability, and performance.
 * - Returns all ideas, with optional status and tag filtering.
 * - Absurdly comprehensive logging for every step, including query construction, execution, and error handling.
 * - Related: lib/database.ts (Postgres pool), types/ideas.d.ts (Idea type), prd.md (feature documentation).
 * - All features preserved, no logic lost in migration.
 */
import { NextRequest, NextResponse } from 'next/server';
import { query, sql } from '@shared/lib/database';
import type { Idea } from '@shared/types/ideas';

export const dynamic = "force-dynamic";

/**
 * API route for fetching ideas
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const tag = url.searchParams.get('tag');

    console.info('[IDEAS][INFO] Received GET /api/orion/ideas', { status, tag });

    // Build query with filters
    let queryStr = `SELECT * FROM ideas WHERE 1=1`;
    const params: any = {};

    if (status) {
      queryStr += ` AND status = @status`;
      params.status = status;
      console.debug('[IDEAS][DEBUG] Filtering by status', { status });
    }

    // Add sorting
    queryStr += ` ORDER BY updatedAt DESC`;

    // Prepare Postgres query
    const paramKeys = Object.keys(params);
    const values = paramKeys.map((k) => params[k]);
    let pgQuery = queryStr;
    paramKeys.forEach((k, i) => {
      pgQuery = pgQuery.replaceAll(`@${k}`, `$${i + 1}`);
    });

    console.debug('[IDEAS][DEBUG] Final SQL Query', { pgQuery, values });

    // Execute query using Postgres
    let rows: any[] = [];
    try {
      const result = await query(pgQuery, values);
      rows = result.rows;
      console.info('[IDEAS][INFO] Query executed successfully', { rowCount: rows.length });
    } catch (dbError: any) {
      console.error('[IDEAS][ERROR] Database query failed', { error: dbError, pgQuery, values });
      throw dbError;
    }

    // Parse JSON fields
    const ideas: Idea[] = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      briefDescription: row.briefDescription,
      status: row.status,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      dueDate: row.dueDate,
      priority: row.priority
    }));

    // If tag filter is provided, filter in memory (since tags are stored as JSON)
    const filteredIdeas = tag
      ? ideas.filter(idea => idea.tags?.some(t => t.toLowerCase() === tag.toLowerCase()))
      : ideas;

    console.info('[IDEAS][INFO] Returning ideas', { count: filteredIdeas.length });

    return NextResponse.json({
      success: true,
      ideas: filteredIdeas
    });
  } catch (error: any) {
    console.error('[IDEAS][ERROR] Error in GET /api/orion/ideas', { error });
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
