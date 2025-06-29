import { create } from 'zustand';
import { Opportunity, $Enums } from '@/lib/types';
import logger from '@/lib/logger';

interface OpportunityPipelineState {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  addOpportunityOptimistic: (opportunity: Opportunity) => void; // For optimistic updates
}

export const useOpportunityPipelineStore = create<OpportunityPipelineState>((set, get) => ({
  opportunities: [],
  isLoading: false,
  error: null,

  // Only keep optimistic add for UI responsiveness
  addOpportunityOptimistic: (opportunity: Opportunity) => {
    logger.info('[OpportunityPipelineStore] Optimistically adding opportunity:', { id: opportunity.id });
    set((state) => ({
      opportunities: [opportunity, ...state.opportunities],
    }));
  },
}));
