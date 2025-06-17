/**
 * GOAL OF FILE|FEATURES|FUNCTIONS: Provides visually rich, interactive analytics for the Opportunity Pipeline using Nivo charts (bar and pie). Displays opportunities by status, type, and priority. Includes loading/error states and motivational quotes.
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts.tsx
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumed by `OpportunityPipelinePage` (`app/(orion_admin)/admin/opportunity-pipeline/page.tsx`).
 *   - Receives `opportunities` data and `isLoading` prop from the parent.
 *   - Uses `@nivo/bar` and `@nivo/pie` for chart rendering.
 *   - Uses `OrionOpportunity` type (`@/lib/types`).
 *   - Uses `logger` (`@/lib/logger`) for extensive logging.
 * Related: OpportunityPipelinePage, OpportunityList, OpportunityKanbanView, Loader, ProgressBar
 */

'use client';

import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Loader } from 'lucide-react';
import { OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger';

// Utility: Count opportunities by a key
function getCounts<T extends OrionOpportunity>(opportunities: T[], key: keyof T) {
  logger.debug('[ORION_OPPORTUNITY_CHARTS][UTILITY][GET_COUNTS][START]', {
    opportunitiesCount: opportunities.length,
    key: String(key),
  });
  const counts: Record<string, number> = {};
  for (const opp of opportunities) {
    const value = opp[key];
    if (!value) continue;
    counts[String(value)] = (counts[String(value)] || 0) + 1;
  }
  logger.debug('[ORION_OPPORTUNITY_CHARTS][UTILITY][GET_COUNTS][END]', { counts });
  return counts;
}

const STATUS_COLORS: Record<string, string> = {
  identified: '#6366f1',
  researching: '#818cf8',
  evaluating: '#f59e42',
  evaluated_positive: '#22c55e',
  evaluated_negative: '#ef4444',
  application_drafting: '#fbbf24',
  application_ready: '#f59e42',
  applied: '#3b82f6',
  interview_scheduled: '#06b6d4',
  interview_completed: '#0ea5e9',
  offer_received: '#10b981',
  negotiating: '#f59e42',
  accepted: '#22c55e',
  rejected_by_them: '#ef4444',
  declined_by_me: '#f87171',
};

const STATUS_LABELS: Record<string, string> = {
  identified: 'Identified',
  researching: 'Researching',
  evaluating: 'Evaluating',
  evaluated_positive: 'Evaluated +',
  evaluated_negative: 'Evaluated -',
  application_drafting: 'Drafting',
  application_ready: 'Ready',
  applied: 'Applied',
  interview_scheduled: 'Interview',
  interview_completed: 'Interviewed',
  offer_received: 'Offer',
  negotiating: 'Negotiating',
  accepted: 'Accepted',
  rejected_by_them: 'Rejected',
  declined_by_me: 'Declined',
};

const TYPE_COLORS: Record<string, string> = {
  job: '#6366f1',
  educationProgram: '#f59e42',
  projectCollaboration: '#22c55e',
  other: '#a21caf',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#fbbf24',
  low: '#3b82f6',
  undefined: '#6b7280',
};

const MOTIVATIONAL_QUOTES = [
  'Every Opportunity is a step closer to Avalon!',
  'You are the architect of your destiny.',
  'Keep building, keep growing, keep winning!',
  "Greatness is inevitable. Let's go!",
  'Your pipeline is your power.',
  'Every application is a new adventure.',
  'You are unstoppable, Tomide!',
];

function useMotivationalQuote() {
  logger.debug('[ORION_OPPORTUNITY_CHARTS][HOOK][USE_MOTIVATIONAL_QUOTE][START]');
  const [quote, setQuote] = useState('');
  useEffect(() => {
    const newQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(newQuote);
    logger.debug('[ORION_OPPORTUNITY_CHARTS][HOOK][USE_MOTIVATIONAL_QUOTE][SET_QUOTE]', { newQuote });
  }, []);
  logger.debug('[ORION_OPPORTUNITY_CHARTS][HOOK][USE_MOTIVATIONAL_QUOTE][END]', { currentQuote: quote });
  return quote;
}

function NivoBarChart({
  data,
  labels,
  colors,
}: {
  data: Record<string, number>;
  labels: Record<string, string>;
  colors: Record<string, string>;
}) {
  logger.debug('[ORION_OPPORTUNITY_CHARTS][COMPONENT][NIVO_BAR_CHART][RENDER]', { data, labels, colors });
  const chartData = Object.keys(data).map((key) => ({
    label: labels[key] || key,
    value: data[key],
    color: colors[key] || '#6366f1',
  }));

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveBar
        data={chartData}
        keys={['value']}
        indexBy="label"
        margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
        padding={0.3}
        colors={({ data }: { data: { color: string } }) => data.color}
        borderRadius={6}
        enableLabel={true}
        labelTextColor="#fff"
        theme={{
          tooltip: { container: { background: '#222', color: '#fff' } },
          axis: { ticks: { text: { fill: '#ccc' } } },
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
  logger.debug('[ORION_OPPORTUNITY_CHARTS][COMPONENT][NIVO_PIE_CHART][RENDER]', {
    data,
    colors,
    labels,
    chartLabel: label,
  });
  const chartData = Object.keys(data).map((key) => ({
    id: key,
    label: labels[key] || key,
    value: data[key],
    color: colors[key] || '#6366f1',
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
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLabelsSkipAngle={10}
        animate={true}
        theme={{
          tooltip: { container: { background: '#222', color: '#fff' } },
        }}
      />
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

export function OpportunityPipelineCharts({
  opportunities,
  isLoading,
}: {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
}) {
  logger.debug('[ORION_OPPORTUNITY_CHARTS][COMPONENT][OPPORTUNITY_PIPELINE_CHARTS][RENDER]', {
    opportunitiesCount: opportunities.length,
    isLoading,
  });
  const quote = useMotivationalQuote();

  useEffect(() => {
    logger.info('[OPPORTUNITY_PIPELINE_CHARTS][MOUNTED]', { opportunitiesCount: opportunities.length });
    return () => {
      logger.info('[OPPORTUNITY_PIPELINE_CHARTS][UNMOUNTED]');
    };
  }, [opportunities.length]);

  try {
    if (isLoading) {
      logger.debug('[ORION_OPPORTUNITY_CHARTS][RENDER][LOADING_STATE]', { isLoading: true });
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-800 rounded-lg p-6 shadow-glow">
          <Loader className="animate-spin text-purple-400 h-16 w-16 mb-4" />
          <p className="text-purple-300 text-lg font-semibold">Loading cosmic insights...</p>
        </div>
      );
    }

    const statusCounts = getCounts(opportunities, 'status');
    const typeCounts = getCounts(opportunities, 'type');
    const priorityCounts = getCounts(opportunities, 'priority');

    logger.debug('[ORION_OPPORTUNITY_CHARTS][DATA_PREP][COUNTS]', { statusCounts, typeCounts, priorityCounts });

    return (
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg text-white font-rajdhani">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-400 glow-text">
          Opportunity Pipeline Analytics
        </h2>
        <p className="text-center text-lg italic mb-8 text-gray-300">{quote}</p>

        {opportunities.length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-10">
            No opportunities yet. Time to manifest some magic!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-800 p-4 rounded-lg shadow-glow">
                <h3 className="text-xl font-semibold mb-4 text-center text-blue-400">Opportunities by Status</h3>
                <NivoBarChart data={statusCounts} labels={STATUS_LABELS} colors={STATUS_COLORS} />
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-glow flex flex-wrap justify-center items-center">
                <h3 className="text-xl font-semibold mb-4 w-full text-center text-green-400">
                  Breakdown by Type & Priority
                </h3>
                <NivoPieChart data={typeCounts} labels={STATUS_LABELS} colors={TYPE_COLORS} label="Type" />
                <NivoPieChart data={priorityCounts} labels={STATUS_LABELS} colors={PRIORITY_COLORS} label="Priority" />
              </div>
            </div>

            <div className="text-center mt-8 text-gray-400 text-sm">
              <p>
                Total Opportunities: <span className="text-purple-300 font-bold text-lg">{opportunities.length}</span>
              </p>
              <p className="mt-2">
                Insight: <span className="text-blue-300">Visualize your path to Avalon.</span>
              </p>
            </div>
          </>
        )}
      </div>
    );
  } catch (error: unknown) {
    logger.error('[ORION_OPPORTUNITY_CHARTS][RENDER_ERROR]', { error });
    return (
      <div className="text-center text-red-500 text-xl py-10 bg-gray-800 rounded-lg p-6 shadow-glow">
        <p>An error occurred while rendering the charts.</p>
        <p>Please check the console for details.</p>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}

// One-liner summary for README:
// OpportunityPipelineCharts (app/(orion_admin)/admin/OrionOpportunity-pipeline/OpportunityPipelineCharts.tsx): Nivo-powered, animated, interactive analytics for the OrionOpportunity Pipeline with robust logging, loading states, and fun UI.
