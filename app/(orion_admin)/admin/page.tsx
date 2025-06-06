"use client";

import React, { useEffect, useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { DashboardRoutineStatus } from '@/components/orion/DashboardRoutineStatus';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  BookOpen,
  Brain,
  ListChecks,
  BarChart2,
  FileText,
  Folder
} from 'lucide-react';
import Link from 'next/link';
import { checkAllLlmApiKeys } from '../../../lib/llm_providers';

export default function AdminDashboardPage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  // Simple password protection
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'orion') {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const [llmHealth, setLlmHealth] = useState<any[]>([]);
  const [llmHealthLoading, setLlmHealthLoading] = useState(true);
  const [llmHealthError, setLlmHealthError] = useState<string | null>(null);

  // LLM API Key Check State
  const [llmApiKeys, setLlmApiKeys] = useState<any[]>([]);

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
            type="password"
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

      {/* LLM API Key Check Section */}
      <section style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>LLM API Key Status</h2>
        <ul>
          {llmApiKeys.map((k, idx) => (
            <li key={k.modelId} style={{ color: k.present ? 'green' : 'red', marginBottom: 2 }}>
              <b>{k.modelId}</b> ({k.provider}): {k.present ? 'API key present' : `MISSING (${k.apiKeyEnv})`}
            </li>
          ))}
        </ul>
        {llmApiKeys.some(k => !k.present) && (
          <div style={{ color: 'red', marginTop: 8 }}>
            <b>Warning:</b> One or more LLM API keys are missing. Add them to your .env.local and restart the server.
          </div>
        )}
      </section>

      {/* LLM Health Check Section */}
      <section style={{ marginBottom: 32, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        <h2 style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>LLM Health Check</h2>
        {llmHealthLoading && <div>Loading LLM health...</div>}
        {llmHealthError && <div style={{ color: 'red' }}>Error: {llmHealthError}</div>}
        {!llmHealthLoading && !llmHealthError && (
          <ul>
            {llmHealth.map((r, idx) => (
              <li key={r.model} style={{ color: r.status === 'success' ? 'green' : 'red', marginBottom: 4 }}>
                <b>{r.model}</b> ({r.provider}): {r.status === 'success' ? 'OK' : `FAIL - ${r.error}`}
              </li>
            ))}
          </ul>
        )}
      </section>

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
              <Link href="/admin/opportunity">
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
              <Link href="/admin/opportunity">
                <BarChart2 className="mr-2 h-4 w-4" />
                Evaluate Opportunity
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
      </div>

      {/* Additional dashboard sections can be added here */}
    </div>
  );
}
