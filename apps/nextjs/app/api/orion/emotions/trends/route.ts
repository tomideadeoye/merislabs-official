import { NextRequest, NextResponse } from "next/server";
import { query } from "@repo/shared/database";
import { logger } from "@repo/shared/logger";
import { z } from "zod";
// Assuming a direct function call for LLM is better than a fetch
// import { getLlmAnalysis } from '@repo/shared/llm';

// Mocking a direct LLM function call as the original fetch was incorrect for server-side
async function getLlmAnalysis(prompt: string): Promise<any> {
  logger.info("[LLM_ANALYSIS_MOCK] Requesting analysis.");
  // In a real scenario, this would call the LLM provider API
  // For now, returning a mock structure to satisfy the type contracts
  const mockResponse = {
    patterns: ["Mock pattern: Increased joy on weekends."],
    correlations: [
      "Mock correlation: 'Work deadline' trigger linked to anxiety.",
    ],
    suggestions: [
      "Mock suggestion: Practice mindfulness during high-stress periods.",
    ],
  };
  return Promise.resolve(JSON.stringify(mockResponse));
}

export const dynamic = "force-dynamic";

const queryParamsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

interface EmotionCount {
  primaryemotion: string;
  count: string; // PG returns count as string
  avgintensity: number;
}

interface CommonTrigger {
  trigger: string;
  count: string; // PG returns count as string
}

interface EmotionTimelinePoint {
  date: string; // Or Date
  primaryemotion: string;
  avgintensity: number;
}

export async function GET(req: NextRequest) {
  const logContext = { route: "api/orion/emotions/trends" };
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const validation = queryParamsSchema.safeParse({
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    });

    if (!validation.success) {
      logger.warn("[EMOTIONS_TRENDS][VALIDATION_FAIL]", {
        errors: validation.error.errors,
        ...logContext,
      });
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }
    const { startDate, endDate } = validation.data;

    logger.info("[EMOTIONS_TRENDS] Starting trend analysis", {
      startDate,
      endDate,
      ...logContext,
    });

    // Build dynamic query for emotion counts
    let queryStr = `SELECT "primaryEmotion", COUNT(*) as count, AVG(intensity) as avgIntensity FROM emotional_logs WHERE 1=1`;
    const params: (string | Date)[] = [];
    let paramIdx = 1;

    if (startDate) {
      queryStr += ` AND timestamp >= $${paramIdx++}`;
      params.push(new Date(startDate));
    }
    if (endDate) {
      queryStr += ` AND timestamp <= $${paramIdx++}`;
      params.push(new Date(endDate));
    }
    queryStr += ` GROUP BY "primaryEmotion" ORDER BY count DESC`;
    const emotionCountsResult = await query<EmotionCount>(queryStr, params);
    logger.info("[EMOTIONS_TRENDS][DB][EMOTION_COUNTS]", {
      rowCount: emotionCountsResult.rowCount,
      ...logContext,
    });

    // Most common triggers
    let triggerQuery = `
      SELECT value as trigger, COUNT(*) as count
      FROM emotional_logs, jsonb_array_elements_text(triggers) as value
      WHERE triggers IS NOT NULL
    `;
    const triggerParams: (string | Date)[] = [];
    paramIdx = 1;
    if (startDate) {
      triggerQuery += ` AND timestamp >= $${paramIdx++}`;
      triggerParams.push(new Date(startDate));
    }
    if (endDate) {
      triggerQuery += ` AND timestamp <= $${paramIdx++}`;
      triggerParams.push(new Date(endDate));
    }
    triggerQuery += ` GROUP BY value ORDER BY count DESC LIMIT 10`;
    const commonTriggersResult = await query<CommonTrigger>(
      triggerQuery,
      triggerParams
    );
    logger.info("[EMOTIONS_TRENDS][DB][TRIGGERS]", {
      rowCount: commonTriggersResult.rowCount,
      ...logContext,
    });

    // Emotion intensity over time
    let timelineQuery = `
      SELECT
        date_trunc('day', timestamp) as date,
        "primaryEmotion",
        AVG(intensity) as avgIntensity
      FROM emotional_logs
      WHERE intensity IS NOT NULL
    `;
    const timelineParams: (string | Date)[] = [];
    paramIdx = 1;
    if (startDate) {
      timelineQuery += ` AND timestamp >= $${paramIdx++}`;
      timelineParams.push(new Date(startDate));
    }
    if (endDate) {
      timelineQuery += ` AND timestamp <= $${paramIdx++}`;
      timelineParams.push(new Date(endDate));
    }
    timelineQuery += ` GROUP BY date, "primaryEmotion" ORDER BY date`;
    const emotionTimelineResult = await query<EmotionTimelinePoint>(
      timelineQuery,
      timelineParams
    );
    logger.info("[EMOTIONS_TRENDS][DB][TIMELINE]", {
      rowCount: emotionTimelineResult.rowCount,
      ...logContext,
    });

    const prompt = `
      Analyze the following emotional data and provide insights:
      Emotion Frequencies: ${JSON.stringify(emotionCountsResult.rows)}
      Common Triggers: ${JSON.stringify(commonTriggersResult.rows)}
      Emotion Timeline: ${JSON.stringify(emotionTimelineResult.rows)}
      Please provide:
      1. Key patterns or trends.
      2. Potential correlations between emotions and triggers.
      3. Suggestions for emotional well-being.
      Format your response as a JSON object with keys: "patterns", "correlations", "suggestions".`;

    let insights = null;
    try {
      const llmResponseContent = await getLlmAnalysis(prompt);
      insights = JSON.parse(llmResponseContent);
      logger.info("[EMOTIONS_TRENDS][LLM][INSIGHTS_PARSED]", {
        insights,
        ...logContext,
      });
    } catch (llmErr) {
      const errorMessage =
        llmErr instanceof Error ? llmErr.message : "LLM processing failed";
      logger.error("[EMOTIONS_TRENDS][LLM][ERROR]", {
        error: errorMessage,
        ...logContext,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        emotionCounts: emotionCountsResult.rows,
        commonTriggers: commonTriggersResult.rows,
        emotionTimeline: emotionTimelineResult.rows,
        insights,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    logger.error("[EMOTIONS_TRENDS][ERROR]", {
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
