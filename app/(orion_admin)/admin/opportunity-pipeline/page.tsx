"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { PageNames } from "@/app_state";
import { BriefcaseBusiness, PlusCircle } from "lucide-react";
import { useOpportunities, OpportunityFilters } from '@/hooks/useOpportunities';
import { OpportunityList } from '@/components/orion/opportunities/OpportunityList';
import { OpportunityFilters as OpportunityFiltersComponent } from '@/components/orion/opportunities/OpportunityFilters';
import { AddOpportunityForm } from '@/components/orion/opportunities/AddOpportunityForm';
import { OpportunityEvaluator } from '@/components/orion/OpportunityEvaluator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from "@/app_state";

export default function OpportunityPipelinePage() {
  const [memoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED, false);
  const [filters, setFilters] = useState<OpportunityFilters>({});
  const [sort, setSort] = useState<string>('lastStatusUpdate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeView, setActiveView] = useState<string>('list');
  const [activeTab, setActiveTab] = useState<string>('opportunities');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { 
    opportunities, 
    isLoading, 
    error, 
    refetchOpportunities 
  } = useOpportunities(filters, sort);

  const handleOpportunityAdded = () => {
    setShowAddForm(false);
    setRefreshKey(prev => prev + 1); // Trigger re-fetch in OpportunityList
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.PIPELINE}
        icon={<BriefcaseBusiness className="h-7 w-7" />}
        description="Track, evaluate, and manage your career, educational, and project opportunities."
        showMemoryStatus={true}
        memoryInitialized={memoryInitialized}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-700 border-gray-600">
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-blue-600">
            Opportunity Tracker
          </TabsTrigger>
          <TabsTrigger value="evaluator" className="data-[state=active]:bg-amber-600">
            Opportunity Evaluator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="opportunities" className="mt-4 space-y-6">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger value="list" className="data-[state=active]:bg-blue-600">
                  List View
                </TabsTrigger>
                <TabsTrigger value="kanban" className="data-[state=active]:bg-purple-600">
                  Kanban View
                </TabsTrigger>
              </TabsList>
              
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Opportunity
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-gray-200">
                  <DialogHeader>
                    <DialogTitle className="text-green-400">Log New Opportunity</DialogTitle>
                  </DialogHeader>
                  <AddOpportunityForm 
                    onSuccess={handleOpportunityAdded} 
                    onCancel={() => setShowAddForm(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mb-6">
              <OpportunityFiltersComponent 
                filters={filters} 
                setFilters={setFilters} 
                sort={sort} 
                setSort={setSort}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
            
            <TabsContent value="list" className="mt-0">
              <OpportunityList 
                key={refreshKey}
                opportunities={opportunities} 
                isLoading={isLoading} 
                error={error} 
                refetchOpportunities={refetchOpportunities} 
              />
            </TabsContent>
            
            <TabsContent value="kanban" className="mt-0">
              <div className="bg-gray-800 border border-gray-700 rounded-md p-6 text-center">
                <p className="text-gray-400">Kanban view coming soon!</p>
                <p className="text-xs text-gray-500 mt-2">This view will display opportunities organized by status.</p>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="evaluator" className="mt-4">
          <OpportunityEvaluator />
        </TabsContent>
      </Tabs>
    </div>
  );
}