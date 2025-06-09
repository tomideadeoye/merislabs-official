"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@shared/app_state";
import { Network } from "lucide-react";

export default function NetworkingFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.NETWORKING}
        icon={<Network className="h-7 w-7" />}
        description="Manage your professional network and contacts."
      />
      <div>
        <p className="text-gray-400">Networking feature component will go here.</p>
      </div>
    </div>
  );
}
