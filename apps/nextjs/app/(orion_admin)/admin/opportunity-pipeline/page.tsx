"use client";

import React, { useState } from 'react';
import { OrionOpportunity } from '@repo/shared';
import { OpportunityList, OpportunityKanbanView, AddOpportunityForm, OpportunityEvaluator } from '@repo/ui';
import { useOpportunityDialogStore } from '@repo/sharedhooks/useOpportunityDialogStore';
import { Tabs, TabsContent, TabsList, TabsTrigger, PageHeader, Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@repo/ui';
import { Briefcase, BarChart2, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useOpportunities } from '@repo/sharedhooks/useOpportunities';
import { OpportunityPipelineCharts } from './OpportunityPipelineCharts';

import { useOpportunityCentralStore } from '@repo/shared';

export default function OpportunityPipelinePage() {
  const [activeView, setActiveView] = useState('list');
  // Dialog open/close state is now managed by global store
  const router = useRouter();
  const {
    opportunities,
    isLoading,
    error,
    refetchOpportunities
  } = useOpportunities();

  // Listen for Kanban refetch flag
  // TODO: Type state properly (currently using 'any' for rapid migration)
  const needsRefetch = useOpportunityCentralStore((state: any) => state.needsRefetch);
  const setNeedsRefetch = useOpportunityCentralStore((state: any) => state.setNeedsRefetch);
  console.info('[OpportunityPipeline][MIGRATION] Using central store selector for needsRefetch and setNeedsRefetch', { needsRefetch, setNeedsRefetch });
  React.useEffect(() => {
    if (needsRefetch) {
      refetchOpportunities();
      setNeedsRefetch(false);
    }
  }, [needsRefetch, refetchOpportunities, setNeedsRefetch]);

  const { open: openAddDialog, close: closeAddDialog } = useOpportunityDialogStore();

  const handleAddNew = () => {
    openAddDialog();
  };

  const handleAddSuccess = (opportunityId: string) => {
    closeAddDialog();
    refetchOpportunities();
  };

  // In the component where you fetch and display opportunities:
  // After fetching, check for error and render fallback UI if needed
  const opportunityError = error;
  const handleRetryFetchOpportunity = () => {
    refetchOpportunities();
  };

  // Add this block after the Notion error fallback UI, or wherever research results/errors are displayed
  const researchError = error;
  const handleRetryResearch = () => {
    refetchOpportunities();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="OrionOpportunity Pipeline"
        icon={<Briefcase className="h-7 w-7" />}
        description="Track and manage job applications, education programs, and project collaborations."
      />

      {/* Visualization charts for admin */}
      <OpportunityPipelineCharts opportunities={opportunities} />

      {opportunityError && (
        <Card className="bg-gradient-to-r from-red-900 to-red-800 border-red-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-red-200">
              <XIcon className="mr-2 h-6 w-6 text-red-400" />
              Notion Fetch Error
            </CardTitle>
            <CardDescription className="text-red-300">
              {opportunityError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-red-200">Troubleshooting tips:</div>
            <ul className="mb-4 text-red-100 list-disc list-inside text-sm">
              <li>Check your Notion API key and integration permissions.</li>
              <li>Ensure the OrionOpportunity ID is valid and accessible.</li>
              <li>Check your network connection and Notion API status.</li>
              <li>Try again or contact support if the issue persists.</li>
            </ul>
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-900/30"
              onClick={handleRetryFetchOpportunity}
            >
              Retry Fetch
            </Button>
          </CardContent>
        </Card>
      )}

      {researchError && (
        <Card className="bg-gradient-to-r from-red-900 to-red-800 border-red-700 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-red-200">
              <XIcon className="mr-2 h-6 w-6 text-red-400" />
              Research Proxy Error
            </CardTitle>
            <CardDescription className="text-red-300">
              {researchError}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-red-200">Troubleshooting tips:</div>
            <ul className="mb-4 text-red-100 list-disc list-inside text-sm">
              <li>Ensure the Python backend is running on <b>localhost:5002</b>.</li>
              <li>Check your network connection and backend logs for errors.</li>
              <li>Try again or contact support if the issue persists.</li>
            </ul>
            <Button
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-900/30"
              onClick={handleRetryResearch}
            >
              Retry Research
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="evaluator">OrionOpportunity Evaluator</TabsTrigger>
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
          />
        </TabsContent>

        <TabsContent value="evaluator" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-200">
                <BarChart2 className="mr-2 h-6 w-6 text-amber-400" />
                OrionOpportunity Evaluator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Analyze job descriptions, academic programs, or project briefs against your profile and goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OpportunityEvaluator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddOpportunityForm
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
