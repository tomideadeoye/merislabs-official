/**
 * NOTE: These are generic/legacy opportunity types, NOT for the Orion pipeline.
 * Canonical Orion types are in orion.d.ts. Do not use these for OrionOpportunity flows.
 */

export interface GenericOpportunityCreatePayload {
  title: string;
  description: string;
  type: string;
  status: string;
}

export interface GenericOpportunityUpdatePayload extends Partial<GenericOpportunityCreatePayload> {
  id: string;
}

export type GenericOpportunityStatus =
  | 'new'
  | 'in_review'
  | 'accepted'
  | 'rejected'
  | 'on_hold';

export type GenericOpportunityPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';
