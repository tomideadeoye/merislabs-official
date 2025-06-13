/**
 * Types for strategic outreach functionality
 */

export interface Persona {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  industry?: string;
  interests?: string[];
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  subject?: string;
  body: string;
  personaId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OutreachMessage {
  id: string;
  templateId?: string;
  personaId?: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PersonaMap = Persona;
