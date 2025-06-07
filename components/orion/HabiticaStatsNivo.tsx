"use client";

import React, { useEffect, useState } from "react";
import { useSessionState, SessionStateKeys } from "@/hooks/useSessionState";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Loader2, AlertTriangle } from "lucide-react";

interface HabiticaStatsNivoProps {
  className?: string;
}

const NivoBarChart = ({ data }: { data: any[] }) => (
    <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="label"
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Stats',
            legendPosition: 'middle',
            legendOffset: 32,
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        theme={{
            axis: {
                ticks: { text: { fill: "#a1a1aa" } },
                legend: { text: { fill: "#a1a1aa" } },
            },
            labels: { text: { fill: "#ffffff" } },
            tooltip: {
                container: {
                    background: "#27272a",
                    color: "#e4e4e7",
                    border: "1px solid #3f3f46",
                },
            },
        }}
    />
);

const NivoPieChart = ({ data }: { data: any[] }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#a1a1aa"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        theme={{
             tooltip: {
                container: {
                    background: "#27272a",
                    color: "#e4e4e7",
                    border: "1px solid #3f3f46",
                },
            },
        }}
    />
);


export const HabiticaStatsNivo: React.FC<HabiticaStatsNivoProps> = ({ className }) => {
  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    async function fetchStatsAndTasks() {
      if (!habiticaUserId || !habiticaApiToken) {
        setError("Habitica credentials are not set.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const statsRes = await fetch("/api/orion/habitica/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken }),
        });
        const statsData = await statsRes.json();
        if (!statsData.success) throw new Error(statsData.error || "Failed to fetch stats");
        setStats(statsData.data);

        const tasksRes = await fetch("/api/orion/habitica/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken }),
        });
        const tasksData = await tasksRes.json();
        if (!tasksData.success) throw new Error(tasksData.error || "Failed to fetch tasks");
        setTasks([...tasksData.todos, ...tasksData.dailys, ...tasksData.habits, ...tasksData.rewards]);

      } catch (err: any) {
        setError(err.message || "Failed to load Habitica data");
      } finally {
          setIsLoading(false);
      }
    }
    fetchStatsAndTasks();
  }, [habiticaUserId, habiticaApiToken]);

  const statsChartData = stats ? [
      { label: "Health", value: Math.floor(stats.stats.hp) },
      { label: "Exp", value: Math.floor(stats.stats.exp) },
      { label: "Mana", value: Math.floor(stats.stats.mp) },
      { label: "Gold", value: Math.floor(stats.stats.gp) },
    ] : [];

  const tasksChartData = tasks.length > 0 ? [
      { id: "Completed", label: "Completed", value: tasks.filter(t => t.completed).length },
      { id: "Incomplete", label: "Incomplete", value: tasks.filter(t => !t.completed).length },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 h-96">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="ml-3 text-gray-400">Loading Habitica Charts...</span>
      </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center h-96">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <div>
                <p className="font-bold">Error loading Habitica data</p>
                <p className="text-sm">{error}</p>
            </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2 text-center text-gray-300">Habitica Stats</h3>
      <div style={{ height: '300px' }}>
        <NivoBarChart data={statsChartData} />
      </div>
      <h4 className="text-md font-semibold mt-6 mb-2 text-center text-gray-300">Task Completion</h4>
      <div style={{ height: '250px' }}>
        <NivoPieChart data={tasksChartData} />
      </div>
    </div>
  );
};

export default HabiticaStatsNivo;
