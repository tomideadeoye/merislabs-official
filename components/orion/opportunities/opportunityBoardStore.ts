import { create } from 'zustand';

interface OpportunityBoardStore {
  needsRefetch: boolean;
  setNeedsRefetch: (value: boolean) => void;
}

export const useOpportunityBoardStore = create<OpportunityBoardStore>((set) => ({
  needsRefetch: false,
  setNeedsRefetch: (value) => set({ needsRefetch: value }),
}));
