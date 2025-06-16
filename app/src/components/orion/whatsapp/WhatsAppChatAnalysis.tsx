'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

interface AnalysisData {
  summary?: string;
  sentiment_analysis?: {
    overall_sentiment: string;
    sentiment_trend: { sentiment: string; message_count: number }[];
  };
  key_themes?: string[];
  communication_patterns?: {
    avg_response_time: string;
    most_active_times: string[];
  };
  relationship_dynamics?: {
    support_balance: string;
    common_phrases: string[];
  };
  suggested_replies?: string[];
}

interface WhatsAppChatAnalysisProps {
  analysisData: AnalysisData | null;
}

export const WhatsAppChatAnalysis: React.FC<WhatsAppChatAnalysisProps> = ({ analysisData }) => {
  if (!analysisData) {
    return <p>No analysis data available. Please upload a chat file.</p>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-200">
      <CardHeader>
        <CardTitle className="text-blue-400">WhatsApp Chat Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="themes">Key Themes</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-4">
            <p>{analysisData.summary || 'No summary available.'}</p>
          </TabsContent>
          <TabsContent value="sentiment" className="mt-4">
            <p>
              <strong>Overall Sentiment:</strong> {analysisData.sentiment_analysis?.overall_sentiment || 'N/A'}
            </p>
          </TabsContent>
          <TabsContent value="themes" className="mt-4">
            <ul>
              {analysisData.key_themes?.map((theme, index) => <li key={index}>{theme}</li>) || (
                <li>No themes found.</li>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
