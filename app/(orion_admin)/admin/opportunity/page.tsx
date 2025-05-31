"use client";

import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { OpportunityEvaluator } from '@/components/orion/OpportunityEvaluator';
import { BarChart2 } from 'lucide-react';

export default function OpportunityPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Opportunity Evaluator"
        icon={<BarChart2 className="h-7 w-7" />}
        description="Analyze job descriptions, academic programs, or project briefs against your profile and goals."
      />

      <OpportunityEvaluator />
    </div>
  );
}