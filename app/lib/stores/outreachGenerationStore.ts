// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - Zustand store to manage the state related to outreach message generation.
//   - Handles loading states, errors, and stores the latest generated outreach draft.
// FILEPATH:
//   app/lib/stores/outreachGenerationStore.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Used by: app/components/orion/networking-hub/OutreachForm.tsx (to set and display drafts)
//              app/(orion_admin)/admin/networking-hub/page.tsx (to display the latest draft)
//   - Connects to: app/api/orion/outreach/generate/route.ts (via fetch calls in OutreachForm)
//                   app/lib/types (for OutreachResponse type definition)
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
//   - Assumes 'OutreachResponse' type is correctly defined and imported.
//   - Assumes '/api/orion/outreach/generate' endpoint exists and returns expected data.
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunities to consolidate
//   - This store is distinct from personaStore as it focuses purely on the LLM generation process and its output.
// TODOS:
//   - Potentially store a history of generated drafts, not just the latest.
// SUGGESTIONS:
//   - Consider adding a mechanism to store/retrieve generated drafts from a backend if persistence is required.
import { create } from 'zustand';
import type { OutreachResponse } from '@/lib/types';
import logger from '@/lib/logger';

interface OutreachGenerationState {
  latestOutreach: string | null;
  isLoading: boolean;
  error: string | null;
  setLatestOutreach: (outreach: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearLatestOutreach: () => void;
  clearState: () => void;
}

export const useOutreachGenerationStore = create<OutreachGenerationState>((set) => ({
  latestOutreach: null,
  isLoading: false,
  error: null,

  setLatestOutreach: (outreach) => {
    logger.info('[OutreachGenerationStore] Setting latest outreach draft.');
    set({ latestOutreach: outreach });
  },
  setIsLoading: (loading) => {
    logger.debug('[OutreachGenerationStore] Setting loading state', { loading });
    set({ isLoading: loading });
  },
  setError: (error) => {
    logger.error('[OutreachGenerationStore] Setting error', { error });
    set({ error });
  },
  clearLatestOutreach: () => {
    logger.info('[OutreachGenerationStore] Clearing latest outreach draft.');
    set({ latestOutreach: null, error: null });
  },
  clearState: () => {
    logger.info('[OutreachGenerationStore] Clearing all state.');
    set({
      latestOutreach: null,
      isLoading: false,
      error: null,
    });
  },
}));
