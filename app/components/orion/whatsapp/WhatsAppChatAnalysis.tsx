/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview This component is responsible for visually displaying the analytical results and insights derived from uploaded WhatsApp chat data.
 * @description It transforms raw chat transcripts, processed by Orion's backend (`orion_chat_analyzer.py`),
 *   into a structured and human-readable representation, highlighting communication patterns, key statistics,
 *   and potentially emotional sentiment and conversation topics. This component is crucial for the "Observe" and
 *   "Orient" phases of the OODA loop, providing the user with comprehensive context before drafting replies.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To parse and present the `analysisData` received from the backend, which contains structured information from WhatsApp chat exports.
 *   - To display key communication statistics such as total messages, number of participants, and a list of recent messages.
 *   - To provide an interface for understanding communication patterns and relationship dynamics within the chat.
 *   - To serve as a transparent window into Orion's LLM-driven analytical insights, fostering informed decision-making.
 *   - To act as a crucial contextual provider for the `WhatsAppReplyDrafter` component, ensuring generated replies are deeply informed by chat history.
 *
 * FILEPATH: `app/components/orion/whatsapp/WhatsAppChatAnalysis.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx` (parent): This component is rendered within the 'WhatsApp Tools' tab and receives `analysisData` as a prop from its parent, which orchestrates data flow from the uploader.
 *   - `app/components/orion/whatsapp/WhatsAppChatUploader.tsx`: The source of the raw chat transcript that gets processed by the backend and whose results are displayed here. It feeds data indirectly via `DraftCommunicationClientWrapper`.
 *   - `app/components/ui/orion/whatsapp/WhatsAppReplyDrafter.tsx`: This component's displayed analysis (and underlying `analysisData`) provides essential context to the `WhatsAppReplyDrafter` for generating hyper-personalized responses.
 *   - `/api/orion/whatsapp/analyze/route.ts` (backend API): This API route proxies the chat transcript to the external Python service and returns the `WhatsAppChatAnalysisData` consumed by this component.
 *   - `http://localhost:8000/analyze-chat` (External Python API Endpoint): This is the *actual* Python backend service that processes the chat data and generates the structured `analysisData` (messages, participants, etc.), which is then returned via the Next.js API route.
 *   - `ParsedWhatsAppMessage` and `WhatsAppChatAnalysisData` interfaces: Defined in this file to ensure type safety and consistent data structure from the backend.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This component is client-side (`'use client'`) due to its interactive nature and direct display of data within the browser.
 *   - Assumes that `analysisData` passed as a prop will conform to the `WhatsAppChatAnalysisData` interface, ensuring data integrity and preventing runtime errors.
 *   - The data displayed is derived from securely processed WhatsApp chat exports, emphasizing privacy and data control.
 *   - Initial display shows a prompt to upload a file when `analysisData` is null or empty.
 *
 * NOTES:
 *   - This component is vital for Orion's relational intelligence, translating raw chat data into actionable insights for the user.
 *   - It directly supports the "Observe" and "Orient" phases of the OODA loop by providing clear, concise, and structured information about the conversation.
 *   - While currently displaying basic statistics and recent messages, its design is extensible to incorporate richer visualizations and deeper LLM-generated insights.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Rich Data Visualization**: Replace raw message listings and simple statistics with interactive charts, graphs (e.g., using D3.js or Nivo for sentiment timelines, message frequency, word clouds), and heatmaps to visualize communication patterns more effectively.
 *   - **Structured Insights UI**: Develop dedicated, engaging UI elements (e.g., custom cards, dashboards) for displaying LLM-generated communication patterns, relationship dynamics summaries, emotional tone shifts, and actionable recommendations.
 *   - **Sentiment Analysis Visualization**: Integrate sentiment scores (if returned by backend) into visual timelines or aggregated charts to show emotional trends over the conversation.
 *   - **Filtering/Sorting Options**: Add interactive options to filter or sort analysis results (e.g., by participant, sentiment, message type, date range) for granular exploration.
 *   - **Memory Interaction**: Allow users to select specific insights or message chunks from the analysis and directly save them to Orion's memory (Qdrant/WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES) via the `DedicatedAddToMemoryFormComponent`.
 *   - **Actionable Reply Suggestions**: Provide direct links or buttons next to analyzed insights to automatically generate specific reply drafts in `WhatsAppReplyDrafter` that address those insights.
 *   - **Topic Modeling/Key Themes**: Integrate backend capabilities to identify key conversation topics or themes and display them prominently, potentially with a tag cloud.
 *   - **User Customization**: Allow users to configure which aspects of the analysis they want to prioritize or visualize.
 *   - **Comparison Feature**: Enable comparison of current chat analysis with historical chat data or ideal communication patterns stored in memory.
 *   - **Error Handling Visualization**: Provide more nuanced visual feedback for partial analysis failures or data anomalies.
 */
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { MessageSquare, Users, FileText, Sparkles } from 'lucide-react';

