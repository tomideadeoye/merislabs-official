"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from '@repo/ui';
import { Loader2, AlertTriangle, Lightbulb, Clock, Tag, Filter } from 'lucide-react';
import Link from 'next/link';
import type { Idea, IdeaStatus } from '@repo/shared';

interface IdeaListProps {
  className?: string;
}

// Status display configuration
const statusConfig: Record<IdeaStatus, { label: string; color: string }> = {
  'raw_spark': { label: 'Raw Spark', color: 'bg-yellow-500' },
  'fleshing_out': { label: 'Fleshing Out', color: 'bg-blue-500' },
  'researching': { label: 'Researching', color: 'bg-purple-500' },
  'prototyping': { label: 'Prototyping', color: 'bg-green-500' },
  'on_hold': { label: 'On Hold', color: 'bg-gray-500' },
  'archived': { label: 'Archived', color: 'bg-red-500' },
  'completed': { label: 'Completed', color: 'bg-emerald-500' }
};

export const IdeaList: React.FC<IdeaListProps> = ({ className }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orion/ideas');
      const data = await response.json();

      if (data.success) {
        setIdeas(data.ideas || []);
      } else {
        throw new Error(data.error || 'Failed to fetch ideas');
      }
    } catch (err: any) {
      console.error('Error fetching ideas:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...ideas];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(idea => idea.status === statusFilter);
    }

    // Apply tag filter
    if (tagFilter) {
      result = result.filter(idea =>
        idea.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(idea =>
        idea.title.toLowerCase().includes(query) ||
        idea.description?.toLowerCase().includes(query)
      );
    }

    setFilteredIdeas(result);
  }, [ideas, statusFilter, tagFilter, searchQuery]);

  // Fetch ideas on mount
  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Apply filters when ideas or filters change
  useEffect(() => {
    applyFilters();
  }, [ideas, statusFilter, tagFilter, searchQuery, applyFilters]);

  const handleRefresh = () => {
    fetchIdeas();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        <span className="ml-2 text-gray-400">Loading ideas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-200 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
          Your Ideas
          <Badge className="ml-2 bg-gray-700 text-gray-300">{ideas.length}</Badge>
        </h3>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="text-gray-300 border-gray-600"
        >
          <Loader2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-md p-3 mb-4">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Filter by tag"
              value={tagFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagFilter(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>

          <div>
            <Input
              placeholder="Search ideas"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Ideas List */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {ideas.length === 0 ? (
            <p>No ideas captured yet. Start by adding your first idea!</p>
          ) : (
            <p>No ideas match your filters. Try adjusting your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIdeas.map(idea => (
            <Link href={`/admin/idea-incubator/${idea.id}`} key={idea.id}>
              <Card className="bg-gray-750 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-gray-200">{idea.title}</h4>
                    const status = idea.status as IdeaStatus | undefined;
                    <Badge className={`${status && statusConfig[status as IdeaStatus] ? statusConfig[status as IdeaStatus].color : 'bg-gray-400'} text-white`}>
                      {status && statusConfig[status as IdeaStatus] ? statusConfig[status as IdeaStatus].label : 'Unknown'}
                    </Badge>
                  </div>

                  {idea.description && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{idea.description}</p>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {idea.updatedAt ? new Date(idea.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>

                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1 text-gray-500" />
                        <div className="flex flex-wrap gap-1">
                          {idea.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {tag}
                            </Badge>
                          ))}
                          {idea.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                              +{idea.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
