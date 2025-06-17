import { create } from 'zustand';
import { SessionStateKeys } from '@/lib/constants';
import { OrionSessionState } from '../lib/types';

interface SessionState extends OrionSessionState {
  [key: string]: unknown; // Explicitly add string index signature
  setSessionValue: (key: SessionStateKeys, value: unknown) => void;
  getSessionValue: (key: SessionStateKeys) => unknown;
  clearSession: () => void;
}

export const useSessionStateStore = create<SessionState>((set, get) => ({
  // Initial state can be empty or loaded from localStorage if needed
  lastActivityTimestamp: '',
  currentActiveFeature: '',
  userPreferences: {},
  sessionStateInitialized: false,

  setSessionValue: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
    // Optional: Persist to localStorage here if desired
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  getSessionValue: (key) => {
    // Optional: Load from localStorage first if not in state
    if (typeof window !== 'undefined' && !(key in get())) {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        try {
          const parsedValue = JSON.parse(storedValue);
          set((state) => ({ ...state, [key]: parsedValue }));
          return parsedValue;
        } catch (e) {
          console.error(`Error parsing localStorage item for ${key}:`, e);
        }
      }
    }
    return get()[key as string];
  },
  clearSession: () => {
    set({
      lastActivityTimestamp: '',
      currentActiveFeature: '',
      userPreferences: {},
      sessionStateInitialized: false,
    }); // Clear all state
    if (typeof window !== 'undefined') {
      localStorage.clear(); // Clear localStorage
    }
  },
}));
