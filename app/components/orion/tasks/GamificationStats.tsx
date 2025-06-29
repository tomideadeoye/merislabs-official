
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';

interface GamificationStats {
  currentStreak: number;
  longestStreak: number;
  achievements: any[];
}

export const GamificationStats: React.FC = () => {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/api/orion/gamification');
        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          throw new Error(response.data.error || 'Failed to fetch gamification stats');
        }
      } catch (err: unknown) {
        logger.error(
          `Error fetching gamification stats: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
          { originalError: err }
        );
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading Stats...</span>
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Gamification Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {stats ? (
          <div>
            <p>Current Streak: {stats.currentStreak}</p>
            <p>Longest Streak: {stats.longestStreak}</p>
            <p>Achievements: {stats.achievements.length}</p>
          </div>
        ) : (
          <p>No stats available.</p>
        )}
      </CardContent>
    </Card>
  );
};
