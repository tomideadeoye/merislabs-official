'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from './OpportunityCard';
import { Button, Input } from '@/ui/components/ui';
import { Plus, Search, Loader2 } from 'lucide-react';

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
  const [opportunities, setOpportunities] = useState<OrionOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.filters);
  const sort = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.sort);
  const sortOrder = useOpportunityCentralStore((state: OpportunityCentralStoreType) => state.sortOrder);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    logger.info('[OpportunityList] Props received.', {
      hasOpportunities: !!propOpportunities,
      isLoading: propIsLoading,
    });
    if (propOpportunities) {
      setOpportunities(propOpportunities);
      setLoading(typeof propIsLoading === 'boolean' ? propIsLoading : false);
      setError(typeof propError === 'string' ? propError : null);
    }
  }, [propOpportunities, propIsLoading, propError]);

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        if (!opp.id) return false;

        const matchesSearch =
          searchTerm === '' ||
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (opp.companyOrInstitution?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = !filters.status || opp.status === filters.status;
        const matchesType = !filters.type || opp.type === filters.type;
        const matchesPriority = !filters.priority || opp.priority === filters.priority;
        const matchesTag =
          !filters.tag ||
          (opp.tags && opp.tags.some((tag: string) => tag.toLowerCase().includes(filters.tag!.toLowerCase())));

        return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTag;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'dateIdentified':
          case 'createdAt':
          case 'updatedAt':
          case 'lastStatusUpdate': {
            const dateA = a[sort as 'dateIdentified' | 'createdAt' | 'updatedAt' | 'lastStatusUpdate'];
            const dateB = b[sort as 'dateIdentified' | 'createdAt' | 'updatedAt' | 'lastStatusUpdate'];

            if (!dateA && !dateB) return 0;
            if (!dateA) return sortOrder === 'asc' ? 1 : -1;
            if (!dateB) return sortOrder === 'asc' ? -1 : 1;

            const timeA = new Date(dateA).getTime();
            const timeB = new Date(dateB).getTime();
            return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
          }

          case 'title':
          case 'id':
          case 'url':
          case 'notes':
          case 'company':
          case 'companyOrInstitution':
          case 'content':
          case 'sourceUrl':
          case 'nextActionDate':
          case 'deadline':
          case 'location':
          case 'salary':
          case 'contact':
          case 'position':
          case 'notionPageId':
          case 'contentType': {
            const stringValA = a[sort as keyof OrionOpportunity] as string | undefined;
            const stringValB = b[sort as keyof OrionOpportunity] as string | undefined;

            if (!stringValA && !stringValB) return 0;
            if (!stringValA) return sortOrder === 'asc' ? 1 : -1;
            if (!stringValB) return sortOrder === 'asc' ? -1 : 1;

            return sortOrder === 'asc' ? stringValA.localeCompare(stringValB) : stringValB.localeCompare(stringValA);
          }

          case 'type':
          case 'status':
          case 'priority': {
            const enumValA = a[sort as keyof OrionOpportunity] as string | undefined;
            const enumValB = b[sort as keyof OrionOpportunity] as string | undefined;

            if (!enumValA && !enumValB) return 0;
            if (!enumValA) return sortOrder === 'asc' ? 1 : -1;
            if (!enumValB) return sortOrder === 'asc' ? -1 : 1;

            return sortOrder === 'asc' ? enumValA.localeCompare(enumValB) : enumValB.localeCompare(enumValA);
          }

          default: {
            const fallbackValA = String(a[sort as keyof OrionOpportunity] || '');
            const fallbackValB = String(b[sort as keyof OrionOpportunity] || '');
            return sortOrder === 'asc'
              ? fallbackValA.localeCompare(fallbackValB)
              : fallbackValB.localeCompare(fallbackValA);
          }
        }
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
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">{error}</div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {searchTerm || Object.values(filters).some((v) => v)
            ? 'No opportunities match your filters.'
            : 'No opportunities found. Add your first one!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} OrionOpportunity={opportunity as OrionOpportunity} />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-right">
        {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
      </div>
    </div>
  );
};
