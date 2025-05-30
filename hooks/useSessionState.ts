"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionStateKeys, getSessionState, initializeSession, OrionSessionState } from "@/app_state";

if (typeof window !== "undefined") {
  initializeSession();
}

export const useSessionState = <K extends SessionStateKeys>(
  key: K,
  defaultValue?: OrionSessionState[K]
): [OrionSessionState[K], (newValue: OrionSessionState[K]) => void] => {
  const sessionManager = getSessionState();

  const [value, setValue] = useState<OrionSessionState[K]>(() => {
    const existingValue = sessionManager.getState(key);
    return existingValue !== undefined ? existingValue : defaultValue;
  });

  useEffect(() => {
    const currentValue = sessionManager.getState(key);
    if (currentValue !== undefined && currentValue !== value) {
      setValue(currentValue);
    }
  }, [key, sessionManager, value]);

  const updateValue = useCallback(
    (newValue: OrionSessionState[K]) => {
      sessionManager.setState(key, newValue);
      setValue(newValue);
    },
    [key, sessionManager]
  );

  return [value, updateValue];
};
