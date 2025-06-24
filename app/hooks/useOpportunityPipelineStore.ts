import { create } from 'zustand';
import { OrionOpportunity, OpportunityStatus } from '@/lib/types';
import logger from '@/lib/logger';

interface OpportunityPipelineState {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
  error: string | null;
  addOpportunityOptimistic: (opportunity: OrionOpportunity) => void; // For optimistic updates
}

export const useOpportunityPipelineStore = create<OpportunityPipelineState>((set, get) => ({
  opportunities: [],
  isLoading: false,
  error: null,

  // Only keep optimistic add for UI responsiveness
  addOpportunityOptimistic: (opportunity: OrionOpportunity) => {
    logger.info('[OpportunityPipelineStore] Optimistically adding opportunity:', { id: opportunity.id });
    set((state) => ({
      opportunities: [opportunity, ...state.opportunities],
    }));
  },
}));
