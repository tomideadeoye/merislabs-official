/**
 * OpportunityPipelineCharts
 * GOAL: Visually rich, interactive, and fun analytics for the OrionOpportunity Pipeline using Nivo.
 * Features animated Nivo bar and pie charts, robust context-rich logging, loading/progress states, motivational UI, and error handling.
 * File: app/(orion_admin)/admin/OrionOpportunity-pipeline/OpportunityPipelineCharts.tsx
 * Related: OpportunityPipelinePage, OpportunityList, OpportunityKanbanView, Loader, ProgressBar
 */

"use client";

import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { OrionOpportunity } from '@repo/shared';
import { Loader, Progress } from "@repo/ui";

// Utility: Count opportunities by a key
function getCounts<T extends OrionOpportunity>(opportunities: T[], key: keyof T) {
  const counts: Record<string, number> = {};
  for (const opp of opportunities) {
    const value = opp[key];
    if (!value) continue;
    counts[String(value)] = (counts[String(value)] || 0) + 1;
  }
  return counts;
}

const STATUS_COLORS: Record<string, string> = {
  identified: "#6366f1",
  researching: "#818cf8",
  evaluating: "#f59e42",
  evaluated_positive: "#22c55e",
  evaluated_negative: "#ef4444",
  application_drafting: "#fbbf24",
  application_ready: "#f59e42",
  applied: "#3b82f6",
  interview_scheduled: "#06b6d4",
  interview_completed: "#0ea5e9",
  offer_received: "#10b981",
  negotiating: "#f59e42",
  accepted: "#22c55e",
  rejected_by_them: "#ef4444",
  declined_by_me: "#f87171",
};

const STATUS_LABELS: Record<string, string> = {
  identified: "Identified",
  researching: "Researching",
  evaluating: "Evaluating",
  evaluated_positive: "Evaluated +",
  evaluated_negative: "Evaluated -",
  application_drafting: "Drafting",
  application_ready: "Ready",
  applied: "Applied",
  interview_scheduled: "Interview",
  interview_completed: "Interviewed",
  offer_received: "Offer",
  negotiating: "Negotiating",
  accepted: "Accepted",
  rejected_by_them: "Rejected",
  declined_by_me: "Declined",
};

const TYPE_COLORS: Record<string, string> = {
  job: "#6366f1",
  education_program: "#f59e42",
  project_collaboration: "#22c55e",
  other: "#a21caf",
};

const PRIORITY_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#fbbf24",
  low: "#3b82f6",
  undefined: "#6b7280",
};

const MOTIVATIONAL_QUOTES = [
  "Every OrionOpportunity is a step closer to Avalon!",
  "You are the architect of your destiny.",
  "Keep building, keep growing, keep winning!",
  "Greatness is inevitable. Let's go!",
  "Your pipeline is your power.",
  "Every application is a new adventure.",
  "You are unstoppable, Tomide!",
];

function useMotivationalQuote() {
  const [quote, setQuote] = useState("");
  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);
  return quote;
}

function NivoBarChart({ data, labels, colors }: {
  data: Record<string, number>;
  labels: Record<string, string>;
  colors: Record<string, string>;
}) {
  const chartData = Object.keys(data).map(key => ({
    label: labels[key] || key,
    value: data[key],
    color: colors[key] || "#6366f1"
  }));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveBar
        data={chartData}
        keys={["value"]}
        indexBy="label"
        margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
        padding={0.3}
        colors={({ data }: { data: { color: string } }) => data.color}
        borderRadius={6}
        enableLabel={true}
        labelTextColor="#fff"
        theme={{
          tooltip: { container: { background: "#222", color: "#fff" } },
          axis: { ticks: { text: { fill: "#ccc" } } }
        }}
        animate={true}
        axisBottom={{
          tickRotation: 30,
        }}
      />
    </div>
  );
}

