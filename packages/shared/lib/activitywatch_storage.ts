// lib/activitywatch_storage.ts

/**
 * ActivityWatchStorage
 * - Persists and retrieves analytics snapshots in Neon DB (Postgres)
 * - Supports saving, fetching by date, and listing summaries
 * - Designed for robust, extensible analytics storage
 */

import { query } from "./postgres";
import { ProductivitySummary } from "./activitywatch_processor";

export type AnalyticsSnapshot = {
  id: number;
  user_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  summary: ProductivitySummary;
  created_at: string;
};

export class ActivityWatchStorage {
  /**
   * Save a productivity summary snapshot for a user and date.
   * If a snapshot for the date/user exists, update it.
   */
  static async saveSnapshot(user_id: string, date: string, summary: ProductivitySummary): Promise<AnalyticsSnapshot> {
    const res = await query(
      `INSERT INTO activitywatch_snapshots (user_id, date, summary, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, date)
       DO UPDATE SET summary = EXCLUDED.summary, created_at = NOW()
       RETURNING id, user_id, date, summary, created_at`,
      [user_id, date, summary]
    );
    return res.rows[0];
  }

  /**
   * Fetch a snapshot for a user and date.
   */
  static async getSnapshot(user_id: string, date: string): Promise<AnalyticsSnapshot | null> {
    const res = await query(
      `SELECT id, user_id, date, summary, created_at
       FROM activitywatch_snapshots
       WHERE user_id = $1 AND date = $2
       LIMIT 1`,
      [user_id, date]
    );
    return res.rows.length ? res.rows[0] : null;
  }

  /**
   * List all snapshots for a user, optionally within a date range.
   */
  static async listSnapshots(user_id: string, startDate?: string, endDate?: string): Promise<AnalyticsSnapshot[]> {
    if (startDate && endDate) {
      const res = await query(
        `SELECT id, user_id, date, summary, created_at
         FROM activitywatch_snapshots
         WHERE user_id = $1
           AND date >= $2
           AND date <= $3
         ORDER BY date ASC`,
        [user_id, startDate, endDate]
      );
      return res.rows;
    } else {
      const res = await query(
        `SELECT id, user_id, date, summary, created_at
         FROM activitywatch_snapshots
         WHERE user_id = $1
         ORDER BY date ASC`,
        [user_id]
      );
      return res.rows;
    }
  }
}
