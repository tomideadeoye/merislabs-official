"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useHabiticaTaskDialogStore } from './habiticaTaskDialogStore';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, CheckCircle, SendToBack } from 'lucide-react';

interface CreateHabiticaTaskDialogProps {
  initialTaskText: string;
  initialTaskNotes?: string;
  sourceModule?: string;
  sourceReferenceId?: string;
  defaultTags?: string[];
}

export const CreateHabiticaTaskDialog: React.FC<CreateHabiticaTaskDialogProps> = ({
  initialTaskText,
  initialTaskNotes = "",
  sourceModule,
  sourceReferenceId,
  defaultTags = []
}) => {
  const { isOpen, openDialog, closeDialog } = useHabiticaTaskDialogStore();
  const [taskText, setTaskText] = useState(initialTaskText);
  const [taskNotes, setTaskNotes] = useState(initialTaskNotes);
  const [priority, setPriority] = useState<number>(1);

  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  // Update form fields if initial props change while dialog is open
  useEffect(() => {
    setTaskText(initialTaskText);

    let notes = initialTaskNotes || "";
    if (sourceModule && sourceReferenceId) {
      notes += `\n\n(From Orion - ${sourceModule}, Ref: ${sourceReferenceId})`;
    } else if (sourceModule) {
      notes += `\n\n(From Orion - ${sourceModule})`;
    }
    if (defaultTags && defaultTags.length > 0) {
      notes += `\nTags: ${defaultTags.join(', ')}`;
    }
    setTaskNotes(notes.trim());
  }, [isOpen, initialTaskText, initialTaskNotes, sourceModule, sourceReferenceId, defaultTags]);

  const handleSendToHabitica = useCallback(async () => {
    if (!taskText.trim()) {
      setFeedback({ type: 'error', message: "Task text cannot be empty." });
      return;
    }

    if (!habiticaUserId || !habiticaApiToken) {
      setFeedback({ type: 'error', message: "Habitica credentials not set. Please configure them in the Habitica dashboard." });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orion/habitica/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: habiticaUserId,
          apiToken: habiticaApiToken,
          taskData: {
            text: taskText,
            type: "todo",
            notes: taskNotes,
            priority: priority
          },
          orionSourceModule: sourceModule,
          orionSourceReferenceId: sourceReferenceId
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ type: 'success', message: `Task "${taskText.substring(0, 30)}${taskText.length > 30 ? '...' : ''}" added to Habitica!` });

        setTimeout(() => {
          closeDialog();
          setFeedback(null);
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to add task to Habitica.");
      }
    } catch (error: any) {
      console.error("Error sending task to Habitica:", error);
      setFeedback({ type: 'error', message: error.message || "Could not send task to Habitica." });
    } finally {
      setIsSending(false);
    }
  }, [taskText, taskNotes, priority, habiticaUserId, habiticaApiToken, closeDialog, sourceModule, sourceReferenceId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? openDialog() : closeDialog()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-sky-400 flex items-center">
            <SendToBack className="mr-2 h-5 w-5" /> Create Habitica To-Do
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Review and confirm the details for your new task in Habitica.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="habiticaTaskText" className="text-gray-300">Task Text*</Label>
            <Input
              id="habiticaTaskText"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <Label htmlFor="habiticaTaskNotes" className="text-gray-300">Notes (Optional)</Label>
            <Textarea
              id="habiticaTaskNotes"
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              rows={4}
              className="bg-gray-700 border-gray-600 text-gray-200"
              placeholder="Add more details, context, or links..."
            />
          </div>

          <div>
            <Label htmlFor="habiticaTaskPriority" className="text-gray-300">Priority</Label>
            <Select
              value={String(priority)}
              onValueChange={(value) => setPriority(Number(value))}
            >
              <SelectTrigger id="habiticaTaskPriority" className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value="0.1">Trivial</SelectItem>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="1.5">Medium</SelectItem>
                <SelectItem value="2">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

        <DialogFooter>
          <Button
            onClick={closeDialog}
            variant="outline"
            className="text-gray-300 border-gray-600"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSendToHabitica}
            disabled={isSending || !taskText.trim()}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SendToBack className="mr-2 h-4 w-4" />
            )}
            Add to Habitica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
