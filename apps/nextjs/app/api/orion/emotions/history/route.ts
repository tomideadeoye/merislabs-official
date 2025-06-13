import { NextRequest, NextResponse } from "next/server";
import { query, sql } from "@repo/shared/database";
import { EmotionalLogEntry } from '@repo/shared';

export const dynamic = "force-dynamic";

/**
 * API route for retrieving emotion logs
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const emotion = url.searchParams.get("emotion");
    const hasDistortionAnalysis = url.searchParams.get("hasDistortionAnalysis");

    // Build query with filters
    let queryStr = `SELECT * FROM emotional_logs WHERE 1=1`;
    const params: any = {};

    if (startDate) {
      queryStr += ` AND timestamp >= @startDate`;
      params.startDate = startDate;
    }

    if (endDate) {
      queryStr += ` AND timestamp <= @endDate`;
      params.endDate = endDate;
    }

    if (emotion) {
      queryStr += ` AND primaryEmotion = @emotion`;
      params.emotion = emotion;
    }

    if (hasDistortionAnalysis === "true") {
      queryStr += ` AND cognitiveDistortionAnalysis IS NOT NULL`;
    } else if (hasDistortionAnalysis === "false") {
      queryStr += ` AND cognitiveDistortionAnalysis IS NULL`;
    }

    // Add sorting and pagination
    queryStr += ` ORDER BY timestamp DESC LIMIT @limit OFFSET @offset`;
    params.limit = limit;
    params.offset = offset;

    // Execute query using Postgres
    // Convert SQLite named parameters (@param) to Postgres ($1, $2, ...)
    const paramKeys = Object.keys(params);
    const values = paramKeys.map((k) => params[k]);
    let pgQuery = queryStr;
    paramKeys.forEach((k, i) => {
      pgQuery = pgQuery.replaceAll(`@${k}`, `$${i + 1}`);
    });

    const { rows } = await query(pgQuery, values);

    // Parse JSON fields
    const logs: EmotionalLogEntry[] = rows.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      primaryEmotion: row.primaryEmotion,
      secondaryEmotions: JSON.parse(row.secondaryEmotions || "[]"),
      intensity: row.intensity,
      triggers: JSON.parse(row.triggers || "[]"),
      physicalSensations: JSON.parse(row.physicalSensations || "[]"),
      accompanyingThoughts: row.accompanyingThoughts,
      copingMechanismsUsed: JSON.parse(row.copingMechanismsUsed || "[]"),
      contextualNote: row.contextualNote,
      relatedJournalSourceId: row.relatedJournalSourceId,
      cognitiveDistortionAnalysis: row.cognitiveDistortionAnalysis
        ? JSON.parse(row.cognitiveDistortionAnalysis)
        : undefined,
    }));

    // Get total count for pagination
    const countResult = await query(
      `SELECT COUNT(*) as count FROM emotional_logs`
    );
    const total = parseInt(countResult.rows[0]?.count || "0", 10);

    return NextResponse.json({
      success: true,
      logs,
      total,
    });
  } catch (error: any) {
    console.error("Error in GET /api/orion/emotions/history:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
