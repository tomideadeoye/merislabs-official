"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Progress, Label } from '@repo/ui';
import { UserCircle } from 'lucide-react';
import type { HabiticaUserStats } from '@repo/shared/types/habitica';

interface HabiticaStatsDisplayProps {
  stats: HabiticaUserStats;
  className?: string;
}

export const HabiticaStatsDisplay: React.FC<HabiticaStatsDisplayProps> = ({ stats, className }) => {
  if (!stats || !stats.stats) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardHeader>
          <CardTitle>Habitica Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading stats...</p>
        </CardContent>
      </Card>
    );
  }
  const userStats = stats.stats;
  const userName = stats.profile?.name || 'Habitica User';

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <UserCircle className="mr-2 h-5 w-5 text-amber-400" />
          {userName}&apos;s Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Level</p>
            <p className="text-xl font-bold text-amber-400">{userStats.lvl}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Class</p>
            <p className="text-xl font-bold text-purple-400">{userStats.class || 'Warrior'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-400 flex justify-between">
              <span>Health</span>
              <span>{Math.floor(userStats.hp)} / {userStats.maxHealth}</span>
            </Label>
            <Progress
              value={(userStats.hp / userStats.maxHealth) * 100}
              className="h-2"
              indicatorClassName="bg-red-500"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400 flex justify-between">
              <span>Experience</span>
              <span>{Math.floor(userStats.exp)} / {userStats.toNextLevel}</span>
            </Label>
            <Progress
              value={(userStats.exp / userStats.toNextLevel) * 100}
              className="h-2"
              indicatorClassName="bg-yellow-500"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-400 flex justify-between">
              <span>Mana</span>
              <span>{Math.floor(userStats.mp)} / {userStats.maxMP}</span>
            </Label>
            <Progress
              value={(userStats.mp / userStats.maxMP) * 100}
              className="h-2"
              indicatorClassName="bg-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <p className="text-sm text-gray-400">Gold</p>
          <p className="text-lg font-medium text-yellow-400">{userStats.gp.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
