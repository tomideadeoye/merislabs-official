/**
 * fileSelectionStore (Zustand)
 * Global store for file selection state in Orion admin UI.
 * Used by: FileExplorer, FileViewer, local-files/page, and any component needing selected file info.
 * Features:
 * - selectedFile: string | null
 * - setSelectedFile: (file: string) => void
 * - clearSelectedFile: () => void
 * - Logging for all state changes
 */

import { create } from "zustand";

interface FileSelectionState {
  selectedFile: string | null;
  setSelectedFile: (file: string) => void;
  clearSelectedFile: () => void;
}

export const useFileSelectionStore = create<FileSelectionState>((set) => ({
  selectedFile: null,
  setSelectedFile: (file) => {
    set({ selectedFile: file });
    console.info("[ZUSTAND][FILE_SELECTION][SET]", { file });
  },
  clearSelectedFile: () => {
    set({ selectedFile: null });
    console.info("[ZUSTAND][FILE_SELECTION][CLEAR]");
  },
}));
