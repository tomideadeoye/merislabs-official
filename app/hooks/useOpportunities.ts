import { useState, useEffect } from 'react';
import { OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger';

// GOAL OF FILE: Custom hook to fetch and manage a list of opportunities.
// RELATION TO OTHER FILES: This hook is used by `admin/opportunity-pipeline/page.tsx`.
// It will handle API calls to fetch opportunities and manage loading/error states.

interface UseOpportunitiesResult {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
  error: string | null;
  refetchOpportunities: () => void;
}

export const useOpportunities = (): UseOpportunitiesResult => {
  const [opportunities, setOpportunities] = useState<OrionOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    logger.info('Fetching opportunities...', { operation: 'fetch_opportunities' });
    try {
      const response = await fetch('/api/orion/opportunities'); // Assuming this API endpoint exists
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.opportunities || []);
        logger.info('Opportunities fetched successfully.', { count: (data.opportunities || []).length });
      } else {
        setError(data.error || 'Failed to fetch opportunities.');
        logger.error('Failed to fetch opportunities from API.', { error: data.error });
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred while fetching opportunities.');
      logger.error('Error fetching opportunities.', { error: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const refetchOpportunities = () => {
    fetchOpportunities();
  };

  return { opportunities, isLoading, error, refetchOpportunities };
};
