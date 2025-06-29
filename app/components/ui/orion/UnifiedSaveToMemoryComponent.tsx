/**
 * @file UnifiedSaveToMemoryComponent.tsx
 * @description A reusable, standalone React component for the "save to memory" feature.
 * This component consolidates all logic from previous implementations into a single,
 * configurable, and extensible component. It supports various props for initial data,
 * display modes, and callbacks, providing a consistent UI/UX for adding memories
 * across the application.
 *
 * @props
 *   - `initialText` (string, optional): The initial text content for the memory.
 *   - `initialType` (string, optional): The initial type of the memory (e.g., "note", "strategy").
 *   - `initialTags` (string, optional): A comma-separated string of initial tags.
 *   - `initialSourceId` (string, optional): The initial source ID for the memory.
 *   - `onMemoryAdded` (function, optional): A callback function to be executed after a memory is successfully added.
 *   - `displayMode` ('full' | 'minimal', optional): The display mode for the component. 'full' shows all fields, while 'minimal' shows a more compact version.
 *
 * @usage
 *   <UnifiedSaveToMemoryComponent
 *     initialText="This is a memory."
 *     initialType="note"
 *     initialTags="project-x, important"
 *     onMemoryAdded={() => console.log('Memory added!')}
 *     displayMode="full"
 *   />
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Brain, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { MemoryPoint, MemoryPayload } from '@/lib/types';
import logger from '@/lib/logger';
import { MultiSelect } from '@/components/ui/multi-select';
import { useToast } from '@/components/ui/use-toast';
import apiClient from '@/lib/apiClient';

interface UnifiedSaveToMemoryComponentProps {
  initialText?: string;
  initialType?: string;
  initialTags?: string;
  initialSourceId?: string;
  onMemoryAdded?: () => void;
  displayMode?: 'full' | 'minimal';
}

export const UnifiedSaveToMemoryComponent: React.FC<UnifiedSaveToMemoryComponentProps> = ({
  initialText = '',
  initialType = 'general_note',
  initialTags = '',
  initialSourceId = '',
  onMemoryAdded,
  displayMode = 'full',
}) => {
  const [text, setText] = useState<string>(initialText);
  const [sourceId, setSourceId] = useState<string>(initialSourceId);
  const [tags, setTags] = useState<string[]>(initialTags ? initialTags.split(',').map((t) => t.trim()) : []);
  const [type, setType] = useState<string>(initialType);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          setText(fileContent);
        };
        reader.onerror = () => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to read file.',
          });
          setSelectedFileName(null);
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Unsupported file type. Please upload a text-based file (e.g., .txt, .md, .json).',
        });
        setSelectedFileName(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Text content cannot be empty.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const finalSourceId =
        sourceId && sourceId.trim()
          ? sourceId.trim()
          : `${type}_${new Date().toISOString().replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

      const response = await apiClient.post('/api/orion/memory/add-memory', {
        text,
        source_id: finalSourceId,
        type,
        tags,
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Memory added successfully!',
        });
        setText('');
        setTags([]);
        setSourceId('');
        if (onMemoryAdded) {
          onMemoryAdded();
        }
      } else {
        throw new Error(response.data.error || 'Failed to save memory.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to add memory: ${errorMessage}`,
      });
      logger.error('[UNIFIED_SAVE_TO_MEMORY][SUBMIT_ERROR]', { error: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  if (displayMode === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a quick memory..."
          className="flex-grow bg-gray-700 border-gray-600 text-gray-200"
          disabled={isSaving}
        />
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </form>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <Brain className="w-6 h-6 mr-2 text-blue-400" /> Add to Orion&apos;s Memory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="memoryText" className="block text-sm font-medium text-gray-300 mb-1">
            Memory Content (Paste or Upload File):
          </Label>
          <Input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            className="mb-2 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            accept=".txt,.md,.json,text/*"
            disabled={isSaving}
          />
          {selectedFileName && (
            <p className="text-xs text-gray-400 mb-2">
              Uploaded: {selectedFileName}{' '}
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-red-400 hover:text-red-300"
                onClick={() => {
                  setSelectedFileName(null);
                  setText(initialText);
                  (document.getElementById('fileUpload') as HTMLInputElement).value = '';
                }}
              >
                Remove
              </Button>
            </p>
          )}
          <Textarea
            id="memoryText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to add to Orion's memory..."
            className="w-full min-h-[150px] bg-gray-700 border-gray-600 text-gray-200"
            rows={6}
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="memoryType" className="block text-sm font-medium text-gray-300 mb-1">
              Memory Type:
            </Label>
            <Input
              id="memoryType"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., meeting_note, idea"
              className="w-full bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="memoryTags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags:
            </Label>
            <MultiSelect
              id="memory-tags"
              placeholder="Select or create tags..."
              onChange={(selected: string[]) => setTags(selected)}
              // You might need to fetch and provide options here
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sourceId" className="block text-sm font-medium text-gray-300 mb-1">
            Source ID (Optional):
          </Label>
          <Input
            id="sourceId"
            type="text"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            placeholder="e.g., Notion page ID, file name"
            className="w-full bg-gray-700 border-gray-600 text-gray-200"
            disabled={isSaving}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding to Memory...
            </>
          ) : (
            'Add to Memory'
          )}
        </Button>
      </form>
    </div>
  );
};

export default UnifiedSaveToMemoryComponent;
