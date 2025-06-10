"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { EmotionalLogForm } from './EmotionalLogForm';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface JournalEmotionIntegrationProps {
  journalText: string;
  journalId?: string;
  className?: string;
}

export const JournalEmotionIntegration: React.FC<JournalEmotionIntegrationProps> = ({
  journalText,
  journalId,
  className
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  // Extract potential emotion from journal text
  const extractEmotion = (): string => {
    // Simple extraction - in a real implementation, this could use NLP or the LLM
    const emotionKeywords = [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'frustrated',
      'grateful', 'content', 'overwhelmed', 'hopeful', 'worried'
    ];

    const lowerText = journalText.toLowerCase();

    // Look for phrases like "I feel [emotion]" or "I am [emotion]"
    const feelingMatch = lowerText.match(/i (?:feel|am|was) (\w+)/);
    if (feelingMatch && feelingMatch[1]) {
      const potentialEmotion = feelingMatch[1];
      if (emotionKeywords.includes(potentialEmotion)) {
        return potentialEmotion.charAt(0).toUpperCase() + potentialEmotion.slice(1);
      }
    }

    // Look for any emotion keyword in the text
    for (const emotion of emotionKeywords) {
      if (lowerText.includes(emotion)) {
        return emotion.charAt(0).toUpperCase() + emotion.slice(1);
      }
    }

    return '';
  };

  const suggestedEmotion = extractEmotion();

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-emerald-400" />
            Log Emotion from Journal
          </div>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">
            Log how you were feeling when writing this journal entry to track emotional patterns over time.
          </p>

          <EmotionalLogForm
            initialPrimaryEmotion={suggestedEmotion}
            initialContextualNote={journalText.length > 100 ? journalText.substring(0, 100) + '...' : journalText}
            relatedJournalSourceId={journalId}
          />
        </CardContent>
      )}
    </Card>
  );
};
