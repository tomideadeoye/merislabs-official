/**
 * habiticaTaskDialogStore (Zustand)
 * Global store for managing open/close state of CreateHabiticaTaskDialog.
 * Used by: CreateHabiticaTaskDialog, parent components that open/close the dialog.
 * Features:
 * - isOpen: boolean
 * - openDialog: () => void
 * - closeDialog: () => void
 * - Logging for all actions
 */

import { create } from "zustand";

interface HabiticaTaskDialogState {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useHabiticaTaskDialogStore = create<HabiticaTaskDialogState>((set) => ({
  isOpen: false,
  openDialog: () => {
    set({ isOpen: true });
    console.info("[ZUSTAND][HABITICA_TASK_DIALOG][OPEN]");
  },
  closeDialog: () => {
    set({ isOpen: false });
    console.info("[ZUSTAND][HABITICA_TASK_DIALOG][CLOSE]");
  },
}));
