import { create } from 'zustand';

interface FileSelectionState {
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  clearSelectedFile: () => void;
}

export const useFileSelectionStore = create<FileSelectionState>((set) => ({
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),
}));
