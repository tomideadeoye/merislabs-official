"use client";

import React from 'react';
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

export default function AdminDashboardPage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orion Dashboard"
        icon={<Home className="h-7 w-7" />}
        description="Your central hub for growth, clarity, and systemic self-mastery."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />

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
