/**
 * habiticaTaskDialogStore (Zustand)
 * Global store for managing open/close state of CreateHabiticaTaskDialog.
 * Used by: CreateHabiticaTaskDialog, parent components that open/close the dialog.
 * Features:
 * - isOpen: boolean
 * - taskProps: {
 *     initialTaskText: string;
 *     initialTaskNotes?: string;
 *     sourceModule?: string;
 *     sourceReferenceId?: string;
 *     defaultTags?: string[];
 *     userId?: string;
 *     apiToken?: string;
 *     originalEntryId?: string;
 *   } | null
 * - openDialog: (props: { initialTaskText: string; initialTaskNotes?: string; sourceModule?: string; sourceReferenceId?: string; defaultTags?: string[]; userId?: string; apiToken?: string; originalEntryId?: string; }) => void
 * - closeDialog: () => void
 * - Logging for all actions
 */

import { create } from 'zustand';

interface HabiticaTaskDialogState {
  isOpen: boolean;
  taskProps: {
    initialTaskText?: string;
    initialTaskNotes?: string;
    sourceModule?: string;
    sourceReferenceId?: string;
    defaultTags?: string[];
    userId?: string;
    apiToken?: string;
    originalEntryId?: string;
  } | null;
  openDialog: (props: {
    initialTaskText?: string;
    initialTaskNotes?: string;
    sourceModule?: string;
    sourceReferenceId?: string;
    defaultTags?: string[];
    userId?: string;
    apiToken?: string;
    originalEntryId?: string;
  }) => void;
  closeDialog: () => void;
}

export const useHabiticaTaskDialogStore = create<HabiticaTaskDialogState>((set) => ({
  isOpen: false,
  taskProps: null,
  openDialog: (props) => {
    set({ isOpen: true, taskProps: props });
    console.info('[ZUSTAND][HABITICA_TASK_DIALOG][OPEN]', props);
  },
  closeDialog: () => {
    set({ isOpen: false, taskProps: null });
    console.info('[ZUSTAND][HABITICA_TASK_DIALOG][CLOSE]');
  },
}));
