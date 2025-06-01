"use client";

import React from 'react';
import { EnhancedOpportunityDetailView } from '@/components/orion/pipeline/EnhancedOpportunityDetailView';

interface OpportunityDetailPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  return (
    <div className="container mx-auto py-8">
      <EnhancedOpportunityDetailView opportunityId={params.opportunityId} />
    </div>
  );
}