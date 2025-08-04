/**
 * GOAL: API route for fetching ideas from Neon/Postgres for Orion.
 * - Replaces SQLite for cloud scalability, reliability, and performance.
 * - Returns all ideas, with optional status and tag filtering.
 * - Absurdly comprehensive logging for every step, including query construction, execution, and error handling.
 * FILEPATH: app/api/orion/ideas/route.ts
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 * - `@/lib/database.ts` (Postgres pool): Used for database interactions.
 * - `@/lib/logger.ts`: Centralized logging utility.
 * - `@/lib/types/index.ts` (Idea type): Defines the structure of Idea objects.
 * ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
 * - Idea data is stored in a `ideas` table in the Neon Postgres database.
 * NOTES: All features preserved from previous implementations. This route is designed to be highly observable with extensive logging.
 * TODOS: Consider adding pagination metadata (total count) to the response for better client-side handling.
 * SUGGESTIONS: Implement a more robust filtering mechanism (e.g., combining status and tags).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client'; // Import Prisma type directly from generated client
import logger from '@/lib/logger';
import { prisma } from '@/lib/prisma'; // Import the shared prisma client
// import { Idea } from '@/lib/types'; // Removed as no longer needed

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
        .enum(['raw_spark', 'researching', 'developing', 'launched', 'abandoned']) // Aligned with Prisma Enum
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

    const whereClause: Prisma.IdeaWhereInput = {}; // Explicitly type whereClause

    if (status) {
      whereClause.status = status;
    }

    if (tag) {
      whereClause.tags = {
        has: tag, // Prisma way to check if an array contains a value
      };
    }

    const ideas = await prisma.idea.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    // No need for separate filtering by tag as Prisma's `has` operator handles it.
    // No need for row mapping as Prisma returns typed objects.

    logger.info('Returning ideas', { count: ideas.length });

    return NextResponse.json({
      success: true,
      ideas: ideas,
    });
  } catch (error: unknown) {
    logger.error('Request failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to fetch ideas: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
