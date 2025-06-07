import { create } from "zustand";
import type { Opportunity } from "@/types/opportunity";

interface DraftApplicationDialogState {
  isOpen: boolean;
  open: (opportunity: Opportunity) => void;
  close: () => void;
  opportunity?: Opportunity;
}

export const useDraftApplicationDialogStore = create<DraftApplicationDialogState>((set) => ({
  isOpen: false,
  opportunity: undefined,
  open: (opportunity) => set({ isOpen: true, opportunity }),
  close: () => set({ isOpen: false, opportunity: undefined }),
}));
