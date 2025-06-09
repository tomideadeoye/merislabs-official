"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { DraftApplicationButton } from './application/DraftApplicationButton';
import { FindStakeholdersButton } from './networking/FindStakeholdersButton';
import type { Opportunity } from '@shared/types/opportunity';

interface OpportunityActionsProps {
  opportunity: Opportunity;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({ opportunity }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DraftApplicationButton opportunity={opportunity} />
      <FindStakeholdersButton opportunity={opportunity} />
    </div>
  );
};