'use client';

import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { useOpportunities } from '../../../../hooks/useOpportunities';
import { OpportunityKanbanView } from '../../../../src/lib';

// GOAL: Display the opportunity pipeline in a Kanban board view, enabling users to visualize and manage opportunities by status.
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// - `useOpportunities` (packages/shared/hooks/useOpportunities.ts): Provides the core logic for fetching opportunities and updating their status.
// - `OpportunityKanbanView` (components/orion/opportunities/OpportunityKanbanView.tsx): Renders the actual Kanban board UI.
// - `OpportunityStatus` (packages/shared/types/orion): Defines the possible statuses for opportunities.
// - API Endpoints (`/api/orion/OrionOpportunity/list`, `/api/orion/OrionOpportunity/update-status`): Backend services for data retrieval and modification.
// - Navigation: Uses `next/navigation` for routing to other opportunity-related pages.
// next steps if any:
// - Integrate advanced filtering options from `useOpportunities` into the UI.
// - Add real-time updates for status changes across multiple users.
// components to merge with if any:

export default function OpportunityKanbanPage() {
  const router = useRouter();
  console.log(
    'DEBUG: OpportunityKanbanPage - Component mounted. Operation: Render, User/Session: N/A, Parameters: {}, Validation: Initializing Kanban page.'
  );

  const { opportunities, isLoading, error, refetchOpportunities, updateOpportunityStatus } = useOpportunities();

  const handleRefresh = () => {
    console.log(
      'INFO: OpportunityKanbanPage - Refresh button clicked. Operation: handleRefresh, User/Session: N/A, Results: Triggering refetchOpportunities.'
    );
    refetchOpportunities();
  };

  const handleNewOpportunity = () => {
    console.log(
      'INFO: OpportunityKanbanPage - New Opportunity button clicked. Operation: handleNewOpportunity, User/Session: N/A, Results: Navigating to new opportunity page.'
    );
    router.push('/admin/OrionOpportunity/new');
  };

  const handleListView = () => {
    console.log(
      'INFO: OpportunityKanbanPage - List View button clicked. Operation: handleListView, User/Session: N/A, Results: Navigating to list view page.'
    );
    router.push('/admin/OrionOpportunity-pipeline');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleListView}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            List View
          </Button>

          <h1 className="text-2xl font-bold text-gray-200">OrionOpportunity Pipeline</h1>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>

          <Button onClick={handleNewOpportunity}>
            <Plus className="mr-2 h-4 w-4" />
            New OrionOpportunity
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6">
          ERROR: {error}
          <p className="mt-2">Please try refreshing or contact support if the issue persists.</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-400">Loading opportunities...</p>
        </div>
      ) : (
        <OpportunityKanbanView opportunities={opportunities} onStatusChange={updateOpportunityStatus} />
      )}
    </div>
  );
}
