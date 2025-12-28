/**
 * Types for strategic outreach functionality
 */

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
