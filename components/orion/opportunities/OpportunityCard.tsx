"use client";

import React from 'react';
import type { Opportunity } from '@/types/opportunity';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, CalendarDays, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface OpportunityCardProps {
  opportunity: Opportunity;
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

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const formattedStatus = opportunity.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedType = opportunity.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Card className="flex flex-col h-full bg-gray-800 border-gray-700 hover:shadow-xl hover:border-blue-500/60 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-blue-300 hover:text-blue-200">
            <Link href={`/admin/opportunity-pipeline/${opportunity.id}`}>
              {opportunity.title}
            </Link>
          </CardTitle>
          <Badge className={`text-xs text-white ${getStatusColor(opportunity.status)}`}>
            {formattedStatus}
          </Badge>
        </div>
        <CardDescription className="text-xs text-gray-400 flex items-center pt-1">
          <Building className="mr-1.5 h-3.5 w-3.5" /> {opportunity.companyOrInstitution}
          <Briefcase className="ml-3 mr-1.5 h-3.5 w-3.5" /> {formattedType}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-2 text-sm text-gray-300">
        {opportunity.descriptionSummary && (
          <p className="line-clamp-3 text-gray-400 text-xs">
            {opportunity.descriptionSummary}
          </p>
        )}
        
        <div className="flex items-center text-xs text-gray-500">
          <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
          Identified: {new Date(opportunity.dateIdentified).toLocaleDateString()}
          {opportunity.nextActionDate && (
            <span className="ml-3 flex items-center">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-yellow-400" /> 
              Next Action: {new Date(opportunity.nextActionDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {opportunity.priority && (
          <div className="flex items-center text-xs">
            <BarChart2 className="mr-1.5 h-3.5 w-3.5 text-red-400" /> 
            Priority: <span className="font-medium text-gray-200 ml-1">{opportunity.priority.toUpperCase()}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex flex-wrap gap-1">
          {opportunity.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300 hover:bg-gray-600">
              {tag}
            </Badge>
          ))}
          {opportunity.tags && opportunity.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-500">
              +{opportunity.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};