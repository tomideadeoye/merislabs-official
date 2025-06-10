"use client";

import React from 'react';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/hooks/useSessionState';
import { Progress } from '@repo/ui';
import { CheckCircle, Clock } from 'lucide-react';

interface RoutineStatusProps {
  className?: string;
}

export const RoutineStatus: React.FC<RoutineStatusProps> = ({ className }) => {
  const [morningCompleted] = useSessionState(SessionStateKeys.ROUTINES_MORNING_COMPLETED, false);
  const [eveningCompleted] = useSessionState(SessionStateKeys.ROUTINES_EVENING_COMPLETED, false);

  // Calculate progress percentage
  const progress = ((morningCompleted ? 1 : 0) + (eveningCompleted ? 1 : 0)) * 50;

  // Get current time to determine which routine is relevant
  const currentHour = new Date().getHours();
  const isMorningTime = currentHour >= 5 && currentHour < 12;
  const isEveningTime = currentHour >= 18 && currentHour < 24;

  // Determine which routine to highlight
  const highlightMorning = isMorningTime || (!morningCompleted && !eveningCompleted);
  const highlightEvening = isEveningTime || (morningCompleted && !eveningCompleted);

  return (
    <div className={`p-4 bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-200">Today&apos;s Routines</h3>
        <span className="text-sm text-gray-400">
          <Clock className="h-4 w-4 inline mr-1" />
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <Progress value={progress} className="h-2 mb-4" />

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-md ${
          morningCompleted
            ? 'bg-green-900/30 border border-green-700'
            : highlightMorning
              ? 'bg-blue-900/30 border border-blue-700'
              : 'bg-gray-700/30 border border-gray-600'
        }`}>
          <div className="flex items-center">
            {morningCompleted ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            ) : (
              <span className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center text-xs">
                1
              </span>
            )}
            <h4 className={`font-medium ${
              morningCompleted
                ? 'text-green-300'
                : highlightMorning
                  ? 'text-blue-300'
                  : 'text-gray-400'
            }`}>
              Morning Kickstart
            </h4>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            {morningCompleted
              ? 'Completed'
              : 'Log mood, review tasks, set intentions'}
          </p>
        </div>

        <div className={`p-3 rounded-md ${
          eveningCompleted
            ? 'bg-green-900/30 border border-green-700'
            : highlightEvening
              ? 'bg-purple-900/30 border border-purple-700'
              : 'bg-gray-700/30 border border-gray-600'
        }`}>
          <div className="flex items-center">
            {eveningCompleted ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            ) : (
              <span className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center text-xs">
                2
              </span>
            )}
            <h4 className={`font-medium ${
              eveningCompleted
                ? 'text-green-300'
                : highlightEvening
                  ? 'text-purple-300'
                  : 'text-gray-400'
            }`}>
              Evening Wind-Down
            </h4>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            {eveningCompleted
              ? 'Completed'
              : 'Review accomplishments, reflect, log mood'}
          </p>
        </div>
      </div>
    </div>
  );
};
