import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// GOAL OF FILE|FEATURES|FUNCTIONS: Displays a single opportunity as a card with basic details (title, company, status, type) and action buttons (View, Edit, Delete).
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/opportunity-pipeline/OpportunityCard.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `OpportunityList` (`app/components/ui/orion/opportunities/OpportunityList.tsx`).
//   - Receives an `OrionOpportunity` object and handlers for view, edit, and delete actions as props.
//   - Uses `@/components/ui` components (`Card`, `Button`).
// NOTES: This component appears to be a duplicate of `/Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/opportunities/OpportunityCard.tsx`. It should be consolidated into a single component in the `components/ui` directory. The version in `components/ui` seems more complete with status badges and date information.
import { Button } from '@/components/ui/button';
import type { OrionOpportunity } from '@/lib/types';

interface OpportunityCardProps {
  opportunity: OrionOpportunity;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onViewDetails, onEdit, onDelete }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-200">
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
        <CardDescription>{opportunity.company}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-400">Status: {opportunity.status}</p>
        <p className="text-sm text-gray-400">Type: {opportunity.type}</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(opportunity.id || '')}>
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(opportunity.id || '')}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(opportunity.id || '')}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
