"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { OpportunityList } from '@/components/orion/opportunities/OpportunityList';
import { OpportunityFilters } from '@/components/orion/opportunities/OpportunityFilters';
import { useOpportunities } from '@/hooks/useOpportunities';

export default function OpportunityPipelinePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('lastStatusUpdate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { 
    opportunities, 
    isLoading, 
    error, 
    refetchOpportunities 
  } = useOpportunities(filters, sortBy, sortOrder);
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const filteredOpportunities = searchTerm 
    ? opportunities.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opp.companyOrInstitution.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : opportunities;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-200">Opportunity Pipeline</h1>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/opportunity-pipeline/kanban')}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban View
          </Button>
          
          <Button
            onClick={() => router.push('/admin/opportunity/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Opportunity
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="min-w-[100px]"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        
        <Button
          variant="outline"
          onClick={refetchOpportunities}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {showFilters && (
        <div className="mb-6">
          <OpportunityFilters 
            onFilterChange={handleFilterChange}
            onSortChange={(sortBy, sortOrder) => {
              setSortBy(sortBy);
              setSortOrder(sortOrder as 'asc' | 'desc');
            }}
          />
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <OpportunityList 
        opportunities={filteredOpportunities} 
        isLoading={isLoading} 
      />
    </div>
  );
}