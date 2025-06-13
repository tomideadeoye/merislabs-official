"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Loader2, BookText, Copy, RefreshCw } from 'lucide-react';
import { OrionOpportunity } from '@repo/shared';

interface NarrativeAlignmentSectionProps {
  OrionOpportunity: OrionOpportunity;
  evaluation?: EvaluationOutput | null;
}

export const NarrativeAlignmentSection: React.FC<NarrativeAlignmentSectionProps> = ({
  OrionOpportunity,
  evaluation
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [narrativeContent, setNarrativeContent] = useState<string>('');
  const [narrativeHighlights, setNarrativeHighlights] = useState<string[]>([]);

  const fetchNarrativeAlignment = useCallback(async () => {
    setIsLoading(true);

    try {
      // First, search for relevant narrative entries in memory
      const memoryResponse = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `Narrative statements, value propositions, or personal brand elements relevant to ${OrionOpportunity.title} at ${OrionOpportunity.company}`,
          collectionName: 'orion_memory',
          limit: 5,
          filter: {
            must: [
              {
                key: 'tags',
                match: {
                  value: 'narrative'
                }
              }
            ]
          }
        })
      });

      const memoryData = await memoryResponse.json();

      if (memoryData.success && memoryData.results && memoryData.results.length > 0) {
        // Extract narrative content from memory results
        const narrativePoints = memoryData.results.map((item: any) => item.payload.text);

        // Generate narrative alignment using LLM
        const alignmentResponse = await fetch('/api/orion/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestType: 'NARRATIVE_ALIGNMENT',
            primaryContext: `
              Based on the following OrionOpportunity and evaluation, extract 3-5 key narrative points from Tomide's existing narrative statements that would be most effective for this specific OrionOpportunity.

              OrionOpportunity: ${OrionOpportunity.title} at ${OrionOpportunity.company}
              ${OrionOpportunity.content ? `Description: ${OrionOpportunity.content}` : ''}

              Evaluation Highlights:
              ${evaluation?.alignmentHighlights?.join('\n') || 'No specific highlights available.'}

              Gap Analysis:
              ${evaluation?.gapAnalysis?.join('\n') || 'No specific gaps identified.'}

              Existing Narrative Statements:
              ${narrativePoints.join('\n\n')}

              Please provide:
              1. A concise paragraph (3-5 sentences) that aligns Tomide's narrative with this specific OrionOpportunity
              2. A list of 3-5 key narrative points that should be emphasized in application materials
            `,
            temperature: 0.4,
            maxTokens: 800
          })
        });

        const alignmentData = await alignmentResponse.json();

        if (alignmentData.success && alignmentData.content) {
          // Parse the response to extract the narrative content and highlights
          const content = alignmentData.content;

          // Extract the paragraph (everything before any numbered list)
          const paragraphMatch = content.match(/^(.*?)(?=\d\.|\n\d\.|\n\n\d\.|\n- |\n\n- )/);
          if (paragraphMatch && paragraphMatch[1]) {
            setNarrativeContent(paragraphMatch[1].trim());
          } else {
            setNarrativeContent(content);
          }

          // Extract the highlights (numbered list or bullet points)
          const highlightsMatch = content.match(/(?:\d\.|-)(.+?)(?=\d\.|$|-|$)/g);
          if (highlightsMatch) {
            setNarrativeHighlights(
              highlightsMatch.map((h: string) => h.replace(/^\d\.|-\s*/, '').trim())
                .filter((h: string) => h.length > 0)
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching narrative alignment:", error);
    } finally {
      setIsLoading(false);
    }
  }, [OrionOpportunity, evaluation]);

  useEffect(() => {
    if (OrionOpportunity && evaluation) {
      fetchNarrativeAlignment();
    }
  }, [OrionOpportunity, evaluation, fetchNarrativeAlignment]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  if (!evaluation) {
    return null; // Don't show this section if there's no evaluation
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <BookText className="mr-2 h-5 w-5 text-indigo-400" />
          Narrative Alignment
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchNarrativeAlignment}
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
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : narrativeContent ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Narrative Summary</h3>
              <div className="relative">
                <p className="text-gray-200 bg-gray-700 p-3 rounded-md">{narrativeContent}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 bg-gray-800/70 hover:bg-gray-700"
                  onClick={() => copyToClipboard(narrativeContent)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {narrativeHighlights.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Key Points to Emphasize</h3>
                <div className="space-y-2">
                  {narrativeHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-700 mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-gray-300">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-indigo-900/20 hover:bg-indigo-900/30 text-indigo-300 w-full"
                onClick={() => {
                  const fullText = `
Narrative Summary:
${narrativeContent}

Key Points to Emphasize:
${narrativeHighlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}
                  `.trim();
                  copyToClipboard(fullText);
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy All Narrative Points
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No narrative alignment data available.</p>
            <Button
              onClick={fetchNarrativeAlignment}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <BookText className="mr-2 h-4 w-4" />
              Generate Narrative Alignment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
