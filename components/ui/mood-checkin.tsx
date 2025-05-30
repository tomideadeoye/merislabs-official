"use client";

import React, { useState } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { SessionStateKeys } from "@/app_state";
import { Button } from "./button";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Neutral", emoji: "😐" },
  { label: "Excited", emoji: "🤩" },
  { label: "Tired", emoji: "😴" },
];

export function MoodCheckIn() {
  const [, setCurrentMood] = useSessionState(
    SessionStateKeys.CURRENT_MOOD,
    undefined
  );
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const submitMood = () => {
    if (selectedMood) {
      setCurrentMood(selectedMood);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white">How are you feeling today?</h2>
      <div className="flex space-x-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => setSelectedMood(mood.label)}
            className={`text-3xl p-2 rounded-full ${
              selectedMood === mood.label ? "bg-blue-600" : "bg-gray-700"
            }`}
            aria-label={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      <Button disabled={!selectedMood} onClick={submitMood}>
        Submit
      </Button>
    </div>
  );
}
