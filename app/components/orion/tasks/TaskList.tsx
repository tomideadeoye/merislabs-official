
'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';

interface TaskListProps {
  className?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ className }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/orion/tasks');
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        throw new Error(response.data.error || 'Failed to fetch tasks');
      }
    } catch (err: unknown) {
      logger.error(
        `Error fetching tasks: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
        { originalError: err }
      );
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefreshTasks = () => {
    fetchTasks();
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

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">Tasks</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshTasks}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No tasks found.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center space-x-2">
                <span className={'text-white'}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
