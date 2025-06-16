import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logger from '@/lib/logger';
import { OrionOpportunity } from '@/lib/types';

// GOAL OF FILE: Display opportunities in a Kanban-style board.
// RELATION TO OTHER FILES: This component is used in `admin/opportunity-pipeline/page.tsx`.
// It receives a list of `OrionOpportunity` objects.

interface OpportunityKanbanViewProps {
  opportunities: OrionOpportunity[];
}

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({ opportunities }) => {
  logger.info('OpportunityKanbanView component rendered.', { operation: 'render', component: 'OpportunityKanbanView' });

  // A very basic Kanban structure. This would typically involve more complex state management
  // and drag-and-drop functionality for real-world use.

  const statuses = ['Identified', 'Researching', 'Applying', 'Interviewing', 'Offered', 'Rejected'];

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 overflow-x-auto p-4">
      {statuses.map((status) => (
        <Card key={status} className="min-w-[280px] flex-shrink-0 bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700 pb-3">
            <CardTitle className="text-lg text-gray-100">{status}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
            {opportunities.filter((opp) => opp.status?.toLowerCase() === status.toLowerCase()).length > 0 ? (
              opportunities
                .filter((opp) => opp.status?.toLowerCase() === status.toLowerCase())
                .map((opp) => (
                  <div key={opp.id} className="bg-gray-700 p-3 rounded-md shadow-sm border border-gray-600">
                    <h4 className="font-medium text-gray-100">{opp.title}</h4>
                    <p className="text-sm text-gray-400">{opp.company}</p>
                    <p className="text-xs text-gray-500">Status: {opp.status}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No opportunities in this stage.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
