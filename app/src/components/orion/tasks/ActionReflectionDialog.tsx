'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
  DialogFooter,
} from '@/components/ui';
import { Loader2, BookOpen, Save } from 'lucide-react';
import { useActionReflectionDialogStore } from './actionReflectionDialogStore';
import { toast } from 'react-hot-toast';

export const ActionReflectionDialog: React.FC = () => {
  const { isOpen, close, task } = useActionReflectionDialogStore();
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReflectionText(''); // Reset on close
    }
  }, [isOpen]);

  if (!task) return null;

  const getPromptText = () => {
    return `Reflect on the action: "${task.text}". What were the outcomes? What did you learn? Was it effective?`;
  };

  const handleSaveReflection = async () => {
    if (!reflectionText.trim()) {
      toast.error('Reflection cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/orion/memory/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `Reflection on task "${task.text}": ${reflectionText}`,
          sourceId: `reflection_task_${task._id}_${Date.now()}`,
          tags: ['reflection', 'task_reflection', 'habitica', ...(task.tags || [])],
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reflection saved to memory!');
        close();
      } else {
        throw new Error(data.error || 'Failed to save reflection.');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-indigo-400 flex items-center">
            <BookOpen className="mr-2 h-5 w-5" /> Task Reflection
          </DialogTitle>
          <DialogDescription className="text-gray-400">{getPromptText()}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={reflectionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReflectionText(e.target.value)}
            placeholder="Write your reflection here..."
            className="min-h-[150px] bg-gray-700 border-gray-600"
            disabled={isSaving}
          />
        </div>
        <DialogFooter>
          <Button onClick={close} variant="outline" className="text-gray-300 border-gray-600" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveReflection}
            disabled={isSaving || !reflectionText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Reflection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
