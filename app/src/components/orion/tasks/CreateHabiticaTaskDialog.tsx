'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useHabiticaTaskDialogStore } from './habiticaTaskDialogStore';
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
} from '@/components/ui';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/lib/app_constants';

export const CreateHabiticaTaskDialog: React.FC = () => {
  const { isOpen, closeDialog, taskProps } = useHabiticaTaskDialogStore();

  const [taskText, setTaskText] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [priority, setPriority] = useState<number>(1); // Default to 'Easy' (1)

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setPriority(1); // Reset priority to default
      setError(null); // Clear any previous errors
    } else {
      // Reset state when dialog is closed or taskProps become null
      setTaskText('');
      setTaskNotes('');
      setPriority(1);
      setError(null);
    }
  }, [taskProps]);

  const handleCreateTask = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent default form submission

      if (!taskText.trim()) {
        setError('Task text cannot be empty.');
        return;
      }

      const currentUserId = taskProps?.userId || habiticaUserId;
      const currentApiToken = taskProps?.apiToken || habiticaApiToken;

      if (!currentUserId || !currentApiToken) {
        setError('Habitica credentials not set. Please configure them in the Habitica dashboard.');
        return;
      }

      setIsSaving(true);
      setError(null);

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
            originalEntryId: taskProps?.originalEntryId,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success(`Task "${taskText.substring(0, 30)}${taskText.length > 30 ? '...' : ''}" added to Habitica!`);
          closeDialog();
        } else {
          throw new Error(data.error || 'Failed to add task to Habitica.');
        }
      } catch (err: unknown) {
        console.error('Error sending task to Habitica:', err);
        setError((err as Error).message || 'Could not send task to Habitica.');
      } finally {
        setIsSaving(false);
      }
    },
    [taskText, taskNotes, priority, habiticaUserId, habiticaApiToken, closeDialog, taskProps]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-lg text-gray-200">Create New Habitica Task</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new task to your Habitica account directly from Orion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
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
              required
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

          {error && (
            <div className="p-3 rounded-md flex items-center bg-red-900/30 border border-red-700 text-red-300">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
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
