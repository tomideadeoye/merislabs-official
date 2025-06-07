import { create } from "zustand";

interface GenerateOutreachDialogState {
  isOpen: boolean;
  open: (data: {
    stakeholder: any;
    opportunityTitle: string;
    opportunityCompany: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => void;
  close: () => void;
  stakeholder?: any;
  opportunityTitle?: string;
  opportunityCompany?: string;
  onOutreachGenerated?: (outreach: string) => void;
  setDialogData: (data: {
    stakeholder?: any;
    opportunityTitle?: string;
    opportunityCompany?: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => void;
}

export const useGenerateOutreachDialogStore = create<GenerateOutreachDialogState>((set) => ({
  isOpen: false,
  open: (data) => set({ isOpen: true, ...data }),
  close: () => set({ isOpen: false }),
  stakeholder: undefined,
  opportunityTitle: undefined,
  opportunityCompany: undefined,
  onOutreachGenerated: undefined,
  setDialogData: (data) => set({ ...data }),
}));
