'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/ui';
import { Heart, Sparkles, Wand, Coins } from 'lucide-react';
import type { HabiticaUserStats } from '@/types/habitica';

interface HabiticaStatsDisplayProps {
  stats: HabiticaUserStats | null;
  className?: string;
}

export const HabiticaStatsDisplay: React.FC<HabiticaStatsDisplayProps> = ({ stats, className }) => {
  if (!stats) {
    return (
      <Card className={`bg-gray-800 border-gray-700 ${className}`}>
        <CardContent className="p-4">
          <p className="text-gray-400">No Habitica stats available.</p>
        </CardContent>
      </Card>
    );
  }

  const { hp, maxHealth, mp, maxMP, exp, toNextLevel, lvl, gp, class: habiticaClass } = stats;

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-300">Habitica Character Stats</CardTitle>
        <CardDescription className="text-gray-400">Level {lvl}</CardDescription>
        <p className="text-xl font-bold text-purple-400">{habiticaClass || 'Warrior'}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-400" />
          <span>
            HP: {Math.round(hp)} / {maxHealth}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Wand className="h-5 w-5 text-blue-400" />
          <span>
            MP: {Math.round(mp)} / {maxMP}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <span>
            EXP: {Math.round(exp)} / {toNextLevel}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span>Gold: {Math.round(gp)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
