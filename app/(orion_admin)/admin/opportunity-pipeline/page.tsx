'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Loader } from '@/hooks/components/ui/loader';
import { OpportunityList } from '@/components/orion/opportunities/OpportunityList';
import { OpportunityFilters } from '@/components/orion/opportunities/OpportunityFilters';
import { AddOpportunityForm } from '@/components/orion/opportunities/AddOpportunityForm';
import { OpportunityKanbanView } from '@/components/orion/opportunities/OpportunityKanbanView';
import { logger } from '@shared/lib/logger';
import { useOpportunityCentralStore } from '@/components/orion/opportunities/opportunityCentralStore';

export default function OpportunityPipelinePage() {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const { opportunities, setOpportunities, isLoading, error } = useOpportunityCentralStore();

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
          <CardTitle>Opportunity Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded ${
                  view === 'list' ? 'bg-primary text-white' : 'bg-secondary'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-4 py-2 rounded ${
                  view === 'kanban' ? 'bg-primary text-white' : 'bg-secondary'
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
              <Loader />
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
