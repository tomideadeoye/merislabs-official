"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, AlertTriangle, MessageCircle } from 'lucide-react';

import { useActionReflectionDialogStore } from './actionReflectionDialogStore';

interface ActionReflectionDialogProps {}

export const ActionReflectionDialog: React.FC<ActionReflectionDialogProps> = () => {
  const {
    isOpen,
    close,
    completedTaskText,
    habiticaTaskId,
    orionSourceModule,
    orionSourceReferenceId,
    onReflectionSaved,
  } = useActionReflectionDialogStore();
  const [reflectionText, setReflectionText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const defaultPrompt = `Reflect on completing: "${completedTaskText}" (Origin: ${orionSourceModule || 'Orion'}).\nWhat went well? What was challenging? Key learning? How do you feel now?`;

  const handleSubmitReflection = useCallback(async () => {
    if (!reflectionText.trim()) {
      setFeedback({ type: 'error', message: "Reflection text cannot be empty if you choose to save."});
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = {
        habiticaTaskId,
        orionSourceModule,
        orionSourceReferenceId,
        originalTaskText: completedTaskText,
        reflectionText: reflectionText,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/orion/reflection/on-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ type: 'success', message: "Reflection saved to Orion's Memory!"});

        if (onReflectionSaved) onReflectionSaved();

        setTimeout(() => {
          close();
          setReflectionText(""); // Clear for next time
          setFeedback(null);
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to save action reflection.");
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || "Could not save reflection."});
    } finally {
      setIsSaving(false);
    }
  }, [reflectionText, habiticaTaskId, orionSourceModule, orionSourceReferenceId, completedTaskText, onReflectionSaved, close]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => {
      console.info('[ActionReflectionDialog] Dialog open state changed', { open });
      if (!open) { // If closing, reset feedback
        setFeedback(null);
        setReflectionText("");
      }
      if (!open) close();
    }}>
      <DialogContent className="sm:max-w-lg bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-green-400 flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" /> Reflect on Action Completed
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You&apos;ve completed: <strong className="text-gray-300">&quot;{completedTaskText}&quot;</strong>.
            {orionSourceModule && <span className="block text-xs"> (Origin: {orionSourceModule})</span>}
            Take a moment to capture your thoughts on this action.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <Label htmlFor="actionReflectionText" className="text-gray-300">Your Reflection:</Label>
          <Textarea
            id="actionReflectionText"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={defaultPrompt}
            rows={7}
            className="min-h-[150px] bg-gray-700 border-gray-600 text-gray-200"
          />
        </div>

        {feedback && (
          <div className={`p-3 rounded-md flex items-center ${
            feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {feedback.message}
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            onClick={() => {
              console.info('[ActionReflectionDialog] Skip Reflection clicked');
              close();
              setReflectionText("");
              setFeedback(null);
            }}
            variant="ghost"
            className="text-gray-400 hover:text-gray-200"
          >
            Skip Reflection
          </Button>

          <Button
            onClick={handleSubmitReflection}
            disabled={isSaving || !reflectionText.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
