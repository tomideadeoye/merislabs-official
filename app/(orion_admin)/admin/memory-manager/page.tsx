"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { DatabaseZap } from "lucide-react";

export default function MemoryManagerFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.MEMORY_MANAGER}
        icon={<DatabaseZap className="h-7 w-7" />}
        description="Manage your memory system and data."
      />
      <div>
        <p className="text-gray-400">Memory Manager feature component will go here.</p>
      </div>
    </div>
  );
}
