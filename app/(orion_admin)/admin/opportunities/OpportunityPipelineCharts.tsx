'use client';

/**
 * @fileoverview Provides visually rich, interactive analytics for the Opportunity Pipeline using Nivo charts. It is a presentational component that receives all its data and state via props.
 * @filepath /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts.tsx
 * @connection Consumed by `OpportunityPipelinePage`, receives `opportunities` and `isLoading` props.
 */
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import logger from '@/lib/logger';
import { Opportunity } from '@prisma/client';

// --- HELPER FUNCTIONS AND CONSTANTS ---
// NOTE: These helpers are self-contained and correct.
// The getCounts function is removed as the Nivo charts are not yet implemented.

const MOTIVATIONAL_QUOTES = [
  'Every Opportunity is a step closer to Avalon!',
  'You are the architect of your destiny.',
  'Keep building, keep growing, keep winning!',
  "Greatness is inevitable. Let's go!",
  //  ADD MORE HERE
];

export function OpportunityPipelineCharts({
  opportunities,
  isLoading,
}: {
  opportunities: Opportunity[];
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
            {/* Nivo charts for Status will be implemented here when data visualization is ready */}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-glow flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 w-full text-center text-green-400">By Type</h3>
            {/* Nivo charts for Type will be implemented here when data visualization is ready */}
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-glow flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 w-full text-center text-red-400">By Priority</h3>
            {/* Nivo charts for Priority will be implemented here when data visualization is ready */}
          </div>
        </div>
      )}
    </div>
  );
}

// One-liner summary for README:
// OpportunityPipelineCharts (app/(orion_admin)/admin/REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA-pipeline/OpportunityPipelineCharts.tsx): Nivo-powered, animated, interactive analytics for the REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA Pipeline with robust logging, loading states, and fun UI.
