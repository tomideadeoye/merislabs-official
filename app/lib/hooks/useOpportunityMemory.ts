import { useEffect, useState } from 'react';
import logger from '@/lib/logger';
import { ScoredMemoryPoint, QdrantFilter, SearchMemoryResponse } from '@/lib/types';
import { apiFetcher } from '@/lib/utils/apiFetcher';

interface UseOpportunityMemoryResult {
  opportunityMemories: ScoredMemoryPoint[];
  isLoading: boolean;
  error: string | null;
}

export const useOpportunityMemory = (opportunityId: string): UseOpportunityMemoryResult => {
  const [opportunityMemories, setOpportunityMemories] = useState<ScoredMemoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opportunityId) {
      logger.warn('useOpportunityMemory: opportunityId is missing.');
      setError('Opportunity ID is required to fetch memories.');
      setIsLoading(false);
      return;
    }

    const fetchOpportunityMemories = async () => {
      logger.info('Fetching opportunity memories.', { opportunityId });
      setIsLoading(true);
      setError(null);
      try {
        // Construct the Qdrant filter to fetch memories for the specific opportunity
        const filter: QdrantFilter = {
          must: [
            {
              key: 'opportunityId',
              match: { value: opportunityId },
            },
            {
              // Optionally, filter by relevant memory types for opportunities
              key: 'type',
              match: { value: 'opportunity_research' }, // Example type
            },
            {
              key: 'type',
              match: { value: 'stakeholder_interaction' }, // Example type
            },
            {
              // Add other relevant memory types here as needed
              key: 'type',
              match: { value: 'journal_entry' },
            },
            {
              key: 'type',
              match: { value: 'general_note' },
            },
          ],
        };

        logger.debug('Calling /api/orion/memory/search with filter', { filter });

        const response = await apiFetcher<SearchMemoryResponse>('/api/orion/memory/search', {
          method: 'POST',
          body: { filter, limit: 100 }, // Adjust limit as needed
        });

        if (response.success && response.results) {
          setOpportunityMemories(response.results);
          logger.success('Opportunity memories fetched successfully.', {
            opportunityId,
            count: response.results.length,
          });
        } else {
          const errorMessage = response.error || 'Unknown error fetching memories.';
          logger.error('Failed to fetch opportunity memories from API.', {
            error: errorMessage,
            opportunityId,
          });
          setError(errorMessage);
        }
      } catch (err: unknown) {
        const errorMessage = `Failed to load opportunity memories: ${(err as Error).message}`;
        logger.error('Error in fetchOpportunityMemories:', { error: err, opportunityId });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityMemories();
  }, [opportunityId]);

  return { opportunityMemories, isLoading, error };
};
