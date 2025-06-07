import { create } from 'zustand';

interface WhatsAppChatUploaderStore {
  isUploading: boolean;
  error: string | null;
  success: boolean;
  analysisData: any | null;
  file: File | null;
  contactName: string;
  setFile: (file: File | null) => void;
  setContactName: (name: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export const useWhatsAppChatUploaderStore = create<WhatsAppChatUploaderStore>((set, get) => ({
  isUploading: false,
  error: null,
  success: false,
  analysisData: null,
  file: null,
  contactName: '',
  setFile: (file) => set({ file, error: null }),
  setContactName: (name) => set({ contactName: name }),
  submit: async () => {
    const { file, contactName } = get();
    if (!file) {
      set({ error: 'Please select a chat export file' });
      return;
    }
    set({ isUploading: true, error: null, success: false });
    try {
      const formData = new FormData();
      formData.append('chatFile', file);
      if (contactName) {
        formData.append('contactName', contactName);
      }
      const response = await fetch('/api/orion/whatsapp/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        set({ success: true, analysisData: data, error: null });
      } else {
        throw new Error(data.error || 'Failed to analyze chat');
      }
    } catch (err: any) {
      set({ error: err.message || 'An unexpected error occurred', success: false });
    } finally {
      set({ isUploading: false });
    }
  },
  reset: () => set({
    file: null,
    contactName: '',
    error: null,
    success: false,
    analysisData: null
  }),
}));
