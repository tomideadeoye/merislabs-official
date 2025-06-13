"use client";

import React, { useState } from 'react';
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedapp_state';
import { Button, Textarea, Input, Label } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@repo/shared/orion_config';

interface DedicatedAddToMemoryFormProps {
  onMemoryAdded?: () => void;
  initialText?: string;
  initialType?: string;
  initialTags?: string;
  initialSourceId?: string;
}

export const DedicatedAddToMemoryFormComponent: React.FC<DedicatedAddToMemoryFormProps> = ({
  onMemoryAdded,
  initialText = "",
  initialType = "general_note",
  initialTags = "",
  initialSourceId = ""
}) => {
  const [text, setText] = useSessionState(SessionStateKeys.ATM_PASTED_TEXT, initialText);
  const [sourceId, setSourceId] = useSessionState(SessionStateKeys.ATM_SOURCE_ID, initialSourceId);
  const [tags, setTags] = useSessionState(SessionStateKeys.ATM_TAGS_INPUT, initialTags);
  const [type, setType] = useState<string>(initialType);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Checklist state for destinations
  const [saveToVectorDB, setSaveToVectorDB] = useState(true);
  const [saveToNotion, setSaveToNotion] = useState(false);
  const [saveToPostgres, setSaveToPostgres] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !text.trim()) {
      setFeedback({ type: 'error', message: "Text content cannot be empty." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      // Generate a source ID if not provided
      const finalSourceId = sourceId && sourceId.trim() ? sourceId.trim() : `${type}_${new Date().toISOString().replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

      // Prepare the save destinations
      const destinations = {
        vectorDB: saveToVectorDB,
        notion: saveToNotion,
        postgres: saveToPostgres
      };

      // 1. Generate embeddings for the text (only if saving to vector DB)
      let embeddingVector = null;
      if (saveToVectorDB) {
        const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            texts: [text]
          })
        });

        const embeddingData = await embeddingResponse.json();

        // New robust error handling for per-text results
        if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
          // If results array is present, show detailed errors
          if (embeddingData.results && Array.isArray(embeddingData.results)) {
            const failed = embeddingData.results.filter((r: any) => !r.embedding);
            const errorList = failed.map((f: any) => `• "${f.text.substring(0, 50)}..." — ${f.error || 'Unknown error'}`).join('\n');
            throw new Error(
              `Failed to generate embeddings for the following text(s):\n${errorList}`
            );
          }
          throw new Error(embeddingData.error || 'Failed to generate embeddings.');
        }

        // If some succeeded, use the first embedding
        embeddingVector = embeddingData.embeddings[0];
      }

      // 2. Prepare the memory point
      const currentISOTime = new Date().toISOString();
      const tagsArray = tags ? tags.split(',').map((tag: string) => tag.trim().toLowerCase()).filter(Boolean) : [];

      const memoryPayload = {
        text: text,
        source_id: finalSourceId,
        timestamp: currentISOTime,
        indexed_at: currentISOTime,
        type: type,
        tags: [type, ...tagsArray],
      };

      // 3. Save to selected destinations
      let vectorDBResult = null, notionResult = null, postgresResult = null;

      if (saveToVectorDB) {
        const memoryPoint = {
          id: uuidv4(),
          vector: embeddingVector,
          payload: memoryPayload,
        };

        const upsertResponse = await fetch('/api/orion/memory/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            points: [memoryPoint],
            collectionName: ORION_MEMORY_COLLECTION_NAME
          })
        });

        vectorDBResult = await upsertResponse.json();
        if (!vectorDBResult.success) {
          throw new Error(vectorDBResult.error || 'Failed to save to vector DB.');
        }
      }

      if (saveToNotion) {
        // Example: call a Notion API route (implement as needed)
        const notionResponse = await fetch('/api/orion/memory/save-to-notion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            sourceId: finalSourceId,
            type,
            tags: tagsArray,
            timestamp: currentISOTime
          })
        });
        notionResult = await notionResponse.json();
        if (!notionResult.success) {
          throw new Error(notionResult.error || 'Failed to save to Notion.');
        }
      }

      if (saveToPostgres) {
        // Example: call a Postgres API route (implement as needed)
        const pgResponse = await fetch('/api/orion/memory/save-to-postgres', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            sourceId: finalSourceId,
            type,
            tags: tagsArray,
            timestamp: currentISOTime
          })
        });
        postgresResult = await pgResponse.json();
        if (!postgresResult.success) {
          throw new Error(postgresResult.error || 'Failed to save to Postgres.');
        }
      }

      // Success
      setFeedback({
        type: 'success', message: `Successfully added to: ${[
          saveToVectorDB ? 'Vector DB' : null,
          saveToNotion ? 'Notion' : null,
          saveToPostgres ? 'Postgres' : null
        ].filter(Boolean).join(', ')}`
      });
      setText("");
      setSourceId("");
      setTags("");

      if (onMemoryAdded) {
        onMemoryAdded();
      }
    } catch (err: any) {
      console.error("Error adding to memory:", err);
      setFeedback({ type: 'error', message: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  const typeOptions = [
    "general_note",
    "article_snippet",
    "quick_idea",
    "research_finding",
    "book_excerpt",
    "meeting_note",
    "learning",
    "observation"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-1">
          Content to Remember:
        </Label>
        <Textarea
          id="text"
          value={text || ""}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type any information you want Orion to remember..."
          className="w-full min-h-[150px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
          rows={6}
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
            Type:
          </Label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 rounded-md p-2 h-10"
            disabled={isSaving}
          >
            {typeOptions.map(option => (
              <option key={option} value={option}>{option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
            <option value="custom">Custom Type...</option>
          </select>
          {type === "custom" && (
            <Input
              type="text"
              onChange={(e) => setType(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              placeholder="Enter custom type (e.g., meeting_notes)"
              className="mt-2 w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
              disabled={isSaving}
            />
          )}
        </div>

        <div>
          <Label htmlFor="sourceId" className="block text-sm font-medium text-gray-300 mb-1">
            Source ID / Prefix (Optional):
          </Label>
          <Input
            id="sourceId"
            type="text"
            value={sourceId || ""}
            onChange={(e) => setSourceId(e.target.value)}
            placeholder="e.g., project_xyz_notes, article_ref"
            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            disabled={isSaving}
          />
        </div>

        <div>
          <Label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
            Tags (Comma-separated):
          </Label>
          <Input
            id="tags"
            type="text"
            value={tags || ""}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., important, research, idea"
            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="mb-4">
        <Label className="block text-sm font-medium text-gray-300 mb-1">
          Save to:
        </Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={saveToVectorDB}
              onChange={() => setSaveToVectorDB(v => !v)}
              disabled={isSaving}
            />
            <span>Vector DB</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={saveToNotion}
              onChange={() => setSaveToNotion(v => !v)}
              disabled={isSaving}
            />
            <span>Notion</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={saveToPostgres}
              onChange={() => setSaveToPostgres(v => !v)}
              disabled={isSaving}
            />
            <span>Postgres</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          type="submit"
          disabled={isSaving || !text?.trim()}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
          {isSaving ? 'Adding to Memory...' : 'Add to Orion\'s Memory'}
        </Button>
      </div>

      {feedback && (
        <div className={`mt-4 p-3 rounded-md text-sm flex items-start ${feedback.type === 'success' ? 'bg-green-800/30 border border-green-600 text-green-300'
          : 'bg-red-800/30 border border-red-600 text-red-300'
          }`}>
          {feedback.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />}
          <p className="flex-grow">{feedback.message}</p>
        </div>
      )}
    </form>
  );
};
