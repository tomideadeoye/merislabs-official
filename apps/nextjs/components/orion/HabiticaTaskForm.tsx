"use client";

import React, { useState } from 'react';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/hooks/useSessionState';
import { Button, Input, Textarea, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import type { HabiticaTaskCreationParams } from '@shared/types/habitica';

interface HabiticaTaskFormProps {
  onTaskCreated?: () => void;
  className?: string;
}

export const HabiticaTaskForm: React.FC<HabiticaTaskFormProps> = ({
  onTaskCreated,
  className
}) => {
  const [taskText, setTaskText] = useState<string>("");
  const [taskNotes, setTaskNotes] = useState<string>("");
  const [taskType, setTaskType] = useState<'todo' | 'daily'>('todo');
  const [taskPriority, setTaskPriority] = useState<0.1 | 1 | 1.5 | 2>(1);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskText.trim()) {
      setError("Task text is required");
      return;
    }

    if (!habiticaUserId || !habiticaApiToken) {
      setError("Habitica credentials not set");
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const taskParams: HabiticaTaskCreationParams = {
        text: taskText.trim(),
        type: taskType,
        notes: taskNotes.trim() || undefined,
        priority: taskPriority
      };

      const response = await fetch('/api/orion/habitica/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: habiticaUserId,
          apiToken: habiticaApiToken,
          task: taskParams
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTaskText("");
        setTaskNotes("");
        setTaskType('todo');
        setTaskPriority(1);

        if (onTaskCreated) {
          onTaskCreated();
        }
      } else {
        throw new Error(data.error || 'Failed to create task');
      }
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const priorityLabels = {
    0.1: 'Trivial',
    1: 'Easy',
    1.5: 'Medium',
    2: 'Hard'
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="taskText" className="text-gray-300">Task Text *</Label>
        <Input
          id="taskText"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done?"
          className="bg-gray-700 border-gray-600 text-gray-200"
          disabled={isCreating}
          required
        />
      </div>

      <div>
        <Label htmlFor="taskNotes" className="text-gray-300">Notes (Optional)</Label>
        <Textarea
          id="taskNotes"
          value={taskNotes}
          onChange={(e) => setTaskNotes(e.target.value)}
          placeholder="Any additional details..."
          className="bg-gray-700 border-gray-600 text-gray-200"
          disabled={isCreating}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taskType" className="text-gray-300">Task Type</Label>
          <Select
            value={taskType}
            onValueChange={(value: any) => setTaskType(value)}
            disabled={isCreating}
          >
            <SelectTrigger id="taskType" className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="todo">To-Do</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="taskPriority" className="text-gray-300">Priority</Label>
          <Select
            value={taskPriority.toString()}
            onValueChange={(value: string) => setTaskPriority(parseFloat(value) as 0.1 | 1 | 1.5 | 2)}
            disabled={isCreating}
          >
            <SelectTrigger id="taskPriority" className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="0.1">{priorityLabels[0.1]}</SelectItem>
              <SelectItem value="1">{priorityLabels[1]}</SelectItem>
              <SelectItem value="1.5">{priorityLabels[1.5]}</SelectItem>
              <SelectItem value="2">{priorityLabels[2]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isCreating || !taskText.trim() || !habiticaUserId || !habiticaApiToken}
        className="bg-blue-600 hover:bg-blue-700 w-full"
      >
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </>
        )}
      </Button>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Task created successfully!
        </div>
      )}
    </form>
  );
};
