"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Opportunity } from '@/types/opportunity';
import { OpportunityList } from '@/components/orion/opportunities/OpportunityList';
import { OpportunityKanbanView } from '@/components/orion/opportunities/OpportunityKanbanView';
import { AddOpportunityForm } from '@/components/orion/opportunities/AddOpportunityForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function OpportunityPipelinePage() {
  const [activeView, setActiveView] = useState('list');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/api/orion/opportunities');
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
      } else {
        setError(res.data.error || 'Failed to load opportunities');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleAddNew = () => {
    setIsAddFormOpen(true);
  };

  const handleAddSuccess = (opportunityId: string) => {
    router.push(`/admin/opportunity-pipeline/${opportunityId}`);
    fetchOpportunities();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Pipeline"
        icon={<Briefcase className="h-7 w-7" />}
        description="Track and manage job applications, education programs, and project collaborations."
      />

      <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <OpportunityList
            opportunities={opportunities}
            isLoading={isLoading}
            error={error}
            refetchOpportunities={fetchOpportunities}
            onAddNew={handleAddNew}
          />
        </TabsContent>

        <TabsContent value="kanban" className="mt-6">
          <OpportunityKanbanView />
        </TabsContent>
      </Tabs>

      <AddOpportunityForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
