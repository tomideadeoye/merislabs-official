/**
 * CareerMilestoneContext
 * GOAL: Provide context-based handlers for career milestone actions (submit, cancel) to all child components.
 * Enables robust, serializable state management and event handling for all career milestone UI flows.
 * Connects to: CareerMilestoneForm, CareerMilestoneList, admin dashboard, gamification/engagement features.
 * All actions are logged with full context for traceability, debugging, and future gamification.
 */

import React, { createContext, useContext, useCallback, useState } from "react";
import type { CareerMilestone } from "@/types/narrative-clarity";

interface CareerMilestoneContextType {
  submitMilestone: (data: Partial<CareerMilestone>) => Promise<void>;
  cancelMilestone: () => void;
  isSubmitting: boolean;
  feedback: { type: "success" | "error"; message: string } | null;
  setFeedback: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; message: string } | null>>;
}

const CareerMilestoneContext = createContext<CareerMilestoneContextType | undefined>(undefined);

export const useCareerMilestone = () => {
  const ctx = useContext(CareerMilestoneContext);
  if (!ctx) throw new Error("useCareerMilestone must be used within CareerMilestoneProvider");
  return ctx;
};

export const CareerMilestoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Replace with actual implementation (API, DB, etc.)
  const submitMilestone = useCallback(async (data: Partial<CareerMilestone>) => {
    setIsSubmitting(true);
    setFeedback(null);
    console.info("[CAREER_MILESTONE][SUBMIT][START]", { data, user: "Tomide" });
    try {
      // Simulate async save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFeedback({ type: "success", message: "Career milestone saved successfully!" });
      console.info("[CAREER_MILESTONE][SUBMIT][SUCCESS]", { data, user: "Tomide" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Failed to save career milestone." });
      console.error("[CAREER_MILESTONE][SUBMIT][ERROR]", { error: err, data, user: "Tomide" });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const cancelMilestone = useCallback(() => {
    setFeedback(null);
    console.info("[CAREER_MILESTONE][CANCEL][USER]", { user: "Tomide" });
  }, []);

  return (
    <CareerMilestoneContext.Provider
      value={{
        submitMilestone,
        cancelMilestone,
        isSubmitting,
        feedback,
        setFeedback,
      }}
    >
      {children}
    </CareerMilestoneContext.Provider>
  );
};
