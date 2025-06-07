// tests/activitywatch_service.test.ts

import axios from "axios";
import { ActivityWatchService } from "../lib/activitywatch_service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ActivityWatchService", () => {
  const baseUrl = "http://localhost:5600/api/0";
  let service: ActivityWatchService;

  beforeEach(() => {
    service = new ActivityWatchService(baseUrl);
    jest.clearAllMocks();
  });

  describe("isServerAvailable", () => {
    it("returns true if server responds", async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });
      await expect(service.isServerAvailable()).resolves.toBe(true);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/status`);
    });

    it("returns false if server is unreachable", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
      await expect(service.isServerAvailable()).resolves.toBe(false);
    });
  });

  describe("getBuckets", () => {
    it("returns buckets on success", async () => {
      const buckets = [{ id: "aw-watcher-window_mac" }, { id: "aw-watcher-afk_mac" }];
      mockedAxios.get.mockResolvedValueOnce({ data: buckets });
      await expect(service.getBuckets()).resolves.toEqual(buckets);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseUrl}/buckets`);
    });

    it("throws error and logs on failure", async () => {
      const error = new Error("API failure");
      mockedAxios.get.mockRejectedValueOnce(error);
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      await expect(service.getBuckets()).rejects.toThrow("Failed to fetch ActivityWatch buckets");
      expect(spy).toHaveBeenCalledWith(
        "[ActivityWatchService][getBuckets][ERROR]",
        { error }
      );
      spy.mockRestore();
    });
  });

  describe("getEvents", () => {
    const bucketId = "aw-watcher-window_mac";
    const startTime = "2024-06-01T00:00:00Z";
    const endTime = "2024-06-01T23:59:59Z";
    const events = [{ timestamp: startTime, data: { app: "Code" } }];

    it("returns events for valid bucket and time range", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: events });
      await expect(service.getEvents(bucketId, startTime, endTime)).resolves.toEqual(events);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/buckets/${encodeURIComponent(bucketId)}/events`,
        { params: { start: startTime, end: endTime } }
      );
    });

    it("accepts Date objects for time range", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: events });
      const start = new Date(startTime);
      const end = new Date(endTime);
      await expect(service.getEvents(bucketId, start, end)).resolves.toEqual(events);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${baseUrl}/buckets/${encodeURIComponent(bucketId)}/events`,
        { params: { start: start.toISOString(), end: end.toISOString() } }
      );
    });

    it("throws error and logs on failure", async () => {
      const error = new Error("API error");
      mockedAxios.get.mockRejectedValueOnce(error);
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      await expect(service.getEvents(bucketId, startTime, endTime)).rejects.toThrow(
        `Failed to fetch events for bucket: ${bucketId}`
      );
      expect(spy).toHaveBeenCalledWith(
        "[ActivityWatchService][getEvents][ERROR]",
        { bucketId, error }
      );
      spy.mockRestore();
    });
  });
});
