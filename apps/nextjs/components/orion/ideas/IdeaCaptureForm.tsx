"use client";

import React, { useState } from 'react';
import { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import type { Idea } from '@repo/shared';

interface IdeaCaptureFormProps {
  onIdeaCaptured?: (idea: Idea) => void;
  className?: string;
}

export const IdeaCaptureForm: React.FC<IdeaCaptureFormProps> = ({
  onIdeaCaptured,
  className
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for your idea");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Process tags
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const response = await fetch('/api/orion/ideas/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          briefDescription: description,
          tags: tagArray
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setTags("");

        if (onIdeaCaptured && data.idea) {
          onIdeaCaptured(data.idea);
        }
      } else {
        throw new Error(data.error || 'Failed to capture idea');
      }
    } catch (err: any) {
      console.error('Error capturing idea:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          Capture New Idea
        </CardTitle>
        <CardDescription className="text-gray-400">
          Quickly capture your creative spark before it fades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your idea called?"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Brief Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in a few sentences..."
              className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-gray-300">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., project, business, creative, tech"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Capture Idea
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Idea captured successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
