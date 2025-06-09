"use client";

import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@shared/ui';
import { Loader2, AlertTriangle, CheckCircle2, Lightbulb, Brain, Info, ListTodo } from 'lucide-react';
import { IdentifiedPattern } from '@shared/types/insights';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';
import { useHabiticaTaskDialogStore } from './tasks/habiticaTaskDialogStore';

interface PatternAnalysisDisplayProps {
  className?: string;
}

export const PatternAnalysisDisplay: React.FC<PatternAnalysisDisplayProps> = ({ className }) => {
  const [patterns, setPatterns] = useState<IdentifiedPattern[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [limit, setLimit] = useState<number>(30);
  const [types, setTypes] = useState<string>("journal_entry,journal_reflection");
  const [tags, setTags] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [customQuery, setCustomQuery] = useState<string>("");

  // Habitica task dialog state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState<boolean>(false);
  const [selectedInsight, setSelectedInsight] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const handleAnalyzePatterns = async () => {
    setIsLoading(true);
    setError(null);
    setPatterns([]);

    try {
      const response = await fetch('/api/orion/insights/analyze-patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          limit,
          types: types.split(',').map(t => t.trim()).filter(Boolean),
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          customQuery: customQuery || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setPatterns(data.patterns || []);
        if ((data.patterns || []).length === 0) {
          if (data.message) {
            setError(data.message);
          } else {
            setError("No patterns identified with the current filters.");
          }
        }
      } else {
        throw new Error(data.error || 'Failed to analyze patterns');
      }
    } catch (err: any) {
      console.error('Error analyzing patterns:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const { openDialog } = useHabiticaTaskDialogStore();
  const handleCreateTask = (insight: string, theme: string) => {
    setSelectedInsight(insight);
    setSelectedTheme(theme);
    openDialog();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-400" />
            Pattern Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze your memories to identify recurring themes, patterns, and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="limit" className="text-gray-300">Number of Memories to Analyze</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 30)}
                className="bg-gray-700 border-gray-600 text-gray-200"
                min={5}
                max={100}
              />
            </div>
            <div>
              <Label htmlFor="types" className="text-gray-300">Memory Types (comma-separated)</Label>
              <Input
                id="types"
                value={types}
                onChange={(e) => setTypes(e.target.value)}
                placeholder="e.g., journal_entry,journal_reflection"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags" className="text-gray-300">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., career,relationships"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="customQuery" className="text-gray-300">Custom Query (optional)</Label>
              <Input
                id="customQuery"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="e.g., career goals"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom" className="text-gray-300">From Date (optional)</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-gray-300">To Date (optional)</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyzePatterns}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Patterns...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Patterns
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-2 text-gray-400">Analyzing patterns in your memories...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-4 rounded-md flex items-start">
          <Info className="h-5 w-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {patterns.length > 0 && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Identified Patterns & Insights:</h3>
          {patterns.map((pattern, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-300">{pattern.theme}</CardTitle>
                {pattern.sentiment && (
                  <CardDescription className="text-gray-400">
                    Sentiment: {pattern.sentiment}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300">{pattern.description}</p>

                {pattern.supportingMemoryIds && pattern.supportingMemoryIds.length > 0 && (
                  <div className="text-sm text-gray-400">
                    <p className="font-medium mb-1">Supporting Memories:</p>
                    <ul className="list-disc list-inside">
                      {pattern.supportingMemoryIds.slice(0, 5).map((id, idx) => (
                        <li key={idx}>{id}</li>
                      ))}
                      {pattern.supportingMemoryIds.length > 5 && (
                        <li>...and {pattern.supportingMemoryIds.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {pattern.actionableInsight && (
                  <div className="mt-2 pt-2 border-t border-gray-700 flex items-start">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-yellow-300">
                          <span className="font-medium">Consider:</span> {pattern.actionableInsight}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateTask(pattern.actionableInsight!, pattern.theme)}
                          className="ml-2 text-xs flex items-center bg-gray-700 hover:bg-gray-600 text-blue-300"
                        >
                          <ListTodo className="mr-1 h-3 w-3" />
                          Create Task
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateHabiticaTaskDialog
        initialTaskText={selectedInsight}
        initialTaskNotes={`From Pattern Analysis: ${selectedTheme}`}
        sourceModule="Pattern Tracker"
        sourceReferenceId={selectedTheme}
      />
    </div>
  );
};
