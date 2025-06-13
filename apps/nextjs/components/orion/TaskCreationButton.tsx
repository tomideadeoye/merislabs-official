"use client";

import React, { useState } from 'react';
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedhooks/useSessionState';
import { Button } from '@repo/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/ui';
import { HabiticaTaskForm } from './HabiticaTaskForm';
import { Loader2, AlertTriangle, Plus } from 'lucide-react';

interface TaskCreationButtonProps {
  initialText?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const TaskCreationButton: React.FC<TaskCreationButtonProps> = ({
  initialText = '',
  className,
  variant = 'default',
  size = 'default'
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCheckingCredentials, setIsCheckingCredentials] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  const handleClick = async () => {
    setError(null);

    if (!habiticaUserId || !habiticaApiToken) {
      setError("Habitica credentials not set. Please set them in the Habitica page.");
      return;
    }

    setIsCheckingCredentials(true);

    try {
      // Verify credentials by making a test API call
      const response = await fetch('/api/orion/habitica/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: habiticaUserId, apiToken: habiticaApiToken })
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(true);
      } else {
        throw new Error(data.error || 'Failed to verify Habitica credentials');
      }
    } catch (err: any) {
      console.error('Error verifying Habitica credentials:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsCheckingCredentials(false);
    }
  };

  const handleTaskCreated = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isCheckingCredentials}
        className={className}
      >
        {isCheckingCredentials ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </>
        )}
      </Button>

      {error && (
        <div className="mt-2 bg-red-900/30 border border-red-700 text-red-300 p-2 rounded-md text-xs flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Create Habitica Task</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new task to your Habitica account
            </DialogDescription>
          </DialogHeader>

          <HabiticaTaskForm onTaskCreated={handleTaskCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};
