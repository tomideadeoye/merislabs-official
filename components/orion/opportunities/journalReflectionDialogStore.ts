import { create } from "zustand";
import { Opportunity } from "@/types/opportunity";

interface JournalReflectionDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  opportunity?: Opportunity;
  actionType?: 'application_sent' | 'interview_completed' | 'outreach_sent' | 'general';
  setDialogData: (data: { opportunity: Opportunity; actionType?: 'application_sent' | 'interview_completed' | 'outreach_sent' | 'general' }) => void;
}

export const useJournalReflectionDialogStore = create<JournalReflectionDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  opportunity: undefined,
  actionType: 'general',
  setDialogData: (data) => set({ ...data }),
}));
