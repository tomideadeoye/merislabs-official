"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { MorningRoutine } from '@/components/orion/routines/MorningRoutine';
import { EveningRoutine } from '@/components/orion/routines/EveningRoutine';
import { RoutineStatus } from '@/components/orion/routines/RoutineStatus';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Repeat, Sun, Moon } from 'lucide-react';

export default function RoutinesPage() {
  // Get current time to determine default tab
  const currentHour = new Date().getHours();
  const defaultTab = currentHour >= 5 && currentHour < 16 ? 'morning' : 'evening';
  
  // Session state for routine completion
  const [morningCompleted] = useSessionState(SessionStateKeys.ROUTINES_MORNING_COMPLETED, false);
  const [eveningCompleted] = useSessionState(SessionStateKeys.ROUTINES_EVENING_COMPLETED, false);
  
  // Local state for active tab
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Daily Routines"
        icon={<Repeat className="h-7 w-7" />}
        description="Orchestrate your daily engagement with Orion for systematic growth and well-being."
      />

      <RoutineStatus className="mb-8" />

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="morning" className="data-[state=active]:bg-gray-700">
            <Sun className="h-4 w-4 mr-2" />
            Morning Kickstart
            {morningCompleted && <span className="ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">✓</span>}
          </TabsTrigger>
          <TabsTrigger value="evening" className="data-[state=active]:bg-gray-700">
            <Moon className="h-4 w-4 mr-2" />
            Evening Wind-Down
            {eveningCompleted && <span className="ml-2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">✓</span>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="morning" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Sun className="mr-2 h-5 w-5 text-amber-400" />
                Morning Kickstart
              </CardTitle>
              <CardDescription className="text-gray-400">
                Start your day with intention and clarity, guided by Orion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MorningRoutine />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="evening" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Moon className="mr-2 h-5 w-5 text-purple-400" />
                Evening Wind-Down
              </CardTitle>
              <CardDescription className="text-gray-400">
                Review your day, capture insights, and prepare for restful peace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EveningRoutine />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}