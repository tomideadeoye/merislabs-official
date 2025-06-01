"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase, Building, CalendarDays, Tag, Link as LinkIcon,
  BarChart2, Clock, RefreshCw, MessageSquare, Users, ListTodo
} from 'lucide-react';
import { OpportunityActions } from './opportunities/OpportunityActions';
import type { Opportunity } from '@/types/opportunity';
import { CreateHabiticaTaskDialog } from './tasks/CreateHabiticaTaskDialog';
import { useOpportunityMemory } from '@/hooks/useOpportunityMemory';

interface OpportunityDetailViewProps {
  opportunityId: string;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({ opportunityId }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [taskDialogs, setTaskDialogs] = useState({
    evaluation: false,
    draft: false,
    outreach: false
  });

  const { evaluations, drafts, outreach } = useOpportunityMemory(opportunityId);

  useEffect(() => {
    const fetchOpportunity = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/orion/opportunity/${opportunityId}`);
        const data = await response.json();

        if (data.success && data.opportunity) {
          setOpportunity(data.opportunity);
        } else {
          throw new Error(data.error || 'Failed to fetch opportunity details');
        }
      } catch (err: any) {
        console.error('Error fetching opportunity details:', err);
        setError(err.message || 'An error occurred while fetching opportunity details');
      } finally {
        setIsLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  const handleRegenerate = async (type: 'evaluation' | 'draft' | 'outreach') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orion/${type}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId })
      });
      const data = await response.json();
      // Refresh the memory hook to get new data
      // await mutate(`/api/orion/memory/${opportunityId}`);
    } catch (err) {
      setError(`Failed to regenerate ${type}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md">
        <h3 className="font-medium mb-2">Error</h3>
        <p>{error || 'Opportunity not found'}</p>
      </div>
    );
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'identified': return 'bg-gray-500';
      case 'researching':
      case 'evaluating': return 'bg-blue-500';
      case 'evaluated_positive':
      case 'application_drafting':
      case 'application_ready': return 'bg-sky-500';
      case 'applied':
      case 'outreach_planned':
      case 'outreach_sent': return 'bg-indigo-500';
      case 'follow_up_needed':
      case 'follow_up_sent': return 'bg-purple-500';
      case 'interview_scheduled':
      case 'interview_completed': return 'bg-fuchsia-500';
      case 'offer_received':
      case 'negotiating': return 'bg-lime-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected_by_them':
      case 'declined_by_me': return 'bg-red-600';
      case 'on_hold': return 'bg-yellow-600';
      case 'archived': return 'bg-slate-600';
      default: return 'bg-gray-400';
    }
  };

  const formattedStatus = opportunity.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedType = opportunity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Overview & Quick Actions */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-blue-300">{opportunity.title}</CardTitle>
                <CardDescription className="text-gray-400 flex items-center mt-1">
                  <Building className="mr-1.5 h-4 w-4" /> {opportunity.companyOrInstitution}
                  <span className="mx-2">•</span>
                  <Briefcase className="mr-1.5 h-4 w-4" /> {formattedType}
                </CardDescription>
              </div>
              <Badge className={`text-white ${getStatusColor(opportunity.status)}`}>
                {formattedStatus}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-700 border-gray-600">
                <TabsTrigger value="details" className="data-[state=active]:bg-blue-600">
                  Details
                </TabsTrigger>
                <TabsTrigger value="actions" className="data-[state=active]:bg-purple-600">
                  Actions
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-green-600">
                  Notes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                {opportunity.descriptionSummary && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{opportunity.descriptionSummary}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-gray-400">Identified: </span>
                        <span className="ml-1 text-gray-300">{new Date(opportunity.dateIdentified).toLocaleDateString()}</span>
                      </div>

                      {opportunity.nextActionDate && (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="text-gray-400">Next Action: </span>
                          <span className="ml-1 text-gray-300">{new Date(opportunity.nextActionDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {opportunity.priority && (
                        <div className="flex items-center text-sm">
                          <BarChart2 className="mr-2 h-4 w-4 text-red-500" />
                          <span className="text-gray-400">Priority: </span>
                          <span className="ml-1 text-gray-300">{opportunity.priority.toUpperCase()}</span>
                        </div>
                      )}

                      {opportunity.sourceURL && (
                        <div className="flex items-center text-sm">
                          <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                          <span className="text-gray-400">Source: </span>
                          <a
                            href={opportunity.sourceURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-400 hover:text-blue-300"
                          >
                            View Original Posting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Available Actions</h3>
                  <OpportunityActions opportunity={opportunity} />
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Notes</h3>
                  {opportunity.notes ? (
                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{opportunity.notes}</p>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No notes available for this opportunity.</p>
                  )}

                  {/* Note editor could be added here in the future */}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={() => handleRegenerate('evaluation')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Re-evaluate Opportunity
            </Button>

            <Button
              onClick={() => handleRegenerate('draft')}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Generate New Draft
            </Button>

            <Button
              onClick={() => handleRegenerate('outreach')}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <Users className="mr-2 h-4 w-4" />
              Find Stakeholders
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Detailed Content */}
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="evaluation">
          <TabsList className="bg-gray-700 border-gray-600">
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="drafts">Application Drafts</TabsTrigger>
            <TabsTrigger value="outreach">Stakeholder Outreach</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="mt-4">
            {evaluations?.map((evaluation, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">
                      Evaluation {evaluations.length > 1 ? `#${index + 1}` : ''}
                    </CardTitle>
                    <Badge variant="secondary">
                      {new Date(evaluation.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {evaluation.fitScorePercentage}%
                    </div>
                    <div className="text-gray-400">Fit Score</div>
                  </div>
                  {evaluation.alignmentHighlights && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Alignments</h4>
                      <ul className="list-disc list-inside text-gray-400">
                        {evaluation.alignmentHighlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
            {drafts?.map((draft, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">
                      Draft {drafts.length > 1 ? `#${index + 1}` : ''}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge>{draft.type}</Badge>
                      <Badge variant="secondary">
                        {new Date(draft.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                    {draft.content}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="outreach" className="mt-4">
            {outreach?.map((contact, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 mb-4">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <Badge>{contact.role}</Badge>
                  </div>
                  <CardDescription>{contact.platform}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contact.messages?.map((message, mIndex) => (
                    <div key={mIndex} className="border-l-2 border-gray-700 pl-4">
                      <div className="text-sm text-gray-400 mb-1">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                        {message.content}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-4">
              {opportunity.statusHistory?.map((status, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(status.status)}`} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">
                      {new Date(status.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-gray-300">
                      Status changed to <span className="font-medium">{status.status.replace(/_/g, ' ')}</span>
                    </div>
                    {status.note && (
                      <div className="text-sm text-gray-400 mt-1">{status.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs and Modals */}
      <CreateHabiticaTaskDialog
        open={taskDialogs.evaluation}
        onOpenChange={(open) => setTaskDialogs(prev => ({ ...prev, evaluation: open }))}
        opportunityId={opportunityId}
        taskType="evaluation"
      />
      <CreateHabiticaTaskDialog
        open={taskDialogs.draft}
        onOpenChange={(open) => setTaskDialogs(prev => ({ ...prev, draft: open }))}
        opportunityId={opportunityId}
        taskType="draft"
      />
      <CreateHabiticaTaskDialog
        open={taskDialogs.outreach}
        onOpenChange={(open) => setTaskDialogs(prev => ({ ...prev, outreach: open }))}
        opportunityId={opportunityId}
        taskType="outreach"
      />
    </div>
  );
};
