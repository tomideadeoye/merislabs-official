"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Loader2, Plus, Search } from 'lucide-react';
import { OpportunityDetails as OpportunityDetailsType, OpportunityDetails, Opportunity } from '@shared/types/opportunity';
import { useOpportunityCentralStore } from '@/components/orion/opportunities/opportunityCentralStore';

// Constants for opportunity filters and sorting
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
  opportunities?: OpportunityDetailsType[];
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
  const [opportunities, setOpportunities] = useState<OpportunityDetailsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters = useOpportunityCentralStore((state: any) => state.filters);
  const sort = useOpportunityCentralStore((state: any) => state.sort);
  const sortOrder = useOpportunityCentralStore((state: any) => state.sortOrder);
  const setFilters = useOpportunityCentralStore((state: any) => state.setFilters);
  const setSort = useOpportunityCentralStore((state: any) => state.setSort);
  const setSortOrder = useOpportunityCentralStore((state: any) => state.setSortOrder);
  const clearFilters = useOpportunityCentralStore((state: any) => state.clearFilters);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use props if provided, otherwise fetch from API
    if (propOpportunities) {
      setOpportunities(propOpportunities);
      setLoading(typeof propIsLoading === 'boolean' ? propIsLoading : false);
      setError(typeof propError === 'string' ? propError : null);
      return;
    }

    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orion/opportunity/list');

        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }

        const data = await response.json();

        if (data.success && data.opportunities) {
          setOpportunities(data.opportunities);
        } else {
          throw new Error(data.error || 'Failed to fetch opportunities');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [propOpportunities, propIsLoading, propError]);

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opp => {
        if (!opp.id) return false;

        const matchesSearch = searchTerm === '' ||
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opp.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (opp.content?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = !filters.status || opp.status === filters.status;
        const matchesType = !filters.type || opp.type === filters.type;
        const matchesPriority = !filters.priority || opp.priority === filters.priority;
        const matchesTag = !filters.tag || (opp.tags && opp.tags.includes(filters.tag));

        return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTag;
      })
      .sort((a, b) => {
        if (sort === "updatedAt") {
          return sortOrder === "asc"
            ? new Date(a.updatedAt || '').getTime() - new Date(b.updatedAt || '').getTime()
            : new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime();
        }
        if (sort === "createdAt") {
          return sortOrder === "asc"
            ? new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
            : new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        }
        if (sort === "title") {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
        if (sort === "company") {
          return sortOrder === "asc"
            ? (a.company || '').localeCompare(b.company || '')
            : (b.company || '').localeCompare(a.company || '');
        }
        if (sort === "priority") {
          return sortOrder === "asc"
            ? (a.priority || '').localeCompare(b.priority || '')
            : (b.priority || '').localeCompare(a.priority || '');
        }
        if (sort === "nextActionDate") {
          return sortOrder === "asc"
            ? new Date(a.nextActionDate || '').getTime() - new Date(b.nextActionDate || '').getTime()
            : new Date(b.nextActionDate || '').getTime() - new Date(a.nextActionDate || '').getTime();
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
          {searchTerm || filters.status || filters.type ?
            'No opportunities match your filters.' :
            'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities
            .filter((opportunity): opportunity is OpportunityDetails & { id: string } => typeof opportunity.id === 'string')
            .map((opportunity) => {
              // Ensure both company and companyOrInstitution are always present and strings
              const company = (opportunity.company ?? (opportunity as any).companyOrInstitution ?? '') || '';
              const companyOrInstitution = ((opportunity as any).companyOrInstitution ?? opportunity.company ?? '') || '';
              const safeOpportunity: Opportunity = {
                ...opportunity,
                id: opportunity.id,
                company,
                companyOrInstitution
              };
              console.info('[OpportunityList] Rendering OpportunityCard with safeOpportunity:', { id: safeOpportunity.id, company: safeOpportunity.company, companyOrInstitution: safeOpportunity.companyOrInstitution });
              return <OpportunityCard key={safeOpportunity.id} opportunity={safeOpportunity} />;
            })}
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
      </div>
    </div>
  );
};
