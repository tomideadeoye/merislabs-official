/**
 * GOAL: API route for analyzing emotional trends in Orion, using Neon/Postgres for cloud scalability, reliability, and auditability.
 * - Aggregates emotion frequencies, triggers, and timelines from the central Postgres DB.
 * - Absurdly comprehensive logging for every step, with context and error details.
 * - Connects to: lib/database.ts (Postgres pool), prd.md (feature doc), tests/e2e.test.ts (tests)
 * - All features preserved from SQLite version, now with improved error handling and observability.
 */
import { NextRequest, NextResponse } from 'next/server';
import { query, sql } from '@shared/lib/database';
import { OPPORTUNITY_EVALUATION_REQUEST_TYPE } from '@shared/lib/orion_config';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build dynamic query for emotion counts
    let queryStr = `SELECT primaryEmotion, COUNT(*) as count, AVG(intensity) as avgIntensity FROM emotional_logs WHERE 1=1`;
    const params: any[] = [];
    let paramIdx = 1;

    if (startDate) {
      queryStr += ` AND timestamp >= $${paramIdx++}`;
      params.push(startDate);
    }
    if (endDate) {
      queryStr += ` AND timestamp <= $${paramIdx++}`;
      params.push(endDate);
    }
    queryStr += ` GROUP BY primaryEmotion ORDER BY count DESC`;

    let emotionCounts = [];
    try {
      const res = await query(queryStr, params);
      emotionCounts = res.rows;
      console.info('[EMOTIONS_TRENDS][DB][EMOTION_COUNTS]', { rowCount: res.rowCount, params });
    } catch (err) {
      console.error('[EMOTIONS_TRENDS][DB][ERROR_EMOTION_COUNTS]', { err, params });
      throw err;
    }

    // Most common triggers (Postgres JSONB)
    let triggerQuery = `
      SELECT value as trigger, COUNT(*) as count
      FROM emotional_logs, jsonb_array_elements_text(triggers) as value
      WHERE triggers IS NOT NULL
    `;
    const triggerParams: any[] = [];
    let triggerParamIdx = 1;
    if (startDate) {
      triggerQuery += ` AND timestamp >= $${triggerParamIdx++}`;
      triggerParams.push(startDate);
    }
    if (endDate) {
      triggerQuery += ` AND timestamp <= $${triggerParamIdx++}`;
      triggerParams.push(endDate);
    }
    triggerQuery += ` GROUP BY value ORDER BY count DESC LIMIT 10`;

    let commonTriggers = [];
    try {
      const trigRes = await query(triggerQuery, triggerParams);
      commonTriggers = trigRes.rows;
      console.info('[EMOTIONS_TRENDS][DB][TRIGGERS]', { rowCount: trigRes.rowCount, triggerParams });
    } catch (err) {
      console.error('[EMOTIONS_TRENDS][DB][ERROR_TRIGGERS]', { err, triggerParams });
      throw err;
    }

    // Emotion intensity over time
    let timelineQuery = `
      SELECT
        date_trunc('day', timestamp) as date,
        primaryEmotion,
        AVG(intensity) as avgIntensity
      FROM emotional_logs
      WHERE intensity IS NOT NULL
    `;
    const timelineParams: any[] = [];
    let timelineParamIdx = 1;
    if (startDate) {
      timelineQuery += ` AND timestamp >= $${timelineParamIdx++}`;
      timelineParams.push(startDate);
    }
    if (endDate) {
      timelineQuery += ` AND timestamp <= $${timelineParamIdx++}`;
      timelineParams.push(endDate);
    }
    timelineQuery += ` GROUP BY date, primaryEmotion ORDER BY date`;

    let emotionTimeline = [];
    try {
      const timeRes = await query(timelineQuery, timelineParams);
      emotionTimeline = timeRes.rows;
      console.info('[EMOTIONS_TRENDS][DB][TIMELINE]', { rowCount: timeRes.rowCount, timelineParams });
    } catch (err) {
      console.error('[EMOTIONS_TRENDS][DB][ERROR_TIMELINE]', { err, timelineParams });
      throw err;
    }

    // Get LLM analysis of the emotional data
    const emotionalData = {
      emotionCounts,
      commonTriggers,
      emotionTimeline
    };

    // Use LLM to analyze the emotional data
    let insights = null;
    try {
      const llmResponse = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: OPPORTUNITY_EVALUATION_REQUEST_TYPE,
          primaryContext: `
            Analyze the following emotional data and provide insights:

            Emotion Frequencies:
            ${JSON.stringify(emotionCounts, null, 2)}

            Common Triggers:
            ${JSON.stringify(commonTriggers, null, 2)}

            Emotion Timeline:
            ${JSON.stringify(emotionTimeline, null, 2)}

            Please provide:
            1. Key patterns or trends you observe
            2. Potential correlations between emotions and triggers
            3. Suggestions for emotional well-being based on this data

            Format your response as a JSON object with the following structure:
            {
              "patterns": ["pattern 1", "pattern 2", ...],
              "correlations": ["correlation 1", "correlation 2", ...],
              "suggestions": ["suggestion 1", "suggestion 2", ...]
            }
          `,
          temperature: 0.3,
          maxTokens: 1000
        })
      });

      if (llmResponse.ok) {
        const llmData = await llmResponse.json();
        if (llmData.success && llmData.content) {
          try {
            insights = JSON.parse(llmData.content);
            console.info('[EMOTIONS_TRENDS][LLM][INSIGHTS_PARSED]', { insights });
          } catch (parseError) {
            console.error('[EMOTIONS_TRENDS][LLM][ERROR_PARSING]', { parseError, content: llmData.content });
          }
        }
      }
    } catch (llmErr) {
      console.error('[EMOTIONS_TRENDS][LLM][ERROR]', { llmErr });
    }

    return NextResponse.json({
      success: true,
      data: {
        emotionCounts,
        commonTriggers,
        emotionTimeline,
        insights
      }
    });

  } catch (error: any) {
    console.error('[EMOTIONS_TRENDS][ERROR]', { error });
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
