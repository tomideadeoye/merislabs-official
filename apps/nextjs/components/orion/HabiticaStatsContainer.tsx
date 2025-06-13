"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedhooks/useSessionState';
import { HabiticaStatsDisplay } from './HabiticaStatsDisplay';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { HabiticaUserStats } from '@repo/shared/types/habitica';

interface HabiticaStatsContainerProps {
  className?: string;
}

export const HabiticaStatsContainer: React.FC<HabiticaStatsContainerProps> = ({ className }) => {
  const [stats, setStats] = useState<HabiticaUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  const fetchStats = useCallback(async () => {
    if (!habiticaUserId || !habiticaApiToken) {
      setError("Habitica User ID or API Token not configured in settings.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/habitica/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response.' }));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch Habitica stats');
      }
    } catch (err: any) {
      console.error('Error fetching Habitica stats:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [habiticaUserId, habiticaApiToken]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        <span className="ml-2 text-gray-400">Loading Habitica stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-gray-400 p-4">
        No stats available. Please check your Habitica credentials.
      </div>
    );
  }

  return <HabiticaStatsDisplay stats={stats} className={className} />;
};
