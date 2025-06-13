"use client";

import React from 'react';
import { Card, CardContent, CardFooter, Badge } from '@repo/ui';
import { Calendar, ExternalLink, BarChart2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { OrionOpportunity } from '@repo/shared';
import Link from 'next/link';

interface OpportunityCardProps {
  OrionOpportunity: OrionOpportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ OrionOpportunity }) => {
  console.log('[OpportunityCard][RENDER]', { OrionOpportunity });
  console.log('[OpportunityCard][COMPANY]', OrionOpportunity.companyOrInstitution);

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

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-500 transition-all">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-200 line-clamp-2">{OrionOpportunity.title}</h3>
          {OrionOpportunity.status ? (
            <Badge className={`${getStatusColor(OrionOpportunity.status)} text-white`}>
              {formatStatus(OrionOpportunity.status)}
            </Badge>
          ) : (
            <Badge className="bg-gray-500 text-white">Unknown</Badge>
          )}
        </div>

        <p className="text-sm text-gray-300 mt-2">
          {OrionOpportunity.companyOrInstitution && (
            <span>{OrionOpportunity.companyOrInstitution}</span>
          )}
        </p>

        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
          {OrionOpportunity.content || 'No description available'}
        </p>

        <div className="flex items-center mt-3 text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Added {OrionOpportunity.dateIdentified ? formatDistanceToNow(new Date(OrionOpportunity.dateIdentified)) + ' ago' : 'Unknown date'}
          </span>
        </div>

        {OrionOpportunity.relatedEvaluationId && (
          <div className="flex items-center mt-2 text-xs text-blue-400">
            <BarChart2 className="h-3 w-3 mr-1" />
            <span>Evaluation available</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <Link
          href={`/admin/OrionOpportunity-pipeline/${OrionOpportunity.id}`}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          View details
        </Link>

        {OrionOpportunity.sourceURL && (
          <a
            href={OrionOpportunity.sourceURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Source
          </a>
        )}
      </CardFooter>
    </Card>
  );
};
