'use client';

import React, { useState } from 'react';
import { useMemory } from '@shared/hooks/useMemory';
import { Textarea, Input, Button, Badge } from '@repo/ui';
import { X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MemoryInputProps {
  type: string;
  defaultTags?: string[];
  onSuccess?: () => void;
}

export function MemoryInput({ type, defaultTags = [], onSuccess }: MemoryInputProps) {
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [tagInput, setTagInput] = useState('');
  const { add, isLoading, error } = useMemory();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const sourceId = uuidv4();
      const success = await add(text, sourceId, type, tags);

      if (success) {
        setText('');
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={`Enter ${type} text...`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[150px]"
      />

      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add tag..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTag}
          disabled={!tagInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <Button type="submit" disabled={isLoading || !text.trim()}>
        {isLoading ? 'Saving...' : 'Save to Memory'}
      </Button>
    </form>
  );
}
