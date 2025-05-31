"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListTodo } from 'lucide-react';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';

interface AddTaskFromReflectionProps {
  suggestedTask: string;
}

export const AddTaskFromReflection: React.FC<AddTaskFromReflectionProps> = ({ 
  suggestedTask
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className="text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-blue-300"
      >
        <ListTodo className="mr-1 h-3 w-3" />
        Create Task
      </Button>
      
      <CreateHabiticaTaskDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        initialTaskText={suggestedTask}
        initialTaskNotes="Generated from journal reflection"
        sourceModule="Journal Reflection"
      />
    </>
  );
};