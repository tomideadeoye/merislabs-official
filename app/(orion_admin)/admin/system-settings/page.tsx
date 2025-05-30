"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { Cog } from "lucide-react";

export default function SystemSettingsFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.SYSTEM}
        icon={<Cog className="h-7 w-7" />}
        description="Configure system preferences and settings."
      />
      <div>
        <p className="text-gray-400">System Settings feature component will go here.</p>
      </div>
    </div>
  );
}
