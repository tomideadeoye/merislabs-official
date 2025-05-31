"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCreationButton } from './TaskCreationButton';
import { ListChecks } from 'lucide-react';

interface JournalTaskIntegrationProps {
  journalText: string;
  className?: string;
}

export const JournalTaskIntegration: React.FC<JournalTaskIntegrationProps> = ({ 
  journalText,
  className
}) => {
  // Extract potential tasks from journal text
  const extractTasks = (): string[] => {
    const tasks: string[] = [];
    
    // Look for lines starting with "- [ ]" or "* [ ]" (markdown task syntax)
    const markdownTaskRegex = /^[-*]\s*\[\s*\]\s*(.+)$/gm;
    let match;
    
    while ((match = markdownTaskRegex.exec(journalText)) !== null) {
      if (match[1].trim()) {
        tasks.push(match[1].trim());
      }
    }
    
    // Look for lines starting with "TODO:" or "Task:"
    const todoRegex = /^(TODO|Task):\s*(.+)$/gim;
    while ((match = todoRegex.exec(journalText)) !== null) {
      if (match[2].trim()) {
        tasks.push(match[2].trim());
      }
    }
    
    // Look for sentences containing "I need to", "I should", "I must"
    const actionRegex = /I\s+(need|should|must)\s+to\s+([^.!?]+)/gi;
    while ((match = actionRegex.exec(journalText)) !== null) {
      if (match[2].trim()) {
        tasks.push(match[2].trim());
      }
    }
    
    return tasks;
  };
  
  const potentialTasks = extractTasks();
  
  if (potentialTasks.length === 0) {
    return null;
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-blue-400" />
          Potential Tasks Detected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          The following potential tasks were detected in your journal entry:
        </p>
        
        <ul className="space-y-3">
          {potentialTasks.map((task, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-750 p-3 rounded-md">
              <span className="text-gray-300">{task}</span>
              <TaskCreationButton 
                initialText={task}
                variant="outline"
                size="sm"
                className="ml-2 text-blue-400 border-blue-600 hover:bg-blue-900/30"
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};