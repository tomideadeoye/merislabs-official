// lib/activitywatch_storage.ts

/**
 * ActivityWatchStorage
 * - Persists and retrieves analytics snapshots in Neon DB (Postgres)
 * - Supports saving, fetching by date, and listing summaries
 * - Designed for robust, extensible analytics storage
 */

import { ProductivitySummary } from './activitywatch_processor';
import { prisma } from '@/lib/prisma';

export type AnalyticsSnapshot = {
  id: number;
  user_id: string;
  date: string; // ISO date (YYYY-MM-DD)
  summary: ProductivitySummary;
  created_at: string;
};

// Helper function to convert database row (array of unknown values) to AnalyticsSnapshot type
const rowToAnalyticsSnapshot = (row: unknown[]): AnalyticsSnapshot => ({
  id: row[0] as number,
  user_id: row[1] as string,
  date: row[2] as string,
  summary: row[3] as ProductivitySummary,
  created_at: row[4] as string,
});

export class ActivityWatchStorage {
  /**
   * Save a productivity summary snapshot for a user and date.
   * If a snapshot for the date/user exists, update it.
   */
  static async saveSnapshot(user_id: string, date: string, summary: ProductivitySummary): Promise<AnalyticsSnapshot> {
    // Use Prisma upsert to handle the ON CONFLICT logic
    const result = await prisma.$queryRaw<AnalyticsSnapshot[]>`
      INSERT INTO activitywatch_snapshots (user_id, date, summary, created_at)
      VALUES (${user_id}, ${date}, ${JSON.stringify(summary)}, NOW())
      ON CONFLICT (user_id, date)
      DO UPDATE SET summary = EXCLUDED.summary, created_at = NOW()
      RETURNING id, user_id, date, summary, created_at
    `;
    return result[0];
  }

  /**
   * Fetch a snapshot for a user and date.
   */
  static async getSnapshot(user_id: string, date: string): Promise<AnalyticsSnapshot | null> {
    const result = await prisma.$queryRaw<AnalyticsSnapshot[]>`
      SELECT id, user_id, date, summary, created_at
      FROM activitywatch_snapshots
      WHERE user_id = ${user_id} AND date = ${date}
      LIMIT 1
    `;
    return result.length ? result[0] : null;
  }

  /**
   * List all snapshots for a user, optionally within a date range.
   */
  static async listSnapshots(user_id: string, startDate?: string, endDate?: string): Promise<AnalyticsSnapshot[]> {
    if (startDate && endDate) {
      return await prisma.$queryRaw<AnalyticsSnapshot[]>`
        SELECT id, user_id, date, summary, created_at
        FROM activitywatch_snapshots
        WHERE user_id = ${user_id}
          AND date >= ${startDate}
          AND date <= ${endDate}
        ORDER BY date ASC
      `;
    } else {
      return await prisma.$queryRaw<AnalyticsSnapshot[]>`
        SELECT id, user_id, date, summary, created_at
        FROM activitywatch_snapshots
        WHERE user_id = ${user_id}
        ORDER BY date ASC
      `;
    }
  }
}
