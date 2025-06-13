// app/narrative-clarity-studio/activitywatch-dashboard.tsx

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ActivityWatchStorage, AnalyticsSnapshot } from "@repo/shared/activitywatch_storage";

// D3.js is imported dynamically to avoid SSR issues
const d3 = typeof window !== "undefined" ? require("d3") : null;

type ChartData = {
  date: string;
  productivityScore: number;
  byCategory: Record<string, number>;
  anomalies: number;
};

const fetchSnapshots = async (user_id: string): Promise<ChartData[]> => {
  // Fetch all snapshots for the user
  const snapshots: AnalyticsSnapshot[] = await ActivityWatchStorage.listSnapshots(user_id);
  return snapshots.map(s => ({
    date: s.date,
    productivityScore: s.summary.productivityScore,
    byCategory: s.summary.byCategory,
    anomalies: s.summary.anomalies.length,
  }));
};

const COLORS = d3
  ? d3.schemeCategory10
  : [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];

export default function ActivityWatchDashboard({ user_id = "user123" }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSnapshots(user_id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [user_id]);

  useEffect(() => {
    if (!d3 || data.length === 0) return;

    // Clear previous SVGs
    d3.select("#productivity-line").selectAll("*").remove();
    d3.select("#category-bar").selectAll("*").remove();
    d3.select("#anomaly-bar").selectAll("*").remove();

    // Productivity Over Time (Line Chart)
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3
      .select("#productivity-line")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => d as string));

    svg.append("g").call(d3.axisLeft(y));

    // [LOG][DEBUG] Creating D3 line generator for productivityScore over time
    const line = d3
      .line()
      .x((d: any) => x(d.date)! + x.bandwidth() / 2)
      .y((d: any) => y(d.productivityScore));
    // [LOG][INFO] D3 line generator created for productivityScore

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Category Breakdown (Stacked Bar Chart)
    const categories = Array.from(
      new Set(data.flatMap((d: ChartData) => Object.keys(d.byCategory)))
    );
    const stack = d3.stack().keys(categories);
    const stackedData = stack(
      data.map((d: ChartData) => {
        const obj: any = { date: d.date };
        categories.forEach((cat: string) => {
          obj[cat] = d.byCategory[cat] || 0;
        });
        return obj;
      })
    );

    const barSvg = d3
      .select("#category-bar")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yBar = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d: ChartData) =>
          categories.reduce((sum: number, cat: string) => sum + (d.byCategory[cat] || 0), 0)
        ) || 1,
      ])
      .range([height, 0]);

    barSvg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => d as string));

    barSvg.append("g").call(d3.axisLeft(yBar));

    barSvg
      .selectAll("g.layer")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", (d: any, i: number) => COLORS[i % COLORS.length])
      .selectAll("rect")
      .data((d: any) => d)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.data.date)!)
      .attr("y", (d: any) => yBar(d[1]))
      .attr("height", (d: any) => yBar(d[0]) - yBar(d[1]))
      .attr("width", x.bandwidth());

    // Anomaly Count (Bar Chart)
    const anomalySvg = d3
      .select("#anomaly-bar")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yAnomaly = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.anomalies) || 1])
      .range([height, 0]);

    anomalySvg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((d: any) => d as string));

    anomalySvg.append("g").call(d3.axisLeft(yAnomaly));

    anomalySvg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: ChartData) => x(d.date)!)
      .attr("y", (d: ChartData) => yAnomaly(d.anomalies))
      .attr("height", (d: ChartData) => height - yAnomaly(d.anomalies))
      .attr("width", x.bandwidth())
      .attr("fill", "#d62728");
  }, [data]);

  return (
    <div>
      <h2>ActivityWatch Analytics Dashboard</h2>
      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <section>
            <h3>Productivity Over Time</h3>
            <svg id="productivity-line"></svg>
          </section>
          <section>
            <h3>Category Breakdown</h3>
            <svg id="category-bar"></svg>
          </section>
          <section>
            <h3>Anomaly Count</h3>
            <svg id="anomaly-bar"></svg>
          </section>
        </>
      )}
    </div>
  );
}
