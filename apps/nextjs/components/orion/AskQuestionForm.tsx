"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/hooks/useSessionState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChevronDown, ChevronUp, Filter, Brain } from 'lucide-react';
// Import directly from the file
import { ASK_QUESTION_REQUEST_TYPE } from '@shared/lib/orion_config';

const MEMORY_TYPES = [
  { id: "journal_entry", label: "Journal Entries" },
  { id: "journal_reflection", label: "Journal Reflections" },
  { id: "whatsapp_analysis", label: "WhatsApp Analysis" },
  { id: "local_doc_txt", label: "Text Files" },
  { id: "local_doc_md", label: "Markdown Files" },
  { id: "local_doc_json", label: "JSON Files" }
];

export const AskQuestionForm: React.FC = () => {
  const [question, setQuestion] = useSessionState(SessionStateKeys.ASK_Q_INPUT, "");
  const [answer, setAnswer] = useSessionState(SessionStateKeys.ASK_Q_ANSWER, "");
  const [isProcessing, setIsProcessing] = useSessionState(SessionStateKeys.ASK_Q_PROCESSING, false);
  const [error, setError] = useState<string | null>(null);

  // Client-side only state for button disabled status to prevent hydration mismatch
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Memory filtering state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedMemoryTypes, setSelectedMemoryTypes] = useState<string[]>([]);
  const [memoryTags, setMemoryTags] = useState<string>("");
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  // Update button disabled state on client side only
  useEffect(() => {
    setIsButtonDisabled(isProcessing || !(question || "").trim());
  }, [isProcessing, question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || !question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setAnswer("");

    try {
      // Prepare request payload
      const payload: any = {
        requestType: ASK_QUESTION_REQUEST_TYPE,
        primaryContext: question,
        temperature: 0.7,
        max_tokens: 1000
      };

      // Add memory filters if selected
      if (selectedMemoryTypes.length > 0) {
        payload.memorySourceTypes = selectedMemoryTypes;
        setFiltersApplied(true);
      }

      if (memoryTags.trim()) {
        payload.memorySourceTags = memoryTags.split(',').map(tag => tag.trim()).filter(Boolean);
        setFiltersApplied(true);
      }

      if (!selectedMemoryTypes.length && !memoryTags.trim()) {
        setFiltersApplied(false);
      }

      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success && data.content) {
        setAnswer(data.content);
      } else {
        throw new Error(data.error || "Failed to get an answer.");
      }
    } catch (err: any) {
      console.error("Error asking question:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedMemoryTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const clearFilters = () => {
    setSelectedMemoryTypes([]);
    setMemoryTags("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={question || ""}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Orion anything..."
            className="min-h-[100px] bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
            disabled={isProcessing}
          />
        </div>

        {/* Memory Filters Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
          <div
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-750"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                Memory Filters
                {filtersApplied && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </span>
            </div>
            {showFilters ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>

          {showFilters && (
            <div className="p-3 border-t border-gray-700 bg-gray-750">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-400 mb-2 block">
                    Memory Types
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MEMORY_TYPES.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type.id}`}
                          checked={selectedMemoryTypes.includes(type.id)}
                          onCheckedChange={() => handleTypeToggle(type.id)}
                        />
                        <Label
                          htmlFor={`type-${type.id}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="memoryTags" className="text-sm text-gray-400 mb-2 block">
                    Memory Tags (comma-separated)
                  </Label>
                  <Input
                    id="memoryTags"
                    value={memoryTags}
                    onChange={(e) => setMemoryTags(e.target.value)}
                    placeholder="e.g., career, project, personal"
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-300 border-gray-600"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button
            type="submit"
            disabled={isButtonDisabled}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Ask Orion
              </>
            )}
          </Button>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Orion&apos;s Answer:</h3>
          <div className="text-gray-300 whitespace-pre-wrap">{answer}</div>

          {filtersApplied && (
            <p className="mt-4 text-xs text-gray-400">
              <Filter className="h-3 w-3 inline mr-1" />
              Answer generated using filtered memory sources
            </p>
          )}
        </div>
      )}
    </div>
  );
};
