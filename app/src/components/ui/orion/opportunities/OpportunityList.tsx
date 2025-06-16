'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button, Input, Loader, Badge } from '../../ui';
import { Plus, Search, Loader2 } from 'lucide-react';
import type { OrionOpportunity } from '@/types/orion';
import { useOpportunities, OpportunityFilters as OpportunityDataFilters } from '@/app/hooks/useOpportunities';
import { useOpportunityDialogStore } from '@/app/hooks/useOpportunityDialogStore';
import { logger } from '@/lib/logger';

const FILTERS = {
  STATUS: {
    ALL: 'all',
    IDENTIFIED: 'identified',
    RESEARCHING: 'researching',
    EVALUATING: 'evaluating',
    EVALUATED_POSITIVE: 'evaluated_positive',
    EVALUATED_NEGATIVE: 'evaluated_negative',
    APPLICATION_DRAFTING: 'application_drafting',
    APPLICATION_READY: 'application_ready',
    APPLIED: 'applied',
    INTERVIEW_SCHEDULED: 'interview_scheduled',
    OFFER_RECEIVED: 'offer_received',
  },
  TYPE: {
    ALL: 'all',
    JOB: 'job',
    EDUCATION: 'education_program',
    PROJECT: 'project_collaboration',
    FUNDING: 'funding',
    OTHER: 'other',
  },
  SORT: {
    DATE_DESC: 'dateDesc',
    DATE_ASC: 'dateAsc',
    TITLE_ASC: 'titleAsc',
    TITLE_DESC: 'titleDesc',
    COMPANY_ASC: 'companyAsc',
    COMPANY_DESC: 'companyDesc',
  },
};

interface OpportunityListProps {
  opportunities?: OrionOpportunity[];
  isLoading?: boolean;
  error?: string | null;
  onAddNew?: () => void;
  refetchOpportunities?: () => Promise<void>;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities: propOpportunities,
  isLoading: propIsLoading,
  error: propError,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OpportunityDataFilters>({}); // Local filters state
  const [sort, setSort] = useState<string>('lastStatusUpdate'); // Local sort state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Local sortOrder state

  const {
    opportunities,
    isLoading,
    error,
    refetchOpportunities, // This will be triggered by filter/sort changes via useEffect
  } = useOpportunities(filters, sort, sortOrder); // Pass local states to useOpportunities

  // Refetch opportunities whenever filters or sort changes
  useEffect(() => {
    refetchOpportunities();
  }, [filters, sort, sortOrder, refetchOpportunities]);

  // Derived filtered opportunities based on searchTerm (local filtering for display)
  const filteredOpportunities = useMemo(() => {
    const filteredBySearch = opportunities.filter((opp) => {
      if (!opp.id) return false;

      const matchesSearch =
        searchTerm === '' ||
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.companyOrInstitution?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
    // No need for status, type, priority, tag filters here as they are handled by useOpportunities hook

    // Sorting is handled by useOpportunities, so we just return the already sorted opportunities
    return filteredBySearch;
  }, [opportunities, searchTerm]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // You might want to expose setFilters, setSort, setSortOrder from here
  // or allow OpportunityFilters to update them via context/props if it's a child

  // For now, removing the direct usage of useOpportunityCentralStore

  console.log('[OpportunityList] Re-evaluating types after previous fixes.');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200">Opportunities</h2>
        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="pl-8 bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Loading opportunities...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">{error}</div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm ? 'No opportunities match your search.' : 'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
      </div>
    </div>
  );
};

export default OpportunityList;
