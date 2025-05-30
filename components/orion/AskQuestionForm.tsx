"use client";

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/app_state';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ASK_QUESTION_REQUEST_TYPE } from '@/lib/orion_config';

export const AskQuestionForm: React.FC = () => {
  const [question, setQuestion] = useSessionState(SessionStateKeys.ASK_Q_INPUT, "");
  const [answer, setAnswer] = useSessionState(SessionStateKeys.ASK_Q_ANSWER, "");
  const [isProcessing, setIsProcessing] = useSessionState(SessionStateKeys.ASK_Q_PROCESSING, false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: ASK_QUESTION_REQUEST_TYPE,
          primaryContext: question,
          temperature: 0.7,
          max_tokens: 1000
        })
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
        
        <div className="flex justify-between items-center">
          <Button 
            type="submit" 
            disabled={isProcessing || !question?.trim()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Ask Orion'
            )}
          </Button>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Orion's Answer:</h3>
          <div className="text-gray-300 whitespace-pre-wrap">{answer}</div>
        </div>
      )}
    </div>
  );
};