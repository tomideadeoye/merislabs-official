"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle2, ListTodo } from 'lucide-react';

interface AddTaskFromReflectionProps {
  reflectionText: string;
  onTaskAdded?: () => void;
  className?: string;
}

export const AddTaskFromReflection: React.FC<AddTaskFromReflectionProps> = ({ 
  reflectionText,
  onTaskAdded,
  className
}) => {
  const [taskText, setTaskText] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const generateTaskFromReflection = async () => {
    if (!reflectionText.trim()) {
      setFeedback({ type: 'error', message: "No reflection text provided." });
      return;
    }
    
    setIsGenerating(true);
    setFeedback(null);

    try {
      // Use the LLM to extract a potential task from the reflection
      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: 'extract_task',
          primaryContext: `
Extract a clear, actionable task from the following journal reflection. 
The task should be something concrete that can be added to a to-do list.
If there is no clear task to extract, respond with "No clear task found."

Reflection:
${reflectionText}

Task (in 10 words or less):
`
        })
      });

      const data = await response.json();
      
      if (data.success && data.content) {
        const extractedTask = data.content.trim();
        if (extractedTask !== "No clear task found.") {
          setTaskText(extractedTask);
        } else {
          setFeedback({ type: 'error', message: "No clear task found in the reflection." });
        }
      } else {
        throw new Error(data.error || 'Failed to extract task from reflection.');
      }
    } catch (err: any) {
      console.error("Error extracting task:", err);
      setFeedback({ type: 'error', message: err.message || "An unexpected error occurred." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTask = async () => {
    if (!taskText.trim()) {
      setFeedback({ type: 'error', message: "Task text is required." });
      return;
    }
    
    setIsAdding(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: taskText.trim(),
          type: 'todo',
          notes: "Generated from journal reflection"
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setFeedback({ type: 'success', message: "Task added to Habitica successfully!" });
        setTaskText('');
        if (onTaskAdded) {
          onTaskAdded();
        }
      } else {
        throw new Error(data.error || 'Failed to add task to Habitica.');
      }
    } catch (err: any) {
      console.error("Error adding task to Habitica:", err);
      setFeedback({ type: 'error', message: err.message || "An unexpected error occurred." });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label htmlFor="taskText" className="text-gray-300 flex items-center">
            <ListTodo className="mr-2 h-4 w-4 text-purple-400" />
            Extract Task from Reflection
          </Label>
          <div className="mt-2 flex gap-2">
            <Button
              onClick={generateTaskFromReflection}
              disabled={isGenerating || isAdding || !reflectionText.trim()}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                "Extract Task"
              )}
            </Button>
          </div>
        </div>
        
        <div>
          <Textarea
            id="taskText"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Task will appear here after extraction, or you can type it manually"
            className="bg-gray-700 border-gray-600 text-gray-200"
            disabled={isAdding || isGenerating}
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
          onClick={handleAddTask} 
          disabled={isAdding || isGenerating || !taskText.trim()} 
          className="bg-purple-600 hover:bg-purple-700 w-full"
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding to Habitica...
            </>
          ) : (
            <>
              <ListTodo className="mr-2 h-4 w-4" />
              Add to Habitica
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};