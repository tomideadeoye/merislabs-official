import { create } from 'zustand';

interface OpportunityDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useOpportunityDialogStore = create<OpportunityDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));