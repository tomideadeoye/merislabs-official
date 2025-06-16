import { create } from 'zustand';
import type { Persona } from '@/lib/types';
import logger from '@/lib/logger';

interface PersonaFormData {
  name: string;
  description: string;
  traits: string[];
  goals: string[];
  company?: string;
  role?: string;
  tags?: string[];
}

interface PersonaFormFeedback {
  type: 'success' | 'error' | 'info' | null;
  message: string | null;
}

interface PersonaFormState {
  formData: Partial<PersonaFormData>;
  isLoading: boolean;
  feedback: PersonaFormFeedback;
  setFormData: (data: Partial<PersonaFormData>) => void;
  setIsLoading: (loading: boolean) => void;
  setFeedback: (feedback: PersonaFormFeedback) => void;
  clearFeedback: () => void;
  resetForm: (initialData?: Partial<Persona>) => void;
}

export const usePersonaFormStore = create<PersonaFormState>((set) => ({
  formData: {
    name: '',
    description: '',
    traits: [],
    goals: [],
    company: '',
    role: '',
    tags: [],
  },
  isLoading: false,
  feedback: { type: null, message: null },

  setFormData: (data) => {
    logger.debug('[PersonaFormStore] Setting form data', { data });
    set((state) => ({ formData: { ...state.formData, ...data } }));
  },
  setIsLoading: (loading) => {
    logger.debug('[PersonaFormStore] Setting loading state', { loading });
    set({ isLoading: loading });
  },
  setFeedback: (feedback) => {
    logger.info('[PersonaFormStore] Setting feedback', { feedbackType: feedback.type, message: feedback.message });
    set({ feedback });
  },
  clearFeedback: () => {
    logger.debug('[PersonaFormStore] Clearing feedback.');
    set({ feedback: { type: null, message: null } });
  },
  resetForm: (initialData = {}) => {
    logger.info('[PersonaFormStore] Resetting form', { initialData });
    set({
      formData: {
        name: initialData.name || '',
        description: initialData.description || '',
        traits: initialData.traits || [],
        goals: initialData.goals || [],
        company: initialData.company || '',
        role: initialData.role || '',
        tags: initialData.tags || [],
      },
      isLoading: false,
      feedback: { type: null, message: null },
    });
  },
}));
