import { create } from 'zustand';
import { OrionOpportunity, OpportunityStatus } from '@/lib/types';
import logger from '@/lib/logger';

interface OpportunityPipelineState {
  opportunities: OrionOpportunity[];
  isLoading: boolean;
  error: string | null;
  fetchOpportunities: () => Promise<void>;
  updateOpportunityStatus: (opportunityId: string, newStatus: OpportunityStatus) => Promise<void>;
  addOpportunityOptimistic: (opportunity: OrionOpportunity) => void; // For optimistic updates
}

export const useOpportunityPipelineStore = create<OpportunityPipelineState>((set, get) => ({
  opportunities: [],
  isLoading: false,
  error: null,

  fetchOpportunities: async () => {
    logger.info('[OpportunityPipelineStore] Fetching opportunities...');
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/orion/opportunity/list'); // Ensure this matches your GET all endpoint
      const data = await response.json();
      if (data.success) {
        set({ opportunities: data.opportunities, isLoading: false });
        logger.info(`[OpportunityPipelineStore] Fetched ${data.opportunities.length} opportunities successfully.`);
      } else {
        throw new Error(data.error || 'Failed to fetch opportunities from store action');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('[OpportunityPipelineStore] Error fetching opportunities:', { error: errorMessage });
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateOpportunityStatus: async (opportunityId: string, newStatus: OpportunityStatus) => {
    logger.info(`[OpportunityPipelineStore] Updating status for opportunity ${opportunityId} to ${newStatus}`);
    // Optimistic update
    const originalOpportunities = get().opportunities;
    set((state) => ({
      opportunities: state.opportunities.map((op) =>
        op.id === opportunityId ? { ...op, status: newStatus, updatedAt: new Date().toISOString() } : op
      ),
    }));

    try {
      const response = await fetch(`/api/orion/opportunities/${opportunityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || `Failed to update status for opportunity ${opportunityId}`);
      }
      // Confirm update (or refetch if PUT doesn't return the full updated object)
      // For now, optimistic update is kept. If API returns updated object, use it:
      // set({ opportunities: originalOpportunities.map(op => op.id === opportunityId ? data.opportunity : op) });
      logger.info(`[OpportunityPipelineStore] Status updated successfully for ${opportunityId}.`);
      // Optionally refetch all to ensure consistency if PUT is complex
      // get().fetchOpportunities();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[OpportunityPipelineStore] Error updating status for ${opportunityId}:`, { error: errorMessage });
      set({ opportunities: originalOpportunities, error: `Failed to update status: ${errorMessage}` }); // Revert on error
    }
  },

  addOpportunityOptimistic: (opportunity: OrionOpportunity) => {
    logger.info('[OpportunityPipelineStore] Optimistically adding opportunity:', { id: opportunity.id });
    set((state) => ({
      opportunities: [opportunity, ...state.opportunities],
    }));
  },
}));
