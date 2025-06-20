import { create } from 'zustand';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// next steps if any:
// components to merge with if any:

export interface OpportunityDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useOpportunityDialogStore = create<OpportunityDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
