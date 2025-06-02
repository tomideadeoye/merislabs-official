"use client";

import React, { useState, useEffect } from 'react';
import { OpportunityDetailView } from '@/components/orion/opportunities/OpportunityDetailView';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft, Loader2 } from 'lucide-react';
import { Opportunity, EvaluationOutput } from '@/types/opportunity';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { Textarea } from '@/components/ui/textarea';

interface OpportunityDetailPageProps {
  params: {
    opportunityId: string;
  };
}

export default function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { opportunityId } = params;
  const router = useRouter();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // State for application drafting
  const [isDraftingApplication, setIsDraftingApplication] = useState(false);
  const [draftApplicationContent, setDraftApplicationContent] = useState<string | null>(null);
  const [draftApplicationError, setDraftApplicationError] = useState<string | null>(null);

  // State for stakeholder and outreach
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [stakeholdersContent, setStakeholdersContent] = useState<string | null>(null);
  const [outreachMessagesContent, setOutreachMessagesContent] = useState<string | null>(null);
  const [outreachError, setOutreachError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunityData = async () => {
      try {
        setLoading(true);

        // Fetch opportunity details
        const opportunityResponse = await fetch(`/api/orion/notion/opportunity/${opportunityId}`);

        if (!opportunityResponse.ok) {
          throw new Error('Failed to fetch opportunity details');
        }

        const opportunityData = await opportunityResponse.json();

        if (opportunityData.success && opportunityData.opportunity) {
          setOpportunity(opportunityData.opportunity);

          // If there's an evaluation ID, fetch the evaluation
          if (opportunityData.opportunity.relatedEvaluationId) {
            try {
              const evaluationResponse = await fetch(`/api/orion/opportunity/${opportunityId}/evaluation`);

              if (evaluationResponse.ok) {
                const evaluationData = await evaluationResponse.json();

                if (evaluationData.success && evaluationData.evaluation) {
                  setEvaluation(evaluationData.evaluation);
                }
              }
            } catch (evalError) {
              console.error('Error fetching evaluation:', evalError);
              // Don't fail the whole page if just the evaluation fails
            }
          }
        } else {
          throw new Error(opportunityData.error || 'Failed to fetch opportunity details');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Error fetching opportunity data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityData();
  }, [opportunityId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete opportunity');
      }

      router.push('/admin/opportunity-pipeline');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error deleting opportunity:', err);
      setIsDeleting(false);
    }
  };

  // Function to handle application drafting
  const handleDraftApplication = async () => {
    if (!opportunityId) return;

    setIsDraftingApplication(true);
    setDraftApplicationContent(null);
    setDraftApplicationError(null);

    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/draft-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally send tailored CV content or other context in the body
        // body: JSON.stringify({ tailoredCVContent: yourTailoredCVContentVariable }),
      });

      const data = await response.json();

      if (data.success && data.draft_content) {
        setDraftApplicationContent(data.draft_content);
      } else {
        setDraftApplicationError(data.error || 'Failed to generate application draft.');
      }
    } catch (err: any) {
      console.error('Error drafting application:', err);
      setDraftApplicationError(err.message || 'An unexpected error occurred during drafting.');
    } finally {
      setIsDraftingApplication(false);
    }
  };

  // Function to handle stakeholder identification and outreach drafting
  const handleGenerateOutreach = async () => {
    if (!opportunityId) return;

    setIsGeneratingOutreach(true);
    setStakeholdersContent(null);
    setOutreachMessagesContent(null);
    setOutreachError(null);

    try {
      const response = await fetch(`/api/orion/opportunity/${opportunityId}/stakeholder-outreach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Optionally send more context
        // body: JSON.stringify({ tailoredCVContent, draftApplicationContent }),
      });

      const data = await response.json();

      if (data.success) {
        setStakeholdersContent(data.identified_stakeholders || null);
        setOutreachMessagesContent(data.draft_outreach_messages || null);
        if (!data.identified_stakeholders && !data.draft_outreach_messages) {
          setOutreachError('No stakeholders identified and no outreach messages drafted.');
        }
      } else {
        setOutreachError(data.error || 'Failed to generate stakeholder and outreach content.');
      }
    } catch (err: any) {
      console.error('Error generating stakeholder outreach:', err);
      setOutreachError(err.message || 'An unexpected error occurred during outreach generation.');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400 mb-4" />
        <p className="text-gray-400">Loading opportunity details...</p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Opportunity Not Found"
          icon={<Briefcase className="h-7 w-7" />}
          description="The requested opportunity could not be found."
        />

        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
          {error || 'Opportunity not found'}
        </div>

        <Button asChild>
          <Link href="/admin/opportunity-pipeline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="border-gray-700">
          <Link href="/admin/opportunity-pipeline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Opportunities
          </Link>
        </Button>

        {isDeleting && (
          <div className="flex items-center text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Deleting...
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="cv-tailoring">CV Tailoring</TabsTrigger>
          <TabsTrigger value="application">Application Drafting</TabsTrigger>
          <TabsTrigger value="outreach">Stakeholder & Outreach</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <OpportunityDetailView
            opportunity={opportunity}
            evaluation={evaluation || undefined}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="cv-tailoring" className="mt-4">
          <CVTailoringStudio
            jobTitle={opportunity.title || ''}
            companyName={opportunity.company || ''}
            jobDescription={opportunity.description || ''}
          />
        </TabsContent>

        <TabsContent value="application" className="mt-4 space-y-4">
          <div className="p-4 border rounded-md bg-gray-800 space-y-4">
            <h3 className="text-xl font-semibold">Draft Application Materials</h3>
            <p className="text-gray-400 text-sm">
              Generate draft content (e.g., cover letter text, key points) tailored for this opportunity based on your profile.
            </p>
            <Button
              onClick={handleDraftApplication}
              disabled={isDraftingApplication}
            >
              {isDraftingApplication ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Briefcase className="mr-2 h-4 w-4" />
              )}
              Draft Application
            </Button>

            {draftApplicationError && (
              <div className="text-red-500 text-sm">
                Error: {draftApplicationError}
              </div>
            )}

            {draftApplicationContent && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Generated Draft:</h4>
                <Textarea
                  value={draftApplicationContent}
                  readOnly
                  className="min-h-[200px] bg-gray-700 text-white"
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="outreach" className="mt-4 space-y-4">
          <div className="p-4 border rounded-md bg-gray-800 space-y-4">
            <h3 className="text-xl font-semibold">Stakeholder Identification & Outreach</h3>
            <p className="text-gray-400 text-sm">
              Identify potential stakeholders for this opportunity and draft initial outreach messages.
            </p>
            <Button
              onClick={handleGenerateOutreach}
              disabled={isGeneratingOutreach}
            >
              {isGeneratingOutreach ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Briefcase className="mr-2 h-4 w-4" />
              )}
              Generate Stakeholders & Outreach
            </Button>

            {outreachError && (
              <div className="text-red-500 text-sm">
                Error: {outreachError}
              </div>
            )}

            {stakeholdersContent && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Identified Stakeholders:</h4>
                <Textarea
                  value={stakeholdersContent}
                  readOnly
                  className="min-h-[100px] bg-gray-700 text-white"
                />
              </div>
            )}

            {outreachMessagesContent && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Draft Outreach Messages:</h4>
                <Textarea
                  value={outreachMessagesContent}
                  readOnly
                  className="min-h-[200px] bg-gray-700 text-white"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
