"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button, Input, Loader, Badge } from '@repo/ui';
import { Plus, Search, Loader2 } from 'lucide-react';
import type { OpportunityDetails, Opportunity } from '@shared/types/opportunity';
import { useOpportunityCentralStore } from '@/components/orion/opportunities/opportunityCentralStore';
import { logger } from '@shared/lib/logger';

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
    OFFER_RECEIVED: 'offer_received'
  },
  TYPE: {
    ALL: 'all',
    JOB: 'job',
    EDUCATION: 'education_program',
    PROJECT: 'project_collaboration',
    FUNDING: 'funding',
    OTHER: 'other'
  },
  SORT: {
    DATE_DESC: 'dateDesc',
    DATE_ASC: 'dateAsc',
    TITLE_ASC: 'titleAsc',
    TITLE_DESC: 'titleDesc',
    COMPANY_ASC: 'companyAsc',
    COMPANY_DESC: 'companyDesc'
  }
};

interface OpportunityListProps {
  opportunities?: OpportunityDetails[];
  isLoading?: boolean;
  error?: string | null;
  onAddNew?: () => void;
  refetchOpportunities?: () => Promise<void>;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities: propOpportunities,
  isLoading: propIsLoading,
  error: propError,
  onAddNew
}) => {
  const [opportunities, setOpportunities] = useState<OpportunityDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters = useOpportunityCentralStore((state: any) => state.filters);
  const sort = useOpportunityCentralStore((state: any) => state.sort);
  const sortOrder = useOpportunityCentralStore((state: any) => state.sortOrder);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    logger.info('[OpportunityList] Props received.', { hasOpportunities: !!propOpportunities, isLoading: propIsLoading });
    if (propOpportunities) {
      setOpportunities(propOpportunities);
      setLoading(typeof propIsLoading === 'boolean' ? propIsLoading : false);
      setError(typeof propError === 'string' ? propError : null);
    }
  }, [propOpportunities, propIsLoading, propError]);

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        if (!opp.id) return false;

        const matchesSearch = searchTerm === '' ||
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opp.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = !filters.status || opp.status === filters.status;
        const matchesType = !filters.type || opp.type === filters.type;
        const matchesPriority = !filters.priority || opp.priority === filters.priority;
        const matchesTag = !filters.tag || (opp.tags && opp.tags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase())));

        return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTag;
      })
      .sort((a, b) => {
        const aValue = a[sort as keyof OpportunityDetails] ?? '';
        const bValue = b[sort as keyof OpportunityDetails] ?? '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
  }, [opportunities, searchTerm, filters, sort, sortOrder]);

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-8 bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Loading opportunities...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          {error}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm || Object.values(filters).some(v => v) ?
            'No opportunities match your filters.' :
            'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity as Opportunity} />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
      </div>
    </div>
  );
};
