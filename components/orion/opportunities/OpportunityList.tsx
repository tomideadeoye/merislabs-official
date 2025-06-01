"use client";

import React, { useState, useEffect } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Search, Filter } from 'lucide-react';
import { OpportunityDetails as Opportunity } from '@/types/opportunity';

interface OpportunityListProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  refetchOpportunities: () => Promise<void>;
  onAddNew?: () => void;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({ onAddNew }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');

  useEffect(() => {
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
  }, []);

  const filteredOpportunities = opportunities
    .filter(opp => {
      const matchesSearch = searchTerm === '' ||
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.companyOrInstitution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opp.descriptionSummary && opp.descriptionSummary.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
      const [matchesType] = typeFilter === 'all' || opp.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateAsc':
          return new Date(a.dateIdentified).getTime() - new Date(b.dateIdentified).getTime();
        case 'dateDesc':
          return new Date(b.dateIdentified).getTime() - new Date(a.dateIdentified).getTime();
        case 'titleAsc':
          return a.title.localeCompare(b.title);
        case 'titleDesc':
          return b.title.localeCompare(a.title);
        case 'companyAsc':
          return (a.companyOrInstitution || '').localeCompare(b.companyOrInstitution || '');
        case 'companyDesc':
          return (b.companyOrInstitution || '').localeCompare(a.companyOrInstitution || '');
        default:
          return 0;
      }
    });

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
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="researching">Researching</SelectItem>
                <SelectItem value="evaluating">Evaluating</SelectItem>
                <SelectItem value="evaluated_positive">Positive Evaluation</SelectItem>
                <SelectItem value="evaluated_negative">Negative Evaluation</SelectItem>
                <SelectItem value="application_drafting">Drafting Application</SelectItem>
                <SelectItem value="application_ready">Application Ready</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="offer_received">Offer Received</SelectItem>
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
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="education_program">Education</SelectItem>
                <SelectItem value="project_collaboration">Project</SelectItem>
                <SelectItem value="funding">Funding</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value="dateDesc">Newest First</SelectItem>
                <SelectItem value="dateAsc">Oldest First</SelectItem>
                <SelectItem value="titleAsc">Title (A-Z)</SelectItem>
                <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
                <SelectItem value="companyAsc">Company (A-Z)</SelectItem>
                <SelectItem value="companyDesc">Company (Z-A)</SelectItem>
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
          {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ?
            'No opportunities match your filters.' :
            'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map(opportunity => (
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
