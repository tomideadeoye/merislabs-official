"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { Rocket } from "lucide-react";

export default function HabiticaFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames["Habitica Integration"]}
        icon={<Rocket className="h-7 w-7" />}
        description="Integrate and manage your Habitica tasks and rewards."
      />
      <div>
        <p className="text-gray-400">Habitica Integration feature component will go here.</p>
      </div>
    </div>
  );
}
