"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types/opportunity';
import { 
  Calendar, 
  ExternalLink, 
  ChevronRight,
  BarChart2,
  FileText,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const router = useRouter();
  
  const handleViewDetails = () => {
    router.push(`/admin/opportunity-pipeline/${opportunity.id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'identified':
      case 'researching':
      case 'evaluating':
        return 'bg-blue-900/30 text-blue-300 border-blue-700';
      case 'evaluated_positive':
      case 'application_drafting':
      case 'application_ready':
        return 'bg-purple-900/30 text-purple-300 border-purple-700';
      case 'applied':
      case 'outreach_planned':
      case 'outreach_sent':
      case 'follow_up_needed':
      case 'follow_up_sent':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'interview_scheduled':
      case 'interview_completed':
        return 'bg-orange-900/30 text-orange-300 border-orange-700';
      case 'offer_received':
      case 'negotiating':
      case 'accepted':
        return 'bg-green-900/30 text-green-300 border-green-700';
      case 'rejected_by_them':
      case 'declined_by_me':
        return 'bg-red-900/30 text-red-300 border-red-700';
      case 'on_hold':
      case 'archived':
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };
  
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/30 text-red-300 border-red-700';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-700';
      case 'low':
        return 'bg-green-900/30 text-green-300 border-green-700';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-700';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const hasEvaluation = !!opportunity.relatedEvaluationId;
  const hasApplicationDrafts = !!opportunity.applicationMaterialIds;
  const hasStakeholders = !!opportunity.stakeholderContactIds;

  return (
    <Card 
      className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={handleViewDetails}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-200">{opportunity.title}</h3>
            <p className="text-sm text-gray-400">{opportunity.companyOrInstitution}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <Badge 
              variant="outline" 
              className={getStatusColor(opportunity.status)}
            >
              {opportunity.status.replace(/_/g, ' ')}
            </Badge>
            
            {opportunity.priority && (
              <Badge 
                variant="outline" 
                className={getPriorityColor(opportunity.priority)}
              >
                {opportunity.priority} priority
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-xs text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Identified: {formatDate(opportunity.dateIdentified)}</span>
          
          {opportunity.nextActionDate && (
            <>
              <span className="mx-1">•</span>
              <span>Next action: {formatDate(opportunity.nextActionDate)}</span>
            </>
          )}
        </div>
        
        {opportunity.descriptionSummary && (
          <p className="mt-2 text-sm text-gray-300 line-clamp-2">{opportunity.descriptionSummary}</p>
        )}
        
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {opportunity.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-700 text-gray-300 text-xs">
                {tag}
              </Badge>
            ))}
            {opportunity.tags.length > 3 && (
              <Badge variant="outline" className="bg-gray-700 text-gray-300 text-xs">
                +{opportunity.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex space-x-2">
            {hasEvaluation && (
              <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-700/50 flex items-center">
                <BarChart2 className="h-3 w-3 mr-1" />
                Evaluated
              </Badge>
            )}
            
            {hasApplicationDrafts && (
              <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-700/50 flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Drafts
              </Badge>
            )}
            
            {hasStakeholders && (
              <Badge variant="outline" className="bg-purple-900/20 text-purple-300 border-purple-700/50 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Contacts
              </Badge>
            )}
          </div>
          
          {opportunity.sourceURL && (
            <a 
              href={opportunity.sourceURL} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 justify-center bg-gray-700 hover:bg-gray-600 text-gray-300"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};