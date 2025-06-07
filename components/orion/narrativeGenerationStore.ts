import { create } from 'zustand';

interface NarrativeGenerationState {
  latestNarrative: string | null;
  latestTitle: string | null;
  setNarrative: (narrative: string, title: string) => void;
  clearNarrative: () => void;
}

export const useNarrativeGenerationStore = create<NarrativeGenerationState>((set) => ({
  latestNarrative: null,
  latestTitle: null,
  setNarrative: (narrative, title) => set({ latestNarrative: narrative, latestTitle: title }),
  clearNarrative: () => set({ latestNarrative: null, latestTitle: null }),
}));
