/**
 * @fileoverview Action button group component for opportunity-related operations.
 * @description Provides a consolidated interface for key actions related to opportunity engagement
 * and follow-up. Designed to maintain consistent interaction patterns across Orion's opportunity
 * management features.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Centralize common opportunity actions in a reusable component
 *   - Maintain consistent UI patterns for opportunity engagement
 *   - Enable rapid iteration on core opportunity workflows
 *
 * FILEPATH: `app/components/OpportunityActions.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/FindStakeholdersButton.tsx`: Primary action component for stakeholder discovery
 *   - `app/components/DraftApplicationButton.tsx`: Handles application drafting functionality
 *   - `app/hooks/useOpportunities.ts`: Provides data context for opportunity actions
 *   - `app/lib/apiClient.ts`: Underlying API client for action implementations
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Expects full opportunity data payload via props
 *   - Assumes child components handle their own state management
 *   - Responsive layout assumes parent container uses flex/grid layout
 *
 * NOTES:
 *   - COMPONENTS TO MERGE WITH: Could be integrated with OpportunityCard component
 *   - PERFORMANCE OPTIMIZATIONS: Memoization recommended for frequent re-renders
 *   - ERROR HANDLING ROBUSTNESS: Dependent on child components' error handling
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Add prop-type validation for opportunity data
 *   - Implement loading states for individual actions
 *   - Add keyboard navigation support
 *   - Introduce undo/redo capabilities for actions
 */
'use client';

import React from 'react';

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
