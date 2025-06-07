"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListTodo } from 'lucide-react';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';
import { useHabiticaTaskDialogStore } from './tasks/habiticaTaskDialogStore';

interface AddTaskFromReflectionProps {
  suggestedTask: string;
}

export const AddTaskFromReflection: React.FC<AddTaskFromReflectionProps> = ({
  suggestedTask
}) => {
  const { openDialog } = useHabiticaTaskDialogStore();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openDialog}
        className="text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-blue-300"
      >
        <ListTodo className="mr-1 h-3 w-3" />
        Create Task
      </Button>

      <CreateHabiticaTaskDialog
        initialTaskText={suggestedTask}
        initialTaskNotes="Generated from journal reflection"
        sourceModule="Journal Reflection"
      />
    </>
  );
};
