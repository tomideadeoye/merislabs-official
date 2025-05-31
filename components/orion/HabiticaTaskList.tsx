"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckSquare, AlertTriangle, RefreshCw } from 'lucide-react';
import type { HabiticaTask } from '@/types/habitica';

interface HabiticaTaskListProps {
  className?: string;
  type?: 'todos' | 'dailys' | 'habits' | 'rewards' | 'completedTodos';
  limit?: number;
  onTaskCompleted?: () => void;
}

export const HabiticaTaskList: React.FC<HabiticaTaskListProps> = ({ 
  className,
  type = 'todos',
  limit = 10,
  onTaskCompleted
}) => {
  const [tasks, setTasks] = useState<HabiticaTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [type]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/orion/habitica/tasks?type=${type}`);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
      } else {
        throw new Error(data.error || 'Failed to fetch Habitica tasks');
      }
    } catch (err: any) {
      console.error('Error fetching Habitica tasks:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTaskId(taskId);
    
    try {
      const response = await fetch('/api/orion/habitica/tasks/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          direction: 'up'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the task in the list
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? { ...task, completed: true } : task
          )
        );
        
        if (onTaskCompleted) {
          onTaskCompleted();
        }
      } else {
        throw new Error(data.error || 'Failed to complete task');
      }
    } catch (err: any) {
      console.error('Error completing task:', err);
      alert(`Error: ${err.message || 'Failed to complete task'}`);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'todos': return 'To-Dos';
      case 'dailys': return 'Dailies';
      case 'habits': return 'Habits';
      case 'rewards': return 'Rewards';
      case 'completedTodos': return 'Completed To-Dos';
      default: return 'Tasks';
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <CheckSquare className="mr-2 h-5 w-5 text-purple-400" />
            {getTitle()}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchTasks} 
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="ml-2 text-gray-400">Loading tasks...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-center py-4 text-gray-400">No {type} found.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.slice(0, limit).map(task => (
              <li key={task.id} className="flex items-start gap-2">
                {type === 'todos' && !task.completed && (
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleCompleteTask(task.id)}
                    disabled={completingTaskId === task.id}
                    className="mt-1"
                  />
                )}
                {(type === 'completedTodos' || (type === 'todos' && task.completed)) && (
                  <Checkbox
                    checked={true}
                    disabled={true}
                    className="mt-1"
                  />
                )}
                <div className="flex-grow">
                  <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                    {task.text}
                  </p>
                  {task.notes && (
                    <p className="text-xs text-gray-500 mt-1">{task.notes}</p>
                  )}
                </div>
                {completingTaskId === task.id && (
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400 mt-1" />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};