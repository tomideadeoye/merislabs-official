/**
 * ValuePropositionContext
 * GOAL: Provide context-based handler for value proposition submission and state.
 * Enables robust, serializable state management and event handling for all value proposition UI flows.
 * Connects to: ValuePropositionForm, admin dashboards, engagement features.
 * All actions are logged with full context for traceability, debugging, and future gamification.
 */

import React, { createContext, useContext, useCallback, useState } from "react";
import type { ValueProposition } from "@/types/narrative-clarity";

interface ValuePropositionContextType {
  valueProposition: Partial<ValueProposition> | null;
  submitValueProposition: (data: Partial<ValueProposition>) => Promise<void>;
}

const ValuePropositionContext = createContext<ValuePropositionContextType | undefined>(undefined);

export const useValueProposition = () => {
  const ctx = useContext(ValuePropositionContext);
  if (!ctx) throw new Error("useValueProposition must be used within ValuePropositionProvider");
  return ctx;
};

export const ValuePropositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [valueProposition, setValueProposition] = useState<Partial<ValueProposition> | null>(null);

  const submitValueProposition = useCallback(async (data: Partial<ValueProposition>) => {
    setValueProposition(data);
    console.info("[VALUE_PROPOSITION][SUBMIT][CONTEXT]", { data, user: "Tomide" });
    // Optionally, you can add API submission logic here if needed
  }, []);

  return (
    <ValuePropositionContext.Provider
      value={{
        valueProposition,
        submitValueProposition,
      }}
    >
      {children}
    </ValuePropositionContext.Provider>
  );
};
