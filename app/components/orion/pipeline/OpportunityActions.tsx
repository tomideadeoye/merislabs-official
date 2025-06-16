import React from 'react';
import { Button } from '@/components/ui/button';
import logger from '@/lib/logger';
import { OrionOpportunity } from '@/lib/types';

interface OpportunityActionsProps {
  opportunity: OrionOpportunity;
  onEvaluate: (opportunityId: string) => void;
  onDraftApplication: (opportunityId: string) => void;
  onFindStakeholders: (opportunityId: string) => void;
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({
  opportunity,
  onEvaluate,
  onDraftApplication,
  onFindStakeholders,
}) => {
  logger.info('OpportunityActions component rendered.', {
    operation: 'render',
    component: 'OpportunityActions',
    opportunityId: opportunity.id,
  });

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <Button
        onClick={() => {
          logger.info('Evaluate button clicked.', { opportunityId: opportunity.id });
          onEvaluate(opportunity.id);
        }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Evaluate Opportunity
      </Button>
      <Button
        onClick={() => {
          logger.info('Draft Application button clicked.', { opportunityId: opportunity.id });
          onDraftApplication(opportunity.id);
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Draft Application
      </Button>
      <Button
        onClick={() => {
          logger.info('Find Stakeholders button clicked.', { opportunityId: opportunity.id });
          onFindStakeholders(opportunity.id);
        }}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Find Stakeholders
      </Button>
      {/* Add more action buttons as needed */}
    </div>
  );
};
