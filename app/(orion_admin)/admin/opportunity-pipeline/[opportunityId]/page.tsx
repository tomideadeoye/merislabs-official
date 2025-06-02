import React from 'react';
import { OpportunityDetailView } from '@/components/orion/pipeline/OpportunityDetailView';
import { EvaluationOutput, Opportunity, OpportunityType, OpportunityStatus, OpportunityPriority, OpportunityNotionOutputShared } from '@/types/opportunity';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    opportunityId: string;
  };
};

async function fetchNotionOpportunity(opportunityId: string): Promise<Opportunity> {
  const fetchResult = await fetchOpportunityByIdFromNotion(opportunityId);
  if (!fetchResult.success || !fetchResult.opportunity) {
    throw new Error('Opportunity not found');
  }
  // Convert OpportunityNotionOutputShared to Opportunity by ensuring required fields exist
  // Convert last_edited_time to string if it's a Date object to match type definition
  const rawOpportunityData = fetchResult.opportunity;
  if (typeof rawOpportunityData.last_edited_time === 'string' || rawOpportunityData.last_edited_time instanceof Date) {
    // valid, do nothing
  } else {
    rawOpportunityData.last_edited_time = null;
  }
  const opportunityData: OpportunityNotionOutputShared = rawOpportunityData;
  const opportunity: Opportunity = {
    id: opportunityData.id,
    notion_page_id: opportunityData.notion_page_id,
    title: opportunityData.title,
    company: opportunityData.company,
    content: opportunityData.content ?? '',
    type: (opportunityData.type ?? 'other') as OpportunityType,
    status: opportunityData.status ?? undefined,
    priority: opportunityData.priority ?? undefined,
    url: opportunityData.url ?? undefined,
    sourceURL: opportunityData.sourceURL ?? undefined,
    deadline: opportunityData.deadline ?? undefined,
    location: opportunityData.location ?? undefined,
    salary: opportunityData.salary ?? undefined,
    contact: opportunityData.contact ?? undefined,
    notes: opportunityData.notes ?? undefined,
    createdAt: opportunityData.createdAt ?? undefined,
    updatedAt: opportunityData.updatedAt ?? undefined,
    dateIdentified: opportunityData.dateIdentified ?? undefined,
    nextActionDate: opportunityData.nextActionDate ?? undefined,
    evaluationOutput: opportunityData.evaluationOutput ?? undefined,
    tailoredCV: opportunityData.tailoredCV ?? undefined,
    webResearchContext: opportunityData.webResearchContext ?? undefined,
    tags: Array.isArray(opportunityData.tags) ? opportunityData.tags : undefined,
    pros: Array.isArray(opportunityData.pros) ? opportunityData.pros : undefined,
    cons: Array.isArray(opportunityData.cons) ? opportunityData.cons : undefined,
    missingSkills: Array.isArray(opportunityData.missingSkills) ? opportunityData.missingSkills : undefined,
    contentType: opportunityData.contentType ?? undefined,
    relatedEvaluationId: (opportunityData.relatedEvaluationId !== null && opportunityData.relatedEvaluationId !== undefined) ? opportunityData.relatedEvaluationId : undefined,
    lastStatusUpdate: (opportunityData.lastStatusUpdate !== null && opportunityData.lastStatusUpdate !== undefined) ? opportunityData.lastStatusUpdate : undefined,
  };
  return opportunity;
}

async function fetchEvaluation(opportunityId: string): Promise<EvaluationOutput | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/orion/opportunity/${opportunityId}/evaluation`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    console.error('Failed to fetch evaluation:', res.statusText);
    return undefined;
  }
  const data = await res.json();
  return data as EvaluationOutput;
}

export default async function OpportunityPipelinePage({ params }: Props) {
  const { opportunityId } = params;

  let opportunity: Opportunity;
  try {
    opportunity = await fetchNotionOpportunity(opportunityId);
  } catch (error) {
    notFound();
  }

  // Attempt to load an existing evaluation for this opportunity
  const evaluation = await fetchEvaluation(opportunityId);

  return (
    <div className="px-4 py-6">
      <OpportunityDetailView
        opportunity={opportunity}
        evaluation={evaluation}
        opportunityId={opportunityId}
      />
    </div>
  );
}
