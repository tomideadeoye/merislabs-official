// tests/activitywatch_processor.test.ts

import {
  ActivityWatchProcessor,
  ActivityEvent,
  CategorizedEvent,
  ProductivitySummary,
} from "../lib/activitywatch_processor";

describe("ActivityWatchProcessor", () => {
  const baseEvent = (app: string, duration = 60): ActivityEvent => ({
    timestamp: "2024-06-01T12:00:00Z",
    data: { app, duration },
  });

  describe("categorizeEvent", () => {
    it("categorizes known apps correctly", () => {
      const event = baseEvent("Code");
      const result = ActivityWatchProcessor.categorizeEvent(event);
      expect(result.category).toBe("work");
      expect(result.productivityScore).toBe(1.0);
    });

    it("categorizes unknown apps as 'other' with 0 productivity", () => {
      const event = baseEvent("UnknownApp");
      const result = ActivityWatchProcessor.categorizeEvent(event);
      expect(result.category).toBe("other");
      expect(result.productivityScore).toBe(0.0);
    });
  });

  describe("detectAnomalies", () => {
    it("flags events with low productivity as anomalies", () => {
      const events: CategorizedEvent[] = [
        { ...baseEvent("YouTube"), category: "entertainment", productivityScore: 0.1 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
      ];
      const result = ActivityWatchProcessor.detectAnomalies(events);
      expect(result[0].anomaly).toBe(true);
      expect(result[1].anomaly).toBe(false);
    });

    it("flags rare app usage as anomalies", () => {
      const events: CategorizedEvent[] = [
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("RareApp"), category: "other", productivityScore: 0.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
        { ...baseEvent("Code"), category: "work", productivityScore: 1.0 },
      ];
      const result = ActivityWatchProcessor.detectAnomalies(events);
      // "RareApp" should be flagged as anomaly due to rare usage
      expect(result[1].anomaly).toBe(true);
    });
  });

  describe("summarizeProductivity", () => {
    it("computes total time, byCategory, and productivityScore", () => {
      const events: ActivityEvent[] = [
        baseEvent("Code", 120),
        baseEvent("YouTube", 60),
        baseEvent("Slack", 30),
      ];
      const summary: ProductivitySummary = ActivityWatchProcessor.summarizeProductivity(events);
      expect(summary.totalTime).toBe(210);
      expect(summary.byCategory).toEqual({
        work: 120,
        entertainment: 60,
        communication: 30,
      });
      // Weighted productivity: (120*1.0 + 60*0.1 + 30*0.7) / 210 = (120 + 6 + 21) / 210 = 147/210 ≈ 0.7
      expect(summary.productivityScore).toBeCloseTo(0.7, 1);
    });

    it("handles empty event list gracefully", () => {
      const summary = ActivityWatchProcessor.summarizeProductivity([]);
      expect(summary.totalTime).toBe(0);
      expect(summary.byCategory).toEqual({});
      expect(summary.productivityScore).toBe(0);
      expect(summary.anomalies).toEqual([]);
    });

    it("returns anomalies in the summary", () => {
      const events: ActivityEvent[] = [
        baseEvent("YouTube", 60),
        baseEvent("Code", 60),
      ];
      const summary = ActivityWatchProcessor.summarizeProductivity(events);
      // YouTube event should be an anomaly (low productivity)
      expect(summary.anomalies.length).toBeGreaterThanOrEqual(1);
      expect(summary.anomalies.some(e => e.data.app === "YouTube")).toBe(true);
    });
  });
});
