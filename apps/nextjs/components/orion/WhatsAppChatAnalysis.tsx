"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { BarChart, PieChart, MessageSquare, Lightbulb, Users } from 'lucide-react';

interface WhatsAppChatAnalysisProps {
  analysisData: any;
  className?: string;
}

export const WhatsAppChatAnalysis: React.FC<WhatsAppChatAnalysisProps> = ({
  analysisData,
  className
}) => {
  const { chat, basicStats, insights } = analysisData;

  if (!chat || !basicStats) {
    return null;
  }

  // Format date range
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const dateRange = `${formatDate(chat.startDate)} - ${formatDate(chat.endDate)}`;

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
            Chat Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-md">
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-xl font-bold text-blue-400">{basicStats.totalMessages}</p>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-md">
              <p className="text-sm text-gray-400">Participants</p>
              <p className="text-xl font-bold text-green-400">{basicStats.totalParticipants}</p>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-md">
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-xl font-bold text-purple-400">{basicStats.duration.days} days</p>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-md">
              <p className="text-sm text-gray-400">Date Range</p>
              <p className="text-sm font-medium text-gray-300">{dateRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="participants" className="data-[state=active]:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-gray-700">
            <BarChart className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gray-700">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participant Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Message Distribution</h3>
                  <div className="space-y-2">
                    {chat.participants.map((participant: string) => {
                      const messageCount = basicStats.messageCountByParticipant[participant] || 0;
                      const percentage = Math.round((messageCount / basicStats.totalMessages) * 100);

                      return (
                        <div key={participant} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{participant}</span>
                            <span className="text-gray-400">{messageCount} messages ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Average Message Length</h3>
                  <div className="space-y-2">
                    {chat.participants.map((participant: string) => {
                      const avgLength = basicStats.avgMessageLengthByParticipant[participant] || 0;
                      const maxAvgLength = Math.max(...Object.values(basicStats.avgMessageLengthByParticipant) as number[]);
                      const percentage = maxAvgLength > 0 ? Math.round((avgLength / maxAvgLength) * 100) : 0;

                      return (
                        <div key={participant} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{participant}</span>
                            <span className="text-gray-400">{avgLength} characters</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Media Messages</h3>
                  <div className="space-y-2">
                    {chat.participants.map((participant: string) => {
                      const mediaCount = basicStats.mediaCountByParticipant[participant] || 0;
                      const totalMediaCount = Object.values(basicStats.mediaCountByParticipant).reduce((sum: number, count: any) => sum + count, 0);
                      const percentage = totalMediaCount > 0 ? Math.round((mediaCount / totalMediaCount) * 100) : 0;

                      return (
                        <div key={participant} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{participant}</span>
                            <span className="text-gray-400">{mediaCount} media messages</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Communication Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Messages by Day of Week</h3>
                  <div className="space-y-2">
                    {Object.entries(basicStats.messagesByDayOfWeek).map(([day, count]: [string, any]) => {
                      const maxCount = Math.max(...Object.values(basicStats.messagesByDayOfWeek) as number[]);
                      const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

                      return (
                        <div key={day} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{day}</span>
                            <span className="text-gray-400">{count} messages</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-300 mb-2">Messages by Time of Day</h3>
                  <div className="grid grid-cols-6 gap-1">
                    {Object.entries(basicStats.messagesByHour).map(([hour, count]: [string, any]) => {
                      const maxCount = Math.max(...Object.values(basicStats.messagesByHour) as number[]);
                      const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;
                      const height = Math.max(percentage, 5); // Minimum height for visibility

                      return (
                        <div key={hour} className="flex flex-col items-center">
                          <div
                            className="w-full bg-cyan-500 rounded-t-sm"
                            style={{ height: `${height}px` }}
                          ></div>
                          <span className="text-xs text-gray-400 mt-1">{hour}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {insights ? (
                <div className="space-y-6">
                  {insights.communicationPatterns && insights.communicationPatterns.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-blue-400 mb-2">Communication Patterns</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {insights.communicationPatterns.map((pattern: string, index: number) => (
                          <li key={index} className="text-gray-300">{pattern}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.relationshipDynamics && insights.relationshipDynamics.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-green-400 mb-2">Relationship Dynamics</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {insights.relationshipDynamics.map((dynamic: string, index: number) => (
                          <li key={index} className="text-gray-300">{dynamic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.conversationTopics && insights.conversationTopics.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-purple-400 mb-2">Conversation Topics</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {insights.conversationTopics.map((topic: string, index: number) => (
                          <li key={index} className="text-gray-300">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.suggestions && insights.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-amber-400 mb-2">Suggestions</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {insights.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="text-gray-300">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No AI insights available for this chat.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
