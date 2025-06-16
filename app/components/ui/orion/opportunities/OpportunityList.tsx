'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button, Input } from '@/components/ui';
import { Plus, Search, Loader2 } from 'lucide-react';
import type { OrionOpportunity } from '@/lib/types';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useOpportunityCentralStore } from '@/opportunityCentralStore';
import { OpportunityCentralStoreType } from '@/opportunityCentralStore'; // Import directly from the store

// Removed FILTERS constant as it's no longer directly used in the component

interface OpportunityListProps {
  // Removed unused props: opportunities, isLoading, error, refetchOpportunities
  onAddNew?: () => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({ onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Use central store for filters and sorting
  const { filters, sort, sortOrder } = useOpportunityCentralStore((state: OpportunityCentralStoreType) => ({
    filters: state.filters,
    sort: state.sort,
    sortOrder: state.sortOrder,
  }));

  const { opportunities, isLoading, error, refetchOpportunities } = useOpportunities(); // No arguments here

  // Refetch opportunities whenever filters or sort changes - this is now a no-op if useOpportunities doesn't use them.
  // We will keep refetchOpportunities, but it will just refetch all data. Local filtering/sorting applied below.
  useEffect(() => {
    refetchOpportunities();
  }, [refetchOpportunities]); // Removed filters, sort, sortOrder from dependency array as useOpportunities does not use them.

  // Derived filtered and sorted opportunities based on searchTerm and central store filters/sort
  const filteredAndSortedOpportunities = useMemo(() => {
    let filtered = opportunities;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter((opp: OrionOpportunity) => {
        return (
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opp.companyOrInstitution?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply filters from central store
    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter((opp: OrionOpportunity) => opp.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter((opp: OrionOpportunity) => opp.type === filters.type);
      }
      if (filters.priority && filters.priority !== 'all') {
        filtered = filtered.filter((opp: OrionOpportunity) => opp.priority === filters.priority);
      }
      if (filters.tag && typeof filters.tag === 'string') {
        filtered = filtered.filter((opp: OrionOpportunity) => opp.tags?.includes(filters.tag as string));
      }
      // Add other filters as needed
    }

    // Apply sorting from central store
    const sorted = [...filtered].sort((a: OrionOpportunity, b: OrionOpportunity) => {
      const aValue = a[sort as keyof OrionOpportunity] || '';
      const bValue = b[sort as keyof OrionOpportunity] || '';

      if (aValue === bValue) return 0;

      if (sortOrder === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });

    return sorted;
  }, [opportunities, searchTerm, filters, sort, sortOrder]);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      ) : filteredAndSortedOpportunities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm ? 'No opportunities match your search.' : 'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedOpportunities.map((opportunity: OrionOpportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        {filteredAndSortedOpportunities.length}{' '}
        {filteredAndSortedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
      </div>
    </div>
  );
};

export default OpportunityList;