interface ParsedWhatsAppMessage {
  date: string; // e.g., "12/01/2023, 10:00"
  sender: string;
  message: string;
  // whatstk might provide more fields like 'message_type', 'is_media', 'time', etc.
  // We can add them here as needed for future enhancements.
}

export interface WhatsAppChatAnalysisData {
  // The whatstk library returns a pandas DataFrame, which when JSON-serialized,
  // typically results in an array of objects (records format).
  // Each object in the array represents a row/message from the chat.
  // The keys of these objects correspond to the DataFrame column names.
  messages: ParsedWhatsAppMessage[];
  // We can add summary statistics calculated in the Python backend here if needed.
  // For now, we will derive some basic stats on the frontend.
  overallSentiment?: string; // e.g., 'positive', 'neutral', 'negative'
  sentimentScore?: number; // e.g., between -1 and 1
}

interface WhatsAppChatAnalysisProps {
  analysisData: WhatsAppChatAnalysisData | null; // Use the defined interface
}

const WhatsAppChatAnalysis: React.FC<WhatsAppChatAnalysisProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.messages || analysisData.messages.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-300 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp Chat Analysis
          </CardTitle>
          <Badge variant="outline" className="mt-2 text-xs text-gray-400 border-gray-600">
            Insights from your communication patterns
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Upload a WhatsApp chat .txt file to see analysis here.</p>
        </CardContent>
      </Card>
    );
  }

  const totalMessages = analysisData.messages.length;
  const uniqueParticipants = Array.from(new Set(analysisData.messages.map((msg) => msg.sender)));
  const numParticipants = uniqueParticipants.length;

  // Determine sentiment badge color
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-600';
      case 'negative':
        return 'bg-red-600';
      case 'neutral':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-300 flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp Chat Analysis Results
        </CardTitle>
        <Badge variant="outline" className="mt-2 text-xs text-gray-400 border-gray-600">
          Detailed insights from your chat transcript
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <p className="text-gray-300">
              Total Messages: <span className="font-bold text-white">{totalMessages}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <p className="text-gray-300">
              Participants: <span className="font-bold text-white">{numParticipants}</span>
            </p>
          </div>
          {analysisData.overallSentiment && (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <p className="text-gray-300">
                Overall Sentiment:{' '}
                <Badge className={getSentimentColor(analysisData.overallSentiment)}>
                  {analysisData.overallSentiment}
                </Badge>
              </p>
            </div>
          )}
          {analysisData.sentimentScore !== undefined && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Score:</span>
              <Badge className="bg-gray-600">{analysisData.sentimentScore.toFixed(2)}</Badge>
            </div>
          )}
        </div>

        {numParticipants > 0 && (
          <div>
            <h3 className="text-md font-semibold text-gray-300 mb-2">Participants:</h3>
            <ul className="list-disc list-inside text-gray-400">
              {uniqueParticipants.map((participant, index) => (
                <li key={index} className="text-sm">
                  {participant}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-md font-semibold text-gray-300 mb-2">Recent Messages:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {analysisData.messages.slice(0, 10).map((msg, index) => (
              <div key={index} className="bg-gray-700/50 p-2 rounded-md text-sm text-gray-200">
                <p className="font-bold text-green-400">
                  {msg.sender} <span className="text-gray-500 font-normal text-xs">({msg.date})</span>:
                </p>
                <p className="mt-1">{msg.message}</p>
              </div>
            ))}
            {totalMessages > 10 && (
              <p className="text-gray-500 text-sm mt-2">... and {totalMessages - 10} more messages.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppChatAnalysis;
