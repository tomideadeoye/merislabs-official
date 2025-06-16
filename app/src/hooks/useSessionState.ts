'use client';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any
import { useCallback } from 'react';
import { SessionStateKeys } from '../lib/app_constants';
import { useSessionStateStore } from '@/state/sessionState';

interface UseSessionState {
  setSessionValue: (key: SessionStateKeys, value: any) => void;
  getSessionValue: (key: SessionStateKeys) => any;
  clearSession: () => void;
  selectSessionValue: <T>(key: SessionStateKeys) => T | undefined;
}

export const useSessionState = (): UseSessionState => {
  const store = useSessionStateStore();

  const selectSessionValue = <T>(key: SessionStateKeys): T | undefined => {
    // Use the getSessionValue from the store to ensure persistence logic is applied
    return store.getSessionValue(key) as T | undefined;
  };

  return {
    setSessionValue: store.setSessionValue,
    getSessionValue: store.getSessionValue,
    clearSession: store.clearSession,
    selectSessionValue,
  };
};
