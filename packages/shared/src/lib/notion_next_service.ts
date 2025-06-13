/**
 * Next.js service for interacting with the Python Notion API
 */

import axios from 'axios';
import { z } from 'zod';

const PYTHON_NOTION_API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_NOTION_API_BASE_URL || 'http://localhost:5002/api/notion';

export interface CVComponent {
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  notion_page_id: string;
}

export interface OpportunityNotionPayload {
  title: string;
  company: string;
  jd_text?: string;
  url?: string;
  status?: string;
}

export interface OpportunityNotionResponse {
  id: string;
  title: string;
  url?: string;
}

export const OpportunityNotionPayloadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  companyOrInstitution: z.string().min(1, 'Company is required'),
  jd_text: z.string().optional(),
  url: z.string().url('Invalid URL').optional(),
  status: z.string().optional(),
});

export async function fetchCvComponentsFromNotion(): Promise<CVComponent[]> {
  try {
    const response = await axios.get(`${PYTHON_NOTION_API_BASE_URL}/cv-components`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CV components from Notion:', error);
    throw error;
  }
}

export async function createOpportunityInNotion(payload: OpportunityNotionPayload): Promise<OpportunityNotionResponse> {
  const parseResult = OpportunityNotionPayloadSchema.safeParse(payload);
  if (!parseResult.success) {
    console.error('[createOpportunityInNotion] Invalid OpportunityNotionPayload:', parseResult.error.format());
    throw new Error('Invalid OpportunityNotionPayload: ' + JSON.stringify(parseResult.error.format()));
  }
  try {
    const response = await axios.post(`${PYTHON_NOTION_API_BASE_URL}/OrionOpportunity`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating OrionOpportunity in Notion:', error);
    throw error;
  }
}

export async function checkNotionApiHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${PYTHON_NOTION_API_BASE_URL.replace('/api/notion', '')}/`);
    return response.data?.status === 'ok';
  } catch (error) {
    console.error('Error checking Notion API health:', error);
    return false;
  }
}
