'use client';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// GOAL OF FILE|FEATURES|FUNCTIONS: Displays a single opportunity as a card with key details (title, company, status, date identified, evaluation status, source URL) and a link to view details.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/ui/orion/opportunities/OpportunityCard.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by `OpportunityList` (`./OpportunityList.tsx`).
//   - Uses `OrionOpportunity` type (`@/lib/types`).
//   - Uses `@/components/ui` components (`Card`, `Badge`).
// Note if any: components to merge with, similar or redundant component
import React from 'react';

import Link from 'next/link';
import { OrionOpportunity } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, BarChart2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '../../card';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

interface OpportunityCardProps {
  opportunity: OrionOpportunity;
  onEdit?: (id: string) => void; // Optional edit handler
  onDelete?: (id: string) => void; // Optional delete handler
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onEdit, onDelete }) => {
  console.log('[OpportunityCard][RENDER]', { opportunity });
  console.log('[OpportunityCard][COMPANY]', opportunity.companyOrInstitution);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
        return 'bg-gray-500';
      case 'researching':
        return 'bg-blue-400';
      case 'evaluating':
        return 'bg-blue-500';
      case 'evaluatedPositive':
        return 'bg-green-500';
      case 'evaluatedNegative':
        return 'bg-red-500';
      case 'applicationDrafting':
        return 'bg-indigo-400';
      case 'applicationReady':
        return 'bg-indigo-500';
      case 'applied':
        return 'bg-purple-500';
      case 'outreachPlanned':
        return 'bg-cyan-400';
      case 'outreachSent':
        return 'bg-cyan-500';
      case 'followUpNeeded':
        return 'bg-amber-400';
      case 'followUpSent':
        return 'bg-amber-500';
      case 'interviewScheduled':
        return 'bg-yellow-500';
      case 'interviewCompleted':
        return 'bg-yellow-600';
      case 'offerReceived':
        return 'bg-emerald-400';
      case 'negotiating':
        return 'bg-emerald-500';
      case 'accepted':
        return 'bg-emerald-600';
      case 'rejectedByThem':
        return 'bg-red-400';
      case 'declinedByMe':
        return 'bg-red-500';
      case 'onHold':
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

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-500 transition-all">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-200 line-clamp-2">{opportunity.title}</h3>
          {opportunity.status ? (
            <Badge className={`${getStatusColor(opportunity.status)} text-white`}>
              {formatStatus(opportunity.status)}
            </Badge>
          ) : (
            <Badge className="bg-gray-500 text-white">Unknown</Badge>
          )}
        </div>

        <p className="text-sm text-gray-300 mt-2">
          {opportunity.companyOrInstitution && <span>{opportunity.companyOrInstitution}</span>}
        </p>

        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{opportunity.content || 'No description available'}</p>

        <div className="flex items-center mt-3 text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            Added{' '}
            {opportunity.dateIdentified
              ? formatDistanceToNow(new Date(opportunity.dateIdentified)) + ' ago'
              : 'Unknown date'}
          </span>
        </div>

        {opportunity.relatedEvaluationId && (
          <div className="flex items-center mt-2 text-xs text-blue-400">
            <BarChart2 className="h-3 w-3 mr-1" />
            <span>Evaluation available</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <Link
          href={`/admin/opportunity-pipeline/${opportunity.id}`}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          View details
        </Link>

        <div className="flex space-x-2">
          {onEdit && (
            <button onClick={() => onEdit(opportunity.id)} className="text-xs text-yellow-400 hover:text-yellow-300">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(opportunity.id)} className="text-xs text-red-400 hover:text-red-300">
              Delete
            </button>
          )}
          {opportunity.sourceUrl && (
            <a
              href={opportunity.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Source
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
