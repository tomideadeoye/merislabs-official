import { create } from 'zustand';
import type { Persona } from '@/lib/types';
import logger from '@/lib/logger';

interface PersonaState {
  personas: Persona[];
  selectedPersona: Persona | null;
  isLoading: boolean;
  error: string | null;
  setPersonas: (personas: Persona[]) => void;
  addPersona: (persona: Persona) => void;
  updatePersonaInList: (updatedPersona: Persona) => void;
  deletePersonaFromList: (id: string) => void;
  setSelectedPersona: (persona: Persona | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearState: () => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personas: [],
  selectedPersona: null,
  isLoading: false,
  error: null,

  setPersonas: (personas) => {
    logger.debug('[PersonaStore] Setting personas', { count: personas.length });
    set({ personas });
  },
  addPersona: (persona) => {
    logger.info('[PersonaStore] Adding new persona', { personaName: persona.name });
    set((state) => ({ personas: [...state.personas, persona] }));
  },
  updatePersonaInList: (updatedPersona) => {
    logger.info('[PersonaStore] Updating persona in list', {
      personaId: updatedPersona.id,
      personaName: updatedPersona.name,
    });
    set((state) => ({
      personas: state.personas.map((p) => (p.id === updatedPersona.id ? updatedPersona : p)),
      selectedPersona: state.selectedPersona?.id === updatedPersona.id ? updatedPersona : state.selectedPersona,
    }));
  },
  deletePersonaFromList: (id) => {
    logger.warn('[PersonaStore] Deleting persona from list', { personaId: id });
    set((state) => ({
      personas: state.personas.filter((p) => p.id !== id),
      selectedPersona: state.selectedPersona?.id === id ? null : state.selectedPersona,
    }));
  },
  setSelectedPersona: (persona) => {
    logger.info('[PersonaStore] Setting selected persona', { personaName: persona?.name || 'None' });
    set({ selectedPersona: persona });
  },
  setIsLoading: (loading) => {
    logger.debug('[PersonaStore] Setting loading state', { loading });
    set({ isLoading: loading });
  },
  setError: (error) => {
    logger.error('[PersonaStore] Setting error', { error });
    set({ error });
  },
  clearState: () => {
    logger.info('[PersonaStore] Clearing all state');
    set({
      personas: [],
      selectedPersona: null,
      isLoading: false,
      error: null,
    });
  },
}));
