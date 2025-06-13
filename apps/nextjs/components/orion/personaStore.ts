/**
 * personaStore (Zustand)
 * Global store for persona actions and selection in Orion admin UI.
 * Used by: PersonaList, PersonaEditor, PersonaDeleteDialog, and any component needing persona actions.
 * Features:
 * - selectedPersona: Persona | null
 * - selectPersona: (persona: Persona) => void
 * - editPersona: (persona: Persona) => void
 * - deletePersona: (id: string) => void
 * - Logging for all actions
 */

import { create } from "zustand";
import type { Persona } from '@repo/shared';

interface PersonaState {
  selectedPersona: Persona | null;
  selectPersona: (persona: Persona) => void;
  editPersona: (persona: Persona) => void;
  deletePersona: (id: string) => void;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  selectedPersona: null,
  selectPersona: (persona) => {
    set({ selectedPersona: persona });
    console.info("[ZUSTAND][PERSONA][SELECT]", { persona });
  },
  editPersona: (persona) => {
    // This should trigger a modal/dialog in the UI, or set a state for editing
    set({ selectedPersona: persona });
    console.info("[ZUSTAND][PERSONA][EDIT]", { persona });
    // Implement further edit logic in the consuming component
  },
  deletePersona: (id) => {
    // This should trigger a confirmation dialog or delete action in the UI
    console.info("[ZUSTAND][PERSONA][DELETE]", { id });
    // Implement further delete logic in the consuming component
  },
}));
