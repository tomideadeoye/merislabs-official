"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { Repeat } from "lucide-react";

export default function RoutinesFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.ROUTINES}
        icon={<Repeat className="h-7 w-7" />}
        description="Manage your daily and weekly routines."
      />
      <div>
        <p className="text-gray-400">Routines feature component will go here.</p>
      </div>
    </div>
  );
}
