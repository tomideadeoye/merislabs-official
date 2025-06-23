'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// something like cline with tool use, the tools could be different functions

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
