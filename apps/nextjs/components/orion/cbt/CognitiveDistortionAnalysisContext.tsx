/**
 * CognitiveDistortionAnalysisContext
 * GOAL: Provide context-based handler for cognitive distortion analysis changes.
 * Enables robust, serializable state management and event handling for all CBT analysis UI flows.
 * Connects to: CognitiveDistortionAnalysisForm, CBT dashboards, engagement features.
 * All actions are logged with full context for traceability, debugging, and future gamification.
 */

import React, { createContext, useContext, useCallback, useState } from "react";
import type { CognitiveDistortionAnalysisData } from "@shared/types/orion";

interface CognitiveDistortionAnalysisContextType {
  analysisData: CognitiveDistortionAnalysisData | null;
  setAnalysisData: (data: CognitiveDistortionAnalysisData) => void;
}

const CognitiveDistortionAnalysisContext = createContext<CognitiveDistortionAnalysisContextType | undefined>(undefined);

export const useCognitiveDistortionAnalysis = () => {
  const ctx = useContext(CognitiveDistortionAnalysisContext);
  if (!ctx) throw new Error("useCognitiveDistortionAnalysis must be used within CognitiveDistortionAnalysisProvider");
  return ctx;
};

export const CognitiveDistortionAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisData, setAnalysisDataState] = useState<CognitiveDistortionAnalysisData | null>(null);

  const setAnalysisData = useCallback((data: CognitiveDistortionAnalysisData) => {
    setAnalysisDataState(data);
    console.info("[CBT_ANALYSIS][CHANGE][CONTEXT]", { data, user: "Tomide" });
  }, []);

  return (
    <CognitiveDistortionAnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
      }}
    >
      {children}
    </CognitiveDistortionAnalysisContext.Provider>
  );
};
