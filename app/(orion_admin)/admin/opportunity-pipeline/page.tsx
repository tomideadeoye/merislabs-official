'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: This page serves as the main administrative view for the Opportunity Pipeline. It provides different views (List, Kanban, Evaluator), displays charts, handles data fetching via a hook, and manages the "Add Opportunity" dialog.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Uses `useOpportunities` hook (`@/hooks/useOpportunities`) for fetching, loading, error, and status updates.
//   - Renders `OpportunityPipelineCharts` (`./OpportunityPipelineCharts`) for data visualization.
//   - Renders `OpportunityList` (`@/components/ui/orion/opportunities/OpportunityList`) for list view.
//   - Renders `OpportunityKanbanView` (`@/components/orion/opportunity-pipeline/OpportunityKanbanView`) for Kanban view.
//   - Renders `OpportunityEvaluator` (`@/components/ui/orion/opportunities/OpportunityEvaluator`) for quick evaluation.
//   - Renders `AddOpportunityForm` (`@/components/ui/orion/opportunities/AddOpportunityForm`) within a dialog.
//   - Uses `useOpportunityDialogStore` (`@/hooks/useOpportunityDialogStore`) to manage the add form dialog state.
//   - Uses `logger` (`@/lib/logger`) for extensive logging.
import React, { useState, useEffect } from 'react';
import {
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components/ui';
import { Briefcase, BarChart2, XIcon } from 'lucide-react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityPipelineCharts } from './OpportunityPipelineCharts';
import { OpportunityList } from '@/components/ui/orion/opportunities/OpportunityList';
import { OpportunityKanbanView } from '@/components/orion/opportunity-pipeline/OpportunityKanbanView';
import { OpportunityEvaluator } from '@/components/ui/orion/opportunities/OpportunityEvaluator';
import { AddOpportunityForm } from '@/components/ui/orion/opportunities/AddOpportunityForm';
import { useOpportunityDialogStore } from '@/hooks/useOpportunityDialogStore';
import logger from '@/lib/logger';

export default function OpportunityPipelinePage() {
  logger.debug('[OPPORTUNITY_PIPELINE_PAGE][RENDER] Component rendering.');
  const [activeView, setActiveView] = useState('list');
  const { open: openAddDialog, close: closeAddDialog } = useOpportunityDialogStore();

  const { opportunities, isLoading, error, refetchOpportunities, updateOpportunityStatus } = useOpportunities();

  // Log opportunities, isLoading, and error from useOpportunities hook
  useEffect(() => {
    logger.debug('[OPPORTUNITY_PIPELINE_PAGE][USE_EFFECT][OPPORTUNITIES_STATE]', {
      opportunitiesCount: opportunities.length,
      isLoading,
      error,
    });
  }, [opportunities.length, isLoading, error]);

  const handleAddNew = () => {
    logger.info('[OPPORTUNITY_PIPELINE_PAGE][EVENT] "Add New" button clicked.');
    openAddDialog();
  };

  const handleAddSuccess = () => {
    logger.info('[OPPORTUNITY_PIPELINE_PAGE][EVENT] New opportunity added successfully, refetching list.');
    closeAddDialog();
    refetchOpportunities(); // This call will trigger a re-fetch and state update in useOpportunities
  };

  logger.debug('[OPPORTUNITY_PIPELINE_PAGE][RETURN] Rendering JSX.', {
    activeView,
    opportunitiesCount: opportunities.length,
    isLoading,
    error,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Pipeline"
        icon={<Briefcase className="h-7 w-7" />}
        description="Track and manage job applications, education programs, and project collaborations."
      />

      <OpportunityPipelineCharts opportunities={opportunities} isLoading={isLoading} />

      {error && (
        <Card className="bg-gradient-to-r from-red-900 to-red-800 border-red-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-red-200">
              <XIcon className="mr-2 h-6 w-6 text-red-400" />
              Data Fetch Error
            </CardTitle>
            <CardDescription className="text-red-300">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-900/30"
              onClick={() => {
                logger.info('[OPPORTUNITY_PIPELINE_PAGE][EVENT] "Retry Fetch" button clicked.');
                refetchOpportunities();
              }}
            >
              Retry Fetch
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs
        defaultValue="list"
        value={activeView}
        onValueChange={(value) => {
          logger.info('[OPPORTUNITY_PIPELINE_PAGE][EVENT] Tab changed.', { newTab: value });
          setActiveView(value);
        }}
      >
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="evaluator">Opportunity Evaluator</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <OpportunityList
            opportunities={opportunities}
            isLoading={isLoading}
            error={error}
            refetchOpportunities={refetchOpportunities}
            onAddNew={handleAddNew}
          />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <OpportunityKanbanView
            opportunities={opportunities}
            onStatusChange={async (opportunityId, newStatus) => {
              logger.info('[OPPORTUNITY_PIPELINE_PAGE][EVENT] Kanban status change initiated.', {
                opportunityId,
                newStatus,
              });
              await updateOpportunityStatus(opportunityId, newStatus);
            }}
          />
        </TabsContent>

        <TabsContent value="evaluator" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-200">
                <BarChart2 className="mr-2 h-6 w-6 text-amber-400" />
                Quick Opportunity Evaluator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Paste details to analyze an opportunity against your profile without saving it first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OpportunityEvaluator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddOpportunityForm onSuccess={handleAddSuccess} />
    </div>
  );
}
