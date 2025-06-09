"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, RefreshCw } from 'lucide-react';
import { CVComponent } from '@shared/lib/notion_next_service';

export const NotionCVComponentsList = () => {
  const [components, setComponents] = useState<CVComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComponents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/notion/cv-components');
      const data = await response.json();
      
      if (data.success) {
        setComponents(data.components);
      } else {
        throw new Error(data.error || 'Failed to fetch CV components');
      }
    } catch (err: any) {
      console.error('Error fetching CV components:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const componentTypeColors: Record<string, string> = {
    'Experience': 'bg-blue-900/30 text-blue-300 border-blue-700',
    'Education': 'bg-purple-900/30 text-purple-300 border-purple-700',
    'Skills': 'bg-green-900/30 text-green-300 border-green-700',
    'Projects': 'bg-amber-900/30 text-amber-300 border-amber-700',
    'Summary': 'bg-red-900/30 text-red-300 border-red-700',
    'Contact': 'bg-gray-900/30 text-gray-300 border-gray-700'
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">CV Components from Notion</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchComponents}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>
      
      {isLoading && components.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Loading CV components...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          <p className="font-medium">Error loading CV components</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">Make sure the Python Notion API server is running.</p>
        </div>
      ) : components.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No CV components found in Notion.</p>
          <p className="text-sm">Check your Notion database or API configuration.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component) => (
            <Card key={component.unique_id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md font-medium text-gray-200">
                    {component.component_name}
                  </CardTitle>
                  <div className={`text-xs px-2 py-1 rounded-full ${componentTypeColors[component.component_type] || 'bg-gray-900/30 text-gray-300 border-gray-700'}`}>
                    {component.component_type}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {component.content_primary}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  ID: {component.unique_id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};