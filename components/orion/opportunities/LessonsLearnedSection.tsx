"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, RefreshCw, Copy } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';

interface LessonsLearnedProps {
  opportunity: Opportunity;
}

interface LessonLearned {
  id: string;
  content: string;
  source: string;
  date: string;
  tags: string[];
  relevance: number;
}

export const LessonsLearnedSection: React.FC<LessonsLearnedProps> = ({ opportunity }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessons, setLessons] = useState<LessonLearned[]>([]);



  const fetchLessonsLearned = useCallback(async () => {
    setIsLoading(true);

    try {
      // Search for reflections and lessons in memory
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `${opportunity.title} ${opportunity.company} ${opportunity.type} ${opportunity.tags?.join(' ') || ''}`,
          collectionName: 'orion_memory',
          limit: 10,
          filter: {
            should: [
              {
                key: 'type',
                match: {
                  value: 'opportunity_reflection'
                }
              },
              {
                key: 'type',
                match: {
                  value: 'lessons_learned'
                }
              },
              {
                key: 'tags',
                match: {
                  value: 'reflection'
                }
              }
            ]
          },
          minScore: 0.5
        })
      });

      const data = await response.json();

      if (data.success && data.results && data.results.length > 0) {
        // Transform the results into a more usable format
        const lessonsLearned = data.results.map((item: any) => ({
          id: item.id,
          content: item.payload.text || 'No content available',
          source: item.payload.source_id || 'Unknown source',
          date: item.payload.timestamp || 'Unknown date',
          tags: item.payload.tags || [],
          relevance: Math.round(item.score * 100)
        }));

        setLessons(lessonsLearned);
      }
    } catch (error) {
      console.error("Error fetching lessons learned:", error);
    } finally {
      setIsLoading(false);
    }
  }, [opportunity]);

  useEffect(() => {
    if (opportunity) {
      fetchLessonsLearned();
    }
  }, [opportunity, fetchLessonsLearned]);

  const generateLessonsLearned = async () => {
    setIsGenerating(true);

    try {
      // First, get all reflections from memory
      const reflectionsResponse = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `${opportunity.type} opportunities reflections lessons`,
          collectionName: 'orion_memory',
          limit: 20,
          filter: {
            should: [
              {
                key: 'tags',
                match: {
                  value: 'reflection'
                }
              },
              {
                key: 'tags',
                match: {
                  value: 'opportunity_reflection'
                }
              }
            ]
          }
        })
      });

      const reflectionsData = await reflectionsResponse.json();

      if (reflectionsData.success && reflectionsData.results && reflectionsData.results.length > 0) {
        // Extract the text from the reflections
        const reflectionTexts = reflectionsData.results.map((item: any) => item.payload.text).join('\n\n');

        // Use LLM to generate lessons learned
        const llmResponse = await fetch('/api/orion/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestType: 'LESSONS_LEARNED_SYNTHESIS',
            primaryContext: `
              Based on the following reflections and past experiences, extract 3-5 key lessons learned that would be relevant to the current opportunity:

              Current Opportunity: ${opportunity.title} at ${opportunity.company}
              Type: ${opportunity.type}
              Tags: ${opportunity.tags?.join(', ') || 'None'}

              Past Reflections:
              ${reflectionTexts}

              Please provide:
              1. 3-5 specific lessons learned that are relevant to this opportunity
              2. For each lesson, include a brief explanation of why it's important
              3. Format each lesson as a separate paragraph
            `,
            temperature: 0.3,
            maxTokens: 1000
          })
        });

        const llmData = await llmResponse.json();

        if (llmData.success && llmData.content) {
          // Save the generated lessons to memory
          const saveResponse = await fetch('/api/orion/memory/add-memory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: llmData.content,
              sourceId: `lessons_learned_${opportunity.id}_${Date.now()}`,
              tags: ['lessons_learned', 'opportunity', opportunity.type, ...(opportunity.tags || [])],
              metadata: {
                type: 'lessons_learned',
                opportunityId: opportunity.id,
                company: opportunity.company,
                title: opportunity.title,
                timestamp: new Date().toISOString()
              }
            })
          });

          // Parse the lessons from the LLM response
          const lessonsArray = llmData.content
            .split('\n\n')
            .filter(Boolean)
            .map((lesson: string, index: number) => ({
              id: `generated_${index}`,
              content: lesson,
              source: 'AI-Generated from Past Reflections',
              date: new Date().toISOString(),
              tags: ['lessons_learned', 'generated'],
              relevance: 95 - index * 5 // Decreasing relevance for each lesson
            }));

          setLessons(lessonsArray);
        }
      }
    } catch (error) {
      console.error("Error generating lessons learned:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          Lessons Learned
        </CardTitle>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLessonsLearned}
            disabled={isLoading}
            className="bg-gray-700 hover:bg-gray-600"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generateLessonsLearned}
            disabled={isGenerating}
            className="bg-yellow-900/20 hover:bg-yellow-900/30 text-yellow-300"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading || isGenerating ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        ) : lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={index} className="bg-gray-700 border border-gray-600 rounded-md p-3 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                  onClick={() => copyToClipboard(lesson.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>

                <p className="text-gray-200 pr-8">{lesson.content}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-900/30 text-yellow-300 border-yellow-700"
                  >
                    {lesson.relevance}% relevant
                  </Badge>

                  {lesson.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="bg-gray-600 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Source: {lesson.source} • {new Date(lesson.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No lessons learned found in memory.</p>
            <Button
              onClick={generateLessonsLearned}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Generate Lessons from Past Reflections
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
