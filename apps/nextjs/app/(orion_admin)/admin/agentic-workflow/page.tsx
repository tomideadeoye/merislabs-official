"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@shared/app_state";
import { BrainCircuit } from "lucide-react";

export default function AgenticWorkflowFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.AGENTIC}
        icon={<BrainCircuit className="h-7 w-7" />}
        description="Automate workflows and agentic tasks."
      />
      <div>
        <p className="text-gray-400">Agentic Workflow feature component will go here.</p>
      </div>
    </div>
  );
}
