"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, UserCircle } from 'lucide-react';
import type { HabiticaUserStats } from '@/types/habitica';

interface HabiticaStatsDisplayProps {
  className?: string;
}

export const HabiticaStatsDisplay: React.FC<HabiticaStatsDisplayProps> = ({ className }) => {
  const [stats, setStats] = useState<HabiticaUserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  
  useEffect(() => {
    fetchStats();
  }, [habiticaUserId, habiticaApiToken]);
  
  const fetchStats = async () => {
    if (!habiticaUserId || !habiticaApiToken) {
      setError("Habitica credentials not set");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/habitica/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken })
      });
      
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
  };
  
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
  
  const userStats = stats.stats;
  const userName = stats.profile?.name || 'Habitica User';
  
  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <UserCircle className="mr-2 h-5 w-5 text-amber-400" />
          {userName}'s Stats
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