"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { EmotionalLogForm } from '@/components/orion/EmotionalLogForm';
import { EmotionalLogHistory } from '@/components/orion/EmotionalLogHistory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPulse, History, PlusCircle } from 'lucide-react';

export default function EmotionalTrackerPage() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleLogSaved = () => {
    // Increment refresh trigger to cause history component to reload
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Emotional Tracker"
        icon={<HeartPulse className="h-7 w-7" />}
        description="Log, track, and understand your emotional patterns and triggers."
      />

      <Tabs defaultValue="log" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="log" className="data-[state=active]:bg-gray-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Log Emotion
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <HeartPulse className="mr-2 h-5 w-5 text-emerald-400" />
                Log Your Emotion
              </CardTitle>
              <CardDescription className="text-gray-400">
                Record how you&apos;re feeling to build awareness and track patterns over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionalLogForm onLogSaved={handleLogSaved} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <History className="mr-2 h-5 w-5 text-emerald-400" />
                Emotional Log History
              </CardTitle>
              <CardDescription className="text-gray-400">
                Review and analyze your emotional patterns over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionalLogHistory key={`history-${refreshTrigger}`} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
