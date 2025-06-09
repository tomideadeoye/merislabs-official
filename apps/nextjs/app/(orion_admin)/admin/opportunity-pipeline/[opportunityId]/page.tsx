import React from 'react';
import { OpportunityDetailView } from '@/components/orion/pipeline/OpportunityDetailView';
import { EvaluationOutput, Opportunity, OpportunityType, OpportunityStatus, OpportunityPriority, OpportunityNotionOutputShared } from '@shared/types/opportunity';
import { fetchOpportunityByIdFromNotion } from '@shared/lib/notion_service';
import { notFound } from 'next/navigation';
import { z } from 'zod';

type Props = {
  params: {
    opportunityId: string;
  };
};

const OpportunityNotionOutputSharedSchema = z.object({
  id: z.string(),
  notion_page_id: z.string().optional(),
  title: z.string(),
  company: z.string(),
  companyOrInstitution: z.string(),
  content: z.string().nullable().optional(),
  descriptionSummary: z.string().nullable().optional(),
  type: z.union([z.string(), z.null()]).optional(),
  status: z.union([z.string(), z.null()]).optional(),
  priority: z.union([z.string(), z.null()]).optional(),
  url: z.string().nullable().optional(),
  jobUrl: z.string().nullable().optional(),
  sourceURL: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  dateIdentified: z.string().nullable().optional(),
  nextActionDate: z.string().nullable().optional(),
  evaluationOutput: z.any().nullable().optional(),
  tailoredCV: z.string().nullable().optional(),
  webResearchContext: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  pros: z.array(z.string()).nullable().optional(),
  cons: z.array(z.string()).nullable().optional(),
  missingSkills: z.array(z.string()).nullable().optional(),
  contentType: z.string().nullable().optional(),
  relatedEvaluationId: z.string().nullable().optional(),
  lastStatusUpdate: z.string().nullable().optional(),
  last_edited_time: z.union([z.string(), z.date(), z.null()]).optional(),
});

async function fetchNotionOpportunity(opportunityId: string): Promise<Opportunity> {
  const fetchResult = await fetchOpportunityByIdFromNotion(opportunityId);
  if (!fetchResult.success || !fetchResult.opportunity) {
    throw new Error('Opportunity not found');
  }
  // Convert OpportunityNotionOutputShared to Opportunity by ensuring required fields exist
  // Convert last_edited_time to string if it's a Date object to match type definition
  const rawOpportunityData = fetchResult.opportunity;
  // Ensure both company and companyOrInstitution are present for validation
  const normalizedOpportunityData: any = {
    ...rawOpportunityData,
    company: (rawOpportunityData.company ?? (rawOpportunityData as any).companyOrInstitution ?? '') || '',
    companyOrInstitution: ((rawOpportunityData as any).companyOrInstitution ?? rawOpportunityData.company ?? '') || '',
  };
  // Validate with zod
  const parseResult = OpportunityNotionOutputSharedSchema.safeParse(normalizedOpportunityData);
  if (!parseResult.success) {
    console.error('[OpportunityNotionOutputShared] Invalid data in fetchNotionOpportunity:', parseResult.error.format(), rawOpportunityData);
    throw new Error('Invalid OpportunityNotionOutputShared: ' + JSON.stringify(parseResult.error.format()));
  }
  const opportunityData: OpportunityNotionOutputShared = parseResult.data;
  const opportunity: Opportunity = {
    id: opportunityData.id || '',
    notion_page_id: opportunityData.notion_page_id,
    title: opportunityData.title || '',
    company: opportunityData.company || '',
    companyOrInstitution: opportunityData.companyOrInstitution || '',
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
  const resolvedParams = await params;
  const { opportunityId } = resolvedParams;

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
