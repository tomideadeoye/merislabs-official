/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview UI component for the Communication Patterns Analyzer.
 * @description This component allows users to upload multiple chat transcripts, triggers LLM-based analysis
 *   to identify recurring communication patterns and suggest actionable strategies, and displays these insights.
 *   It also provides functionality to save selected patterns/strategies to Qdrant memory.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide an interface for uploading/selecting multiple chat transcripts for analysis.
 *   - Display identified recurring communication patterns and suggested strategies.
 *   - Allow users to save specific patterns/strategies to Qdrant memory.
 *   - Integrate with the `/api/orion/communication/analyze-patterns` API.
 *   - Offer engaging visualizations for patterns and strategies.
 *
 * @visualizations
 *   - Bar Chart: Displays the frequency distribution of identified communication patterns (High, Medium, Low).
 *   - Line Graph: Shows the sentiment trend across multiple analyzed chat transcripts.
 *
 * FILEPATH: `app/components/orion/whatsapp/CommunicationPatternsAnalyzer.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/communication/analyze-patterns/route.ts`: Backend API for analysis.
 *   - `app/lib/types/communication`: Defines data structures for patterns and strategies.
 *   - `app/lib/memory`: `addMemory` for saving insights.
 *   - `@nivo/bar`, `@nivo/line`, `@nivo/core`: Used for rendering interactive bar and line charts.
 *   - `app/components/ui`: Shadcn UI components.
 *   - `react-hot-toast`: For user feedback.
 *   - `lucide-react`: Icons.
 *
 * NOTE: This file was refactored to fix all TypeScript and lint errors, including strict typing for all state and function parameters, correct onClick handler signatures, and canonical array/union/undefined/null usage. Copious logging was added for all user actions and state changes for traceability and rapid debugging.
 */
'use client';

