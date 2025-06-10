import { useState, useEffect, useCallback } from 'react';
import { Opportunity } from '../types/opportunity';

export interface OpportunityFilters {
  status?: string;
  type?: string;
  tag?: string;
  priority?: string;
}

export function useOpportunities(
  filters: OpportunityFilters = {},
  sortBy: string = 'lastStatusUpdate',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.priority) params.append('priority', filters.priority);

      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/orion/opportunity/list?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setOpportunities(data.opportunities);
      } else {
        throw new Error(data.error || 'Failed to fetch opportunities');
      }
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message || 'An unexpected error occurred');
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.type, filters.tag, filters.priority, sortBy, sortOrder]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return {
    opportunities,
    isLoading,
    error,
    refetchOpportunities: fetchOpportunities
  };
}