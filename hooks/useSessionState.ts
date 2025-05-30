"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionStateKeys, initializeClientSession, OrionSessionState, sessionStore } from "@/app_state";

if (typeof window !== "undefined") {
  initializeClientSession();
}

export const useSessionState = <K extends SessionStateKeys>(
  key: K,
  explicitDefaultValue?: OrionSessionState[K]
): [OrionSessionState[K], (newValue: OrionSessionState[K]) => void] => {

  const [value, setValue] = useState<OrionSessionState[K]>(() => {
    return sessionStore.getState(key, explicitDefaultValue);
  });

  useEffect(() => {
    const currentStoredValue = sessionStore.getState(key, explicitDefaultValue);
    if (currentStoredValue !== value) {
      setValue(currentStoredValue);
    }
  }, [key, explicitDefaultValue, value]);

  const updateValue = useCallback(
    (newValue: OrionSessionState[K]) => {
      sessionStore.setState(key, newValue);
      setValue(newValue);
    },
    [key]
  );

  return [value, updateValue];
};
