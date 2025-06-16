'use client';

import React from 'react';
import { Button } from '@/ui/components/ui';
import { ListTodo } from 'lucide-react';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';
import { useHabiticaTaskDialogStore } from './tasks/habiticaTaskDialogStore';

interface AddTaskFromReflectionProps {
  suggestedTask: string;
  onTaskAdded: () => void;
  userId: string;
  originalEntryId: string;
  apiToken: string;
}

export const AddTaskFromReflection: React.FC<AddTaskFromReflectionProps> = ({
  suggestedTask,
  onTaskAdded,
  userId,
  originalEntryId,
  apiToken,
}) => {
  const { openDialog } = useHabiticaTaskDialogStore();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          openDialog({
            initialTaskText: suggestedTask,
            initialTaskNotes: 'Generated from journal reflection',
            sourceModule: 'Journal Reflection',
            userId: userId,
            apiToken: apiToken,
            originalEntryId: originalEntryId,
          });
          onTaskAdded();
        }}
        className="text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-blue-300"
      >
        <ListTodo className="mr-1 h-3 w-3" />
        Create Task
      </Button>

      <CreateHabiticaTaskDialog />
    </>
  );
};
