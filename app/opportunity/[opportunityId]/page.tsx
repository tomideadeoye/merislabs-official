'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Loader2, Calendar, ExternalLink } from 'lucide-react';
import { OrionOpportunity, OpportunityStatus } from '@/lib/types';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { OpportunityActions } from '@/components/orion/pipeline/OpportunityActions';

export default function OpportunityDetailPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunityData, setOpportunity] = useState<OrionOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orion/opportunities/${opportunityId}`);
        const data = await response.json();

        if (data.success) {
          setOpportunity(data.opportunity);
        } else {
          setError(data.error || 'Failed to fetch opportunity');
        }
      } catch (err: unknown) {
        logger.error('Error fetching opportunity details:', { error: err, opportunityId });
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

  if (!opportunityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Opportunity Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested opportunity could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  const handleEvaluate = (id: string) => {
    logger.info(`Evaluating opportunity: ${id}`);
    // Example: router.push(`/opportunity/${id}/evaluation`);
  };

  const handleDraftApplication = (id: string) => {
    logger.info(`Drafting application for opportunity: ${id}`);
    router.push(`/opportunity/${id}/cv-tailoring`);
  };

  const handleFindStakeholders = (id: string) => {
    logger.info(`Finding stakeholders for opportunity: ${id}`);
    // Example: router.push(`/opportunity/${id}/networking-hub`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{opportunityData.title}</h1>
          <p className="text-gray-500">{opportunityData.company}</p>
        </div>
        <Badge variant={opportunityData.status === OpportunityStatus.APPLIED ? 'success' : 'default'}>
          {opportunityData.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {opportunityData.content ? (
                <div dangerouslySetInnerHTML={{ __html: opportunityData.content }} />
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}
            </div>

            {opportunityData.url && (
              <div className="mt-4">
                <a
                  href={opportunityData.url}
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
              {opportunityData.deadline && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-gray-500">{opportunityData.deadline}</p>
                  </div>
                </div>
              )}

              {opportunityData.location && (
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-500">{opportunityData.location}</p>
                </div>
              )}

              {opportunityData.salary && (
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-gray-500">{opportunityData.salary}</p>
                </div>
              )}

              {opportunityData.contact && (
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-gray-500">{opportunityData.contact}</p>
                </div>
              )}

              {opportunityData.tags && opportunityData.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {opportunityData.tags.map((tag: string, index: number) => (
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
              <OpportunityActions
                opportunity={opportunityData}
                onEvaluate={handleEvaluate}
                onDraftApplication={handleDraftApplication}
                onFindStakeholders={handleFindStakeholders}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {opportunityData.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{opportunityData.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
