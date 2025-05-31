"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { HabiticaCredentialsForm } from '@/components/orion/HabiticaCredentialsForm';
import { HabiticaStats } from '@/components/orion/HabiticaStats';
import { HabiticaTaskList } from '@/components/orion/HabiticaTaskList';
import { HabiticaAddTodo } from '@/components/orion/HabiticaAddTodo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, CheckSquare, ListTodo, Key } from 'lucide-react';

export default function HabiticaPage() {
  const [userId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [apiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  useEffect(() => {
    setIsConfigured(Boolean(userId && apiToken));
  }, [userId, apiToken]);

  const handleCredentialsSaved = () => {
    setIsConfigured(true);
  };

  const handleTaskAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Habitica Integration"
        icon={<Rocket className="h-7 w-7" />}
        description="Connect Orion with Habitica to manage your tasks and build productive habits."
      />

      {!isConfigured ? (
        <div className="max-w-md mx-auto">
          <HabiticaCredentialsForm onCredentialsSaved={handleCredentialsSaved} />
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-700">
              <Rocket className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="todos" className="data-[state=active]:bg-gray-700">
              <CheckSquare className="h-4 w-4 mr-2" />
              To-Dos
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
              <Key className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Dashboard Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <HabiticaStats key={`stats-${refreshTrigger}`} />
              </div>
              <div className="md:col-span-2">
                <HabiticaTaskList 
                  key={`tasks-${refreshTrigger}`}
                  type="todos" 
                  limit={5}
                  onTaskCompleted={handleTaskAdded}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HabiticaAddTodo onTodoAdded={handleTaskAdded} />
              <HabiticaTaskList 
                key={`completed-${refreshTrigger}`}
                type="completedTodos" 
                limit={5}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="todos" className="mt-6 space-y-6">
            {/* To-Dos Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <HabiticaAddTodo onTodoAdded={handleTaskAdded} />
              </div>
              <div className="md:col-span-2">
                <HabiticaTaskList 
                  key={`all-todos-${refreshTrigger}`}
                  type="todos"
                  onTaskCompleted={handleTaskAdded}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6 space-y-6">
            {/* Settings Tab Content */}
            <div className="max-w-md mx-auto">
              <HabiticaCredentialsForm onCredentialsSaved={handleCredentialsSaved} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}