"use client";

import React, { useEffect, useState } from 'react';
import { PageHeader, Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@repo/ui';
import { PageNames } from "@repo/sharedapp_state";
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedhooks/useSessionState';
import { DashboardRoutineStatus } from '@/components/orion/DashboardRoutineStatus';
import {
  Home,
  BookOpen,
  Brain,
  ListChecks,
  BarChart2,
  FileText,
  Folder,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  X as XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { checkAllLlmApiKeys, PROVIDER_MODEL_CONFIGS } from '@repo/shared';
import { useUserProfile } from '@repo/sharedhooks/useUserProfile';

import { HabiticaStatsContainer } from "@/components/orion/HabiticaStatsContainer";

export default function AdminDashboardPage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(profile);
  const [profileErrorState, setProfileErrorState] = useState(profileError);
  const [profileLoadingState, setProfileLoadingState] = useState(profileLoading);

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

  const [llmHealth, setLlmHealth] = useState<any[]>([]);
  const [llmHealthLoading, setLlmHealthLoading] = useState(true);
  const [llmHealthError, setLlmHealthError] = useState<string | null>(null);

  // LLM API Key Check State
  const [llmApiKeys, setLlmApiKeys] = useState<any[]>([]);

  // Expand/collapse and close state for profile card
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      setLlmHealthLoading(true);
      setLlmHealthError(null);
      try {
        const res = await fetch('/api/orion/llm/health');
        const data = await res.json();
        if (data.success) {
          setLlmHealth(data.results);
        } else {
          setLlmHealthError('Failed to fetch LLM health');
        }
      } catch (err: any) {
        setLlmHealthError(err.message || 'Unknown error');
      } finally {
        setLlmHealthLoading(false);
      }
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    setLlmApiKeys(checkAllLlmApiKeys());
  }, []);

  // Sync with useUserProfile hook
  useEffect(() => {
    setProfileData(profile);
    setProfileErrorState(profileError);
    setProfileLoadingState(profileLoading);
  }, [profile, profileError, profileLoading]);

  // Refresh profile from API (no reload)
  const handleRefreshProfile = async () => {
    setRefreshing(true);
    setProfileErrorState(null);
    setProfileLoadingState(true);
    try {
      localStorage.removeItem('userProfile');
      console.info('[ProfileUI][ACTION] Removed profile cache, fetching fresh from API...');
      const res = await fetch('/api/orion/profile');
      if (!res.ok) throw new Error('Failed to fetch profile: ' + res.status);
      const data = await res.json();
      setProfileData(data);
      setProfileErrorState(null);
      localStorage.setItem('userProfile', JSON.stringify({ data, timestamp: Date.now() }));
      console.info('[ProfileUI][ACTION] Profile refreshed and cached', { data });
    } catch (err: any) {
      setProfileErrorState(err.message || 'Unknown error');
      setProfileData(null);
      console.error('[ProfileUI][ERROR] Failed to refresh profile:', err);
    } finally {
      setProfileLoadingState(false);
      setRefreshing(false);
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
            onChange={e => setUsername(e.target.value)}
            className="mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-4 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && (
            <div className="text-red-500 mb-2">{passwordError}</div>
          )}
          <Button type="submit">Unlock</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orion Dashboard"
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
            Welcome, {profileLoading ? 'loading...' : 'Tomide'}!
          </CardTitle>
          <CardDescription className="text-gray-400">
            {profileError ? `Error: ${profileError}` : "Ready to conquer your goals?"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Details Card */}
      {profileVisible && (
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700 shadow-lg mb-6">
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer select-none p-4" onClick={() => {
            setProfileExpanded((prev) => {
              const next = !prev;
              console.info('[ProfileUI][ACTION] Toggled profile card expand/collapse', { expanded: next });
              return next;
            });
          }}>
            <div className="flex items-center text-xl text-white">
              <UserIcon className="mr-2 h-6 w-6 text-blue-300" />
              Current Profile (cached in localStorage)
              <span className="ml-2">{profileExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</span>
            </div>
            <button
              type="button"
              aria-label="Close profile card"
              className="ml-4 p-1 rounded hover:bg-red-800/40 transition"
              onClick={e => {
                e.stopPropagation();
                setProfileVisible(false);
                console.info('[ProfileUI][ACTION] Closed profile card');
              }}
            >
              <XIcon className="h-5 w-5 text-red-300" />
            </button>
          </CardHeader>
          {profileExpanded && (
            <CardContent>
              {/* Profile loaded successfully */}
              {!profileLoadingState && !profileErrorState && profileData && (
                <div className="space-y-2 text-white">
                  {profileData?.profileText && (
                    <div className="whitespace-pre-line text-blue-200">{profileData.profileText}</div>
                  )}
                  <div className="mt-2 text-xs text-gray-400">(Full object: <code>{JSON.stringify(profileData)}</code>)</div>
                </div>
              )}
              {/* Fallback UI: error or missing profile */}
              {!profileLoadingState && (profileErrorState || !profileData) && (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="text-2xl mb-2 text-yellow-300">
                    <span role="img" aria-label="warning">⚠️</span> No profile data loaded!
                  </div>
                  <div className="text-gray-300 mb-2">
                    {profileErrorState ? (
                      <>
                        <b>Error:</b> {profileErrorState}
                      </>
                    ) : (
                      <>No profile data found in cache or from API.</>
                    )}
                  </div>
                  <div className="text-gray-400 mb-4">
                    Orion can't find your profile. This may be due to a network issue, missing Notion config, or local file fallback failure.<br />
                    <span className="text-xs">Try refreshing below, or check your Notion/DB config.</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-900/30 mb-2"
                    onClick={e => {
                      e.stopPropagation();
                      handleRefreshProfile();
                    }}
                    disabled={refreshing}
                  >
                    {refreshing ? 'Refreshing...' : 'Retry / Refresh Profile'}
                  </Button>
                </div>
              )}
              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-900/30"
                  onClick={e => {
                    e.stopPropagation();
                    handleRefreshProfile();
                  }}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-900/30"
                  onClick={e => {
                    e.stopPropagation();
                    localStorage.removeItem('userProfile');
                    setProfileData(null);
                    setProfileErrorState(null);
                    setProfileLoadingState(false);
                    console.info('[ProfileUI][ACTION] Cleared profile cache (no reload).');
                  }}
                  disabled={refreshing}
                >
                  Clear Profile Cache
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Unified LLM Status & Health Section */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-white">
            <Brain className="mr-2 h-6 w-6 text-purple-400" />
            LLM API Key & Health Status
          </CardTitle>
          <CardDescription className="text-gray-300">
            Real-time status of all configured LLM models, API keys, and health checks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <span className="text-green-400 font-bold flex items-center"><span className="mr-1">✅</span>OK: {llmHealth.filter(r => r.status === 'success').length}</span>
            <span className="text-red-400 font-bold flex items-center"><span className="mr-1">❌</span>Fail: {llmHealth.filter(r => r.status === 'fail').length}</span>
            <span className="text-yellow-400 font-bold flex items-center"><span className="mr-1">⚠️</span>Missing Key: {llmApiKeys.filter(k => !k.present).length}</span>
            <span className="text-gray-400 ml-4">Total Models: {Object.values(PROVIDER_MODEL_CONFIGS).flat().length}</span>
          </div>
          <div className="border-b border-gray-700 mb-4" />
          {/* Table of all models */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 pr-4">Model</th>
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2 pr-4">API Key</th>
                  <th className="py-2 pr-4">Health</th>
                  <th className="py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PROVIDER_MODEL_CONFIGS).flatMap(([provider, models]) =>
                  models.map(model => {
                    const keyStatus = llmApiKeys.find(k => k.modelId === model.modelId);
                    const healthStatus = llmHealth.find(r => r.model === model.modelId);
                    let apiKeyBadge = keyStatus?.present
                      ? <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-mono">OK</span>
                      : <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs font-mono">MISSING</span>;
                    let healthBadge;
                    if (!keyStatus?.present) {
                      healthBadge = <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs font-mono">N/A</span>;
                    } else if (healthStatus?.status === 'success') {
                      healthBadge = <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-mono">OK</span>;
                    } else if (healthStatus?.status === 'fail') {
                      healthBadge = <span className="bg-red-900 text-red-300 px-2 py-1 rounded text-xs font-mono">FAIL</span>;
                    } else {
                      healthBadge = <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-mono">Unknown</span>;
                    }
                    return (
                      <tr key={model.modelId} className="border-b border-gray-800 hover:bg-gray-900/40 transition">
                        <td className="py-2 pr-4 text-white font-mono">{model.modelId}</td>
                        <td className="py-2 pr-4 text-blue-300">{provider}</td>
                        <td className="py-2 pr-4">{apiKeyBadge} <span className="ml-2 text-xs text-gray-500">{model.apiKeyEnv}</span></td>
                        <td className="py-2 pr-4">{healthBadge}</td>
                        <td className="py-2 text-xs text-gray-400 max-w-xs truncate">
                          {healthStatus?.status === 'fail' && (
                            <span title={healthStatus.error}>{healthStatus.error?.slice(0, 60)}{healthStatus.error?.length > 60 ? '...' : ''}</span>
                          )}
                          {(!healthStatus || healthStatus.status === 'success') && (model.comment || '')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Warning if any missing */}
          {llmApiKeys.some(k => !k.present) && (
            <div className="mt-4 text-yellow-400 font-bold flex items-center">
              <span className="mr-2">⚠️</span>One or more LLM API keys are missing. Add them to your .env.local and restart the server.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Cards Section (moved from home page) */}
      <section className="container mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal</CardTitle>
              <CardDescription>Write and view journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Record your thoughts and reflections in a journal that's stored in memory.</p>
              <Link href="/admin/journal">
                <Button>Open Journal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Explorer</CardTitle>
              <CardDescription>Search and explore your memory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Search through your memory and add new memories of different types.</p>
              <Link href="/admin/memory-manager">
                <Button>Explore Memory</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>Manage and evaluate opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Track and evaluate job opportunities, projects, and more.</p>
              <Link href="/admin/OrionOpportunity">
                <Button>View Opportunities</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardRoutineStatus />
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start text-blue-400 border-blue-600 hover:bg-blue-700/30"
          >
            <Link href="/admin/journal">
              <BookOpen className="mr-2 h-4 w-4" />
              New Journal Entry
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start text-green-400 border-green-600 hover:bg-green-700/30"
          >
            <Link href="/admin/habitica">
              <ListChecks className="mr-2 h-4 w-4" />
              Manage Tasks
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start text-amber-400 border-amber-600 hover:bg-amber-700/30"
          >
            <Link href="/admin/OrionOpportunity">
              <BarChart2 className="mr-2 h-4 w-4" />
              Evaluate OrionOpportunity
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start text-purple-400 border-purple-600 hover:bg-purple-700/30"
          >
            <Link href="/admin/narrative">
              <FileText className="mr-2 h-4 w-4" />
              Narrative Studio
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full justify-start text-cyan-400 border-cyan-600 hover:bg-cyan-700/30"
          >
            <Link href="/admin/local-files">
              <Folder className="mr-2 h-4 w-4" />
              Browse Local Files
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2 h-5 w-5 text-sky-400" />
          Recent Activity & Notes
        </h2>
        {/* Placeholder for recent activity */}
        <p className="text-gray-400">Recent activities will be displayed here.</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Folder className="mr-2 h-5 w-5 text-rose-400" />
          Local File Explorer
        </h2>
        <p className="text-gray-400 mb-4">
          Browse and interact with your local file system.
        </p>
        <Button asChild>
          <Link href="/admin/local-files">
            Open File Explorer
          </Link>
        </Button>
      </div>
    </div>
  );
}
