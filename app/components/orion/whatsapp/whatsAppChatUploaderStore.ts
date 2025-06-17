/*
 * @/components/orion/whatsapp/whatsAppChatUploaderStore.ts
 * GOAL: Placeholder Zustand store for managing WhatsApp chat uploader state.
 * This store will handle the state of file uploads, progress, and parsed data.
 */

import { create } from 'zustand';

/**
 * GOAL: Define the structure for parsed WhatsApp chat data.
 * This interface provides a basic structure for chat messages. You can expand it
 * based on the actual parsing output (e.g., message type, attachments, etc.).
 */
export interface WhatsAppParsedChatData {
  messages: {
    id: string;
    sender: string;
    timestamp: string; // ISO 8601 string
    content: string;
  }[];
  chatName?: string;
  participants?: string[];
  // Add other properties as needed, e.g., metadata, chat type
}

/**
 * GOAL: Define the structure for WhatsApp chat analysis data.
 * This interface provides a basic structure for the output of chat analysis.
 * You can expand it based on the actual analysis results (e.g., sentiment, topics, action items).
 */
export interface WhatsAppAnalysisData {
  summary: string;
  keyThemes: string[];
  sentimentAnalysis?: {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
  };
  identifiedPatterns?: {
    pattern: string;
    messages: string[];
  }[];
  // Add other properties as needed, e.g., suggested replies, action items
}

interface WhatsAppChatUploaderStore {
  uploadedFile: File | null;
  uploadProgress: number;
  parsedChatData: WhatsAppParsedChatData | null;
  analysisData: WhatsAppAnalysisData | null;
  success: boolean;
  setUploadedFile: (file: File | null) => void;
  setUploadProgress: (progress: number) => void;
  setParsedChatData: (data: WhatsAppParsedChatData | null) => void;
  setAnalysisData: (data: WhatsAppAnalysisData | null) => void;
  setSuccess: (success: boolean) => void;
  reset: () => void;
}

const useWhatsAppChatUploaderStore = create<WhatsAppChatUploaderStore>((set) => ({
  uploadedFile: null,
  uploadProgress: 0,
  parsedChatData: null,
  analysisData: null,
  success: false,
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setParsedChatData: (data) => set({ parsedChatData: data }),
  setAnalysisData: (data) => set({ analysisData: data }),
  setSuccess: (success) => set({ success: success }),
  reset: () => set({ uploadedFile: null, uploadProgress: 0, parsedChatData: null, analysisData: null, success: false }),
}));

export default useWhatsAppChatUploaderStore;
