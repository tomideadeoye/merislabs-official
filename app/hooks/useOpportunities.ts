import { OrionOpportunity } from '@/lib/types';
import logger from '@/lib/logger';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GOAL OF FILE: Custom hook to fetch and manage a list of opportunities using TanStack Query.
// RELATION TO OTHER FILES: This hook is used by `admin/opportunity-pipeline/page.tsx`.
// It will handle API calls to fetch opportunities and manage loading/error states robustly with caching.

interface UseOpportunitiesResult {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
  error: string | null;
  refetchOpportunities: () => void;
  updateOpportunityStatus: (opportunityId: string, newStatus: string) => Promise<void>;
}

export const useOpportunities = (): UseOpportunitiesResult => {
  logger.debug('[USE_OPPORTUNITIES][INIT] Hook initialization with TanStack Query.');
  const queryClient = useQueryClient();

  // Query to fetch opportunities
  const {
    data: opportunities = [],
    isLoading,
    error,
    refetch: refetchOpportunities,
  } = useQuery<OrionOpportunity[], Error>({
    queryKey: ['opportunities'],
    queryFn: async () => {
      logger.info(
        '[USE_OPPORTUNITIES][FETCH_OPPORTUNITIES][START] Attempting to fetch opportunities via React Query.',
        { operation: 'fetch_opportunities' }
      );
      const response = await fetch('/api/orion/opportunity/list');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        logger.warn('[USE_OPPORTUNITIES][FETCH_OPPORTUNITIES][HTTP_ERROR]', { status: response.status, errorData });
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.opportunities)) {
        logger.info('[USE_OPPORTUNITIES][FETCH_OPPORTUNITIES][SUCCESS]', {
          count: result.opportunities.length,
          user: 'system',
        });
        return result.opportunities;
      } else {
        logger.error('[USE_OPPORTUNITIES][FETCH_OPPORTUNITIES][INVALID_RESPONSE]', {
          responseData: result,
          user: 'system',
        });
        throw new Error(result.error || 'Failed to fetch opportunities: Invalid API response format.');
      }
    },
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    // onError is handled via the `error` return value of useQuery or QueryClientProvider global config
  });

  // Mutation to update opportunity status
  const { mutateAsync } = useMutation<void, Error, { opportunityId: string; newStatus: string }>({
    mutationFn: async ({ opportunityId, newStatus }) => {
      logger.info(
        `[USE_OPPORTUNITIES][UPDATE_STATUS][START] Attempting to update status for opportunity ${opportunityId} to ${newStatus}.`,
        {
          operation: 'update_opportunity_status',
          opportunityId,
          newStatus,
          user: 'system',
        }
      );
      const response = await fetch(`/api/orion/opportunity/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update opportunity' }));
        logger.warn('[USE_OPPORTUNITIES][UPDATE_STATUS][HTTP_ERROR]', {
          status: response.status,
          errorData,
          user: 'system',
        });
        throw new Error(errorData.error || 'Failed to update opportunity status.');
      }

      const result = await response.json();
      if (!result.success) {
        logger.error('[USE_OPPORTUNITIES][UPDATE_STATUS][API_FAILURE]', { responseData: result, user: 'system' });
        throw new Error(result.error || 'API indicated failure in updating opportunity status.');
      }
      logger.info(
        `[USE_OPPORTUNITIES][UPDATE_STATUS][SUCCESS] Successfully updated status for opportunity ${opportunityId}.`,
        { response: result, user: 'system' }
      );
    },
    onSuccess: () => {
      logger.info(
        '[USE_OPPORTUNITIES][UPDATE_STATUS][ON_SUCCESS] Invalidating opportunities query to refetch latest data.',
        { user: 'system' }
      );
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
    onError: (err: Error) => {
      logger.error(`[USE_OPPORTUNITIES][UPDATE_STATUS][MUTATION_ERROR] Error updating status.`, {
        error: err.message,
        stack: err.stack,
        user: 'system',
      });
    },
  });

  // Create a wrapper function for updateOpportunityStatus to match the expected signature
  const updateOpportunityStatusWrapper = async (opportunityId: string, newStatus: string): Promise<void> => {
    await mutateAsync({ opportunityId, newStatus });
  };

  return {
    opportunities,
    isLoading,
    error: error ? error.message : null,
    refetchOpportunities: () => refetchOpportunities(),
    updateOpportunityStatus: updateOpportunityStatusWrapper,
  };
};
