import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

interface LlmAnalysisInsights {
  patterns: string[];
  correlations: string[];
  suggestions: string[];
}

async function getLlmAnalysis(): Promise<string> {
  logger.info('[LLM_ANALYSIS_MOCK] Requesting analysis.');
  const mockResponse: LlmAnalysisInsights = {
    patterns: ['Mock pattern: Increased joy on weekends.'],
    correlations: ["Mock correlation: 'Work deadline' trigger linked to anxiety."],
    suggestions: ['Mock suggestion: Practice mindfulness during high-stress periods.'],
  };
  return Promise.resolve(JSON.stringify(mockResponse));
}

export const dynamic = 'force-dynamic';

const queryParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

interface EmotionCount {
  primaryEmotion: string;
  count: string;
  avgIntensity: number;
}

interface CommonTrigger {
  trigger: string;
  count: string;
}

interface EmotionTimelinePoint {
  date: string;
  primaryEmotion: string;
  avgIntensity: number;
}

export async function GET(req: NextRequest) {
  const logContext = { route: 'api/orion/emotions/trends' };
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const validation = queryParamsSchema.safeParse({
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    });

    if (!validation.success) {
      logger.warn('[EMOTIONS_TRENDS][VALIDATION_FAIL]', {
        errors: validation.error.errors,
        ...logContext,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }
    const { startDate, endDate } = validation.data;

    logger.info('[EMOTIONS_TRENDS] Starting trend analysis', {
      startDate,
      endDate,
      ...logContext,
    });

    // Get emotion counts using Prisma
    const emotionCountsResult = await prisma.$queryRaw<EmotionCount[]>`
      SELECT "primaryEmotion", COUNT(*) as count, AVG(intensity) as "avgIntensity"
      FROM journal_entries
      WHERE "primaryEmotion" IS NOT NULL AND intensity IS NOT NULL
      ${startDate ? Prisma.sql`AND "createdAt" >= ${startDate}` : Prisma.sql``}
      ${endDate ? Prisma.sql`AND "createdAt" <= ${endDate}` : Prisma.sql``}
      GROUP BY "primaryEmotion"
      ORDER BY count DESC
    `;

    logger.info('[EMOTIONS_TRENDS][DB][EMOTION_COUNTS]', {
      rowCount: emotionCountsResult.length,
      ...logContext,
    });

    // Most common triggers using Prisma raw query (since triggers is JSONB)
    const commonTriggersResult = await prisma.$queryRaw<CommonTrigger[]>`
      SELECT value as trigger, COUNT(*) as count
      FROM journal_entries, jsonb_array_elements_text(triggers) as value
      WHERE triggers IS NOT NULL AND jsonb_array_length(triggers) > 0
        ${startDate ? Prisma.sql`AND "createdAt" >= ${startDate}` : Prisma.sql``}
        ${endDate ? Prisma.sql`AND "createdAt" <= ${endDate}` : Prisma.sql``}
      GROUP BY value
      ORDER BY count DESC
      LIMIT 10
    `;

    logger.info('[EMOTIONS_TRENDS][DB][TRIGGERS]', {
      rowCount: commonTriggersResult.length,
      ...logContext,
    });

    // Emotion intensity over time using Prisma raw query
    const emotionTimelineResult = await prisma.$queryRaw<EmotionTimelinePoint[]>`
      SELECT
        date_trunc('day', "createdAt") as date,
        "primaryEmotion",
        AVG(intensity) as "avgIntensity"
      FROM journal_entries
      WHERE intensity IS NOT NULL AND "primaryEmotion" IS NOT NULL
        ${startDate ? Prisma.sql`AND "createdAt" >= ${startDate}` : Prisma.sql``}
        ${endDate ? Prisma.sql`AND "createdAt" <= ${endDate}` : Prisma.sql``}
      GROUP BY date, "primaryEmotion"
      ORDER BY date
    `;

    logger.info('[EMOTIONS_TRENDS][DB][TIMELINE]', {
      rowCount: emotionTimelineResult.length,
      ...logContext,
    });

    let insights: LlmAnalysisInsights | null = null;
    try {
      const llmResponseContent = await getLlmAnalysis();
      insights = JSON.parse(llmResponseContent);
      logger.info('[EMOTIONS_TRENDS][LLM][INSIGHTS_PARSED]', {
        insights,
        ...logContext,
      });
    } catch (llmErr: unknown) {
      const errorMessage = llmErr instanceof Error ? llmErr.message : 'LLM processing failed';
      logger.error('[EMOTIONS_TRENDS][LLM][ERROR]', {
        error: errorMessage,
        ...logContext,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        emotionCounts: emotionCountsResult,
        commonTriggers: commonTriggersResult,
        emotionTimeline: emotionTimelineResult,
        insights,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    logger.error('[EMOTIONS_TRENDS][ERROR]', {
      error: errorMessage,
      ...logContext,
    });
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
