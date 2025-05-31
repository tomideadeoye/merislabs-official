"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCreationButton } from './TaskCreationButton';
import { Lightbulb, ListChecks } from 'lucide-react';

interface PatternTaskIntegrationProps {
  patternInsights: string[];
  className?: string;
}

export const PatternTaskIntegration: React.FC<PatternTaskIntegrationProps> = ({ 
  patternInsights,
  className
}) => {
  // Extract potential action items from pattern insights
  const extractActionItems = (): { insight: string; action: string }[] => {
    const actionItems: { insight: string; action: string }[] = [];
    
    patternInsights.forEach(insight => {
      // Look for action-oriented phrases
      const actionPhrases = [
        'try to', 'consider', 'focus on', 'prioritize', 'practice',
        'develop', 'establish', 'create', 'implement', 'start',
        'reduce', 'increase', 'improve', 'maintain', 'schedule'
      ];
      
      for (const phrase of actionPhrases) {
        const regex = new RegExp(`(${phrase}\\s+[^.!?]+)`, 'gi');
        const match = insight.match(regex);
        
        if (match) {
          actionItems.push({
            insight,
            action: match[0].trim()
          });
          break;
        }
      }
    });
    
    return actionItems;
  };
  
  const actionItems = extractActionItems();
  
  if (actionItems.length === 0) {
    return null;
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          Turn Insights into Action
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          Create tasks based on the pattern insights:
        </p>
        
        <ul className="space-y-4">
          {actionItems.map((item, index) => (
            <li key={index} className="bg-gray-750 p-3 rounded-md">
              <p className="text-sm text-gray-400 mb-1">Based on insight:</p>
              <p className="text-gray-300 text-sm italic mb-2">"{item.insight}"</p>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center">
                  <ListChecks className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-300">{item.action}</span>
                </div>
                <TaskCreationButton 
                  initialText={item.action}
                  variant="outline"
                  size="sm"
                  className="ml-2 text-blue-400 border-blue-600 hover:bg-blue-900/30"
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};