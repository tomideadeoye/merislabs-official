/**
 * @fileoverview Server Component to fetch data for a single opportunity and render the client view.
 * @description This page acts as the data-loading entry point for the Opportunity Command Center.
 */
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { OpportunityDetailView } from '@/components/ui/orion/opportunities/OpportunityDetailView';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Briefcase } from 'lucide-react';

interface Props {
  params: { opportunityId: string };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { opportunityId } = await params; // Destructure for clarity, satisfies linter hint

  // Basic validation to prevent processing .map files or other non-UUID-like strings
  // A more robust UUID validation regex could be used if needed.
  if (!opportunityId || opportunityId.includes('.') || opportunityId.length < 36) {
    console.warn(`[OpportunityDetailPage] Invalid opportunityId format received: ${opportunityId}. Returning 404.`);
    notFound();
  }

  const opportunity = await getOpportunityByIdFromDb(opportunityId);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="space-y-6 container mx-auto py-8">
      <PageHeader
        title={opportunity.title}
        icon={<Briefcase className="h-7 w-7" />}
        description={`Command Center for your opportunity at ${opportunity.company}.`}
      />
      <OpportunityDetailView opportunity={opportunity} />
    </div>
  );
}
