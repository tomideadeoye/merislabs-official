"use client";

import React, { useState } from 'react';
import type { ScoredMemoryPoint } from '@/types/orion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, Smile, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JournalEntryDisplayProps {
  entry: ScoredMemoryPoint;
}

export const JournalEntryDisplay: React.FC<JournalEntryDisplayProps> = ({ entry }) => {
  const { payload, score } = entry;
  const entryDate = new Date(payload.timestamp);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  const fetchReflection = async () => {
    if (reflection) {
      setShowReflection(!showReflection);
      return;
    }

    setIsLoadingReflection(true);
    try {
      // Search for reflection with the original_entry_id matching this entry's source_id
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "journal_reflection" } },
              { key: "original_entry_id", match: { value: payload.source_id } }
            ]
          },
          limit: 1
        })
      });

      const data = await response.json();
      if (data.success && data.results && data.results.length > 0) {
        setReflection(data.results[0].payload.text);
        setShowReflection(true);
      } else {
        // If no reflection found, generate one now
        const llmResponse = await fetch('/api/orion/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin-token'
          },
          body: JSON.stringify({
            requestType: "JOURNAL_REFLECTION",
            primaryContext: `Analyze the following journal entry and provide thoughtful insights, patterns, and reflections. Be supportive, insightful, and help the user gain deeper understanding of their thoughts and feelings:\n\n${payload.text}`,
            mood: payload.mood || undefined,
            temperature: 0.7,
            maxTokens: 500
          })
        });

        const llmData = await llmResponse.json();
        if (llmData.success && llmData.content) {
          setReflection(llmData.content);
          setShowReflection(true);
          
          // Store the reflection in memory
          const reflectionSourceId = `reflection_${payload.source_id}`;
          const reflectionPayload = {
            text: llmData.content,
            source_id: reflectionSourceId,
            original_entry_id: payload.source_id,
            timestamp: new Date().toISOString(),
            indexed_at: new Date().toISOString(),
            type: "journal_reflection",
            tags: ["reflection", "journal_reflection", ...(payload.tags || [])],
          };

          // Generate embedding for the reflection
          const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer admin-token'
            },
            body: JSON.stringify({
              texts: [llmData.content]
            })
          });

          const embeddingData = await embeddingResponse.json();
          if (embeddingData.success && embeddingData.embeddings) {
            // Store the reflection in memory
            await fetch('/api/orion/memory/upsert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin-token'
              },
              body: JSON.stringify({
                points: [{
                  id: crypto.randomUUID(),
                  vector: embeddingData.embeddings[0],
                  payload: reflectionPayload
                }]
              })
            });
          }
        } else {
          setReflection("Unable to generate reflection for this entry.");
          setShowReflection(true);
        }
      }
    } catch (error) {
      console.error("Error fetching reflection:", error);
      setReflection("Error loading reflection.");
      setShowReflection(true);
    } finally {
      setIsLoadingReflection(false);
    }
  };

  return (
    <Card className="mb-4 bg-gray-800 border-gray-700 hover:shadow-lg hover:border-blue-600/50 transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg text-blue-400 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Journal Entry
        </CardTitle>
        <CardDescription className="text-xs text-gray-500 flex items-center space-x-4">
          <span className="flex items-center">
            <CalendarDays className="mr-1 h-3 w-3" />
            {entryDate.toLocaleDateString()} ({entryDate.toLocaleTimeString()})
          </span>
          {payload.mood && (
            <span className="flex items-center">
                <Smile className="mr-1 h-3 w-3" />
                Mood: <Badge variant="secondary" className="ml-1 bg-gray-700 text-gray-300">{payload.mood}</Badge>
            </span>
          )}
          <span>Score: {score.toFixed(4)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
          {payload.text}
        </pre>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300"
            onClick={fetchReflection}
            disabled={isLoadingReflection}
          >
            {isLoadingReflection ? (
              <>Loading reflection...</>
            ) : showReflection ? (
              <>Hide AI Reflection <ChevronUp className="ml-1 h-3 w-3" /></>
            ) : (
              <>Show AI Reflection <ChevronDown className="ml-1 h-3 w-3" /></>
            )}
          </Button>
        </div>
        
        {showReflection && reflection && (
          <div className="mt-3 p-3 bg-gray-700/50 rounded-md border border-gray-600">
            <h4 className="text-sm font-medium text-blue-400 mb-2">AI Reflection:</h4>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{reflection}</p>
          </div>
        )}
        
        {payload.tags && payload.tags.filter(tag => tag !== "journal" && tag !== "journal_entry").length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center">
                <Tag className="mr-1 h-3 w-3" />
                Tags:
            </h4>
            <div className="flex flex-wrap gap-1">
              {payload.tags.filter(tag => tag !== "journal" && tag !== "journal_entry").map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs border-sky-500 text-sky-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};