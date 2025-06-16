'use client';

import React from 'react';
import { Button } from '@/components/button';

import type { OrionOpportunity } from '@/lib/types';
import { FindStakeholdersButton } from './FindStakeholdersButton';
import { DraftApplicationButton } from './DraftApplicationButton';

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
