'use client';

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui';
import { Plus } from 'lucide-react';
import { HabiticaTaskForm } from './HabiticaTaskForm';

// GOAL OF FILE|FEATURES|FUNCTIONS:
// This component provides a button that opens a dialog to create a new Habitica task.
// It manages the dialog's open/close state.

interface TaskCreationButtonProps {
  onTaskCreated?: () => void;
  initialText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const TaskCreationButton: React.FC<TaskCreationButtonProps> = ({
  onTaskCreated,
  initialText,
  variant,
  size,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTaskCreated = () => {
    setIsOpen(false);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant={variant} size={size} className={className}>
        <Plus className="mr-2 h-4 w-4" />
        New Task
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-200">Create New Habitica Task</DialogTitle>
            <DialogDescription className="text-gray-400">Add a new task to your Habitica account</DialogDescription>
          </DialogHeader>
          <HabiticaTaskForm onTaskCreated={handleTaskCreated} initialText={initialText} />
        </DialogContent>
      </Dialog>
    </>
  );
};
