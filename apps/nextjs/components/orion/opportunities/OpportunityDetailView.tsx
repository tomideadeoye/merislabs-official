"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Opportunity, EvaluationOutput } from '@shared/types/opportunity';
import { Calendar, ExternalLink, Edit, Trash2, BarChart2, FileText, MessageSquare, Users } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { StatusUpdateButton } from './StatusUpdateButton';
import Link from 'next/link';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  evaluation?: EvaluationOutput;
  onEdit?: () => void;
  onDelete?: () => void;
  opportunityId: string;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  evaluation,
  onEdit,
  onDelete,
  opportunityId
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified': return 'bg-gray-500';
      case 'researching': return 'bg-blue-400';
      case 'evaluating': return 'bg-blue-500';
      case 'evaluated_positive': return 'bg-green-500';
      case 'evaluated_negative': return 'bg-red-500';
      case 'application_drafting': return 'bg-indigo-400';
      case 'application_ready': return 'bg-indigo-500';
      case 'applied': return 'bg-purple-500';
      case 'outreach_planned': return 'bg-cyan-400';
      case 'outreach_sent': return 'bg-cyan-500';
      case 'follow_up_needed': return 'bg-amber-400';
      case 'follow_up_sent': return 'bg-amber-500';
      case 'interview_scheduled': return 'bg-yellow-500';
      case 'interview_completed': return 'bg-yellow-600';
      case 'offer_received': return 'bg-emerald-400';
      case 'negotiating': return 'bg-emerald-500';
      case 'accepted': return 'bg-emerald-600';
      case 'rejected_by_them': return 'bg-red-400';
      case 'declined_by_me': return 'bg-red-500';
      case 'on_hold': return 'bg-gray-400';
      case 'archived': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatType = (type: string | null | undefined): string => {
    if (!type) {
      return 'Unknown Type'; // Or return ''; or handle as appropriate
    }
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{opportunity.title}</h1>
          <p className="text-lg text-gray-300 mt-1">{opportunity.company}</p>
        </div>

        <div className="flex items-center space-x-2">
          <StatusUpdateButton opportunityId={opportunity.id} currentStatus={opportunity.status || ''} />

          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="border-gray-600">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}

          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {opportunity.status ? (
          <Badge className={`${getStatusColor(opportunity.status)} text-white`}>
            {formatStatus(opportunity.status)}
          </Badge>
        ) : (
          <Badge className="bg-gray-500 text-white">Unknown</Badge>
        )}

        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {formatType(opportunity.type)}
        </Badge>

        {opportunity.tags && opportunity.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluation" disabled={!evaluation}>Evaluation</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {opportunity.content && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {opportunity.content}
                    </div>
                  </CardContent>
                </Card>
              )}

              {evaluation && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-gray-200">Evaluation Summary</CardTitle>
                    <Button variant="outline" size="sm" asChild className="border-gray-600">
                      <Link href={`#evaluation`} onClick={() => setActiveTab('evaluation')}>
                        <BarChart2 className="h-4 w-4 mr-1" />
                        View Full Evaluation
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Fit Score</h4>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${evaluation.fitScorePercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-right text-sm text-gray-400 mt-1">{evaluation.fitScorePercentage}%</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-1">Recommendation</h4>
                        <p className="text-gray-200">{evaluation.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-200">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Date Identified</h4>
                    <p className="text-gray-300 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {opportunity.dateIdentified ? (
                        <>
                          {format(new Date(opportunity.dateIdentified), 'PPP')}
                          <span className="text-gray-500 text-sm ml-2">
                            ({formatDistanceToNow(new Date(opportunity.dateIdentified))} ago)
                          </span>
                        </>
                      ) : (
                        <span>Unknown date</span>
                      )}
                    </p>
                  </div>

                  {opportunity.nextActionDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Next Action Date</h4>
                      <p className="text-gray-300">
                        {format(new Date(opportunity.nextActionDate), 'PPP')}
                      </p>
                    </div>
                  )}

                  {opportunity.priority && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Priority</h4>
                      <Badge
                        className={
                          opportunity.priority === 'high' ? 'bg-red-500' :
                          opportunity.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }
                      >
                        {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)}
                      </Badge>
                    </div>
                  )}

                  {opportunity.sourceURL && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Source</h4>
                      <a
                        href={opportunity.sourceURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Source
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-200">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full border-gray-600 justify-start" asChild>
                    <Link href={`/admin/opportunity-pipeline/${opportunity.id}/evaluate`}>
                      <BarChart2 className="h-4 w-4 mr-2" />
                      {evaluation ? 'Re-evaluate' : 'Evaluate'} Opportunity
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full border-gray-600 justify-start" asChild>
                    <Link href={`/admin/opportunity-pipeline/${opportunity.id}/draft`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Draft Application
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full border-gray-600 justify-start" asChild>
                    <Link href={`/admin/opportunity-pipeline/${opportunity.id}/stakeholders`}>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Stakeholders
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full border-gray-600 justify-start" asChild>
                    <Link href={`/admin/opportunity-pipeline/${opportunity.id}/notes`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Notes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          {evaluation ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Fit Score</h3>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${evaluation.fitScorePercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-400">{evaluation.fitScorePercentage}%</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Recommendation</h3>
                    <p className="text-gray-300">{evaluation.recommendation}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Reasoning</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{evaluation.reasoning}</p>
                  </div>

                  {evaluation.alignmentHighlights && evaluation.alignmentHighlights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Alignment Highlights</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        {evaluation.alignmentHighlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.gapAnalysis && evaluation.gapAnalysis.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Gap Analysis</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        {evaluation.gapAnalysis.map((gap, index) => (
                          <li key={index}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {evaluation.riskRewardAnalysis && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Risk/Reward Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {evaluation.riskRewardAnalysis.potentialRewards && (
                          <div className="bg-gray-700 p-4 rounded-md">
                            <h4 className="font-medium text-gray-200 mb-2">Potential Rewards</h4>
                            <p className="text-gray-300">{evaluation.riskRewardAnalysis.potentialRewards}</p>
                          </div>
                        )}

                        {evaluation.riskRewardAnalysis.potentialRisks && (
                          <div className="bg-gray-700 p-4 rounded-md">
                            <h4 className="font-medium text-gray-200 mb-2">Potential Risks</h4>
                            <p className="text-gray-300">{evaluation.riskRewardAnalysis.potentialRisks}</p>
                          </div>
                        )}

                        {evaluation.riskRewardAnalysis.timeInvestment && (
                          <div className="bg-gray-700 p-4 rounded-md">
                            <h4 className="font-medium text-gray-200 mb-2">Time Investment</h4>
                            <p className="text-gray-300">{evaluation.riskRewardAnalysis.timeInvestment}</p>
                          </div>
                        )}

                        {evaluation.riskRewardAnalysis.financialConsiderations && (
                          <div className="bg-gray-700 p-4 rounded-md">
                            <h4 className="font-medium text-gray-200 mb-2">Financial Considerations</h4>
                            <p className="text-gray-300">{evaluation.riskRewardAnalysis.financialConsiderations}</p>
                          </div>
                        )}

                        {evaluation.riskRewardAnalysis.careerImpact && (
                          <div className="bg-gray-700 p-4 rounded-md">
                            <h4 className="font-medium text-gray-200 mb-2">Career Impact</h4>
                            <p className="text-gray-300">{evaluation.riskRewardAnalysis.careerImpact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {evaluation.suggestedNextSteps && evaluation.suggestedNextSteps.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Suggested Next Steps</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300">
                        {evaluation.suggestedNextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No evaluation available. Click "Evaluate Opportunity" to create one.
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="text-center py-12 text-gray-400">
              Application drafts will appear here. Click "Draft Application" to create one.
          </div>
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <div className="text-center py-12 text-gray-400">
              Stakeholders will appear here. Click "Manage Stakeholders" to add contacts.
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="text-center py-12 text-gray-400">
              Notes will appear here. Click "Add Notes" to create one.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
