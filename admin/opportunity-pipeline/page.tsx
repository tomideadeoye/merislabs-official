'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/ui';
// TODO: Replace Loader with a @/ui/components/ui or shared implementation if available
// import { Loader } from '@/ui/components/ui';
// TODO: Replace Loader with a @/ui/components/ui or shared implementation if available
// import { Loader } from '@/ui/components/ui';
// import { Loader } from '@/ui/components/ui';
import { OpportunityList } from '@/ui/components/orion/opportunities/OpportunityList';
import { OpportunityFilters } from '@/components/OpportunityFilters';
import { AddOpportunityForm } from '@/ui/components/orion/opportunities/AddOpportunityForm';
import { OpportunityKanbanView } from '@/components/OpportunityKanbanView';
import { logger } from '@/lib/logger';
import { useOpportunities } from '@/app/hooks/useOpportunities';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

export default function OpportunityPipelinePage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const { opportunities, isLoading, error } = useOpportunities();

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
            <OpportunityList opportunities={opportunities} />
          ) : (
            <OpportunityKanbanView opportunities={opportunities} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
