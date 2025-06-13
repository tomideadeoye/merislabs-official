"use client";

import React from 'react';
import { Button } from '@repo/ui';
import { DraftApplicationButton } from './application/DraftApplicationButton';
import { FindStakeholdersButton } from './networking/FindStakeholdersButton';
import type { OrionOpportunity } from '@repo/shared';

interface OpportunityActionsProps {
  OrionOpportunity: OrionOpportunity;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({ OrionOpportunity }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DraftApplicationButton OrionOpportunity={OrionOpportunity} />
      <FindStakeholdersButton OrionOpportunity={OrionOpportunity} />
    </div>
  );
};
