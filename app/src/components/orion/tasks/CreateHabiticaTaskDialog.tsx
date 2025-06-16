'use client';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

import React, { useState, useEffect, useCallback } from 'react';
import { useHabiticaTaskDialogStore } from './habiticaTaskDialogStore';
// FIX: Use barrel exports from @/ui/components/ui for all UI components to resolve TS2307 errors and align with monorepo best practices.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Label,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/ui/components/ui';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/app_constants';
import { HabiticaTask, HabiticaUserStats } from '@/types/habitica';
import { createTask, getUserData } from '@/lib/habitica_client';

export const CreateHabiticaTaskDialog: React.FC = () => {
  const { isOpen, closeDialog, taskProps } = useHabiticaTaskDialogStore();

  const [taskText, setTaskText] = useState(taskProps?.initialTaskText || '');
  const [taskNotes, setTaskNotes] = useState(taskProps?.initialTaskNotes || '');
  const [priority, setPriority] = useState<number>(1);

  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { selectSessionValue } = useSessionState();

  const habiticaUserId = selectSessionValue<string>(SessionStateKeys.HABITICA_USER_ID) || '';
  const habiticaApiToken = selectSessionValue<string>(SessionStateKeys.HABITICA_API_TOKEN) || '';

  // Update form fields if initial props change while dialog is open
  useEffect(() => {
    if (taskProps) {
      setTaskText(taskProps.initialTaskText || '');

      let notes = taskProps.initialTaskNotes || '';
      if (taskProps.sourceModule && taskProps.sourceReferenceId) {
        notes += `\n\n(From Orion - ${taskProps.sourceModule}, Ref: ${taskProps.sourceReferenceId})`;
      } else if (taskProps.sourceModule) {
        notes += `\n\n(From Orion - ${taskProps.sourceModule})`;
      }
      if (taskProps.defaultTags && taskProps.defaultTags.length > 0) {
        notes += `\nTags: ${taskProps.defaultTags.join(', ')}`;
      }
      setTaskNotes(notes.trim());
    }
  }, [taskProps]);

  const handleSendToHabitica = useCallback(async () => {
    if (!taskText.trim()) {
      setFeedback({ type: 'error', message: 'Task text cannot be empty.' });
      return;
    }

    // Use userId and apiToken from taskProps if available, otherwise fallback to session state
    const currentUserId = taskProps?.userId || habiticaUserId;
    const currentApiToken = taskProps?.apiToken || habiticaApiToken;

    if (!currentUserId || !currentApiToken) {
      setFeedback({
        type: 'error',
        message: 'Habitica credentials not set. Please configure them in the Habitica dashboard.',
      });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orion/habitica/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          apiToken: currentApiToken,
          taskData: {
            text: taskText,
            type: 'todo',
            notes: taskNotes,
            priority: priority,
          },
          orionSourceModule: taskProps?.sourceModule,
          orionSourceReferenceId: taskProps?.sourceReferenceId,
          originalEntryId: taskProps?.originalEntryId, // Pass originalEntryId from taskProps
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Task "${taskText.substring(0, 30)}${taskText.length > 30 ? '...' : ''}" added to Habitica!`);
        closeDialog();
        setFeedback(null);
      } else {
        throw new Error(data.error || 'Failed to add task to Habitica.');
      }
    } catch (error: unknown) {
      console.error('Error sending task to Habitica:', error);
      setFeedback({ type: 'error', message: (error as Error).message || 'Could not send task to Habitica.' });
    } finally {
      setIsSending(false);
    }
  }, [taskText, taskNotes, priority, habiticaUserId, habiticaApiToken, closeDialog, taskProps]);

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg text-gray-200">Create New Habitica Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to your Habitica account directly from Orion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSendToHabitica} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="habiticaTaskText" className="text-gray-300">
              Task Text*
            </Label>
            <Input
              id="habiticaTaskText"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <Label htmlFor="habiticaTaskNotes" className="text-gray-300">
              Notes (Optional)
            </Label>
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
            <Label htmlFor="habiticaTaskPriority" className="text-gray-300">
              Priority
            </Label>
            <Select value={String(priority)} onValueChange={(value) => setPriority(Number(value))}>
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

          {feedback && (
            <div
              className={`p-3 rounded-md flex items-center ${
                feedback.type === 'success'
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {feedback.message}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeDialog} className="bg-gray-700 hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                'Create Task in Habitica'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
