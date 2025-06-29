'use client';

import { PageHeader } from '@/components/ui/page-header';
import { BrainCircuit } from 'lucide-react';
import { PageNames } from '@/lib/constants';

import { AgenticWorkflowComponent } from '@/components/orion/admin/AgenticWorkflowComponent';

export default function AgenticWorkflowFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.AGENTIC}
        icon={<BrainCircuit className="h-7 w-7" />}
        description="Automate workflows and manage your tasks in one place."
      />
      <AgenticWorkflowComponent />
    </div>
  );
}
