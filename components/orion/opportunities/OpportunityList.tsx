"use client";

import React from 'react';
import { Opportunity } from '@/types/opportunity';
import { OpportunityCard } from './OpportunityCard';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpportunityListProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  refetchOpportunities: () => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  isLoading,
  error,
  refetchOpportunities
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading opportunities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">Error loading opportunities</p>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetchOpportunities}
            className="mt-2 border-red-700 text-red-300 hover:bg-red-900/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 text-gray-300 p-6 rounded-md text-center">
        <p className="mb-2">No opportunities found</p>
        <p className="text-sm text-gray-400">Try adjusting your filters or add a new opportunity.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map(opportunity => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
};