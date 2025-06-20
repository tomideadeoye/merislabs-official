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
import React, { useState } from 'react';
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
import { Briefcase, XIcon } from 'lucide-react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { OpportunityPipelineCharts } from './OpportunityPipelineCharts';
import { OpportunityList } from '@/components/ui/orion/opportunities/OpportunityList';
import { OpportunityKanbanView } from '@/components/orion/opportunity-pipeline/OpportunityKanbanView';
import { AddOpportunityForm } from '@/components/ui/orion/opportunities/AddOpportunityForm';
import { useOpportunityDialogStore } from '@/hooks/useOpportunityDialogStore';
import logger from '@/lib/logger';

export default function OpportunityPipelinePage() {
  const [activeView, setActiveView] = useState('list');
  const { open: openAddDialog, close: closeAddDialog } = useOpportunityDialogStore();

  const { opportunities, isLoading, error, refetchOpportunities, updateOpportunityStatus } = useOpportunities();

  const handleAddNew = () => {
    logger.info('[OpportunityPipelinePage] "Add New" button clicked.');
    openAddDialog();
  };

  const handleAddSuccess = () => {
    logger.info('[OpportunityPipelinePage] New opportunity added, refetching list.');
    closeAddDialog();
    refetchOpportunities();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Pipeline"
        icon={<Briefcase className="h-7 w-7" />}
        description="Track and manage all career and educational opportunities from a single command center."
      />

      <OpportunityPipelineCharts opportunities={opportunities} isLoading={isLoading} />

      {error && (
        <Card className="bg-red-900/30 border-red-700 text-red-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <XIcon className="mr-2" /> Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={refetchOpportunities}>
              Retry Fetch
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <OpportunityList
            onAddNew={handleAddNew}
            opportunities={opportunities}
            isLoading={isLoading}
            error={error}
            refetchOpportunities={refetchOpportunities}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-4">
          <OpportunityKanbanView
            opportunities={opportunities}
            onStatusChange={updateOpportunityStatus}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>

      <AddOpportunityForm onSuccess={handleAddSuccess} />
    </div>
  );
}
