'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, Save, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MEMORY_TYPES } from '@/lib/orion_config';

export function JournalEntryWithMemory() {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>(['journal', 'journal_entry']);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    if (!text.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const sourceId = uuidv4();
      const response = await fetch('/api/orion/memory/index-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          sourceId,
          type: MEMORY_TYPES.JOURNAL_ENTRY,
          tags,
          additionalFields: {
            mood: mood || undefined
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setText('');
        setMood('');
        setTags(['journal', 'journal_entry']);
      } else {
        setError(data.error || 'Failed to save journal entry');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
        <CardDescription>
          Write your thoughts and they'll be saved to memory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
            disabled={isSubmitting}
          />

          <div className="flex gap-2">
            <Input
              placeholder="How are you feeling?"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-xs"
                  disabled={isSubmitting}
                >
                  ×
                </button>
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
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">Journal entry saved successfully!</div>
          )}

          <Button type="submit" disabled={isSubmitting || !text.trim()} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Journal Entry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}