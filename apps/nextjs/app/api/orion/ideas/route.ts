/**
 * GOAL: API route for fetching ideas from Neon/Postgres for Orion.
 * - Replaces SQLite for cloud scalability, reliability, and performance.
 * - Returns all ideas, with optional status and tag filtering.
 * - Absurdly comprehensive logging for every step, including query construction, execution, and error handling.
 * - Related: lib/database.ts (Postgres pool), types/ideas.d.ts (Idea type), prd.md (feature documentation).
 * - All features preserved, no logic lost in migration.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  query,
  SQLQueryBuilder,
  handleDatabaseOperation,
  normalizeError
} from "@repo/shared/database";
import {
  createLogger,
  validateRequest,
  errorResponse
} from "@repo/shared/utils";
import type { Idea } from "@repo/shared/types/ideas";

export const dynamic = "force-dynamic";

/**
 * API route for fetching ideas
 */
export async function GET(req: NextRequest) {
  const logger = createLogger("IDEAS_GET");
  try {
    // Validate query parameters
    const { searchParams, error } = validateRequest({
      request: req,
      schema: z.object({
        status: z.enum(["raw_spark", "incubating", "active", "completed"]).optional(),
        tag: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20)
      })
    });

    if (error) {
      logger.warn("Invalid query parameters", { error: error.errors });
      return errorResponse(error);
    }

    const { status, tag, page, limit } = searchParams;
    logger.info("Request received", { status, tag, page, limit });

    // Build parameterized query
    const queryBuilder = new SQLQueryBuilder()
      .select("*")
      .from("ideas")
      .where(status ? "status = $1" : "", status)
      .orderBy("updatedAt DESC")
      .paginate(page, limit);

    const { query: pgQuery, params: queryParams } = queryBuilder.build();
    logger.debug("Constructed SQL query", { pgQuery, queryParams });


    // Execute query with error handling
    const { rows, rowCount } = await handleDatabaseOperation({
      query: pgQuery,
      params: queryParams,
      context: "fetch_ideas",
      logger
    });

    // Parse JSON fields
    const ideas: Idea[] = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      briefDescription: row.briefDescription,
      status: row.status,
      tags: JSON.parse(row.tags || "[]"),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      dueDate: row.dueDate,
      priority: row.priority,
    }));

    // If tag filter is provided, filter in memory (since tags are stored as JSON)
    const filteredIdeas = tag
      ? ideas.filter((idea) =>
          idea.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      : ideas;

    console.info("[IDEAS][INFO] Returning ideas", {
      count: filteredIdeas.length,
    });

    return NextResponse.json({
      success: true,
      ideas: filteredIdeas,
    });
  } catch (error: unknown) {
    const { message, code } = normalizeError(error);
    logger.error("Request failed", { error: message, code });
    return errorResponse({
      code: code || 500,
      message: message || "Failed to fetch ideas"
    });
  }
}
