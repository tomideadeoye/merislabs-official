/**
 * @fileoverview Page for the CV Tailoring Studio.
 * @description This server component fetches the opportunity and all available CV components
 * and then passes them to the client-side studio for interactive tailoring.
 */
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { FileText } from 'lucide-react';

interface Props {
  params: { opportunityId: string };
}

export default async function CVTailoringPage({ params }: Props) {
  const opportunity = await getOpportunityByIdFromDb(params.opportunityId);
  const cvComponents = await fetchAllCvComponents();

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <PageHeader
        title="CV Tailoring Studio"
        icon={<FileText className="h-7 w-7" />}
        description={`Crafting the perfect CV for: ${opportunity.title} at ${opportunity.company}`}
      />
      <CVTailoringStudio opportunity={opportunity} cvComponents={cvComponents} />
    </div>
  );
}
