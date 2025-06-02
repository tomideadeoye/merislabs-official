"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { OpportunityDetails as OpportunityDetailsType, OpportunityDetails, Opportunity } from '@/types/opportunity';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(FILTERS.STATUS.ALL);
  const [typeFilter, setTypeFilter] = useState(FILTERS.TYPE.ALL);
  const [sortBy, setSortBy] = useState(FILTERS.SORT.DATE_DESC);

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
        // Filter out items without id
        if (!opp.id) return false;

        const matchesSearch = searchTerm === '' ||
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opp.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (opp.content?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === FILTERS.STATUS.ALL || opp.status === statusFilter;
        const matchesType = typeFilter === FILTERS.TYPE.ALL || opp.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case FILTERS.SORT.DATE_ASC:
            return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          case FILTERS.SORT.DATE_DESC:
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          case FILTERS.SORT.TITLE_ASC:
            return a.title.localeCompare(b.title);
          case FILTERS.SORT.TITLE_DESC:
            return b.title.localeCompare(a.title);
          case FILTERS.SORT.COMPANY_ASC:
            return (a.company || '').localeCompare(b.company || '');
          case FILTERS.SORT.COMPANY_DESC:
            return (b.company || '').localeCompare(a.company || '');
          default:
            return 0;
        }
      });
  }, [opportunities, searchTerm, statusFilter, typeFilter, sortBy]);

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

        <div className="flex gap-2 flex-wrap">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value={FILTERS.STATUS.ALL}>All Statuses</SelectItem>
                <SelectItem value={FILTERS.STATUS.IDENTIFIED}>Identified</SelectItem>
                <SelectItem value={FILTERS.STATUS.RESEARCHING}>Researching</SelectItem>
                <SelectItem value={FILTERS.STATUS.EVALUATING}>Evaluating</SelectItem>
                <SelectItem value={FILTERS.STATUS.EVALUATED_POSITIVE}>Positive Evaluation</SelectItem>
                <SelectItem value={FILTERS.STATUS.EVALUATED_NEGATIVE}>Negative Evaluation</SelectItem>
                <SelectItem value={FILTERS.STATUS.APPLICATION_DRAFTING}>Drafting Application</SelectItem>
                <SelectItem value={FILTERS.STATUS.APPLICATION_READY}>Application Ready</SelectItem>
                <SelectItem value={FILTERS.STATUS.APPLIED}>Applied</SelectItem>
                <SelectItem value={FILTERS.STATUS.INTERVIEW_SCHEDULED}>Interview Scheduled</SelectItem>
                <SelectItem value={FILTERS.STATUS.OFFER_RECEIVED}>Offer Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value={FILTERS.TYPE.ALL}>All Types</SelectItem>
                <SelectItem value={FILTERS.TYPE.JOB}>Job</SelectItem>
                <SelectItem value={FILTERS.TYPE.EDUCATION}>Education</SelectItem>
                <SelectItem value={FILTERS.TYPE.PROJECT}>Project</SelectItem>
                <SelectItem value={FILTERS.TYPE.FUNDING}>Funding</SelectItem>
                <SelectItem value={FILTERS.TYPE.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value={FILTERS.SORT.DATE_DESC}>Newest First</SelectItem>
                <SelectItem value={FILTERS.SORT.DATE_ASC}>Oldest First</SelectItem>
                <SelectItem value={FILTERS.SORT.TITLE_ASC}>Title (A-Z)</SelectItem>
                <SelectItem value={FILTERS.SORT.TITLE_DESC}>Title (Z-A)</SelectItem>
                <SelectItem value={FILTERS.SORT.COMPANY_ASC}>Company (A-Z)</SelectItem>
                <SelectItem value={FILTERS.SORT.COMPANY_DESC}>Company (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          {searchTerm || statusFilter !== FILTERS.STATUS.ALL || typeFilter !== FILTERS.TYPE.ALL ?
            'No opportunities match your filters.' :
            'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities
            .filter((opportunity): opportunity is OpportunityDetails & { id: string } => typeof opportunity.id === 'string')
            .map((opportunity) => {
              const safeOpportunity: Opportunity = { ...opportunity, id: opportunity.id };
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
