import { OpportunityNotionOutputShared, EvaluationOutput } from '@repo/shared/types/orion';
import { notFound } from 'next/navigation';
import { OpportunityDetailView } from '../../../../../components/orion/OpportunityDetailView';

// GOAL:
// This page displays the detailed view of a single opportunity, including its evaluation and related data.
// Data is fetched via a dedicated Next.js API route to ensure server-side data fetching and prevent client-side import of Notion service.
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// - Uses `@repo/shared/types/orion` for Opportunity types.
// - Fetches data from `/api/orion/opportunity/[id]` and `/api/orion/OrionOpportunity/[id]/evaluation`.
// - Renders `OpportunityDetailView` from `../../../../../components/orion/OpportunityDetailView`.
// next steps if any:
// components to merge with if any:

interface Props {
  params: {
    opportunityId: string;
  };
}

export default async function OpportunityPipelinePage({ params }: Props) {
  const resolvedParams = await params;
  const { opportunityId } = resolvedParams;

  let OrionOpportunity: OpportunityNotionOutputShared | null = null;
  let evaluation: EvaluationOutput | undefined = undefined;

  try {
    const opportunityRes = await fetch(`/api/orion/opportunity/${opportunityId}`);
    if (!opportunityRes.ok) {
      console.error(`Failed to fetch opportunity ${opportunityId}:`, opportunityRes.status, opportunityRes.statusText);
      notFound();
    }
    const opportunityData = await opportunityRes.json();

    if (opportunityData.success && opportunityData.opportunity) {
      OrionOpportunity = opportunityData.opportunity;
    } else {
      console.error('API returned error for opportunity:', opportunityData.error);
      notFound();
    }

    // Attempt to load an existing evaluation for this OrionOpportunity
    const evaluationRes = await fetch(`/api/orion/OrionOpportunity/${opportunityId}/evaluation`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (evaluationRes.ok) {
      const evaluationData = await evaluationRes.json();
      evaluation = evaluationData as EvaluationOutput;
    } else {
      console.error('Failed to fetch evaluation:', evaluationRes.statusText);
    }
  } catch (error: unknown) {
    console.error('Error fetching opportunity or evaluation:', error);
    notFound();
  }

  if (!OrionOpportunity) {
    notFound();
  }

  return (
    <div className="px-4 py-6">
      <OpportunityDetailView
        OrionOpportunity={OrionOpportunity}
        evaluation={evaluation}
        opportunityId={opportunityId}
      />
    </div>
  );
}
