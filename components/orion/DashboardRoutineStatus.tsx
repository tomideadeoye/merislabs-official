"use client";

import React from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardRoutineStatusProps {
  className?: string;
}

export const DashboardRoutineStatus: React.FC<DashboardRoutineStatusProps> = ({ className }) => {
  const [morningCompleted] = useSessionState(SessionStateKeys.ROUTINES_MORNING_COMPLETED, false);
  const [eveningCompleted] = useSessionState(SessionStateKeys.ROUTINES_EVENING_COMPLETED, false);
  
  // Get current time to determine which routine is relevant
  const currentHour = new Date().getHours();
  const isMorningTime = currentHour >= 5 && currentHour < 12;
  const isEveningTime = currentHour >= 18 && currentHour < 24;
  
  // Determine which routine to highlight
  const highlightMorning = isMorningTime || (!morningCompleted && !eveningCompleted);
  const highlightEvening = isEveningTime || (morningCompleted && !eveningCompleted);
  
  // Determine which routine to show
  const showMorning = highlightMorning || !morningCompleted;
  const showEvening = highlightEvening || (!showMorning && !eveningCompleted);
  
  // Format current date
  const currentDate = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-200">Today's Routines</h3>
          <span className="text-sm text-gray-400">
            <Clock className="h-4 w-4 inline mr-1" />
            {currentDate}
          </span>
        </div>
        
        {morningCompleted && eveningCompleted ? (
          <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <p>All routines completed for today. Great job!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {showMorning && (
              <div className={`p-3 rounded-md ${
                morningCompleted 
                  ? 'bg-green-900/30 border border-green-700' 
                  : 'bg-blue-900/30 border border-blue-700'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {morningCompleted ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    ) : (
                      <span className="h-5 w-5 mr-2 rounded-full border border-blue-500 flex items-center justify-center text-xs text-blue-400">
                        1
                      </span>
                    )}
                    <h4 className={`font-medium ${morningCompleted ? 'text-green-300' : 'text-blue-300'}`}>
                      Morning Kickstart
                    </h4>
                  </div>
                  
                  {!morningCompleted && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="text-blue-400 hover:bg-blue-900/30"
                    >
                      <Link href="/admin/routines?tab=morning">
                        Start <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {showEvening && (
              <div className={`p-3 rounded-md ${
                eveningCompleted 
                  ? 'bg-green-900/30 border border-green-700' 
                  : 'bg-purple-900/30 border border-purple-700'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {eveningCompleted ? (
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    ) : (
                      <span className="h-5 w-5 mr-2 rounded-full border border-purple-500 flex items-center justify-center text-xs text-purple-400">
                        2
                      </span>
                    )}
                    <h4 className={`font-medium ${eveningCompleted ? 'text-green-300' : 'text-purple-300'}`}>
                      Evening Wind-Down
                    </h4>
                  </div>
                  
                  {!eveningCompleted && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="text-purple-400 hover:bg-purple-900/30"
                    >
                      <Link href="/admin/routines?tab=evening">
                        Start <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};