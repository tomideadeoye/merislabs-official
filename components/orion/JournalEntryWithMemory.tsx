'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { JournalEntryNotionInput, MemoryPayload, MemoryPoint, EmotionalLogEntry, LogEmotionRequestBody } from '@/types/orion';
import { SaveOptionsButton, SaveResult } from '@/components/orion/SaveOptionsButton';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { Label } from '@/components/ui/label';

export function JournalEntryWithMemory() {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>(['journal', 'journal_entry']);
  const [tagInput, setTagInput] = useState('');
  const [isOverallSubmitting, setIsOverallSubmitting] = useState(false);
  const [overallError, setOverallError] = useState<string | null>(null);
  const [overallSuccess, setOverallSuccess] = useState<string | null>(null);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    if (!['journal', 'journal_entry'].includes(tagToRemove)) {
      setTags(tags.filter(tag => tag !== tagToRemove));
    }
  }, [tags]);

  const handleSaveToNotionCallback = useCallback(async (dataToSave: any): Promise<Omit<SaveResult, 'serviceName'>> => {
    const notionPayload: JournalEntryNotionInput = {
      title: dataToSave.title || `Journal Entry - ${new Date(dataToSave.date).toLocaleDateString()}`,
      date: dataToSave.date instanceof Date ? dataToSave.date : new Date(dataToSave.date),
      content: dataToSave.content,
    };
    try {
      const response = await fetch('/api/orion/notion/journal/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notionPayload),
      });
      const result = await response.json();

      if (result.success) {
        return { success: true, message: "Saved to Notion.", data: result.entry };
      }
      console.error('Notion Save Error:', result.error);
      return { success: false, error: result.error || 'Failed to save to Notion.' };
    } catch (err: any) {
      console.error('Notion Save Exception:', err);
      return { success: false, error: err.message || 'Error saving to Notion.' };
    }
  }, []);

  const handleSaveToQdrantCallback = useCallback(async (dataToSave: any): Promise<Omit<SaveResult, 'serviceName'>> => {
    const { content, title, date, metadata } = dataToSave;
    if (!content) return { success: false, error: "No content to save to Qdrant." };

    const currentISOTime = new Date().toISOString();
    const entryDate = date instanceof Date ? date : new Date(date);
    const entryTimestamp = entryDate.toISOString();

    const sourceId = `journal_${entryDate.toISOString().replace(/[:.-]/g, '')}_${uuidv4().substring(0,8)}`;

    try {
      const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ texts: [content] })
      });
      const embeddingData = await embeddingResponse.json();

      if (!embeddingData.success || !embeddingData.embeddings?.[0]) {
        console.error('Qdrant Embeddings Error:', embeddingData.error);
        return { success: false, error: embeddingData.error || "Embedding generation failed for Qdrant." };
      }
      const vector = embeddingData.embeddings[0];

      const memoryPayload: MemoryPayload = {
        text: content,
        source_id: sourceId,
        timestamp: entryTimestamp,
        indexed_at: currentISOTime,
        type: "journal_entry",
        title: title || content.substring(0, 50) + '...',
        ...(metadata?.mood && { mood: metadata.mood }),
        ...(metadata?.tags && metadata.tags.length > 0 && { tags: metadata.tags }),
      };
      const memoryPoint: MemoryPoint = { id: uuidv4(), vector, payload: memoryPayload };

      const upsertResponse = await fetch('/api/orion/memory/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              points: [memoryPoint],
              collectionName: ORION_MEMORY_COLLECTION_NAME,
          })
      });
      const upsertData = await upsertResponse.json();

      if (upsertData.success) {
        return { success: true, message: "Saved to Qdrant (Vector Memory).", data: { sourceId: sourceId, qdrantId: memoryPoint.id } };
      }
      console.error('Qdrant Upsert Error:', upsertData.error);
      return { success: false, error: upsertData.error || "Failed to save to Qdrant." };
    } catch (err: any) {
      console.error('Qdrant Save Exception:', err);
      return { success: false, error: err.message || "Error saving to Qdrant." };
    }
  }, []);

  const handleSaveToSQLiteCallback = useCallback(async (dataToSave: any): Promise<Omit<SaveResult, 'serviceName'>> => {
    const { content, title, date, metadata } = dataToSave;
    if (!metadata?.mood && (!metadata?.tags || metadata.tags.length === 0)) {
        return { success: true, message: "No mood or tags provided, skipping SQLite log." };
    }

    const entryDate = date instanceof Date ? date : new Date(date);
    const entryTimestamp = entryDate.toISOString();

    const emotionalLogPayload: LogEmotionRequestBody = {
      primaryEmotion: metadata?.mood || "Neutral",
      contextualNote: `Journal: ${title || 'Untitled'}\n---\n${content.substring(0, Math.min(content.length, 500))}...`,
      triggers: metadata?.tags || [],
      entryTimestamp: entryTimestamp,
    };

    try {
      const response = await fetch('/api/orion/emotions/log', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(emotionalLogPayload)
      });
      const result = await response.json();

      if (result.success) {
        return { success: true, message: "Logged emotion/tags to SQLite.", data: result.entry };
      }
       console.error('SQLite Save Error:', result.error);
      return { success: false, error: result.error || "Failed to log emotion/tags to SQLite." };
    } catch (err: any) {
      console.error('SQLite Save Exception:', err);
      return { success: false, error: err.message || "Error saving to SQLite." };
    }
  }, []);

  const handleCopyToClipboardCallback = useCallback(async (dataToSave: any): Promise<Omit<SaveResult, 'serviceName'>> => {
    const textToCopy = dataToSave.content || JSON.stringify(dataToSave);
    if (!textToCopy) return { success: false, error: "No content to copy to clipboard." };

    try {
      await navigator.clipboard.writeText(textToCopy);
      return { success: true, message: "Copied to clipboard!" };
    } catch (err: any) {
      console.error('Clipboard Copy Exception:', err);
      return { success: false, error: "Failed to copy to clipboard. Ensure you are in a secure context." };
    }
  }, []);

  const handleOverallProcessingStart = useCallback(() => {
    setIsOverallSubmitting(true);
    setOverallError(null);
    setOverallSuccess(null);
  }, []);

  const handleOverallSaveComplete = useCallback((results: SaveResult[]) => {
    setIsOverallSubmitting(false);
    const successfulServices = results.filter(r => r.success).map(r => r.serviceName);
    const failedServices = results.filter(r => !r.success).map(r => r.serviceName);

    console.log('Save Actions Complete:', results);

    if (successfulServices.length > 0) {
      setOverallSuccess(`Successfully processed for: ${successfulServices.join(', ')}.`);

      if (successfulServices.some(s => ['Notion', 'Qdrant (Memory)', 'SQLite (Log)'].includes(s))) {
        setText('');
        setMood('');
        setTags(['journal', 'journal_entry']);
        setTagInput('');
         setTimeout(() => setOverallSuccess(null), 5000);
      }
    }
    if (failedServices.length > 0) {
      setOverallError(`Failed for: ${failedServices.join(', ')}. Check console for details.`);
        setTimeout(() => setOverallError(null), 7000);
    } else if (successfulServices.length === 0) {
         setOverallError("No actions were selected or completed.");
          setTimeout(() => setOverallError(null), 7000);
    }
  }, []);

  const journalDataForButton = {
    title: text.trim().split(' ').slice(0, 5).join(' ') || `Journal Entry - ${new Date().toLocaleDateString()}`,
    content: text.trim(),
    date: new Date(),
    metadata: {
        mood: mood.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
    }
  };

  const isSubmitDisabled = isOverallSubmitting || !text.trim();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900 text-gray-200 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-sky-400">New Journal Entry</CardTitle>
        <CardDescription className="text-gray-400">
          Capture your thoughts, feelings, and insights. Select where you'd like to save this entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind today, my love?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-sky-500 focus:border-sky-500"
            disabled={isOverallSubmitting}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="mood" className="text-gray-400">Mood (Optional)</Label>
                <Input
                    id="mood"
                    placeholder="How are you feeling?"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                    disabled={isOverallSubmitting}
                />
            </div>
            <div>
                <Label htmlFor="tagInput" className="text-gray-400">Tags (Optional)</Label>
                <div className="flex gap-2">
                    <Input
                    id="tagInput"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                        }
                    }}
                    className="flex-1 bg-gray-800 border-gray-600"
                    disabled={isOverallSubmitting}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim() || isOverallSubmitting} className="text-gray-300 border-gray-600 hover:bg-gray-700">
                    Add
                    </Button>
                </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300 hover:bg-gray-600 items-center">
                {tag}
                {!['journal', 'journal_entry'].includes(tag) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 text-xs text-gray-500 hover:text-red-400"
                    disabled={isOverallSubmitting}
                    aria-label={`Remove tag ${tag}`}
                  >
                    &times;
                  </button>
                )}
              </Badge>
            ))}
          </div>

          {overallError && (
            <div className="text-red-400 text-sm p-2 bg-red-900/30 border border-red-700 rounded flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2"/> {overallError}
            </div>
          )}
          {overallSuccess && (
            <div className="text-green-400 text-sm p-2 bg-green-900/30 border border-green-700 rounded flex items-center">
                <CheckCircle className="h-4 w-4 mr-2"/> {overallSuccess}
            </div>
          )}

          <SaveOptionsButton
            data={journalDataForButton}
            onSaveToNotion={handleSaveToNotionCallback}
            onSaveToQdrant={handleSaveToQdrantCallback}
            onSaveToSQLite={handleSaveToSQLiteCallback}
            onCopyToClipboard={handleCopyToClipboardCallback}
            onProcessingStart={handleOverallProcessingStart}
            onProcessingComplete={handleOverallSaveComplete}
            buttonText="Process Journal Entry"
            disabled={isSubmitDisabled}
            availableOptions={{
                notion: true,
                qdrant: true,
                sqlite: true,
                clipboard: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
