"use client";

import React, { useState, useEffect } from 'react';
import type { ScoredMemoryPoint, JournalEntryNotionInput } from '@shared/types/orion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, Smile, MessageSquare, ChevronDown, ChevronUp, ListTodo, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';
import { AddTaskFromReflection } from './AddTaskFromReflection';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/app_state';

interface JournalEntryDisplayProps {
  entry: JournalEntryNotionInput;
  initialReflection?: string;
}

interface ActionReflection {
  text: string;
  taskText: string;
  timestamp: string;
}

export const JournalEntryDisplay: React.FC<JournalEntryDisplayProps> = ({ entry, initialReflection }) => {
  // All hooks must be called unconditionally at the top level
  const [showReflection, setShowReflection] = useState(!!initialReflection);
  const [reflection, setReflection] = useState<string | null>(initialReflection || null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);
  const [actionReflections, setActionReflections] = useState<ActionReflection[]>([]);
  const [isLoadingActionReflections, setIsLoadingActionReflections] = useState(false);
  const [showActionReflections, setShowActionReflections] = useState(false);
  const [userId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [apiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  // Check for reflection when component mounts if not provided initially
  useEffect(() => {
    if (entry && !reflection && !isLoadingReflection && entry.notionPageId) {
      checkForExistingReflection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, reflection, isLoadingReflection]);

  if (!entry) {
    return null;
  }
  const { content, date, mood, tags, notionPageId } = entry;
  const entryDate = new Date(date);

  const checkForExistingReflection = async () => {
    if (!notionPageId) return;

    try {
      // Search for reflection with the original_entry_id matching this entry's notionPageId
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "journal_reflection" } },
              { key: "original_entry_id", match: { value: notionPageId } }
            ]
          },
          limit: 1
        })
      });

      const data = await response.json();
      if (data.success && data.results && data.results.length > 0) {
        setReflection(data.results[0].payload.text);
        // Don't show reflection automatically, let user click to show it
      }
    } catch (error) {
      console.error("Error checking for existing reflection:", error);
    }
  };

  const fetchReflection = async () => {
    if (reflection) {
      setShowReflection(!showReflection);
      return;
    }

    if (!notionPageId) {
      setReflection("Cannot generate reflection: Missing entry ID.");
      setShowReflection(true);
      return;
    }

    setIsLoadingReflection(true);
    try {
      // Search for reflection with the original_entry_id matching this entry's notionPageId
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "journal_reflection" } },
              { key: "original_entry_id", match: { value: notionPageId } }
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestType: "JOURNAL_REFLECTION",
            primaryContext: `Analyze the following journal entry and provide thoughtful insights, patterns, and reflections. Be supportive, insightful, and help the user gain deeper understanding of their thoughts and feelings:\n\n${content}`,
            mood: mood || undefined,
            temperature: 0.7,
            maxTokens: 500
          })
        });

        const llmData = await llmResponse.json();
        if (llmData.success && llmData.content) {
          setReflection(llmData.content);
          setShowReflection(true);

          // Store the reflection in memory
          const reflectionSourceId = `reflection_${notionPageId}`;
          const reflectionPayload = {
            text: llmData.content,
            source_id: reflectionSourceId,
            original_entry_id: notionPageId,
            timestamp: new Date().toISOString(),
            indexed_at: new Date().toISOString(),
            type: "journal_reflection",
            tags: ["reflection", "journal_reflection", ...(tags || [])],
          };

          // Generate embedding for the reflection
          const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                points: [{
                  id: crypto.randomUUID(),
                  vector: embeddingData.embeddings[0],
                  payload: reflectionPayload
                }],
                collectionName: ORION_MEMORY_COLLECTION_NAME
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

  const fetchActionReflections = async () => {
    if (actionReflections.length > 0) {
      setShowActionReflections(!showActionReflections);
      return;
    }

    if (!notionPageId) {
      console.warn("Cannot fetch action reflections: Missing entry ID.");
      setActionReflections([]);
      setShowActionReflections(true);
      setIsLoadingActionReflections(false);
      return;
    }

    setIsLoadingActionReflections(true);
    try {
      // Search for action reflections related to this journal entry
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryText: "*",
          filter: {
            must: [
              { key: "type", match: { value: "action_reflection" } },
              { key: "payload.original_entry_id", match: { value: notionPageId } }
            ]
          },
          limit: 10
        })
      });

      const data = await response.json();
      if (data.success && data.results && data.results.length > 0) {
        const reflections = data.results.map((result: any) => ({
          text: result.payload.text,
          taskText: result.payload.original_task_text || "Unknown task",
          timestamp: result.payload.timestamp
        }));
        setActionReflections(reflections);
        setShowActionReflections(true);
      } else {
        // No action reflections found
        setActionReflections([]);
        setShowActionReflections(true);
      }
    } catch (error) {
      console.error("Error fetching action reflections:", error);
    } finally {
      setIsLoadingActionReflections(false);
    }
  };

  // Extract potential task from reflection
  const extractTaskSuggestion = (reflectionText: string | null): string | null => {
    if (!reflectionText) {
      return null;
    }

    // Look for common task suggestion patterns in the reflection
    const patterns = [
      /you could (try|consider) (to )?([\w\s]+)/i,
      /I suggest (that you )?([\w\s]+)/i,
      /you might want to ([\w\s]+)/i,
      /it would be helpful to ([\w\s]+)/i,
      /consider ([\w\s]+ing)/i,
      /action item: ([\w\s]+)/i,
      /task: ([\w\s]+)/i
    ];

    for (const pattern of patterns) {
      const match = reflectionText.match(pattern);
      if (match) {
        // Return the captured suggestion, cleaning up any trailing punctuation
        const suggestion = match[match.length - 1].trim().replace(/[.!,;:]$/, '');
        return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
      }
    }

    return null;
  };

  const taskSuggestion = reflection ? extractTaskSuggestion(reflection) : null;
  const hasHabiticaCredentials = userId && apiToken;

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
          {mood && (
            <span className="flex items-center">
                <Smile className="mr-1 h-3 w-3" />
                Mood: <Badge variant="secondary" className="ml-1 bg-gray-700 text-gray-300">{mood}</Badge>
            </span>
          )}
          {tags && tags.length > 0 && (
            <span className="flex items-center">
              <Tag className="mr-1 h-3 w-3" />
              Tags:
              <div className="flex flex-wrap gap-1">
                {tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs border-sky-500 text-sky-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-gray-300 whitespace-pre-wrap break-words">
          {content}
        </div>

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
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium text-blue-400 mb-2">AI Reflection:</h4>
              {taskSuggestion && hasHabiticaCredentials && (
                <AddTaskFromReflection suggestedTask={taskSuggestion} />
              )}
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{reflection}</p>
          </div>
        )}

        {/* Action Reflections Section */}
        {hasHabiticaCredentials && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-green-300"
              onClick={fetchActionReflections}
              disabled={isLoadingActionReflections}
            >
              {isLoadingActionReflections ? (
                <>Loading action reflections...</>
              ) : showActionReflections ? (
                <>Hide Action Reflections <ChevronUp className="ml-1 h-3 w-3" /></>
              ) : (
                <>Show Action Reflections <BookOpen className="ml-1 h-3 w-3" /></>
              )}
            </Button>
          </div>
        )}

        {showActionReflections && (
          <div className="mt-3">
            {actionReflections.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No action reflections found for tasks from this entry.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-green-400">Action Reflections:</h4>
                {actionReflections.map((reflection: ActionReflection, index: number) => (
                  <div key={index} className="p-3 bg-gray-700/30 rounded-md border border-green-800/50">
                    <div className="flex items-center mb-2">
                      <ListTodo className="h-3 w-3 mr-1 text-green-400" />
                      <span className="text-xs font-medium text-green-300">
                        Task: {reflection.taskText}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 whitespace-pre-wrap">{reflection.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(reflection.timestamp).toLocaleDateString()} ({new Date(reflection.timestamp).toLocaleTimeString()})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
