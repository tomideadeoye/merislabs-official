"use client";

import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { BriefcaseBusiness } from "lucide-react";

export default function OpportunityPipelineFeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames["Opportunity Pipeline"]}
        icon={<BriefcaseBusiness className="h-7 w-7" />}
        description="Track and manage your sales and business opportunities."
      />
      <div>
        <p className="text-gray-400">Opportunity Pipeline feature component will go here.</p>
      </div>
    </div>
  );
}
