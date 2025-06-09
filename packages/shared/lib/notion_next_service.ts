/**
 * Next.js service for interacting with the Python Notion API
 */

import axios from 'axios';
import { z } from 'zod';

// Define the base URL for the Python Notion API
const PYTHON_NOTION_API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_NOTION_API_BASE_URL || 'http://localhost:5002/api/notion';

// Define types for CV components
export interface CVComponent {
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  notion_page_id: string;
}

// Define types for opportunity payload and response
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

/**
 * Fetch CV components from Notion via Python API
 */
export async function fetchCvComponentsFromNotion(): Promise<CVComponent[]> {
  try {
    const response = await axios.get(`${PYTHON_NOTION_API_BASE_URL}/cv-components`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CV components from Notion:', error);
    throw error;
  }
}

/**
 * Create or find an opportunity in Notion via Python API
 */
export async function createOpportunityInNotion(payload: OpportunityNotionPayload): Promise<OpportunityNotionResponse> {
  // Validate payload using zod
  const parseResult = OpportunityNotionPayloadSchema.safeParse(payload);
  if (!parseResult.success) {
    console.error('[createOpportunityInNotion] Invalid OpportunityNotionPayload:', parseResult.error.format());
    throw new Error('Invalid OpportunityNotionPayload: ' + JSON.stringify(parseResult.error.format()));
  }
  try {
    const response = await axios.post(`${PYTHON_NOTION_API_BASE_URL}/opportunity`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating opportunity in Notion:', error);
    throw error;
  }
}

/**
 * Check if the Python Notion API is running
 */
export async function checkNotionApiHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${PYTHON_NOTION_API_BASE_URL.replace('/api/notion', '')}/`);
    return response.data?.status === 'ok';
  } catch (error) {
    console.error('Error checking Notion API health:', error);
    return false;
  }
}
