import { create } from 'zustand';
import { SessionStateKeys } from '@/lib/constants';
import { OrionSessionState } from '../lib/types';

interface SessionState extends OrionSessionState {
  [key: string]: unknown; // Explicitly add string index signature
  setSessionValue: (key: SessionStateKeys, value: unknown) => void;
  getSessionValue: (key: SessionStateKeys) => unknown;
  clearSession: () => void;
  hydrateFromLocalStorage: () => void; // New action for hydration
}

export const useSessionStateStore = create<SessionState>((set, get) => ({
  // Initial state can be empty or loaded from localStorage if needed
  lastActivityTimestamp: '',
  currentActiveFeature: '',
  userPreferences: {}, // Ensure all keys from SessionStateKeys have default values if appropriate
  sessionStateInitialized: false,

  setSessionValue: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
    // Optional: Persist to localStorage here if desired
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  getSessionValue: (key) => {
    // Pure read from the current state
    return get()[key as keyof OrionSessionState];
  },
  clearSession: () => {
    set({
      lastActivityTimestamp: '',
      currentActiveFeature: '',
      userPreferences: {},
      sessionStateInitialized: false,
      // Reset other session keys to their initial/default values
      [SessionStateKeys.MEMORY_INITIALIZED]: false, // Example
    }); // Clear all state
    if (typeof window !== 'undefined') {
      localStorage.clear(); // Clear localStorage
    }
  },
  hydrateFromLocalStorage: () => {
    if (typeof window !== 'undefined' && !get().sessionStateInitialized) {
      const updates: Partial<OrionSessionState> = {};
      // Iterate over known session keys to hydrate them
      Object.values(SessionStateKeys).forEach((key) => {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
          try {
            updates[key as keyof OrionSessionState] = JSON.parse(storedValue);
          } catch (e) {
            console.error(`Error parsing localStorage item for ${key}:`, e);
          }
        }
      });

      set((state) => ({ ...state, ...updates, sessionStateInitialized: true }));
      console.info('[SessionState] Hydrated from localStorage', updates);
    }
  },
}));