function NivoPieChart({
  data,
  colors,
  labels,
  label,
}: {
  data: Record<string, number>;
  colors: Record<string, string>;
  labels: Record<string, string>;
  label: string;
}) {
  const chartData = Object.keys(data).map(key => ({
    id: key,
    label: labels[key] || key,
    value: data[key],
    color: colors[key] || "#6366f1"
  }));

  return (
    <div className="flex flex-col items-center mx-4" style={{ width: 220, height: 220 }}>
      <ResponsivePie
        data={chartData}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={6}
        colors={({ data }: { data: { color: string } }) => data.color}
        borderWidth={2}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        arcLabelsSkipAngle={10}
        animate={true}
        theme={{
          tooltip: { container: { background: "#222", color: "#fff" } }
        }}
      />
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

export function OpportunityPipelineCharts({ opportunities }: { opportunities: OrionOpportunity[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quote = useMotivationalQuote();

  // [LOG][INFO] Chart component mounted
  useEffect(() => {
    console.info("[OPPORTUNITY_PIPELINE_CHARTS][MOUNTED]", { opportunitiesCount: opportunities.length });
    return () => {
      console.info("[OPPORTUNITY_PIPELINE_CHARTS][UNMOUNTED]");
    };
  }, [opportunities.length]);

  // Simulate loading for async fetch/animation
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900); // Simulate fetch/animation
  }, [opportunities]);

  try {
    if (loading) {
      // [LOG][INFO] Showing Loader
      return (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6 flex flex-col items-center">
          <Loader />
        </div>
      );
    }

    if (opportunities.length === 0) {
      // [LOG][WARN] No opportunities to visualize
      return (
        <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6 text-gray-400">
          No opportunities to visualize.
        </div>
      );
    }

    // Data prep
    const statusCounts = getCounts(opportunities, "status");
    const typeCounts = getCounts(opportunities, "type");
    const priorityCounts = getCounts(opportunities, "priority");

    // [LOG][INFO] Rendering OpportunityPipelineCharts
    console.info("[OPPORTUNITY_PIPELINE_CHARTS][RENDER]", {
      statusCounts, typeCounts, priorityCounts, total: opportunities.length,
    });

    return (
      <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Pipeline Visual Analytics</h3>
        <div className="mb-2 text-sm text-indigo-300 font-bold text-center animate-pulse">{quote}</div>
        {/* Nivo Bar Chart: Status */}
        <div className="w-full overflow-x-auto">
          <NivoBarChart data={statusCounts} labels={STATUS_LABELS} colors={STATUS_COLORS} />
        </div>
        <div className="text-xs text-gray-400 mt-2 mb-4">
          <span className="mr-2">Total: {opportunities.length}</span>
          <span className="mr-2">Statuses: {Object.keys(statusCounts).length}</span>
        </div>
        {/* Nivo Pie Charts */}
        <div className="flex flex-wrap justify-center gap-8">
          <NivoPieChart
            data={typeCounts}
            colors={TYPE_COLORS}
            labels={{
              job: "Job",
              education_program: "Education",
              project_collaboration: "Collab",
              other: "Other",
            }}
            label="By Type"
          />
          <NivoPieChart
            data={priorityCounts}
            colors={PRIORITY_COLORS}
            labels={{
              high: "High",
              medium: "Medium",
              low: "Low",
              undefined: "Unspecified",
            }}
            label="By Priority"
          />
        </div>
        {/* Gamification/Badge */}
        <div className="mt-4 flex flex-col items-center">
          {opportunities.length >= 10 && (
            <div className="bg-green-700 text-white px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
              Pipeline Pro: 10+ Opportunities!
            </div>
          )}
          {opportunities.length >= 25 && (
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold shadow-lg animate-bounce mt-2">
              Pipeline Master: 25+ Opportunities!
            </div>
          )}
        </div>
      </div>
    );
  } catch (err: any) {
    // [LOG][ERROR] Chart render error
    console.error("[OPPORTUNITY_PIPELINE_CHARTS][ERROR]", { error: err, opportunities });
    setError("Failed to render pipeline analytics. Please try again.");
    return (
      <div className="bg-red-900 border border-red-700 rounded p-4 mb-6 text-red-200">
        Error: {error}
      </div>
    );
  }
}

// One-liner summary for README:
// OpportunityPipelineCharts (app/(orion_admin)/admin/OrionOpportunity-pipeline/OpportunityPipelineCharts.tsx): Nivo-powered, animated, interactive analytics for the OrionOpportunity Pipeline with robust logging, loading states, and fun UI.
