import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  FileEdit, 
  Search, 
  Users, 
  Calendar, 
  ExternalLink,
  Download,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types/opportunity';

interface OpportunityActionsProps {
  opportunity: Opportunity;
}

export function OpportunityActions({ opportunity }: OpportunityActionsProps) {
  return (
    <div className="space-y-4">
      {opportunity.tailoredCV && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-sm flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
            Tailored CV
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/api/orion/opportunity/${opportunity.id}/cv`}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Link>
          </Button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Link href={`/opportunity/${opportunity.id}/analyze`}>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Analyze JD
          </Button>
        </Link>
        <Link href={`/opportunity/${opportunity.id}/cv-tailoring`}>
          <Button 
            variant={opportunity.tailoredCV ? "default" : "outline"} 
            size="sm"
            className={opportunity.tailoredCV ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            {opportunity.tailoredCV ? "View Tailored CV" : "Tailor CV"}
          </Button>
        </Link>
        <Link href={`/opportunity/${opportunity.id}/application`}>
          <Button variant="outline" size="sm">
            <FileEdit className="h-4 w-4 mr-2" />
            Draft Application
          </Button>
        </Link>
        <Link href={`/opportunity/${opportunity.id}/networking`}>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Find Contacts
          </Button>
        </Link>
      </div>
    </div>
  );
}