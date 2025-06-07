// lib/activitywatch_processor.ts

/**
 * ActivityWatchProcessor
 * - Categorizes ActivityWatch events (e.g., work, social, entertainment)
 * - Detects anomalies in usage patterns
 * - Computes productivity scores
 * - Designed for extensibility and robust analytics
 */

export type ActivityEvent = {
  timestamp: string;
  data: {
    app: string;
    title?: string;
    [key: string]: any;
  };
};

export type CategorizedEvent = ActivityEvent & {
  category: string;
  productivityScore: number;
  anomaly?: boolean;
};

export type ProductivitySummary = {
  totalTime: number; // in seconds
  byCategory: Record<string, number>;
  productivityScore: number;
  anomalies: CategorizedEvent[];
};

/**
 * Default mapping of app names to categories.
 * Extend this as new use cases arise.
 * Supports user-defined overrides via the second argument to categorizeEvent.
 */
const DEFAULT_APP_CATEGORY_MAP: Record<string, string> = {
  "Code": "work",
  "Terminal": "work",
  "Slack": "communication",
  "Discord": "social",
  "Chrome": "browsing",
  "Safari": "browsing",
  "YouTube": "entertainment",
  "Spotify": "entertainment",
  "Notion": "productivity",
  "Figma": "design",
  "Photoshop": "design",
  "Excel": "work",
  "Word": "work",
  "PowerPoint": "work",
  "Teams": "communication",
  "Zoom": "communication",
  "Gmail": "communication",
  "Outlook": "communication",
  "Twitter": "social",
  "Facebook": "social",
  "Instagram": "social",
  "Reddit": "browsing",
  "VSCode": "work",
  "IntelliJ": "work",
  "Jupyter": "work",
  "Steam": "gaming",
  "Minecraft": "gaming",
  "League of Legends": "gaming",
  // Add more mappings as needed
};

const DEFAULT_CATEGORY_PRODUCTIVITY: Record<string, number> = {
  "work": 1.0,
  "productivity": 0.9,
  "design": 0.8,
  "communication": 0.7,
  "browsing": 0.5,
  "social": 0.3,
  "entertainment": 0.1,
  "gaming": 0.05,
};

export class ActivityWatchProcessor {
  /**
   * Categorize an event based on app name.
   */
  /**
   * Categorize an event based on app name, with optional user overrides.
   * @param event - The activity event to categorize
   * @param userCategoryMap - Optional user-defined app-to-category mapping
   * @param userProductivityMap - Optional user-defined category-to-productivity mapping
   */
  static categorizeEvent(
    event: ActivityEvent,
    userCategoryMap?: Record<string, string>,
    userProductivityMap?: Record<string, number>
  ): CategorizedEvent {
    const app = event.data.app || "";
    const categoryMap = { ...DEFAULT_APP_CATEGORY_MAP, ...(userCategoryMap || {}) };
    const productivityMap = { ...DEFAULT_CATEGORY_PRODUCTIVITY, ...(userProductivityMap || {}) };
    const category = categoryMap[app] || "other";
    const productivityScore = productivityMap[category] ?? 0.0;
    return {
      ...event,
      category,
      productivityScore,
    };
  }

  /**
   * Detect anomalies in a list of categorized events.
   * Flags events with unusually low productivity or rare app usage.
   */
  static detectAnomalies(events: CategorizedEvent[]): CategorizedEvent[] {
    const appCounts: Record<string, number> = {};
    events.forEach(e => {
      appCounts[e.data.app] = (appCounts[e.data.app] || 0) + 1;
    });
    const total = events.length;
    return events.map(e => {
      // Anomaly if productivity is very low or app is rarely used (<5% of total)
      const isAnomaly =
        e.productivityScore < 0.2 ||
        (appCounts[e.data.app] / total < 0.05);
      return { ...e, anomaly: isAnomaly };
    });
  }

  /**
   * Summarize productivity for a list of events.
   * Returns total time, time by category, overall productivity score, and anomalies.
   * @param events - List of ActivityEvents (must include duration in data if available)
   */
  static summarizeProductivity(events: ActivityEvent[]): ProductivitySummary {
    let totalTime = 0;
    const byCategory: Record<string, number> = {};
    let weightedProductivity = 0;

    // Assume each event has a 'duration' field in seconds (fallback to 60s if missing)
    const categorized = events.map(e => {
      // Optionally, pass user-defined mappings here in the future
      const ce = this.categorizeEvent(e);
      const duration = e.data.duration ?? 60;
      totalTime += duration;
      byCategory[ce.category] = (byCategory[ce.category] || 0) + duration;
      weightedProductivity += ce.productivityScore * duration;
      return { ...ce, data: { ...ce.data, duration } };
    });

    const anomalies = this.detectAnomalies(categorized);
    const overallProductivity = totalTime > 0 ? weightedProductivity / totalTime : 0;

    return {
      totalTime,
      byCategory,
      productivityScore: Number(overallProductivity.toFixed(2)),
      anomalies: anomalies.filter(e => e.anomaly),
    };
  }
}
