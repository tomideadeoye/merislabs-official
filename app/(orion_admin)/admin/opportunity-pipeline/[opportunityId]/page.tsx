
// GOAL:
// This page displays the detailed view of a single opportunity. It fetches the opportunity data and any existing evaluation server-side via API routes and renders the `OpportunityDetailView` component.
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// - Fetches opportunity data from `/api/orion/opportunity/[opportunityId]`.
// - Fetches existing evaluation data from `/api/orion/OrionOpportunity/[opportunityId]/evaluation`.
// - Renders `OpportunityDetailView` from `../../../../../components/orion/OpportunityDetailView`.
// next steps if any:
// components to merge with if any:

import { OpportunityDetailView } from "@/components/ui/orion";
import { OpportunityNotionOutputShared, EvaluationOutput } from "@/styles";
import { notFound } from "next/navigation";

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
