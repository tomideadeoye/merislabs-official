"use client";

import React, { useState } from 'react';
import { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle } from '@shared/ui';
import { Loader2, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import { HabiticaTaskCreateData } from '@shared/types/habitica';

interface HabiticaAddTodoProps {
  onTodoAdded?: () => void;
  className?: string;
  initialText?: string;
  initialNotes?: string;
}

export const HabiticaAddTodo: React.FC<HabiticaAddTodoProps> = ({
  onTodoAdded,
  className,
  initialText = '',
  initialNotes = ''
}) => {
  const [text, setText] = useState<string>(initialText);
  const [notes, setNotes] = useState<string>(initialNotes);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setFeedback({ type: 'error', message: "Task text is required." });
      return;
    }

    setIsAdding(true);
    setFeedback(null);

    try {
      const taskData: HabiticaTaskCreateData = {
        text: text.trim(),
        type: 'todo',
        notes: notes.trim() || undefined
      };

      const response = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({ type: 'success', message: "Todo added successfully!" });
        setText('');
        setNotes('');
        if (onTodoAdded) {
          onTodoAdded();
        }
      } else {
        throw new Error(data.error || 'Failed to add todo.');
      }
    } catch (err: any) {
      console.error("Error adding todo:", err);
      setFeedback({ type: 'error', message: err.message || "An unexpected error occurred." });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Plus className="mr-2 h-5 w-5 text-purple-400" />
          Add To-Do
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="todoText" className="text-gray-300">Task *</Label>
            <Input
              id="todoText"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isAdding}
              required
            />
          </div>

          <div>
            <Label htmlFor="todoNotes" className="text-gray-300">Notes (Optional)</Label>
            <Textarea
              id="todoNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isAdding}
            />
          </div>

          {feedback && (
            <div className={`p-3 rounded-md flex items-center ${
              feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300'
                                       : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}>
              {feedback.type === 'success' ?
                <CheckCircle2 className="h-5 w-5 mr-2" /> :
                <AlertTriangle className="h-5 w-5 mr-2" />
              }
              {feedback.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isAdding || !text.trim()}
            className="bg-purple-600 hover:bg-purple-700 w-full"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add To-Do
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
