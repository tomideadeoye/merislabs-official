"use client";

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

interface AddToMemoryFormProps {
  onMemoryAdded?: () => void;
}

export const AddToMemoryForm: React.FC<AddToMemoryFormProps> = ({ onMemoryAdded }) => {
  const [text, setText] = useSessionState(SessionStateKeys.ATM_PASTED_TEXT, "");
  const [sourceId, setSourceId] = useSessionState(SessionStateKeys.ATM_SOURCE_ID, "");
  const [tags, setTags] = useSessionState(SessionStateKeys.ATM_TAGS_INPUT, "");
  const [type, setType] = useState<string>("general_note");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      
      // 1. Generate embeddings for the text
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
      
      if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
        throw new Error(embeddingData.error || 'Failed to generate embeddings.');
      }

      const embeddingVector = embeddingData.embeddings[0];
      
      // 2. Prepare the memory point
      const currentISOTime = new Date().toISOString();
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [];
      
      const memoryPayload = {
        text: text,
        source_id: finalSourceId,
        timestamp: currentISOTime,
        indexed_at: currentISOTime,
        type: type,
        tags: [type, ...tagsArray],
      };

      const memoryPoint = {
        id: uuidv4(),
        vector: embeddingVector,
        payload: memoryPayload,
      };
      
      // 3. Upsert the memory point into Qdrant
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

      const upsertData = await upsertResponse.json();
      
      if (!upsertData.success) {
        throw new Error(upsertData.error || 'Failed to save to memory.');
      }

      // Success
      setFeedback({ type: 'success', message: `Successfully added to memory with ID: ${finalSourceId}` });
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
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button 
          type="submit" 
          disabled={isSaving || !text?.trim()} 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4"/>}
          {isSaving ? 'Adding to Memory...' : 'Add to Orion\'s Memory'}
        </Button>
      </div>

      {feedback && (
        <div className={`mt-4 p-3 rounded-md text-sm flex items-start ${
            feedback.type === 'success' ? 'bg-green-800/30 border border-green-600 text-green-300' 
                                     : 'bg-red-800/30 border border-red-600 text-red-300'
        }`}>
            {feedback.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />}
            <p className="flex-grow">{feedback.message}</p>
        </div>
      )}
    </form>
  );
};