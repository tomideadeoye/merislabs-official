"use client";

import React from "react";
// TODO: Refactor to inject session state from app layer. Removed cross-package imports for monorepo build.
// import { useSessionState } from "@shared/hooks/useSessionState";
// import { SessionStateKeys } from "@shared/app_state";
import { Button } from "./button";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Neutral", emoji: "😐" },
  { label: "Excited", emoji: "🤩" },
  { label: "Tired", emoji: "😴" },
];

export function MoodCheckIn() {
  // Placeholder: UI only, no state logic
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white">How are you feeling today?</h2>
      <div className="flex space-x-4">
        {/* Example moods, replace with app logic */}
        <button className="text-3xl p-2 rounded-full bg-gray-700" aria-label="Happy">😊</button>
        <button className="text-3xl p-2 rounded-full bg-gray-700" aria-label="Sad">😢</button>
        <button className="text-3xl p-2 rounded-full bg-gray-700" aria-label="Angry">😡</button>
      </div>
      <Button disabled>Submit</Button>
    </div>
  );
}
