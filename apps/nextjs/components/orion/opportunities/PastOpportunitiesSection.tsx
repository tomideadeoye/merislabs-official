"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { Loader2, History, RefreshCw, ExternalLink } from 'lucide-react';
import { OrionOpportunity } from '@repo/shared';

interface PastOpportunitiesProps {
  OrionOpportunity: OrionOpportunity;
}

interface SimilarOpportunity {
  id: string;
  title: string;
  company: string;
  status: string;
  similarity: number;
  date: string;
  outcome?: string;
}

export const PastOpportunitiesSection: React.FC<PastOpportunitiesProps> = ({ OrionOpportunity }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [similarOpportunities, setSimilarOpportunities] = useState<SimilarOpportunity[]>([]);

  const fetchSimilarOpportunities = useCallback(async () => {
    setIsLoading(true);

    try {
      // Search for similar opportunities in memory
      const response = await fetch('/api/orion/memory/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `${OrionOpportunity.title} ${OrionOpportunity.company} ${OrionOpportunity.type} ${OrionOpportunity.tags?.join(' ') || ''}`,
          collectionName: 'orion_memory',
          limit: 5,
          filter: {
            must: [
              {
                key: 'type',
                match: {
                  value: 'opportunity_evaluation'
                }
              }
            ],
            must_not: [
              {
                key: 'opportunityId',
                match: {
                  value: OrionOpportunity.id
                }
              }
            ]
          },
          minScore: 0.6
        })
      });

      const data = await response.json();

      if (data.success && data.results && data.results.length > 0) {
        // Transform the results into a more usable format
        const opportunities = data.results.map((item: any) => ({
          id: item.payload.opportunityId || 'unknown',
          title: item.payload.title || 'Unknown OrionOpportunity',
          company: item.payload.company || 'Unknown Company',
          status: item.payload.status || 'unknown',
          similarity: Math.round(item.score * 100),
          date: item.payload.timestamp || 'Unknown Date',
          outcome: item.payload.outcome || undefined
        }));

        setSimilarOpportunities(opportunities);
      }
    } catch (error) {
      console.error("Error fetching similar opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [OrionOpportunity]);

  useEffect(() => {
    if (OrionOpportunity) {
      fetchSimilarOpportunities();
    }
  }, [OrionOpportunity, fetchSimilarOpportunities]);

  const getStatusColor = (status: string) => {
    if (status.includes('accepted') || status.includes('offer')) {
      return 'bg-green-900/30 text-green-300 border-green-700';
    } else if (status.includes('rejected') || status.includes('declined')) {
      return 'bg-red-900/30 text-red-300 border-red-700';
    } else if (status.includes('applied') || status.includes('interview')) {
      return 'bg-blue-900/30 text-blue-300 border-blue-700';
    } else {
      return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <History className="mr-2 h-5 w-5 text-amber-400" />
          Similar Past Opportunities
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSimilarOpportunities}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        ) : similarOpportunities.length > 0 ? (
          <div className="space-y-4">
            {similarOpportunities.map((item, index) => (
              <div key={index} className="bg-gray-700 border border-gray-600 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-200">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.company}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(item.status)}
                      >
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-amber-900/30 text-amber-300 border-amber-700"
                      >
                        {item.similarity}% similar
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-200"
                    onClick={() => {
                      if (item.id !== 'unknown') {
                        window.open(`/admin/OrionOpportunity-pipeline/${item.id}`, '_blank');
                      }
                    }}
                    disabled={item.id === 'unknown'}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {item.outcome && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-400">Outcome: </span>
                    <span className="text-gray-300">{item.outcome}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-400">No similar opportunities found in memory.</p>
            <p className="text-sm text-gray-500 mt-2">As you evaluate more opportunities, this section will populate with relevant past experiences.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
