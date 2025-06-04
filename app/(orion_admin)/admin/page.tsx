"use client";

import React, { useEffect, useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { DashboardRoutineStatus } from '@/components/orion/DashboardRoutineStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // LLM Health Check State
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
