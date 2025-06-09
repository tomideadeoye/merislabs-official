import { create } from "zustand";

interface OutreachGenerationState {
  latestOutreach: string | null;
  setLatestOutreach: (draft: string) => void;
  clearLatestOutreach: () => void;
}

const OUTREACH_DRAFT_KEY = "orion_latestOutreach";

function getInitialOutreach(): string | null {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(OUTREACH_DRAFT_KEY);
      return stored !== null ? stored : null;
    } catch {
      return null;
    }
  }
  return null;
}

export const useOutreachGenerationStore = create<OutreachGenerationState>((set) => ({
  latestOutreach: getInitialOutreach(),
  setLatestOutreach: (draft) => {
    set({ latestOutreach: draft });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(OUTREACH_DRAFT_KEY, draft);
      } catch {}
    }
  },
  clearLatestOutreach: () => {
    set({ latestOutreach: null });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(OUTREACH_DRAFT_KEY);
      } catch {}
    }
  },
}));
