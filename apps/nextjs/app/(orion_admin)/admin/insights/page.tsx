"use client";

import React from 'react';
import { PageHeader } from "@repo/ui";
import { PageNames } from "@repo/sharedapp_state";
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedhooks/useSessionState';
import { PatternAnalysisDisplay } from '@/components/orion/PatternAnalysisDisplay';
import { Brain } from 'lucide-react';

export default function InsightsPage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pattern Insights"
        icon={<Brain className="h-7 w-7" />}
        description="Discover recurring themes, patterns, and insights across your memories and journal entries."
      />

      <PatternAnalysisDisplay />
    </div>
  );
}
