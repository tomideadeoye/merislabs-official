
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskPriority, TaskType } from '@prisma/client';
import logger from '@/lib/logger';
import { useTasks } from '@/hooks/useTasks';

interface TaskFormProps {
  task?: Task;
  onTaskSavedAction: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskSavedAction }) => {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);
  const [type, setType] = useState<TaskType>(task?.type || TaskType.TODO);
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- Related Links/Contacts State ---
  const [relatedLinks, setRelatedLinks] = useState<string[]>(task?.relatedLinks || []);
  const [newLink, setNewLink] = useState('');
  const [relatedContactIds, setRelatedContactIds] = useState<string[]>(task?.relatedContactIds || []);
  const [newContactId, setNewContactId] = useState('');

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
        relatedLinks,
        relatedContactIds,
      };

      if (task) {
        await updateTask.mutateAsync({ ...task, ...taskData });
      } else {
        await addTask.mutateAsync(taskData);
      }
      onTaskSavedAction();
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

  // --- Handlers for Related Links ---
  const handleAddLink = () => {
    if (newLink.trim() && !relatedLinks.includes(newLink.trim())) {
      setRelatedLinks([...relatedLinks, newLink.trim()]);
      setNewLink('');
    }
  };
  const handleRemoveLink = (link: string) => {
    setRelatedLinks(relatedLinks.filter((l) => l !== link));
  };

  // --- Handlers for Related Contacts ---
  const handleAddContact = () => {
    if (newContactId.trim() && !relatedContactIds.includes(newContactId.trim())) {
      setRelatedContactIds([...relatedContactIds, newContactId.trim()]);
      setNewContactId('');
    }
  };
  const handleRemoveContact = (id: string) => {
    setRelatedContactIds(relatedContactIds.filter((c) => c !== id));
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

      {/* --- Related Links UI --- */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Related Links</label>
        <div className="flex gap-2 mb-2">
          <Input
            type="url"
            placeholder="https://example.com"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <Button type="button" onClick={handleAddLink} disabled={!newLink.trim()}>Add</Button>
        </div>
        <ul className="space-y-1">
          {relatedLinks.map((link) => (
            <li key={link} className="flex items-center gap-2">
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{link}</a>
              <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveLink(link)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Related Contacts UI (by ID for now) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Related Contacts (IDs)</label>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="Contact ID"
            value={newContactId}
            onChange={(e) => setNewContactId(e.target.value)}
          />
          <Button type="button" onClick={handleAddContact} disabled={!newContactId.trim()}>Add</Button>
        </div>
        <ul className="space-y-1">
          {relatedContactIds.map((id) => (
            <li key={id} className="flex items-center gap-2">
              <span className="text-gray-200">{id}</span>
              <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveContact(id)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Task'}
      </Button>
    </form>
  );
};
