// Strategic Outreach Engine Types

/**
 * Represents a persona map for strategic outreach
 */
export interface Persona {
  id?: string;
  name?: string;
  company?: string;
  role?: string;
  industry?: string;
  values?: string[];
  challenges?: string[];
  interests?: string[];
  valueProposition?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// PersonaMap is now a single Persona object (not an array)
export type PersonaMap = Persona;

/**
 * Request to generate strategic outreach content
 */
export interface OutreachRequest {
  personaId: string;
  opportunityDetails: string;
  goal: string;
  communicationType: 'email' | 'linkedin' | 'proposal' | 'other';
  tone?: 'formal' | 'conversational' | 'enthusiastic' | 'professional';
  additionalContext?: string;
}

/**
 * Response from outreach generation
 */
export interface OutreachResponse {
  id: string;
  personaId: string;
  draft: string;
  relevantMemories?: any[];
  createdAt: string;
}
