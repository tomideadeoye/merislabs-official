import { create } from 'zustand';
import { SessionStateKeys } from '../lib/app_constants';

interface SessionState {
  [key: string]: any; // Allows for dynamic properties
  setSessionValue: (key: SessionStateKeys, value: any) => void;
  getSessionValue: (key: SessionStateKeys) => any;
  clearSession: () => void;
}

export const useSessionStateStore = create<SessionState>((set, get) => ({
  // Initial state can be empty or loaded from localStorage if needed
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
    return get()[key];
  },
  clearSession: () => {
    set({}); // Clear all state
    if (typeof window !== 'undefined') {
      localStorage.clear(); // Clear localStorage
    }
  },
}));
