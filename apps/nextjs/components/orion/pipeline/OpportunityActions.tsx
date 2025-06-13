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
import { Button } from '@repo/ui';
import type { OrionOpportunity } from '@repo/shared';

interface OpportunityActionsProps {
  OrionOpportunity: OrionOpportunity;
}

export function OpportunityActions({ OrionOpportunity }: OpportunityActionsProps) {
  return (
    <div className="space-y-4">
      {OrionOpportunity.tailoredCV && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <span className="text-sm flex items-center">
            <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
            Tailored CV
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/api/orion/OrionOpportunity/${OrionOpportunity.id}/cv`}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Link>
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href={`/OrionOpportunity/${OrionOpportunity.id}/analyze`}>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Analyze JD
          </Button>
        </Link>
        <Link href={`/OrionOpportunity/${OrionOpportunity.id}/cv-tailoring`}>
          <Button
            variant={OrionOpportunity.tailoredCV ? "default" : "outline"}
            size="sm"
            className={OrionOpportunity.tailoredCV ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            {OrionOpportunity.tailoredCV ? "View Tailored CV" : "Tailor CV"}
          </Button>
        </Link>
        <Link href={`/OrionOpportunity/${OrionOpportunity.id}/application`}>
          <Button variant="outline" size="sm">
            <FileEdit className="h-4 w-4 mr-2" />
            Draft Application
          </Button>
        </Link>
        <Link href={`/OrionOpportunity/${OrionOpportunity.id}/networking`}>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Find Contacts
          </Button>
        </Link>
      </div>
    </div>
  );
}
