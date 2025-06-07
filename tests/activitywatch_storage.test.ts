// tests/activitywatch_storage.test.ts

import { ActivityWatchStorage, AnalyticsSnapshot } from "../lib/activitywatch_storage";
import { ProductivitySummary } from "../lib/activitywatch_processor";

// Mock the query function from postgres
jest.mock("../lib/postgres", () => ({
  query: jest.fn(),
}));

import { query } from "../lib/postgres";

describe("ActivityWatchStorage", () => {
  const user_id = "user123";
  const date = "2024-06-01";
  const summary: ProductivitySummary = {
    totalTime: 120,
    byCategory: { work: 60, entertainment: 60 },
    productivityScore: 0.55,
    anomalies: [],
  };
  const snapshot: AnalyticsSnapshot = {
    id: 1,
    user_id,
    date,
    summary,
    created_at: "2024-06-01T12:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveSnapshot", () => {
    it("inserts or updates and returns the snapshot", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [snapshot] });
      const result = await ActivityWatchStorage.saveSnapshot(user_id, date, summary);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO activitywatch_snapshots"),
        [user_id, date, summary]
      );
      expect(result).toEqual(snapshot);
    });
  });

  describe("getSnapshot", () => {
    it("returns the snapshot if found", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [snapshot] });
      const result = await ActivityWatchStorage.getSnapshot(user_id, date);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, user_id, date, summary, created_at"),
        [user_id, date]
      );
      expect(result).toEqual(snapshot);
    });

    it("returns null if not found", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await ActivityWatchStorage.getSnapshot(user_id, date);
      expect(result).toBeNull();
    });
  });

  describe("listSnapshots", () => {
    it("returns all snapshots for a user", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [snapshot] });
      const result = await ActivityWatchStorage.listSnapshots(user_id);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE user_id = $1"),
        [user_id]
      );
      expect(result).toEqual([snapshot]);
    });

    it("returns snapshots within a date range", async () => {
      (query as jest.Mock).mockResolvedValueOnce({ rows: [snapshot] });
      const startDate = "2024-06-01";
      const endDate = "2024-06-07";
      const result = await ActivityWatchStorage.listSnapshots(user_id, startDate, endDate);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining("AND date >= $2"),
        [user_id, startDate, endDate]
      );
      expect(result).toEqual([snapshot]);
    });
  });
});
