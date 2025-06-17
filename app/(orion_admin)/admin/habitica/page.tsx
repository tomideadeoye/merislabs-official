/**
// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Orion Admin Habitica Integration page.
//   - Allows user to connect their Habitica account, view stats, and manage tasks (todos, dailies).
//   - Features: Credential form, stats display, task creation, and task lists (todos, dailys).
//   - Refreshes stats and tasks on credential or task changes.
// FILEPATH:
//   apps/nextjs/app/(orion_admin)/admin/habitica/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses:
//       - useSessionState (from @repo/shared/hooks/useSessionState)
//       - HabiticaCredentialsForm, HabiticaStatsContainer, HabiticaTaskList, HabiticaTaskForm (from components/orion/)
//       - UI components from '@/components/ui
//   - Related to: User authentication/session state, Habitica API integration, admin dashboard features, journal task extraction.
// ASSUMPTIONS & CLEAR COMMENTS
//   - Assumes Habitica-related components are implemented and handle API logic internally.
//   - Assumes useSessionState provides habiticaUserId and habiticaApiToken in state.
//   - NOTE: Assumed HabiticaTaskList "dailys" is correct spelling per Habitica API – confirm with team.
// NOTES:
//   - Consider consolidating Habitica-related components into a single module for maintainability.
//   - Check for redundant logic between HabiticaStatsContainer and HabiticaTaskList.
//   - Opportunity: Add loading/progress states, error toasts, and more robust logging for user actions.
//   - Could merge similar admin integration pages for other services for a unified UX.
*/

'use client';

import { HabiticaCredentialsForm } from '@/components/orion/Habitica/HabiticaCredentialsForm';
import { HabiticaStatsContainer } from '@/components/orion/Habitica/HabiticaStatsContainer';
import { HabiticaTaskForm } from '@/components/orion/Habitica/HabiticaTaskForm';
import { HabiticaTaskList } from '@/components/orion/Habitica/HabiticaTaskList';
import { useSessionState } from '@/hooks/useSessionState';
import React, { useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, ShieldAlert } from 'lucide-react';
import { SessionStateKeys } from '@/lib/constants';

export default function HabiticaPage() {
  const { selectSessionValue } = useSessionState();
  const habiticaUserId = selectSessionValue<string | null>(SessionStateKeys.HABITICA_USER_ID);
  const habiticaApiToken = selectSessionValue<string | null>(SessionStateKeys.HABITICA_API_TOKEN);
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());

  const credentialsAreSet = Boolean(habiticaUserId && habiticaApiToken);

  const handleCredentialsUpdated = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  const handleTaskCreated = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Habitica Integration"
        icon={<Rocket className="h-7 w-7" />}
        description="Connect Orion to your Habitica account to manage tasks and bridge insights with action."
      />

      <HabiticaCredentialsForm onCredentialsSet={handleCredentialsUpdated} />

      {credentialsAreSet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <HabiticaStatsContainer key={`stats-${refreshKey}`} />

            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg"> Create New Task </CardTitle>
                <CardDescription className="text-gray-400">Add a new task to your Habitica account</CardDescription>
              </CardHeader>
              <CardContent>
                <HabiticaTaskForm key={`form-${refreshKey}`} onTaskCreated={handleTaskCreated} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 space-y-6">
                {/* Render Todos List */}
                <HabiticaTaskList key={`todos-${refreshKey}`} type="todos" />

                {/* Render Dailies List */}
                <HabiticaTaskList key={`dailies-${refreshKey}`} type="dailys" />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="bg-gray-800/50 border-gray-700 border-dashed">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" />
              Habitica Connection Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Please enter your Habitica User ID and API Token above to connect Orion to your Habitica account. Once
              connected, you & apos;ll be able to view your stats, manage tasks, and create new to - dos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
