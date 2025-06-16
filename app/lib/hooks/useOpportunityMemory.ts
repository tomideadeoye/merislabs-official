import { useEffect, useState } from 'react';
import logger from '@/lib/logger';
import { ScoredMemoryPoint } from '@/lib/types';

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
        // Simulate API call to fetch memories related to the opportunity
        // In a real scenario, this would be an API call to your /api/orion/memory endpoint
        // Example: const response = await fetch(`/api/orion/memory/search?opportunityId=${opportunityId}`);
        // const data = await response.json();

        const simulatedMemories: ScoredMemoryPoint[] = [
          {
            id: 'mem1',
            score: 0.95,
            payload: {
              text: 'Key details from initial research about company X, focusing on their AI division and recent projects.',
              source_id: `opportunity-${opportunityId}-research-1`,
              timestamp: new Date().toISOString(),
              indexedAt: new Date().toISOString(),
              type: 'opportunity_research',
              tags: ['opportunity', 'research', 'companyX'],
              title: 'Company X Research Overview',
            },
          },
          {
            id: 'mem2',
            score: 0.88,
            payload: {
              text: "Notes from a previous conversation with John Doe about company X's culture and hiring process.",
              source_id: `opportunity-${opportunityId}-stakeholder-notes-1`,
              timestamp: new Date().toISOString(),
              indexedAt: new Date().toISOString(),
              type: 'stakeholder_interaction',
              tags: ['opportunity', 'stakeholder', 'johnDoe'],
              title: 'John Doe Conversation Summary',
            },
          },
        ];
        setOpportunityMemories(simulatedMemories);
        logger.success('Opportunity memories fetched successfully.', {
          opportunityId,
          count: simulatedMemories.length,
        });
      } catch (err) {
        logger.error('Failed to fetch opportunity memories.', { error: err, opportunityId });
        setError('Failed to load opportunity memories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunityMemories();
  }, [opportunityId]);

  return { opportunityMemories, isLoading, error };
};
