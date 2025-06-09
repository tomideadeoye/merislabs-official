"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@shared/hooks/useSessionState';
import { SessionStateKeys } from '@shared/hooks/useSessionState';
import { EmotionalLogForm } from '@/components/orion/EmotionalLogForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle, Brain, ListChecks, Sparkles } from 'lucide-react';
import { THOUGHT_FOR_THE_DAY_REQUEST_TYPE } from '@shared/lib/orion_config';
import Link from 'next/link';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const MorningRoutine: React.FC = () => {
  // Session state
  const [habiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  const [morningRoutineCompleted, setMorningRoutineCompleted] = useSessionState(
    SessionStateKeys.ROUTINES_MORNING_COMPLETED, 
    false
  );
  
  // Local state
  const [moodLogged, setMoodLogged] = useState<boolean>(false);
  const [dailyTasks, setDailyTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
  const [thoughtForDay, setThoughtForDay] = useState<string | null>(null);
  const [isLoadingThought, setIsLoadingThought] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Habitica credentials are set
  const habiticaConfigured = Boolean(habiticaUserId && habiticaApiToken);

  // Fetch Habitica tasks on mount if credentials are available
  useEffect(() => {
    if (habiticaConfigured) {
      fetchHabiticaTasks();
    }
    fetchThoughtForDay();
  }, [habiticaConfigured]);

  // Fetch Habitica tasks
  const fetchHabiticaTasks = async () => {
    setIsLoadingTasks(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/habitica/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'dailys' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Filter for dailies that are due today
        setDailyTasks(data.tasks.filter((task: any) => !task.completed));
      } else {
        throw new Error(data.error || 'Failed to fetch Habitica tasks');
      }
    } catch (err: any) {
      console.error('Error fetching Habitica tasks:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Fetch thought for the day
  const fetchThoughtForDay = async () => {
    setIsLoadingThought(true);
    
    try {
      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestType: THOUGHT_FOR_THE_DAY_REQUEST_TYPE,
          primaryContext: `Generate a brief, insightful, and motivating thought or a single reflective question for the start of the day. Focus on themes like agency, creation, clarity, or peace. Keep it concise (1-2 sentences).`,
          temperature: 0.7,
          maxTokens: 100
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.content) {
        setThoughtForDay(data.content);
      } else {
        throw new Error(data.error || 'Failed to generate thought for the day');
      }
    } catch (err: any) {
      console.error('Error generating thought for the day:', err);
      // Fallback thought
      setThoughtForDay("What one small action today would move you closer to your goals?");
    } finally {
      setIsLoadingThought(false);
    }
  };

  // Handle task completion
  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/orion/habitica/tasks/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          direction: 'up'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update task list
        setDailyTasks(dailyTasks.filter(task => task.id !== taskId));
      } else {
        throw new Error(data.error || 'Failed to complete task');
      }
    } catch (err: any) {
      console.error('Error completing task:', err);
      alert(`Error: ${err.message || 'Failed to complete task'}`);
    }
  };

  // Handle mood logged
  const handleMoodLogged = () => {
    setMoodLogged(true);
    
    // Check if morning routine is complete
    if (dailyTasks.length === 0 || !habiticaConfigured) {
      setMorningRoutineCompleted(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mood Logging Section */}
      {!moodLogged ? (
        <section>
          <h3 className="text-lg font-medium text-gray-300 mb-2">How are you feeling this morning?</h3>
          <EmotionalLogForm 
            onLogSaved={handleMoodLogged}
            initialContextualNote={`Morning check-in ${getTodayDateString()}`}
          />
        </section>
      ) : (
        <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Morning mood logged successfully!
        </div>
      )}
      
      {/* Thought for the Day Section */}
      <section>
        <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-400" />
          Thought for Your Day:
        </h3>
        
        {isLoadingThought ? (
          <div className="flex items-center text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Generating thought...
          </div>
        ) : thoughtForDay ? (
          <blockquote className="border-l-4 border-purple-500 pl-3 italic text-gray-300">
            {thoughtForDay}
          </blockquote>
        ) : (
          <p className="text-gray-400">What one small action today would move you closer to your goals?</p>
        )}
      </section>
      
      {/* Habitica Tasks Section */}
      {habiticaConfigured && (
        <section>
          <h3 className="text-lg font-medium text-gray-300 mb-2 flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-blue-400" />
            Your Key Tasks for Today:
          </h3>
          
          {isLoadingTasks ? (
            <div className="flex items-center text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading tasks...
            </div>
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : dailyTasks.length === 0 ? (
            <p className="text-gray-400">No pending tasks for today. Great job!</p>
          ) : (
            <ul className="space-y-2">
              {dailyTasks.map(task => (
                <li key={task.id} className="flex items-center p-2 bg-gray-700/50 rounded-md">
                  <Checkbox
                    id={task.id}
                    checked={false}
                    onCheckedChange={() => handleCompleteTask(task.id)}
                    className="mr-2"
                  />
                  <label htmlFor={task.id} className="text-gray-300 cursor-pointer">
                    {task.text}
                  </label>
                </li>
              ))}
            </ul>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="mt-3 text-blue-400 border-blue-600 hover:bg-blue-700/30"
          >
            <Link href="/admin/habitica">Go to Full Habitica Dashboard</Link>
          </Button>
        </section>
      )}
      
      {/* Journal Link Section */}
      <section className="mt-4 pt-4 border-t border-gray-700/50">
        <Link href="/admin/journal" legacyBehavior>
          <Button variant="ghost" className="text-amber-400 hover:bg-amber-700/20 hover:text-amber-300">
            <Sparkles className="mr-2 h-4 w-4" />
            Ready to Journal Your Morning Intentions?
          </Button>
        </Link>
      </section>
    </div>
  );
};