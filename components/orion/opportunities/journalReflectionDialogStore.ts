import { create } from "zustand";
import { OrionOpportunity } from '@repo/shared';

interface JournalReflectionDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  OrionOpportunity?: OrionOpportunity;
  actionType?:
    | "application_sent"
    | "interview_completed"
    | "outreach_sent"
    | "general";
  setDialogData: (data: {
    OrionOpportunity: OrionOpportunity;
    actionType?:
      | "application_sent"
      | "interview_completed"
      | "outreach_sent"
      | "general";
  }) => void;
}

export const useJournalReflectionDialogStore =
  create<JournalReflectionDialogState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    OrionOpportunity: undefined,
    actionType: "general",
    setDialogData: (data) => set({ ...data }),
  }));
