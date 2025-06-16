'use client';

import React from 'react';
import { Button } from '@/components/button';

import type { OrionOpportunity } from '@/types/orion';
import { FindStakeholdersButton } from './networking/FindStakeholdersButton';
import { DraftApplicationButton } from './application/DraftApplicationButton';

interface OpportunityActionsProps {
  OrionOpportunity: OrionOpportunity;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({ OrionOpportunity }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DraftApplicationButton orionOpportunity={OrionOpportunity} />
      <FindStakeholdersButton orionOpportunity={OrionOpportunity} />
    </div>
  );
};
