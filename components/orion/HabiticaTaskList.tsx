"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getOrionSourceUrl } from '@/lib/utils';
import type { HabiticaTask } from '@/types/habitica';
import { ActionReflectionDialog } from './tasks/ActionReflectionDialog';

interface HabiticaTaskListProps {
  className?: string;
}

interface TaskWithOrigin extends HabiticaTask {
  orionOrigin?: {
    orionSourceModule: string;
    orionSourceReferenceId: string;
    createdAt: string;
  };
}

export const HabiticaTaskList: React.FC<HabiticaTaskListProps> = ({ className }) => {
  const [todos, setTodos] = useState<TaskWithOrigin[]>([]);
  const [dailies, setDailies] = useState<TaskWithOrigin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('todos');
  
  // Reflection dialog state
  const [showReflectionDialog, setShowReflectionDialog] = useState<boolean>(false);
  const [taskForReflection, setTaskForReflection] = useState<TaskWithOrigin | null>(null);
  
  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  
  useEffect(() => {
    fetchTasks();
  }, [habiticaUserId, habiticaApiToken]);
  
  const fetchTasks = async () => {
    if (!habiticaUserId || !habiticaApiToken) {
      setError("Habitica credentials not set");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch todos
      const todosResponse = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: habiticaUserId, 
          apiToken: habiticaApiToken,
          type: 'todos'
        })
      });
      
      const todosData = await todosResponse.json();
      
      if (!todosData.success) {
        throw new Error(todosData.error || 'Failed to fetch todos');
      }
      
      // Fetch dailies
      const dailiesResponse = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: habiticaUserId, 
          apiToken: habiticaApiToken,
          type: 'dailys'
        })
      });
      
      const dailiesData = await dailiesResponse.json();
      
      if (!dailiesData.success) {
        throw new Error(dailiesData.error || 'Failed to fetch dailies');
      }
      
      // Sort todos by completed status
      const sortedTodos = [...todosData.tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
      
      // Sort dailies by completed status and due status
      const sortedDailies = [...dailiesData.tasks].sort((a, b) => {
        if (a.completed === b.completed) {
          if (a.isDue === b.isDue) return 0;
          return a.isDue ? -1 : 1;
        }
        return a.completed ? 1 : -1;
      });
      
      setTodos(sortedTodos);
      setDailies(sortedDailies);
    } catch (err: any) {
      console.error('Error fetching Habitica tasks:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskToggle = async (task: TaskWithOrigin) => {
    if (!habiticaUserId || !habiticaApiToken) return;
    
    try {
      const response = await fetch('/api/orion/habitica/tasks/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: habiticaUserId,
          apiToken: habiticaApiToken,
          taskId: task._id,
          direction: task.completed ? 'down' : 'up'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        if (task.type === 'todo') {
          setTodos(todos.map(t => 
            t._id === task._id ? { ...t, completed: !t.completed } : t
          ));
        } else if (task.type === 'daily') {
          setDailies(dailies.map(d => 
            d._id === task._id ? { ...d, completed: !d.completed } : d
          ));
        }
        
        // If task was just completed (not uncompleted) and has Orion origin, trigger reflection
        if (!task.completed && task.orionOrigin) {
          console.log("Task completed, preparing for reflection:", task);
          setTaskForReflection(task);
          setShowReflectionDialog(true);
        }
      } else {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (err: any) {
      console.error('Error updating task:', err);
      alert(`Error: ${err.message || 'Failed to update task'}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
        <span className="ml-2 text-gray-400">Loading tasks...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }
  
  const renderTask = (task: TaskWithOrigin, isCompleted: boolean) => (
    <Card 
      key={task._id} 
      className={`bg-gray-750 border-gray-700 ${isCompleted ? 'opacity-60' : ''}`}
    >
      <CardContent className="p-3">
        <div className="flex items-center">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleTaskToggle(task)}
            className="mr-3"
          />
          <div className="flex-1">
            <p className={`text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
              {task.text}
            </p>
            {task.notes && (
              <p className="text-xs text-gray-400 mt-1">{task.notes}</p>
            )}
          </div>
          {isCompleted && (
            <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
          )}
        </div>
        
        {task.orionOrigin && (
          <div className="mt-2 pt-2 border-t border-gray-600/50 flex items-center">
            <Link 
              href={getOrionSourceUrl(task.orionOrigin.orionSourceModule, task.orionOrigin.orionSourceReferenceId)}
              className="text-xs text-sky-400 hover:underline flex items-center"
              title={`Created from ${task.orionOrigin.orionSourceModule} on ${new Date(task.orionOrigin.createdAt).toLocaleDateString()}`}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              From: {task.orionOrigin.orionSourceModule}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-200">Your Tasks</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTasks}
          className="text-gray-300 border-gray-600"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-700 border-gray-600">
          <TabsTrigger 
            value="todos" 
            className="data-[state=active]:bg-blue-600"
          >
            To-Dos
          </TabsTrigger>
          <TabsTrigger 
            value="dailies" 
            className="data-[state=active]:bg-purple-600"
          >
            Dailies
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4 space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No to-dos found</p>
          ) : (
            todos.map(task => renderTask(task, task.completed))
          )}
        </TabsContent>
        
        <TabsContent value="dailies" className="mt-4 space-y-2">
          {dailies.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No dailies found</p>
          ) : (
            dailies.map(task => (
              <Card 
                key={task._id} 
                className={`bg-gray-750 border-gray-700 ${
                  task.completed ? 'opacity-60' : task.isDue ? '' : 'opacity-80'
                }`}
              >
                <CardContent className="p-3 flex items-center">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                      {task.text}
                    </p>
                    {task.notes && (
                      <p className="text-xs text-gray-400 mt-1">{task.notes}</p>
                    )}
                  </div>
                  {task.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                  ) : !task.isDue ? (
                    <span className="text-xs text-gray-400 ml-2">Not due</span>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Action Reflection Dialog */}
      {taskForReflection && taskForReflection.orionOrigin && (
        <ActionReflectionDialog
          isOpen={showReflectionDialog}
          setIsOpen={setShowReflectionDialog}
          completedTaskText={taskForReflection.text}
          habiticaTaskId={taskForReflection._id || ''}
          orionSourceModule={taskForReflection.orionOrigin.orionSourceModule}
          orionSourceReferenceId={taskForReflection.orionOrigin.orionSourceReferenceId}
          onReflectionSaved={() => {
            console.log(`Reflection saved for task: ${taskForReflection.text}`);
            // Optionally refresh tasks to show reflection status
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};