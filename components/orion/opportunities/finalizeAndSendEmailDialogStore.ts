import { create } from "zustand";

interface FinalizeAndSendEmailDialogState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  initialTo?: string;
  initialSubject?: string;
  initialHtmlBody?: string;
  attachmentsToSend?: any[];
  setDialogData: (data: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    attachmentsToSend?: any[];
  }) => void;
}

export const useFinalizeAndSendEmailDialogStore = create<FinalizeAndSendEmailDialogState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  initialTo: "",
  initialSubject: "",
  initialHtmlBody: "",
  attachmentsToSend: [],
  setDialogData: (data) => set({ ...data }),
}));
