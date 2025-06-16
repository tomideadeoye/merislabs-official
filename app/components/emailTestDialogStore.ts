import { create } from 'zustand';

interface EmailTestDialogStore {
  isOpen: boolean;
  initialTo: string;
  initialSubject: string;
  initialHtmlBody: string;
  onEmailSent?: (id: string) => void;
  open: (params: {
    initialTo: string;
    initialSubject: string;
    initialHtmlBody: string;
    onEmailSent?: (id: string) => void;
  }) => void;
  close: () => void;
}

export const useEmailTestDialogStore = create<EmailTestDialogStore>((set) => ({
  isOpen: false,
  initialTo: '',
  initialSubject: '',
  initialHtmlBody: '',
  onEmailSent: undefined,
  open: ({ initialTo, initialSubject, initialHtmlBody, onEmailSent }) =>
    set({
      isOpen: true,
      initialTo,
      initialSubject,
      initialHtmlBody,
      onEmailSent,
    }),
  close: () =>
    set({
      isOpen: false,
      initialTo: '',
      initialSubject: '',
      initialHtmlBody: '',
      onEmailSent: undefined,
    }),
}));
