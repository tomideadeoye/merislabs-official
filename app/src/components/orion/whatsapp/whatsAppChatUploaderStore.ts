// GOAL: Create a Zustand store for managing the state of the WhatsApp chat uploader and analysis.

import { create } from 'zustand';

interface WhatsAppChatUploaderState {
  analysisData: any | null;
  success: boolean;
  setAnalysisData: (data: any, success: boolean) => void;
  clearAnalysisData: () => void;
}

export const useWhatsAppChatUploaderStore = create<WhatsAppChatUploaderState>((set) => ({
  analysisData: null,
  success: false,
  setAnalysisData: (data, success) => set({ analysisData: data, success: success }),
  clearAnalysisData: () => set({ analysisData: null, success: false }),
}));
