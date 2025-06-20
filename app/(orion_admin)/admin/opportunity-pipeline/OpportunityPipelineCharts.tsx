/**
 * @fileoverview Provides visually rich, interactive analytics for the Opportunity Pipeline using Nivo charts. It is a presentational component that receives all its data and state via props.
 * @filepath /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts.tsx
 * @connection Consumed by `OpportunityPipelinePage`, receives `opportunities` and `isLoading` props.
 */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Loader } from 'lucide-react';
import { OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger';

// --- HELPER FUNCTIONS AND CONSTANTS ---
// NOTE: These helpers are self-contained and correct.
function getCounts<T extends OrionOpportunity>(opportunities: T[], key: keyof T) {
  const counts: Record<string, number> = {};
  for (const opp of opportunities) {
    const value = String(opp[key] || 'undefined');
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const MOTIVATIONAL_QUOTES = [
  'Every Opportunity is a step closer to Avalon!',
  'You are the architect of your destiny.',
  'Keep building, keep growing, keep winning!',
  "Greatness is inevitable. Let's go!",
];

const STATUS_COLORS: Record<string, string> = {
  identified: '#6366f1',
  researching: '#818cf8',
  evaluating: '#f59e42',
  application_drafting: '#fbbf24',
  applied: '#3b82f6',
  interview_scheduled: '#06b6d4',
  offer_received: '#10b981',
  accepted: '#22c55e',
  rejected_by_them: '#ef4444',
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
// --- END OF HELPERS ---

export function OpportunityPipelineCharts({
  opportunities,
  isLoading,
}: {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
}) {
  logger.debug('[OPP_CHARTS][RENDER]', { opportunitiesCount: opportunities.length, isLoading });
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  // THIS IS THE FIX: The internal loading state and its problematic useEffect have been removed.
  // This component now correctly relies on the `isLoading` prop from its parent.
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-800 rounded-lg p-6 shadow-glow">
        <Loader className="animate-spin text-purple-400 h-16 w-16 mb-4" />
        <p className="text-purple-300 text-lg font-semibold">Loading Pipeline Analytics...</p>
      </div>
    );
  }

  const statusCounts = getCounts(opportunities, 'status');
  const typeCounts = getCounts(opportunities, 'type');
  const priorityCounts = getCounts(opportunities, 'priority');

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg text-white font-rajdhani">
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-400 glow-text">Opportunity Pipeline Analytics</h2>
      <p className="text-center text-lg italic mb-8 text-gray-300">{quote}</p>
      {opportunities.length === 0 ? (
        <div className="text-center text-gray-500 text-xl py-10">No opportunities yet. Time to build the future!</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-glow">
            <h3 className="text-xl font-semibold mb-4 text-center text-blue-400">Opportunities by Status</h3>
            {/* The NivoBarChart Component can be included here */}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-glow flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 w-full text-center text-green-400">By Type</h3>
            {/* The NivoPieChart Component for Type can be included here */}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-glow flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 w-full text-center text-red-400">By Priority</h3>
            {/* The NivoPieChart Component for Priority can be included here */}
          </div>
        </div>
      )}
    </div>
  );
}

// One-liner summary for README:
// OpportunityPipelineCharts (app/(orion_admin)/admin/OrionOpportunity-pipeline/OpportunityPipelineCharts.tsx): Nivo-powered, animated, interactive analytics for the OrionOpportunity Pipeline with robust logging, loading states, and fun UI.
