// packages/ui/src/components/orion/opportunities/journalReflectionDialogStore.ts

import { OrionOpportunity } from '@/lib/types';
import { create } from 'zustand';

interface JournalReflectionDialogStore {
  isOpen: boolean;
  opportunity: OrionOpportunity | null;
  actionType: 'general' | 'application_sent' | 'interview_completed' | 'outreach_sent';
  initialReflection: string;
  onReflectionSaved?: ((reflection: string) => void) | undefined;
  open: (
    opportunity: OrionOpportunity,
    actionType: 'general' | 'application_sent' | 'interview_completed' | 'outreach_sent',
    initialReflection?: string,
    onReflectionSaved?: ((reflection: string) => void) | undefined
  ) => void;
  close: () => void;
}

export const useJournalReflectionDialogStore = create<JournalReflectionDialogStore>((set) => ({
  isOpen: false,
  opportunity: null,
  actionType: 'general',
  initialReflection: '',
  onReflectionSaved: undefined,
  open: (opportunity, actionType, initialReflection = '', onReflectionSaved) =>
    set({
      isOpen: true,
      opportunity,
      actionType,
      initialReflection,
      onReflectionSaved,
    }),
  close: () =>
    set({
      isOpen: false,
      opportunity: null,
      actionType: 'general',
      initialReflection: '',
      onReflectionSaved: undefined,
    }),
}));
