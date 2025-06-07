import { create } from "zustand";

interface OpportunityDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useOpportunityDialogStore = create<OpportunityDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
