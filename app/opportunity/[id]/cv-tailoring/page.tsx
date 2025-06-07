'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EnhancedCVTailoringStudio } from '@/components/orion/EnhancedCVTailoringStudio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CVTailoringPage() {
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunity, setOpportunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [autoGenLoading, setAutoGenLoading] = useState(false);
  const [autoGenError, setAutoGenError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orion/opportunity/${opportunityId}`);
        const data = await response.json();

        if (data.success) {
          setOpportunity(data.opportunity);
        } else {
          setError(data.error || 'Failed to fetch opportunity');
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

  if (!opportunity) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>CV Tailoring for {opportunity.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Tailor your CV for this opportunity using AI assistance. The system will suggest relevant components,
            help you rephrase content to match the job requirements, and assemble a final CV.
          </p>
          {/* Auto Generate CV Button */}
          <div className="mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
              disabled={autoGenLoading}
              onClick={async () => {
                setAutoGenLoading(true);
                setAutoGenError(null);
                try {
                  // Fetch all CV components for this opportunity
                  const res = await fetch(`/api/orion/cv-components?opportunityId=${opportunityId}`);
                  const data = await res.json();
                  if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch CV components');
                  }
                  // Navigate to tailor content page (data will be fetched again on that page)
                  router.push(`/opportunity/${opportunityId}/tailor-content`);
                } catch (err: any) {
                  setAutoGenError(err.message || 'Failed to auto-generate CV');
                } finally {
                  setAutoGenLoading(false);
                }
              }}
            >
              {autoGenLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating CV...
                </span>
              ) : (
                "Auto Generate CV"
              )}
            </button>
            {autoGenError && (
              <p className="text-red-500 mt-2">{autoGenError}</p>
            )}
          </div>

          <EnhancedCVTailoringStudio
            jdAnalysis={opportunity.description || ''}
            jobTitle={opportunity.title || ''}
            companyName={opportunity.company || ''}
            webResearchContext={opportunity.webResearchContext || ''}
            opportunityId={opportunityId}
            onCVAssembled={(cv) => {
              // Save the CV to the opportunity record
              fetch(`/api/orion/opportunity/${opportunityId}/cv`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cv })
              });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