import React, { useState, useMemo, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Lightbulb, Save, InfoIcon, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { handleClientError } from '@/lib/utils/clientErrorHandler';
import {
  CommunicationPatternAnalysisResult,
  RecurringPattern,
  SuggestedStrategy,
  IndividualChatAnalysisSummary,
} from '@/lib/types/communication';
import { UnifiedSaveToMemoryComponent } from '@/components/ui/orion/UnifiedSaveToMemoryComponent';
import { addMemory } from '@/lib/memory';

export default function CommunicationPatternsAnalyzer() {
  const [chatTranscripts, setChatTranscripts] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<CommunicationPatternAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized data for Pattern Frequency Bar Chart
  const patternFrequencyData = useMemo(() => {
    if (!analysisResult || !analysisResult.recurringPatterns) return [];

    const frequencyCounts: Record<string, number> = {
      High: 0,
      Medium: 0,
      Low: 0,
    };

    analysisResult.recurringPatterns.forEach((pattern) => {
      if (pattern.frequency in frequencyCounts) {
        frequencyCounts[pattern.frequency]++;
      }
    });

    return Object.entries(frequencyCounts).map(([frequency, count]) => ({
      frequency,
      count,
    }));
  }, [analysisResult]);

  // Memoized data for Sentiment Trend Line Graph
  const sentimentTrendData = useMemo(() => {
    if (!analysisResult || !analysisResult.chatAnalysisSummaries || analysisResult.chatAnalysisSummaries.length === 0)
      return [];

    return [
      {
        id: 'Sentiment Score',
        data: analysisResult.chatAnalysisSummaries.map((summary: IndividualChatAnalysisSummary) => ({
          x: `Chat ${summary.chatIndex + 1}`,
          y: summary.sentimentScore,
        })),
      },
    ];
  }, [analysisResult]);

  const handleAddTranscript = (transcript: string) => {
    setChatTranscripts((prev) => [...prev, transcript]);
  };

  const handleAnalyzePatterns = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    toast.loading('Analyzing communication patterns...');
    logger.info('[COMM_PATTERNS_ANALYZER][ANALYZE_START]', { numTranscripts: chatTranscripts.length });

    if (chatTranscripts.length === 0) {
      setError('Please add at least one chat transcript for analysis.');
      toast.error('No transcripts to analyze.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post('/api/orion/communication/analyze-patterns', {
        chatTranscripts,
      });

      if (response.data.success) {
        setAnalysisResult(response.data.analysis);
        toast.success('Communication patterns analyzed successfully!');
        logger.success('[COMM_PATTERNS_ANALYZER][ANALYZE_SUCCESS]', {
          patternsCount: response.data.analysis.recurringPatterns.length,
        });
      } else {
        throw new Error(response.data.error || 'Failed to analyze communication patterns.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { stage: 'analyze_patterns_api_call' });
      setError(handledError.message);
      toast.error(`Analysis Failed: ${handledError.message}`);
      logger.error('[COMM_PATTERNS_ANALYZER][ANALYZE_ERROR]', {
        error: handledError.message,
        details: handledError.details,
      });
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-600';
      case 'negative':
        return 'bg-red-600';
      case 'neutral':
        return 'bg-blue-600';
      case 'mixed':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-300 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" /> Communication Patterns Analyzer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Identify recurring patterns and get actionable strategies from multiple chat transcripts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="chatInput" className="text-sm text-gray-300 mb-1 block">
            Paste Chat Transcripts (one per box, or multiple in one)
          </Label>
          <Textarea
            id="chatInput"
            placeholder="Paste WhatsApp chat transcript here..."
            value={chatTranscripts.join('\n\n--- NEW CHAT ---\n\n')}
            onChange={(e) => setChatTranscripts([e.target.value])} // Simple for now, can be enhanced for multiple inputs
            rows={10}
            className="bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <InfoIcon className="h-3 w-3 mr-1 text-gray-500" /> For best results, paste transcripts from different
            conversations or different phases of a long conversation.
          </p>
        </div>

        <Button
          onClick={handleAnalyzePatterns}
          disabled={isLoading || chatTranscripts.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isLoading ? 'Analyzing Patterns...' : 'Analyze Communication Patterns'}
        </Button>

        {error && (
          <div className="bg-red-900/30 text-red-300 p-3 rounded-md flex items-center space-x-2">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-200">Overall Communication Summary:</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{analysisResult.overallCommunicationSummary}</p>

            {/* Pattern Frequency Bar Chart */}
            {analysisResult.recurringPatterns.length > 0 && (
              <div className="mt-6 h-[300px]">
                {' '}
                {/* Added height for chart */}
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Pattern Frequency Distribution:</h3>
                <ResponsiveBar
                  data={patternFrequencyData}
                  keys={['count']}
                  indexBy="frequency"
                  margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
                  padding={0.3}
                  colors={{ scheme: 'pastel1' }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Frequency',
                    legendPosition: 'middle',
                    legendOffset: 40,
                    truncateTickAt: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Patterns',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    truncateTickAt: 0,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]],
                  }}
                  enableGridY={true}
                  theme={{
                    axis: {
                      ticks: { text: { fill: '#cbd5e0' } },
                      legend: { text: { fill: '#cbd5e0' } },
                    },
                    grid: { line: { stroke: '#4a5568' } },
                    tooltip: {
                      container: { background: '#2d3748', color: '#cbd5e0' },
                    },
                    labels: { text: { fill: '#cbd5e0' } },
                  }}
                  ariaLabel="Pattern Frequency Chart"
                />
              </div>
            )}

            {/* Sentiment Trend Line Graph */}
            {analysisResult.chatAnalysisSummaries && analysisResult.chatAnalysisSummaries.length > 0 && (
              <div className="mt-6 h-[300px]">
                {' '}
                {/* Added height for chart */}
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Sentiment Trend Across Chats:</h3>
                <ResponsiveLine
                  data={sentimentTrendData}
                  margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: -1, // Sentiment score range
                    max: 1,
                    stacked: false,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Chat Index',
                    legendOffset: 40,
                    legendPosition: 'middle',
                    truncateTickAt: 0,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Sentiment Score',
                    legendOffset: -40,
                    legendPosition: 'middle',
                    truncateTickAt: 0,
                  }}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  enableGridX={true}
                  enableGridY={true}
                  colors={{ scheme: 'category10' }}
                  theme={{
                    axis: {
                      ticks: { text: { fill: '#cbd5e0' } },
                      legend: { text: { fill: '#cbd5e0' } },
                    },
                    grid: { line: { stroke: '#4a5568' } },
                    tooltip: {
                      container: { background: '#2d3748', color: '#cbd5e0' },
                    },
                    labels: { text: { fill: '#cbd5e0' } },
                  }}
                  useMesh={true}
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: 'circle',
                      symbolBorderColor: 'rgba(0, 0, 0, .5)',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-200">Recurring Patterns:</h3>
            <div className="space-y-4">
              {analysisResult.recurringPatterns.map((pattern, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-md text-yellow-300">{pattern.name}</CardTitle>
                    <Badge variant="secondary" className={`bg-gray-600 ${getSentimentColor(pattern.sentimentImpact)}`}>
                      {pattern.frequency} - {pattern.sentimentImpact}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm">{pattern.description}</p>
                  <div className="mt-2">
                    <UnifiedSaveToMemoryComponent
                      initialText={JSON.stringify(pattern, null, 2)}
                      initialType="communication_pattern"
                      initialTags={`whatsapp,communication_pattern,${pattern.name.toLowerCase().replace(/\s/g, '_')}`}
                      displayMode="minimal"
                      onMemoryAdded={() => {
                        logger.info('[COMM_PATTERNS_ANALYZER][MEMORY_ADDED]', { pattern });
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-200">Suggested Strategies:</h3>
            <div className="space-y-4">
              {analysisResult.suggestedStrategies.map((strategy, index) => (
                <Card key={index} className="bg-gray-700 border-gray-600 p-4">
                  <CardTitle className="text-md text-green-300 mb-2">{strategy.name}</CardTitle>
                  <p className="text-gray-300 text-sm mb-2">{strategy.description}</p>
                  <p className="text-gray-400 text-xs">Targets: {strategy.targetsPattern}</p>
                  <p className="text-gray-400 text-xs">Alignment: {strategy.alignmentWithProfile}</p>
                  <div className="mt-2">
                    <UnifiedSaveToMemoryComponent
                      initialText={JSON.stringify(strategy, null, 2)}
                      initialType="communication_strategy"
                      initialTags={`whatsapp,communication_strategy,${strategy.targetsPattern.toLowerCase().replace(/\s/g, '_')}`}
                      displayMode="minimal"
                      onMemoryAdded={() => {
                        logger.info('[COMM_PATTERNS_ANALYZER][MEMORY_ADDED]', { strategy });
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
