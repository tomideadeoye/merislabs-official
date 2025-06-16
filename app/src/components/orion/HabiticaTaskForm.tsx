'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/ui/components/ui';
import { createTask, getUserData } from '@/lib/habitica_client';
import { SessionStateKeys } from '@/lib/app_constants';
import { HabiticaTask } from '@/types/habitica';
import { useSessionState } from '@/hooks/useSessionState';

interface HabiticaTaskFormProps {
  onTaskCreated: () => void;
}

interface HabiticaFormData {
  text: string;
  type: 'todo' | 'daily' | 'habit' | 'reward';
  notes: string;
  priority: string;
}

export const HabiticaTaskForm: React.FC<HabiticaTaskFormProps> = ({ onTaskCreated }) => {
  const { register, handleSubmit, control, reset } = useForm<HabiticaFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { selectSessionValue } = useSessionState();
  const habiticaUserId = selectSessionValue<string>(SessionStateKeys.HABITICA_USER_ID) || '';
  const habiticaApiToken = selectSessionValue<string>(SessionStateKeys.HABITICA_API_TOKEN) || '';

  const onSubmit = async (data: HabiticaFormData) => {
    setLoading(true);
    setError(null);
    try {
      const taskPriority = parseFloat(data.priority);
      if (isNaN(taskPriority)) {
        throw new Error('Invalid priority value.');
      }

      const taskData: HabiticaTask = {
        _id: '',
        text: data.text,
        type: data.type,
        notes: data.notes,
        priority: taskPriority,
      };

      await createTask(taskData, habiticaUserId, habiticaApiToken);
      reset();
      onTaskCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register('text', { required: true })} placeholder="Task Title" />
      <Textarea {...register('notes')} placeholder="Notes (optional)" />
      <Controller
        name="type"
        control={control}
        defaultValue="todo"
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To-Do</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="habit">Habit</SelectItem>
              <SelectItem value="reward">Reward</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <Controller
        name="priority"
        control={control}
        defaultValue="1"
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.1">Trivial</SelectItem>
              <SelectItem value="1">Easy</SelectItem>
              <SelectItem value="1.5">Medium</SelectItem>
              <SelectItem value="2">Hard</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Task'}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};
