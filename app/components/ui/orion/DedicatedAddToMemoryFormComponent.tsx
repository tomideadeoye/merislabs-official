'use client';

import React, { useState } from 'react';
// GOAL: This component allows users to add text content to Orion's memory system,
// with options to save to a vector database (Qdrant).
// It handles embedding generation, data structuring, and API calls to
// persist memory points across selected destinations.
//
// GOAL OF FILE|FEATURES|FUNCTIONS: Allows users to add text content to Orion's memory system, with options to save to a vector database (Qdrant), Notion, and PostgreSQL. Handles embedding generation, data structuring, and API calls.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/DedicatedAddToMemoryFormComponent.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Uses `useSessionStateStore` (`@/state/sessionState`) for persistent form state across sessions.
// - Calls backend API routes: `/api/orion/memory/generate-embeddings` (POST) and `/api/orion/memory/upsert` (POST).
//   - `/api/orion/memory/save-to-notion`: Backend API for saving to Notion (requires implementation).
//   - `/api/orion/memory/save-to-postgres`: Backend API for saving to PostgreSQL (requires implementation).
//   - `@/components/ui` components: `Button`, `Textarea`, `Input`, `Label` from the lib UI library.
//   - `lucide-react`: For icons like `Loader2`, `AlertTriangle`, `CheckCircle`, `Brain`.
//   - `uuid`: For generating unique IDs for memory points.
// Opportunties for improvement or consolidation.
// Note if any:
// - This component is a standalone form for adding memories.
// - It integrates directly with Orion's backend memory APIs.
// - The UI is designed for clarity and ease of use in memory ingestion.

import { useSessionStateStore } from '@/state/sessionState';
import { Button, Textarea, Input, Label } from '@/components/ui';
import { Loader2, Brain } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import { MemoryPoint, MemoryPayload } from '@/lib/types';
import { SessionStateKeys } from '@/lib/constants';

interface DedicatedAddToMemoryFormProps {
  onMemoryAdded?: () => void;
  initialText?: string;
  initialType?: string;
  initialTags?: string;
  initialSourceId?: string;
}

