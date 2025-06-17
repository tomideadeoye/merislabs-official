'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: This page serves as the main view for the Opportunity Pipeline, displaying opportunities in list or Kanban view, providing filtering options, and allowing users to add new opportunities.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/admin/opportunity-pipeline/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Renders `OpportunityList` (`@/components/ui/orion/opportunities/OpportunityList`) for list view.
//   - Renders `OpportunityKanbanView` (`@/components/orion/opportunity-pipeline/OpportunityKanbanView`) for Kanban view.
//   - Renders `OpportunityFilters` (`@/components/orion/opportunity-pipeline/OpportunityFilters`) for filtering.
//   - Renders `AddOpportunityForm` (`@/components/ui/orion/opportunities/AddOpportunityForm`) for adding new opportunities.
//   - Uses `useOpportunities` hook (`@/hooks/useOpportunities`) to fetch and manage opportunity data.
//   - Uses `logger` (`@/lib/logger`) for logging component lifecycle and events.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed `useOpportunities` hook correctly fetches data from the backend. Assumed necessary UI components are available in `@/components/ui`.
// NOTES: This page orchestrates several components related to opportunity management. The `Loader` component import is commented out and marked as a TODO for replacement.
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// TODO: Replace Loader with a @/components/ui or shared implementation if available
// import { Loader } from '@/components/ui';
// TODO: Replace Loader with a @/components/ui or shared implementation if available
// import { Loader } from '@/components/ui';
// import { Loader } from '@/components/ui';
import { OpportunityList } from '@/components/ui/orion/opportunities/OpportunityList';
import { OpportunityFilters } from '@/components/orion/opportunity-pipeline/OpportunityFilters';
import { AddOpportunityForm } from '@/components/ui/orion/opportunities/AddOpportunityForm';
import { OpportunityKanbanView } from '@/components/orion/opportunity-pipeline/OpportunityKanbanView';
import { useOpportunities } from '@/hooks/useOpportunities';
import logger from '@/lib/logger';

export default function OpportunityPipelinePage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const { opportunities, isLoading, error, updateOpportunityStatus, refetchOpportunities } = useOpportunities();

  useEffect(() => {
    logger.info('OpportunityPipelinePage mounted', { view });
  }, [view]);

  if (error) {
    logger.error('Error loading opportunities', { error });
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load opportunities. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OrionOpportunity Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'bg-secondary'}`}
              >
                List View
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded ${view === 'kanban' ? 'bg-primary text-white' : 'bg-secondary'}`}
              >
                Kanban View
              </button>
            </div>
            <AddOpportunityForm />
          </div>

          <OpportunityFilters />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : view === 'list' ? (
            <OpportunityList
              opportunities={opportunities}
              isLoading={isLoading}
              error={error}
              refetchOpportunities={refetchOpportunities}
              onAddNew={() => {
                // TODO: Connect this to AddOpportunityForm dialog/modal if needed
                logger.info('Add new opportunity triggered from OpportunityList');
              }}
            />
          ) : (
            <OpportunityKanbanView opportunities={opportunities} onStatusChange={updateOpportunityStatus} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
