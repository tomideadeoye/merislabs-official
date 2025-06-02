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

export default function OpportunityPipelinePage() {
  const [activeView, setActiveView] = useState('list');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orion/notion/opportunity/list');
      const data = await response.json();

      if (data.success) {
        setOpportunities(data.opportunities);
      } else {
        setError(data.error || 'Failed to load opportunities from Notion');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching opportunities');
      console.error('Fetch Opportunities Error:', err);
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
    setIsAddFormOpen(false);
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
          <OpportunityKanbanView
             opportunities={opportunities}
             refetchOpportunities={fetchOpportunities}
          />
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
