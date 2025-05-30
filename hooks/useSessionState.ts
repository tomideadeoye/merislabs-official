"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import {
  SessionStateKeys,
  initializeClientSession,
  sessionStore,
} from "@/app_state";
import type { OrionSessionState } from "@/types/orion";

const subscribeToLocalStorageKey = (key: SessionStateKeys, callback: () => void) => {
  const handleChange = (event: StorageEvent) => {
    if (event.key === key) {
      callback();
    }
  };
  window.addEventListener("storage", handleChange);
  return () => window.removeEventListener("storage", handleChange);
};

const getSnapshotForLocalStorageKey = <K extends SessionStateKeys>(
  key: K,
  explicitDefaultValue?: OrionSessionState[K]
): OrionSessionState[K] => {
  return sessionStore.getState(key, explicitDefaultValue);
};

export const useSessionState = <K extends SessionStateKeys>(
  key: K,
  explicitDefaultValue?: OrionSessionState[K]
): [OrionSessionState[K], (newValue: OrionSessionState[K]) => void] => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeClientSession();
    }
  }, []);

  const value = useSyncExternalStore(
    (callback) => subscribeToLocalStorageKey(key, callback),
    () => getSnapshotForLocalStorageKey(key, explicitDefaultValue),
    () => getSnapshotForLocalStorageKey(key, explicitDefaultValue)
  );

  const updateValue = useCallback(
    (newValue: OrionSessionState[K]) => {
      sessionStore.setState(key, newValue);
    },
    [key]
  );

  return [value, updateValue];
};
