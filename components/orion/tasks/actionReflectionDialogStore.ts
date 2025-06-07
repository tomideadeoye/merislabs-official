import { create } from "zustand";

interface ActionReflectionDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  completedTaskText: string;
  habiticaTaskId: string;
  orionSourceModule?: string;
  orionSourceReferenceId?: string;
  onReflectionSaved?: () => void;
  setDialogData: (data: {
    completedTaskText: string;
    habiticaTaskId: string;
    orionSourceModule?: string;
    orionSourceReferenceId?: string;
    onReflectionSaved?: () => void;
  }) => void;
}

export const useActionReflectionDialogStore = create<ActionReflectionDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  completedTaskText: "",
  habiticaTaskId: "",
  orionSourceModule: undefined,
  orionSourceReferenceId: undefined,
  onReflectionSaved: undefined,
  setDialogData: (data) => set({ ...data }),
}));
