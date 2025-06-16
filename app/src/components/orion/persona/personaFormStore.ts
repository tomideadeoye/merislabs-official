import { Persona } from '@repo/shared';
import { create } from 'zustand';

interface PersonaFormStore {
  isSubmitting: boolean;
  feedback: { type: 'success' | 'error'; message: string } | null;
  lastSubmittedData: Partial<Persona> | null;
  error: string | null;
  submitPersona: (data: Partial<Persona>) => Promise<void>;
  clearFeedback: () => void;
}

export const usePersonaFormStore = create<PersonaFormStore>((set) => ({
  isSubmitting: false,
  feedback: null,
  lastSubmittedData: null,
  error: null,
  submitPersona: async (data) => {
    set({ isSubmitting: true, feedback: null, error: null });
    try {
      // TODO: Replace with actual API call or logic
      // Example: await fetch('/api/persona', { method: 'POST', body: JSON.stringify(data) });
      // Simulate async save
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        feedback: { type: 'success', message: 'Persona saved successfully!' },
        lastSubmittedData: data,
        isSubmitting: false,
        error: null,
      });
    } catch (err: unknown) {
      set({
        feedback: {
          type: 'error',
          message: err instanceof Error ? err.message : 'An unknown error occurred.',
        },
        error: err instanceof Error ? err.message : 'An unknown error occurred.',
        isSubmitting: false,
      });
    }
  },
  clearFeedback: () => set({ feedback: null, error: null }),
}));
