import { useState, useEffect } from 'react';
import type { OpportunityEvaluation, OpportunityDraft, StakeholderOutreach } from '@/types/opportunity';

interface UseOpportunityMemoryReturn {
  evaluations: OpportunityEvaluation[];
  drafts: OpportunityDraft[];
  outreach: StakeholderOutreach[];
  isLoading: boolean;
  error: string | null;
}

export function useOpportunityMemory(opportunityId: string): UseOpportunityMemoryReturn {
  const [data, setData] = useState<UseOpportunityMemoryReturn>({
    evaluations: [],
    drafts: [],
    outreach: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    async function fetchMemory() {
      try {
        const response = await fetch(`/api/orion/memory/${opportunityId}`);
        const result = await response.json();

        if (result.success) {
          setData({
            evaluations: result.evaluations || [],
            drafts: result.drafts || [],
            outreach: result.outreach || [],
            isLoading: false,
            error: null
          });
        } else {
          throw new Error(result.error || 'Failed to fetch memory data');
        }
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch memory data'
        }));
      }
    }

    if (opportunityId) {
      fetchMemory();
    }
  }, [opportunityId]);

  return data;
}
