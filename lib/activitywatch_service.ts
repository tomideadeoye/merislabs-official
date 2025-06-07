// lib/activitywatch_service.ts

import axios from "axios";

/**
 * ActivityWatchService provides methods to fetch tracked activity data
 * from the local ActivityWatch server for analytics or productivity features.
 *
 * - Uses the REST API (default: http://localhost:5600)
 * - Handles errors and logs context for traceability
 * - Designed for extensibility and testability
 */

const DEFAULT_AW_URL = "http://localhost:5600/api/0";

export class ActivityWatchService {
  private baseUrl: string;

  constructor(baseUrl: string = DEFAULT_AW_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches all available buckets from ActivityWatch.
   * Buckets represent different sources of tracked data (e.g., window, afk).
   */
  async getBuckets(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/buckets`);
      return response.data;
    } catch (error) {
      console.error("[ActivityWatchService][getBuckets][ERROR]", { error });
      throw new Error("Failed to fetch ActivityWatch buckets");
    }
  }

  /**
   * Fetches events from a specific bucket within a time range.
   * @param bucketId - The ID of the bucket (e.g., 'aw-watcher-window_mac')
   * @param startTime - ISO string or Date for range start
   * @param endTime - ISO string or Date for range end
   */
  async getEvents(
    bucketId: string,
    startTime: string | Date,
    endTime: string | Date
  ): Promise<any[]> {
    try {
      const start = typeof startTime === "string" ? startTime : startTime.toISOString();
      const end = typeof endTime === "string" ? endTime : endTime.toISOString();
      const response = await axios.get(
        `${this.baseUrl}/buckets/${encodeURIComponent(bucketId)}/events`,
        { params: { start, end } }
      );
      return response.data;
    } catch (error) {
      console.error("[ActivityWatchService][getEvents][ERROR]", { bucketId, error });
      throw new Error(`Failed to fetch events for bucket: ${bucketId}`);
    }
  }

  /**
   * Utility: Checks if the ActivityWatch server is reachable.
   */
  async isServerAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/status`);
      return true;
    } catch {
      return false;
    }
  }
}

// Example usage (to be removed/commented in production):
// const awService = new ActivityWatchService();
// awService.getBuckets().then(console.log).catch(console.error);
