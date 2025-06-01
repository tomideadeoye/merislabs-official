"use client";

import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { BriefcaseBusiness } from "lucide-react";
import { OpportunityDetailView } from '@/components/orion/OpportunityDetailView';

interface OpportunityDetailPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { opportunityId } = params;
  
  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.PIPELINE}
        icon={<BriefcaseBusiness className="h-7 w-7" />}
        description="View and manage opportunity details"
        backLink="/admin/opportunity-pipeline"
      />
      
      <OpportunityDetailView opportunityId={opportunityId} />
    </div>
  );
}