
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskPriority, TaskType } from '@prisma/client';
import apiClient from '@/lib/apiClient';
import logger from '@/lib/logger';

interface TaskFormProps {
  task?: Task;
  onTaskSaved: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskSaved }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);
  const [type, setType] = useState<TaskType>(task?.type || TaskType.TODO);
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const taskData = {
        title,
        description,
        priority,
        type,
        dueDate: dueDate ? new Date(dueDate) : null,
      };

      if (task) {
        await apiClient.put(`/api/orion/tasks/${task.id}`, taskData);
      } else {
        await apiClient.post('/api/orion/tasks', taskData);
      }
      onTaskSaved();
    } catch (err: unknown) {
      logger.error(
        `Error saving task: ${err instanceof Error ? err.message : 'An unknown error occurred'}`,
        { originalError: err }
      );
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Select onValueChange={(value) => setPriority(value as TaskPriority)} defaultValue={priority}>
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(TaskPriority).map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setType(value as TaskType)} defaultValue={type}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(TaskType).map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Task'}
      </Button>
    </form>
  );
};
