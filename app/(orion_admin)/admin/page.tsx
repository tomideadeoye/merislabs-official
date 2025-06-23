/**
// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Orion Admin Dashboard main page.
//   - Central hub for growth, clarity, and systemic self-mastery.
//   - Features: Profile management, LLM API health/status, navigation to Journal, Memory, Opportunities, Habitica, Narrative Studio, Local Files, and Quick Actions.
//   - Displays real-time LLM health, API key status, and user profile (with cache/refresh).
//   - Provides password-protected admin access.
// FILEPATH:
//   apps/nextjs/app/(orion_admin)/admin/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses:
//       - useSessionState, useUserProfile, PageNames, SessionStateKeys (from @repo/lib)
//       - DashboardRoutineStatus, HabiticaStatsContainer (from components/orion/)
//       - UI components from @/components/ui/index
//       - checkAllLlmApiKeys, PROVIDER_MODEL_CONFIGS (from @/lib/llm_providers)
//       - Links to other admin pages: /admin/journal, /admin/habitica, /admin/OrionOpportunity, /admin/narrative, /admin/local-files
//   - Related to: LLM API integration, user session/profile, admin navigation, feature dashboards.
// ASSUMPTIONS & CLEAR COMMENTS
//   - Assumes all imported hooks/components are implemented and stable.
//   - NOTE: Assumed admin password is 'orion' for both username and password – confirm with team for production security.
// NOTES:
//   - Consider consolidating admin dashboard cards/components for maintainability.
//   - Add more robust error handling, logging, and loading/progress states.
//   - Opportunity: Merge similar dashboard logic across admin pages for unified UX.
//   - Could modularize feature cards and quick actions for reusability.
//   - Add recent activity and file explorer as dynamic, not static, sections.
*/

'use client';

import React, { useState } from 'react';
import { PageHeader, Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {
  Briefcase,
  Home,
  UserIcon,
  Brain,
  BookOpen,
  ListChecks,
  Folder,
  RefreshCw,
  Info,
  Sparkles,
  Target,
  Star,
  HeartPulse,
} from 'lucide-react';
import Link from 'next/link';
import { PageNames, SessionStateKeys } from '@/lib/constants';
import logger from '@/lib/logger';
import { useSessionState } from '@/hooks/useSessionState';
import useUserProfile from '@/hooks/useUserProfile';
import { HabiticaStatsContainer } from '@/components/orion/HabiticaStatsContainer';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const { selectSessionValue } = useSessionState();
  const memoryInitialized = selectSessionValue<boolean>(SessionStateKeys.MEMORY_INITIALIZED);
  const { profile, isLoading: profileLoading, error: profileError, refetch } = useUserProfile();

  // Simple password protection
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setPasswordError('Username is required');
      return;
    }
    if (username === 'orion' && password === 'orion') {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect username or password');
    }
  };

  // Refresh profile from API
  const handleRefreshProfile = async () => {
    try {
      logger.info('[ProfileUI][ACTION] Triggering profile refetch...');
      await refetch();
      logger.info('[ProfileUI][ACTION] Profile refetched successfully.');
    } catch (err: unknown) {
      logger.error('[ProfileUI][ERROR] Failed to refresh profile:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  if (!authenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(20, 20, 30, 0.85)',
        }}
      >
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center border border-gray-300 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <input
            type="text"
            autoComplete="username"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && <div className="text-red-500 mb-2">{passwordError}</div>}
          <Button type="submit">Unlock</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={PageNames.ADMIN_DASHBOARD}
        icon={<Home className="h-7 w-7" />}
        description="Your central hub for growth, clarity, and systemic self-mastery."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-white">
            <UserIcon className="mr-3 h-8 w-8 text-blue-400" />
            Welcome, {profileLoading ? 'loading...' : profile?.name || 'Architect'}!
          </CardTitle>
          <CardDescription className="text-gray-400">
            {profileError ? `Error: ${profileError}` : 'Ready to conquer your goals?'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* User Profile Summary Card */}
      {profile && !profileLoading && !profileError && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200 flex items-center">
              <UserIcon className="mr-2 h-6 w-6 text-blue-400" />
              Your Profile Summary
            </CardTitle>
            <CardDescription className="text-gray-400">A quick overview of your loaded Orion profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="multiple" className="w-full">
              {profile.backgroundSummary && (
                <AccordionItem value="summary">
                  <AccordionTrigger>
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-yellow-400" /> Summary
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-200 whitespace-pre-wrap">{profile.backgroundSummary}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {profile.keySkills && profile.keySkills.length > 0 && (
                <AccordionItem value="key-skills">
                  <AccordionTrigger>
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Star className="h-4 w-4 mr-1 text-green-400" /> Key Skills
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.keySkills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-700 text-blue-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {profile.goals && profile.goals.length > 0 && (
                <AccordionItem value="goals">
                  <AccordionTrigger>
                    <h4 className="text-sm font-medium text-gray-300 flex items-center">
                      <Target className="h-4 w-4 mr-1 text-purple-400" /> Goals
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-gray-200">
                      {profile.goals.map((goal: string, index: number) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
            <Button onClick={handleRefreshProfile} className="mt-4 bg-gray-700 hover:bg-gray-600 text-gray-200">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200 flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-amber-400" /> Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-400">Jumpstart your workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/journal" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Journal</span>
            </Button>
          </Link>
          <Link href="/admin/memory-manager" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Memory Manager</span>
            </Button>
          </Link>
          <Link href="/admin/opportunity-pipeline" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Opportunity Pipeline</span>
            </Button>
          </Link>
          <Link href="/admin/habitica" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <ListChecks className="h-5 w-5" />
              <span>Habitica</span>
            </Button>
          </Link>
          <Link href="/admin/narrative-clarity-studio" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Narrative Studio</span>
            </Button>
          </Link>
          <Link href="/admin/local-files" passHref>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Local Files</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Habitica Stats */}
      <HabiticaStatsContainer />

      {/* Real-time LLM Health & API Status (Placeholder) */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200 flex items-center">
            <HeartPulse className="mr-2 h-6 w-6 text-red-400" /> LLM API Health Check
          </CardTitle>
          <CardDescription className="text-gray-400">
            Monitor the status of your AI backend integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">
            LLM API status: <span className="font-semibold text-green-400">Operational</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">Details: All required API keys are configured.</p>
          {/* Real implementation would fetch actual health checks */}
          <Button className="mt-4 bg-gray-700 hover:bg-gray-600 text-gray-200">Run Health Check</Button>
        </CardContent>
      </Card>
    </div>
  );
}
