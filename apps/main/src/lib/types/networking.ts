/**
 * @fileoverview Defines TypeScript interfaces for networking-related data, including stakeholder information.
 * @description These types are used to structure data related to finding and managing networking contacts and opportunities,
 *   ensuring type safety and consistency across the frontend and backend.
 *
 * FILEPATH: `app/lib/types/networking.ts`
 */

export interface Stakeholder {
  id: string;
  name: string;
  title?: string; // Original search result title
  email?: string;
  linkedinUrl?: string;
  role?: string; // Job title/role
  company_name?: string; // Company name from search results
  company_description?: string; // Brief company description from search results
  company_website?: string; // Company website URL from search results
  person_snippet?: string; // Brief description from search
  company?: string; // Original company field, now optional
  [key: string]: unknown;
}

export interface FindStakeholdersResponse {
  stakeholders: Stakeholder[];
}
