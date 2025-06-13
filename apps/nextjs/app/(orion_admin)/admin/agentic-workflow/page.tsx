"use client";

import { PageHeader } from "@repo/ui";
import { PageNames } from "@repo/sharedapp_state";
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
