import { NextRequest, NextResponse } from "next/server";
import { query, sql } from "@repo/shared/database";
import { EmotionalLogEntry } from '@repo/shared';
import { logger } from "@repo/shared/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    logger.info("[EMOTIONS_HISTORY] Fetching emotional log history.");
    const result = await query<EmotionalLogEntry>(
      "SELECT * FROM emotional_logs ORDER BY timestamp DESC LIMIT 100"
    );
    logger.info("[EMOTIONS_HISTORY] Successfully fetched history.", {
      count: result.rowCount,
    });
    return NextResponse.json({ success: true, history: result.rows });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error("[EMOTIONS_HISTORY] Error fetching history.", {
      error: errorMessage,
    });
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
