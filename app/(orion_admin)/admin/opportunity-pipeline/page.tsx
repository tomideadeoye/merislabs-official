"use client";

import React, { useState } from 'react';
import { OpportunityList } from '@/components/orion/opportunities/OpportunityList';
import { OpportunityKanbanView } from '@/components/orion/opportunities/OpportunityKanbanView';
import { AddOpportunityForm } from '@/components/orion/opportunities/AddOpportunityForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { BriefcaseBusiness } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OpportunityPipelinePage() {
  const [activeView, setActiveView] = useState('list');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const router = useRouter();
  
  const handleAddNew = () => {
    setIsAddFormOpen(true);
  };
  
  const handleAddSuccess = (opportunityId: string) => {
    router.push(`/admin/opportunity-pipeline/${opportunityId}`);
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Pipeline"
        icon={<BriefcaseBusiness className="h-7 w-7" />}
        description="Track and manage job applications, education programs, and project collaborations."
      />
      
      <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <OpportunityList onAddNew={handleAddNew} />
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