export const DedicatedAddToMemoryFormComponent: React.FC<DedicatedAddToMemoryFormProps> = ({
  onMemoryAdded,
  initialText = '',
  initialType = 'general_note',
  initialTags = '',
  initialSourceId = '',
}) => {
  const { setSessionValue, getSessionValue } = useSessionStateStore();

  const [text, setText] = useState<string>(
    typeof getSessionValue(SessionStateKeys.ATM_PASTED_TEXT) === 'string'
      ? (getSessionValue(SessionStateKeys.ATM_PASTED_TEXT) as string)
      : initialText
  );
  const [sourceId, setSourceId] = useState<string>(
    typeof getSessionValue(SessionStateKeys.ATM_SOURCE_ID) === 'string'
      ? (getSessionValue(SessionStateKeys.ATM_SOURCE_ID) as string)
      : initialSourceId
  );
  const [tags, setTags] = useState<string>(
    typeof getSessionValue(SessionStateKeys.ATM_TAGS_INPUT) === 'string'
      ? (getSessionValue(SessionStateKeys.ATM_TAGS_INPUT) as string)
      : initialTags
  );

  // Local states for component specific UI/logic
  const [type, setType] = useState<string>(initialType);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Checklist state for destinations
  const [saveToVectorDB, setSaveToVectorDB] = useState(true);
  const [saveToNotion, setSaveToNotion] = useState(false);
  const [saveToPostgres, setSaveToPostgres] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Update session state when local state changes
  React.useEffect(() => {
    setSessionValue(SessionStateKeys.ATM_PASTED_TEXT, text);
  }, [text, setSessionValue]);

  React.useEffect(() => {
    setSessionValue(SessionStateKeys.ATM_SOURCE_ID, sourceId);
  }, [sourceId, setSessionValue]);

  React.useEffect(() => {
    setSessionValue(SessionStateKeys.ATM_TAGS_INPUT, tags);
  }, [tags, setSessionValue]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md')) {
        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result as string;
          setText(fileContent);
          setFeedback(null); // Clear previous feedback
        };
        reader.onerror = () => {
          setFeedback({ type: 'error', message: 'Failed to read file.' });
          setSelectedFileName(null);
        };
        reader.readAsText(file);
      } else {
        setFeedback({
          type: 'error',
          message: 'Unsupported file type. Please upload a text-based file (e.g., .txt, .md, .json).',
        });
        setSelectedFileName(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !text.trim()) {
      setFeedback({ type: 'error', message: 'Text content cannot be empty.' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      // Generate a source ID if not provided
      const finalSourceId =
        sourceId && sourceId.trim()
          ? sourceId.trim()
          : `${type}_${new Date().toISOString().replace(/[:.]/g, '-')}_${uuidv4().substring(0, 8)}`;

      // 1. Generate embeddings for the text (only if saving to vector DB)
      let embeddingVector = null;
      if (saveToVectorDB) {
        const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: [text],
          }),
        });

        interface EmbeddingResult {
          text: string;
          embedding?: number[];
          error?: string;
        }

        const embeddingData = await embeddingResponse.json();

        // New robust error handling for per-text results
        if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
          // If results array is present, show detailed errors
          if (embeddingData.results && Array.isArray(embeddingData.results)) {
            const failed = embeddingData.results.filter((r: EmbeddingResult) => !r.embedding);
            const errorList = failed
              .map((f: EmbeddingResult) => `• "${f.text.substring(0, 50)}..." — ${f.error || 'Unknown error'}`)
              .join('\n');
            throw new Error(
              `Failed to generate embeddings for the following text(s):\n${errorList}` +
                (embeddingData.error ? `\nGeneral Error: ${embeddingData.error}` : '')
            );
          }
          throw new Error(embeddingData.error || 'Failed to generate embeddings.');
        }

        // If some succeeded, use the first embedding
        embeddingVector = embeddingData.embeddings[0];
      }

      // 2. Prepare the memory point
      const currentISOTime = new Date().toISOString();
      const tagsArray = tags
        ? tags
            .split(',')
            .map((tag: string) => tag.trim().toLowerCase())
            .filter(Boolean)
        : [];

      const memoryPayload: MemoryPayload = {
        text: text,
        source_id: finalSourceId,
        timestamp: currentISOTime,
        indexedAt: currentISOTime,
        type: type,
        tags: [type, ...tagsArray],
      };

      // 3. Save to selected destinations
      let vectorDBResult = null,
        notionResult = null,
        postgresResult = null;

      if (saveToVectorDB) {
        const memoryPoint: MemoryPoint = {
          id: uuidv4(),
          vector: embeddingVector!,
          payload: memoryPayload,
        };

        const upsertResponse = await fetch('/api/orion/memory/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points: [memoryPoint],
            collectionName: ORION_MEMORY_COLLECTION_NAME,
          }),
        });

        const result = await upsertResponse.json();
        vectorDBResult = result;
        if (!vectorDBResult.success) {
          throw new Error(vectorDBResult.error || 'Failed to save to vector DB.');
        }
      }

      if (saveToNotion) {
        // Logic to save to Notion
        const notionSaveResponse = await fetch('/api/orion/memory/save-to-notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memoryData: memoryPayload }),
        });
        notionResult = await notionSaveResponse.json();
        if (!notionResult.success) {
          throw new Error(notionResult.error || 'Failed to save to Notion.');
        }
      }

      if (saveToPostgres) {
        // Logic to save to PostgreSQL
        const postgresSaveResponse = await fetch('/api/orion/memory/save-to-postgres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memoryData: memoryPayload }),
        });
        postgresResult = await postgresSaveResponse.json();
        if (!postgresResult.success) {
          throw new Error(postgresResult.error || 'Failed to save to PostgreSQL.');
        }
      }

      const successMessages = [];
      if (saveToVectorDB && vectorDBResult?.success) successMessages.push('Vector DB');
      if (saveToNotion && notionResult?.success) successMessages.push('Notion');
      if (saveToPostgres && postgresResult?.success) successMessages.push('PostgreSQL');

      if (successMessages.length > 0) {
        setFeedback({
          type: 'success',
          message: `Memory added successfully to: ${successMessages.join(', ')}!`,
        });
        setText('');
        setTags('');
        setSourceId('');
        if (onMemoryAdded) {
          onMemoryAdded();
        }
      } else {
        setFeedback({
          type: 'error',
          message: 'No destinations selected or all selected destinations failed to save.',
        });
      }
    } catch (error: unknown) {
      console.error('Error adding memory:', error);
      setFeedback({
        type: 'error',
        message: `Failed to add memory: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <Brain className="w-6 h-6 mr-2 text-blue-400" /> Add to Orion&apos;s Memory
      </h2>

      {feedback && (
        <div
          className={`p-3 rounded-md text-sm mb-4 ${feedback.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}
        >
          {feedback.message}
        </div>
      )}

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
            placeholder="Enter text to add to Orion's memory (e.g., a meeting note, an idea, a key takeaway from an article)"
            className="w-full min-h-[150px] md:min-h-[200px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
            rows={6}
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="memoryType" className="block text-sm font-medium text-gray-300 mb-1">
              Memory Type (e.g., meeting_note, idea, learning):
            </Label>
            <Input
              id="memoryType"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., meeting_note, idea, learning"
              className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="memoryTags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags (comma-separated):
            </Label>
            <Input
              id="memoryTags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., project-x, client-y, personal-growth"
              className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
              disabled={isSaving}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="sourceId" className="block text-sm font-medium text-gray-300 mb-1">
            Source ID (Optional, for linking to original source, e.g., Notion page ID):
          </Label>
          <Input
            id="sourceId"
            type="text"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            placeholder="e.g., Notion page ID, URL, internal document ID"
            className="w-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-md p-3"
            disabled={isSaving}
          />
        </div>

        <div className="flex flex-col space-y-2 text-gray-400">
          <p className="text-sm font-semibold text-gray-300">Save to:</p>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveToVectorDB"
              checked={saveToVectorDB}
              onChange={(e) => setSaveToVectorDB(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              disabled={isSaving}
              title="Save to Vector Database (Qdrant)"
            />
            <Label
              htmlFor="saveToVectorDB"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Vector Database (Qdrant) - For semantic search and insights
            </Label>
          </div>
          <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              id="saveToNotion"
              checked={saveToNotion}
              onChange={(e) => setSaveToNotion(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              disabled={true} // Not yet implemented in backend API
              title="Save to Notion"
            />
            <Label
              htmlFor="saveToNotion"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Notion (Content Management) - Not yet implemented
            </Label>
          </div>
          <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
            <input
              type="checkbox"
              id="saveToPostgres"
              checked={saveToPostgres}
              onChange={(e) => setSaveToPostgres(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              disabled={true} // Not yet implemented in backend API
              title="Save to PostgreSQL"
            />
            <Label
              htmlFor="saveToPostgres"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PostgreSQL (Structured Data) - Not yet implemented
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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

export default DedicatedAddToMemoryFormComponent;
