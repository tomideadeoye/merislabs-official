"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { EmotionalLogForm } from '@/components/orion/EmotionalLogForm';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Moon, BookOpen, ListChecks } from 'lucide-react';
import { DAILY_REFLECTION_REQUEST_TYPE } from '@/lib/orion_config';
import Link from 'next/link';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const EveningRoutine: React.FC = () => {
  // Session state
  const [eveningRoutineCompleted, setEveningRoutineCompleted] = useSessionState(
    SessionStateKeys.ROUTINES_EVENING_COMPLETED,
    false
  );

  // Local state
  const [moodLogged, setMoodLogged] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [reflectionPrompt, setReflectionPrompt] = useState<string | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch completed tasks and reflection prompt on mount
  useEffect(() => {
    fetchCompletedTasks();
    generateReflectionPrompt();
  }, []);

  // Fetch completed tasks from Habitica
  const fetchCompletedTasks = async () => {
    setIsLoadingTasks(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'completedTodos' })
      });

      const data = await response.json();

      if (data.success) {
        // Get tasks completed today
        const today = getTodayDateString();
        const todaysTasks = data.tasks.filter((task: any) => {
          if (!task.dateCompleted) return false;
          return task.dateCompleted.startsWith(today);
        });

        setCompletedTasks(todaysTasks);
      } else {
        throw new Error(data.error || 'Failed to fetch completed tasks');
      }
    } catch (err: any) {
      console.error('Error fetching completed tasks:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Generate reflection prompt
  const generateReflectionPrompt = async () => {
    setIsLoadingPrompt(true);

    try {
      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: DAILY_REFLECTION_REQUEST_TYPE,
          primaryContext: `Generate a thoughtful evening reflection prompt that encourages self-awareness and gratitude. Focus on themes like accomplishments, learning, gratitude, or peace. Keep it concise (1-2 sentences).`,
          temperature: 0.7,
          maxTokens: 100
        })
      });

      const data = await response.json();

      if (data.success && data.content) {
        setReflectionPrompt(data.content);
      } else {
        throw new Error(data.error || 'Failed to generate reflection prompt');
      }
    } catch (err: any) {
      console.error('Error generating reflection prompt:', err);
      // Fallback prompt
      setReflectionPrompt("What went well today, and what are you grateful for?");
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  // Handle mood logged
  const handleMoodLogged = () => {
    setMoodLogged(true);
    setEveningRoutineCompleted(true);
  };

  return (
    <div className="space-y-6">
      {/* Completed Tasks Section */}
      <section>
        <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-green-400" />
          Tasks Completed Today:
        </h3>

        {isLoadingTasks ? (
          <div className="flex items-center text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading completed tasks...
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : completedTasks.length === 0 ? (
          <p className="text-gray-400">No tasks completed today. That&apos;s okay, tomorrow is a new day!</p>
        ) : (
          <ul className="space-y-1">
            {completedTasks.map(task => (
              <li key={task.id} className="flex items-center text-gray-300">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                {task.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reflection Prompt Section */}
      <section>
        <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
          <Moon className="mr-2 h-5 w-5 text-purple-400" />
          Evening Reflection:
        </h3>

        {isLoadingPrompt ? (
          <div className="flex items-center text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating prompt...
          </div>
        ) : reflectionPrompt ? (
          <blockquote className="border-l-4 border-purple-500 pl-3 italic text-gray-300">
            {reflectionPrompt}
          </blockquote>
        ) : (
          <p className="text-gray-400">What went well today, and what are you grateful for?</p>
        )}

        <Button
          variant="outline"
          size="sm"
          asChild
          className="mt-3 text-purple-400 border-purple-600 hover:bg-purple-700/30"
        >
          <Link href="/admin/journal">Open Journal to Reflect</Link>
        </Button>
      </section>

      {/* Mood Logging Section */}
      {!moodLogged ? (
        <section>
          <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-400" />
            How are you feeling this evening?
          </h3>
          <EmotionalLogForm
            onLogSaved={handleMoodLogged}
            initialContextualNote={`Evening check-in ${getTodayDateString()}`}
          />
        </section>
      ) : (
        <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Evening mood logged successfully. Rest well!
        </div>
      )}
    </div>
  );
};
