
'use client';

import React, { useState } from 'react';
import { Task } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  onTaskSelectAction: (taskId: string) => void;
  className?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error, onTaskSelectAction, className }) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Extract unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((t) => (t.tags || [])))).filter(Boolean);
  const [tagFilter, setTagFilter] = useState<string>('ALL');

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesTag = tagFilter === 'ALL' || (task.tags && task.tags.includes(tagFilter));
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesTag && matchesSearch;
  });

  // Refresh handler (simulate refetch, could be replaced with actual refetch logic)
  const handleRefreshTasks = () => {
    window.location.reload();
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
        <span>{error instanceof Error ? error.message : String(error)}</span>
      </div>
    );
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <CardTitle className="text-lg flex items-center">Tasks</CardTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-32 md:w-48"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1"
            aria-label="Filter by status"
            title="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-gray-700 text-white rounded px-2 py-1"
            aria-label="Filter by priority"
            title="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          {allTags.length > 0 && (
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1"
              aria-label="Filter by tag"
              title="Filter by tag"
            >
              <option value="ALL">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}
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
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400">No tasks found.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center space-x-4 p-2 rounded cursor-pointer transition-colors ${selectedTaskId === task.id ? 'bg-purple-800/40 border-l-4 border-purple-500' : 'hover:bg-gray-700/60'
                  }`}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  onTaskSelectAction(task.id);
                }}
              >
                <div className="flex-1">
                  <div className="font-semibold text-white">{task.title}</div>
                  <div className="flex flex-wrap gap-2 text-xs mt-1">
                    <span className={`px-2 py-1 rounded-full ${task.status === 'DONE' ? 'bg-green-600' : task.status === 'IN_PROGRESS' ? 'bg-yellow-600' : 'bg-gray-600'} text-white`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${task.priority === 'HIGH' ? 'bg-red-600' : task.priority === 'MEDIUM' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="px-2 py-1 rounded-full bg-blue-900 text-blue-100">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 &&
                      task.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 rounded-full bg-purple-700 text-white">
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
                {/* Actions: Edit/Delete could be added here if needed */}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

