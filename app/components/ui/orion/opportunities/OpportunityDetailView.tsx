'use client';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from '../../ui';
import { EvaluationOutput, OpportunityNotionOutputShared } from '@/lib/types';
import { Calendar, ExternalLink, Edit, Trash2, BarChart2, FileText, MessageSquare, Users } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { StatusUpdateButton } from './StatusUpdateButton';
import { OpportunityAnalysisDisplay } from './OpportunityAnalysisDisplay';
import Link from 'next/link';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

interface OpportunityDetailViewProps {
  OrionOpportunity: OpportunityNotionOutputShared;
  evaluation?: EvaluationOutput;
  onEdit?: () => void;
  onDelete?: () => void;
  opportunityId: string;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  OrionOpportunity,
  evaluation,
  onEdit,
  onDelete,
  opportunityId,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-gray-500';
      case 'researching':
        return 'bg-blue-400';
      case 'evaluating':
        return 'bg-blue-500';
      case 'evaluated_positive':
        return 'bg-green-500';
      case 'evaluated_negative':
        return 'bg-red-500';
      case 'application_drafting':
        return 'bg-indigo-400';
      case 'application_ready':
        return 'bg-indigo-500';
      case 'applied':
        return 'bg-purple-500';
      case 'outreach_planned':
        return 'bg-cyan-400';
      case 'outreach_sent':
        return 'bg-cyan-500';
      case 'follow_up_needed':
        return 'bg-amber-400';
      case 'follow_up_sent':
        return 'bg-amber-500';
      case 'interview_scheduled':
        return 'bg-yellow-500';
      case 'interview_completed':
        return 'bg-yellow-600';
      case 'offer_received':
        return 'bg-emerald-400';
      case 'negotiating':
        return 'bg-emerald-500';
      case 'accepted':
        return 'bg-emerald-600';
      case 'rejected_by_them':
        return 'bg-red-400';
      case 'declined_by_me':
        return 'bg-red-500';
      case 'on_hold':
        return 'bg-gray-400';
      case 'archived':
        return 'bg-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatType = (type: string | null | undefined): string => {
    if (!type) {
      return 'Unknown Type'; // Or return ''; or handle as appropriate
    }
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{OrionOpportunity.title}</h1>
          <p className="text-lg text-gray-300 mt-1">{OrionOpportunity.company}</p>
        </div>

        <div className="flex items-center space-x-2">
          <StatusUpdateButton opportunityId={OrionOpportunity.id} currentStatus={OrionOpportunity.status || ''} />

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
        {OrionOpportunity.status ? (
          <Badge className={`${getStatusColor(OrionOpportunity.status)} text-white`}>
            {formatStatus(OrionOpportunity.status)}
          </Badge>
        ) : (
          <Badge className="bg-gray-500 text-white">Unknown</Badge>
        )}

        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {formatType(OrionOpportunity.type)}
        </Badge>

        {OrionOpportunity.tags &&
          OrionOpportunity.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
              {tag}
            </Badge>
          ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluation" disabled={!evaluation}>
            Evaluation
          </TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {OrionOpportunity.content && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 whitespace-pre-wrap">{OrionOpportunity.content}</div>
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
                            style={{
                              width: `${evaluation.fitScorePercentage}%`,
                            }}
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
                      {OrionOpportunity.dateIdentified ? (
                        <>
                          {format(new Date(OrionOpportunity.dateIdentified), 'PPP')}
                          <span className="text-gray-500 text-sm ml-2">
                            ({formatDistanceToNow(new Date(OrionOpportunity.dateIdentified))} ago)
                          </span>
                        </>
                      ) : (
                        <span>Unknown date</span>
                      )}
                    </p>
                  </div>

                  {OrionOpportunity.nextActionDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Next Action Date</h4>
                      <p className="text-gray-300">{format(new Date(OrionOpportunity.nextActionDate), 'PPP')}</p>
                    </div>
                  )}

                  {OrionOpportunity.priority && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Priority</h4>
                      <Badge
                        className={
                          OrionOpportunity.priority === 'high'
                            ? 'bg-red-500'
                            : OrionOpportunity.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                        }
                      >
                        {OrionOpportunity.priority.charAt(0).toUpperCase() + OrionOpportunity.priority.slice(1)}
                      </Badge>
                    </div>
                  )}

                  {OrionOpportunity.sourceUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Source</h4>
                      <a
                        href={OrionOpportunity.sourceUrl}
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
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    Below you&apos;ll find various actions you can take related to this opportunity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/opportunity/${opportunityId}/cv-tailoring`} passHref>
                      <Button variant="outline" className="border-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        Tailor CV
                      </Button>
                    </Link>
                    <Link href={`/opportunity/${opportunityId}/stakeholders`} passHref>
                      <Button variant="outline" className="border-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        Find & Manage Stakeholders
                      </Button>
                    </Link>
                    <Link href={`/opportunity/${opportunityId}/communications`} passHref>
                      <Button variant="outline" className="border-gray-600">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Draft Communications
                      </Button>
                    </Link>
                    {/* Add more action buttons here */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluation" className="mt-6">
          <OpportunityAnalysisDisplay OrionOpportunity={OrionOpportunity} initialEvaluation={evaluation} />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Manage applications for this opportunity.</p>
              {/* Future: List applications, provide links to draft new ones */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Stakeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Identify and manage key stakeholders for this opportunity.</p>
              {/* Future: List stakeholders, allow adding/editing */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">Detailed notes and thoughts about this opportunity.</p>
              {/* Future: Rich text editor for notes */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
