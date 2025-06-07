import { create } from "zustand";
import type { Opportunity } from "@/types/opportunity";
import type { Stakeholder } from "./FindStakeholdersButton";

interface FindStakeholdersDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  stakeholders: Stakeholder[];
  setStakeholders: (stakeholders: Stakeholder[]) => void;
  selectedStakeholder: Stakeholder | null;
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => void;
  opportunity?: Opportunity;
  setOpportunity: (opportunity: Opportunity) => void;
}

export const useFindStakeholdersDialogStore = create<FindStakeholdersDialogState>((set) => ({
  isOpen: false,
  stakeholders: [],
  selectedStakeholder: null,
  opportunity: undefined,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, selectedStakeholder: null }),
  setStakeholders: (stakeholders) => set({ stakeholders }),
  setSelectedStakeholder: (stakeholder) => set({ selectedStakeholder: stakeholder }),
  setOpportunity: (opportunity) => set({ opportunity }),
}));
