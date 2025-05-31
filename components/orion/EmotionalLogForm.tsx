"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, CheckCircle, Heart } from 'lucide-react';
import { LogEmotionRequest } from '@/types/emotions';

// Common emotions for autocomplete
const commonEmotions = [
  "Joy", "Sadness", "Anger", "Fear", "Surprise", "Disgust", 
  "Anxiety", "Frustration", "Calm", "Content", "Overwhelmed", 
  "Stressed", "Relief", "Excitement", "Gratitude", "Hope"
];

interface EmotionalLogFormProps {
  onLogSaved?: () => void;
  initialPrimaryEmotion?: string;
  initialContextualNote?: string;
  relatedJournalSourceId?: string;
  className?: string;
}

export const EmotionalLogForm: React.FC<EmotionalLogFormProps> = ({ 
  onLogSaved,
  initialPrimaryEmotion = '',
  initialContextualNote = '',
  relatedJournalSourceId,
  className
}) => {
  const [primaryEmotion, setPrimaryEmotion] = useState<string>(initialPrimaryEmotion);
  const [secondaryEmotions, setSecondaryEmotions] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [triggers, setTriggers] = useState<string>('');
  const [physicalSensations, setPhysicalSensations] = useState<string>('');
  const [accompanyingThoughts, setAccompanyingThoughts] = useState<string>('');
  const [copingMechanisms, setCopingMechanisms] = useState<string>('');
  const [contextualNote, setContextualNote] = useState<string>(initialContextualNote);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!primaryEmotion.trim()) {
      setFeedback({ type: 'error', message: "Primary emotion is required." });
      return;
    }
    
    setIsLoading(true);
    setFeedback(null);
    
    try {
      const payload: LogEmotionRequest = {
        primaryEmotion: primaryEmotion.trim(),
        secondaryEmotions: secondaryEmotions ? secondaryEmotions.split(',').map(e => e.trim()).filter(Boolean) : [],
        intensity,
        triggers: triggers ? triggers.split(',').map(t => t.trim()).filter(Boolean) : [],
        physicalSensations: physicalSensations ? physicalSensations.split(',').map(s => s.trim()).filter(Boolean) : [],
        accompanyingThoughts,
        copingMechanismsUsed: copingMechanisms ? copingMechanisms.split(',').map(m => m.trim()).filter(Boolean) : [],
        contextualNote,
        relatedJournalSourceId
      };
      
      const response = await fetch('/api/orion/emotions/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFeedback({ type: 'success', message: "Emotion logged successfully!" });
        
        // Reset form
        setPrimaryEmotion('');
        setSecondaryEmotions('');
        setIntensity(5);
        setTriggers('');
        setPhysicalSensations('');
        setAccompanyingThoughts('');
        setCopingMechanisms('');
        setContextualNote('');
        
        if (onLogSaved) {
          onLogSaved();
        }
      } else {
        throw new Error(data.error || 'Failed to log emotion');
      }
    } catch (err: any) {
      console.error('Error logging emotion:', err);
      setFeedback({ type: 'error', message: err.message || 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primaryEmotion" className="text-gray-300">Primary Emotion *</Label>
          <Input
            id="primaryEmotion"
            value={primaryEmotion}
            onChange={(e) => setPrimaryEmotion(e.target.value)}
            placeholder="e.g., Joy, Anxiety, Frustration"
            className="bg-gray-700 border-gray-600 text-gray-200"
            list="common-emotions"
            required
          />
          <datalist id="common-emotions">
            {commonEmotions.map(emotion => (
              <option key={emotion} value={emotion} />
            ))}
          </datalist>
        </div>
        
        <div>
          <Label htmlFor="intensity" className="text-gray-300">Intensity (1-10)</Label>
          <Input
            id="intensity"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Mild (1)</span>
            <span>Moderate (5)</span>
            <span>Intense (10)</span>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="secondaryEmotions" className="text-gray-300">Secondary Emotions (comma-separated)</Label>
        <Input
          id="secondaryEmotions"
          value={secondaryEmotions}
          onChange={(e) => setSecondaryEmotions(e.target.value)}
          placeholder="e.g., Hope, Uncertainty, Relief"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div>
        <Label htmlFor="triggers" className="text-gray-300">Triggers (comma-separated)</Label>
        <Input
          id="triggers"
          value={triggers}
          onChange={(e) => setTriggers(e.target.value)}
          placeholder="e.g., Work deadline, Conversation with friend"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div>
        <Label htmlFor="physicalSensations" className="text-gray-300">Physical Sensations (comma-separated)</Label>
        <Input
          id="physicalSensations"
          value={physicalSensations}
          onChange={(e) => setPhysicalSensations(e.target.value)}
          placeholder="e.g., Tight chest, Racing heart, Calm breathing"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div>
        <Label htmlFor="accompanyingThoughts" className="text-gray-300">Accompanying Thoughts</Label>
        <Textarea
          id="accompanyingThoughts"
          value={accompanyingThoughts}
          onChange={(e) => setAccompanyingThoughts(e.target.value)}
          placeholder="What thoughts were going through your mind?"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div>
        <Label htmlFor="copingMechanisms" className="text-gray-300">Coping Mechanisms Used (comma-separated)</Label>
        <Input
          id="copingMechanisms"
          value={copingMechanisms}
          onChange={(e) => setCopingMechanisms(e.target.value)}
          placeholder="e.g., Deep breathing, Journaling, Exercise"
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <div>
        <Label htmlFor="contextualNote" className="text-gray-300">Additional Context</Label>
        <Textarea
          id="contextualNote"
          value={contextualNote}
          onChange={(e) => setContextualNote(e.target.value)}
          placeholder="Any additional details about this emotional experience..."
          className="bg-gray-700 border-gray-600 text-gray-200"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading || !primaryEmotion.trim()} 
        className="bg-emerald-600 hover:bg-emerald-700 w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging Emotion...
          </>
        ) : (
          <>
            <Heart className="mr-2 h-4 w-4" />
            Log Emotion
          </>
        )}
      </Button>
      
      {feedback && (
        <div className={`p-3 rounded-md flex items-center ${
          feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' 
                                   : 'bg-red-900/30 border border-red-700 text-red-300'
        }`}>
          {feedback.type === 'success' ? 
            <CheckCircle className="h-5 w-5 mr-2" /> : 
            <AlertTriangle className="h-5 w-5 mr-2" />
          }
          {feedback.message}
        </div>
      )}
    </form>
  );
};