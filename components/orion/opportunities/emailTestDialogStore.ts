import { create } from "zustand";

interface EmailTestDialogState {
  isOpen: boolean;
  open: (data?: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    onEmailSent?: (messageId: string) => void;
  }) => void;
  close: () => void;
  initialTo: string;
  initialSubject: string;
  initialHtmlBody: string;
  onEmailSent?: (messageId: string) => void;
}

export const useEmailTestDialogStore = create<EmailTestDialogState>((set) => ({
  isOpen: false,
  initialTo: "",
  initialSubject: "Test Email from Orion",
  initialHtmlBody: "",
  onEmailSent: undefined,
  open: (data) =>
    set({
      isOpen: true,
      initialTo: data?.initialTo ?? "",
      initialSubject: data?.initialSubject ?? "Test Email from Orion",
      initialHtmlBody: data?.initialHtmlBody ?? "",
      onEmailSent: data?.onEmailSent,
    }),
  close: () => set({ isOpen: false }),
}));
