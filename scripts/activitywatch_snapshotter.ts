// scripts/activitywatch_snapshotter.ts

/**
 * Periodic ActivityWatch snapshotter.
 * - Fetches ActivityWatch events for the past day
 * - Processes them into a productivity summary
 * - Saves the summary to Neon DB (Postgres) for the user
 * - Designed for cron or serverless scheduling
 */

import { ActivityWatchService } from "../lib/activitywatch_service";
import { ActivityWatchProcessor } from "../lib/activitywatch_processor";
import { ActivityWatchStorage } from "../lib/activitywatch_storage";

const USER_ID = process.env.AW_USER_ID || "user123"; // Set via env or default

async function main() {
  try {
    const awService = new ActivityWatchService();
    const isAvailable = await awService.isServerAvailable();
    if (!isAvailable) {
      console.error("[AW Snapshotter] ActivityWatch server is not available.");
      process.exit(1);
    }

    // Get all buckets
    const buckets = await awService.getBuckets();
    // Only use window/afk buckets for productivity
    const relevantBuckets = buckets.filter(
      (b: any) =>
        b.id.startsWith("aw-watcher-window") || b.id.startsWith("aw-watcher-afk")
    );

    // Get events for the past day
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 1);

    let allEvents: any[] = [];
    for (const bucket of relevantBuckets) {
      const events = await awService.getEvents(bucket.id, start, end);
      allEvents = allEvents.concat(events);
    }

    if (allEvents.length === 0) {
      console.warn("[AW Snapshotter] No events found for the past day.");
      process.exit(0);
    }

    // Process events into productivity summary
    const summary = ActivityWatchProcessor.summarizeProductivity(allEvents);

    // Save to Neon DB
    const dateStr = start.toISOString().slice(0, 10);
    const saved = await ActivityWatchStorage.saveSnapshot(USER_ID, dateStr, summary);

    console.info(
      `[AW Snapshotter] Saved productivity snapshot for ${USER_ID} on ${dateStr}.`,
      { summary }
    );
    process.exit(0);
  } catch (err) {
    console.error("[AW Snapshotter] Error during snapshotting:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
