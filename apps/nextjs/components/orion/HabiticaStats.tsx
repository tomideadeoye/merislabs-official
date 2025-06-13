"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Progress } from '@repo/ui';
import { Loader2, Heart, Zap, Star, Coins } from 'lucide-react';
import type { HabiticaUserStats } from '@repo/shared/types/habitica';

interface HabiticaStatsProps {
  className?: string;
}

export const HabiticaStats: React.FC<HabiticaStatsProps> = ({ className }) => {
  const [stats, setStats] = useState<HabiticaUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/habitica/user');
      const data = await response.json();

      if (data.success) {
        setStats(data.userStats);
      } else {
        throw new Error(data.error || 'Failed to fetch Habitica stats');
      }
    } catch (err: any) {
      console.error('Error fetching Habitica stats:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <span className="ml-2 text-gray-400">Loading Habitica stats...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4">
          <p className="text-red-400">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats || !stats.stats) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4">
          <p className="text-gray-400">No Habitica stats available.</p>
        </CardContent>
      </Card>
    );
  }

  const { hp, maxHealth, mp, maxMP, exp, toNextLevel, lvl, gp } = stats.stats;
  const username = stats.profile?.name || stats.auth?.local?.username || 'Habitican';

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-purple-400">{username}&apos;s Stats</h3>
          <div className="text-gray-300">Level {lvl}</div>
        </div>

        <div className="space-y-4">
          {/* Health */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-400" />
                <span className="text-sm text-gray-300">Health</span>
              </div>
              <span className="text-sm text-gray-300">{Math.round(hp)}/{maxHealth}</span>
            </div>
            <Progress value={(hp / maxHealth) * 100} className="h-2 bg-gray-700" indicatorClassName="bg-red-500" />
          </div>

          {/* Mana */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-blue-400" />
                <span className="text-sm text-gray-300">Mana</span>
              </div>
              <span className="text-sm text-gray-300">{Math.round(mp)}/{maxMP}</span>
            </div>
            <Progress value={(mp / maxMP) * 100} className="h-2 bg-gray-700" indicatorClassName="bg-blue-500" />
          </div>

          {/* Experience */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span className="text-sm text-gray-300">Experience</span>
              </div>
              <span className="text-sm text-gray-300">{Math.round(exp)}/{toNextLevel}</span>
            </div>
            <Progress value={(exp / toNextLevel) * 100} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-500" />
          </div>

          {/* Gold */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm text-gray-300">Gold</span>
            </div>
            <span className="text-sm text-gray-300">{Math.floor(gp)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
