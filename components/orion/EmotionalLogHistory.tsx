"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, Calendar, Search, RefreshCw } from 'lucide-react';
import { EmotionalLogEntry } from '@/types/emotions';

interface EmotionalLogHistoryProps {
  className?: string;
  limit?: number;
}

export const EmotionalLogHistory: React.FC<EmotionalLogHistoryProps> = ({ 
  className,
  limit = 10
}) => {
  const [logs, setLogs] = useState<EmotionalLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (emotion) params.append('emotion', emotion);
      
      const response = await fetch(`/api/orion/emotions/history?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.logs);
      } else {
        throw new Error(data.error || 'Failed to fetch emotional logs');
      }
    } catch (err: any) {
      console.error('Error fetching emotional logs:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getIntensityColor = (intensity?: number) => {
    if (!intensity) return 'bg-gray-400';
    if (intensity <= 3) return 'bg-green-400';
    if (intensity <= 6) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
          
          <div>
            <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
          
          <div>
            <Label htmlFor="emotion" className="text-gray-300">Emotion</Label>
            <Input
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Filter by emotion"
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setEmotion('');
            }}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Clear Filters
          </Button>
          
          <Button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={fetchLogs}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          <span className="ml-2 text-gray-400">Loading emotional logs...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No emotional logs found. Start logging your emotions to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getIntensityColor(log.intensity)}`}></div>
                      <h3 className="text-lg font-medium text-gray-200">{log.primaryEmotion}</h3>
                      {log.intensity && (
                        <span className="ml-2 text-sm text-gray-400">Intensity: {log.intensity}/10</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                {log.secondaryEmotions && log.secondaryEmotions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Secondary Emotions:</p>
                    <p className="text-sm text-gray-300">{log.secondaryEmotions.join(', ')}</p>
                  </div>
                )}
                
                {log.triggers && log.triggers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Triggers:</p>
                    <p className="text-sm text-gray-300">{log.triggers.join(', ')}</p>
                  </div>
                )}
                
                {log.accompanyingThoughts && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Thoughts:</p>
                    <p className="text-sm text-gray-300">{log.accompanyingThoughts}</p>
                  </div>
                )}
                
                {log.contextualNote && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Context:</p>
                    <p className="text-sm text-gray-300">{log.contextualNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};