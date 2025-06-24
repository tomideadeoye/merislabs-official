import { create } from 'zustand';
import { ScoredMemoryPoint } from '@/lib/types';
import { CVComponent } from '@/lib/types/cv';

interface CVTailoringState {
  suggestedIds: string[];
  selectedIds: Set<string>;
  editedContents: Map<string, string>;
  isLoading: boolean;
  assembledCvMarkdown: string | null;
  isAssembling: boolean;
  isRephrasing: Set<string>;
  isDownloadingPdf: boolean;
  isAutoGeneratingCv: boolean;
  autoGenerateMemoryResults: ScoredMemoryPoint[];
  setSuggestedIds: (ids: string[]) => void;
  setSelectedIds: (ids: Set<string>) => void;
  setEditedContents: (contents: Map<string, string>) => void;
  setIsLoading: (loading: boolean) => void;
  setAssembledCvMarkdown: (markdown: string | null) => void;
  setIsAssembling: (assembling: boolean) => void;
  setIsRephrasing: (ids: Set<string>) => void;
  setIsDownloadingPdf: (downloading: boolean) => void;
  setIsAutoGeneratingCv: (auto: boolean) => void;
  setAutoGenerateMemoryResults: (results: ScoredMemoryPoint[]) => void;
  reset: () => void;
}

export const useCVTailoringStore = create<CVTailoringState>((set) => ({
  suggestedIds: [],
  selectedIds: new Set(),
  editedContents: new Map(),
  isLoading: true,
  assembledCvMarkdown: '',
  isAssembling: false,
  isRephrasing: new Set(),
  isDownloadingPdf: false,
  isAutoGeneratingCv: false,
  autoGenerateMemoryResults: [],
  setSuggestedIds: (ids) => set({ suggestedIds: ids }),
  setSelectedIds: (ids) => set({ selectedIds: new Set(ids) }),
  setEditedContents: (contents) => set({ editedContents: new Map(contents) }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setAssembledCvMarkdown: (markdown) => set({ assembledCvMarkdown: markdown }),
  setIsAssembling: (assembling) => set({ isAssembling: assembling }),
  setIsRephrasing: (ids) => set({ isRephrasing: new Set(ids) }),
  setIsDownloadingPdf: (downloading) => set({ isDownloadingPdf: downloading }),
  setIsAutoGeneratingCv: (auto) => set({ isAutoGeneratingCv: auto }),
  setAutoGenerateMemoryResults: (results) => set({ autoGenerateMemoryResults: results }),
  reset: () =>
    set({
      suggestedIds: [],
      selectedIds: new Set(),
      editedContents: new Map(),
      isLoading: true,
      assembledCvMarkdown: '',
      isAssembling: false,
      isRephrasing: new Set(),
      isDownloadingPdf: false,
      isAutoGeneratingCv: false,
      autoGenerateMemoryResults: [],
    }),
}));
