'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
// TODO: Replace Loader with a @repo/ui or shared implementation if available
// import { Loader } from '@repo/ui';
// TODO: Replace Loader with a @repo/ui or shared implementation if available
// import { Loader } from '@repo/ui';
// import { Loader } from '@repo/sharedui';
import { OpportunityList, OpportunityFilters, AddOpportunityForm, OpportunityKanbanView } from '@repo/ui';
import { logger } from '@repo/shared/logger';
import { useOpportunities } from '@repo/sharedhooks/useOpportunities';

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
                className={`px-4 py-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'bg-secondary'
                  }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded ${view === 'kanban' ? 'bg-primary text-white' : 'bg-secondary'
                  }`}
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
