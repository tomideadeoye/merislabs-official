'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Loader2, Calendar, ExternalLink } from 'lucide-react';
import { OpportunityActions } from '@/components/orion/pipeline/OpportunityActions';

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [OrionOpportunity, setOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orion/OrionOpportunity/${opportunityId}`);
        const data = await response.json();

        if (data.success) {
          setOpportunity(data.OrionOpportunity);
        } else {
          setError(data.error || 'Failed to fetch OrionOpportunity');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!OrionOpportunity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>OrionOpportunity Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested OrionOpportunity could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{OrionOpportunity.title}</h1>
          <p className="text-gray-500">{OrionOpportunity.company}</p>
        </div>
        <Badge variant={OrionOpportunity.status === 'Applied' ? 'success' : 'default'}>
          {OrionOpportunity.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {OrionOpportunity.content ? (
                <div dangerouslySetInnerHTML={{ __html: OrionOpportunity.content }} />
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}
            </div>

            {OrionOpportunity.url && (
              <div className="mt-4">
                <a
                  href={OrionOpportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Original Posting
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {OrionOpportunity.deadline && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-gray-500">{OrionOpportunity.deadline}</p>
                  </div>
                </div>
              )}

              {OrionOpportunity.location && (
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-500">{OrionOpportunity.location}</p>
                </div>
              )}

              {OrionOpportunity.salary && (
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-gray-500">{OrionOpportunity.salary}</p>
                </div>
              )}

              {OrionOpportunity.contact && (
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-gray-500">{OrionOpportunity.contact}</p>
                </div>
              )}

              {OrionOpportunity.tags && OrionOpportunity.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {OrionOpportunity.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <OpportunityActions OrionOpportunity={OrionOpportunity} />
            </CardContent>
          </Card>
        </div>
      </div>

      {OrionOpportunity.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{OrionOpportunity.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
