"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, BookOpen, Save } from 'lucide-react';
import { Opportunity } from '@shared/types/opportunity';
import { useJournalReflectionDialogStore } from './journalReflectionDialogStore';

interface JournalReflectionDialogProps {}

export const JournalReflectionDialog: React.FC<JournalReflectionDialogProps> = () => {
  const {
    isOpen,
    close,
    opportunity,
    actionType = 'general'
  } = useJournalReflectionDialogStore();
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  if (!opportunity) return null;

  // Generate a prompt based on the action type
  const getPromptText = () => {
    switch (actionType) {
      case 'application_sent':
        return `Reflect on your application to ${opportunity.title} at ${opportunity.company}. How do you feel about your application? What strengths did you highlight? Any concerns?`;
      case 'interview_completed':
        return `Reflect on your interview for ${opportunity.title} at ${opportunity.company}. What went well? What could have gone better? What did you learn?`;
      case 'outreach_sent':
        return `Reflect on your outreach for ${opportunity.title} at ${opportunity.company}. What was your approach? What response do you hope for?`;
      default:
        return `Reflect on this opportunity (${opportunity.title} at ${opportunity.company}). What are your thoughts, feelings, or insights?`;
    }
  };

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) {
      setFeedback({ type: 'error', message: "Reflection cannot be empty." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      // Save to memory system
      const response = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: reflectionText,
          sourceId: `reflection_${opportunity.id}_${Date.now()}`,
          tags: [
            'reflection',
            'opportunity_reflection',
            (opportunity.company || 'no_company').toLowerCase().replace(/\s+/g, '_'),
            actionType
          ]
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ type: 'success', message: "Reflection saved successfully!" });

        // Clear the form and close the dialog after a short delay
        setTimeout(() => {
          setReflectionText('');
          close();
          setFeedback(null);
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to save reflection.");
      }
    } catch (error: any) {
      console.error("Error saving reflection:", error);
      setFeedback({ type: 'error', message: error.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-indigo-400 flex items-center">
            <BookOpen className="mr-2 h-5 w-5" /> Opportunity Reflection
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Take a moment to reflect on this opportunity and capture your thoughts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-300">{getPromptText()}</p>

          <Textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write your reflection here..."
            className="min-h-[200px] bg-gray-700 border-gray-600 text-gray-200"
            disabled={isSaving}
          />
        </div>

        {feedback && (
          <div className={`p-3 rounded-md flex items-center ${
            feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}>
            {feedback.message}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={close}
            variant="outline"
            className="text-gray-300 border-gray-600"
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSaveReflection}
            disabled={isSaving || !reflectionText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
