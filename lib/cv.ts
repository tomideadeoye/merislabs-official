/**
 * CV component management and tailoring functionality
 */

import { PYTHON_API_URL } from './orion_config';

export interface CVComponent {
  notionPageId: string;
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  keywords?: string[];
  associated_company_institution?: string;
  start_date?: string;
  end_date?: string;
  contentType?: string;
}

const BASE_URL = typeof window === 'undefined' ? (process.env.NEXTAUTH_URL || 'http://localhost:3000') : '';

/**
 * Fetch all CV components from Notion
 */
export async function fetchCVComponents(): Promise<CVComponent[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/orion/notion/cv-components`);
    if (!response.ok) {
      throw new Error(`Failed to fetch CV components: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching CV components:', error);
    throw error;
  }
}

/**
 * Suggest CV components based on JD analysis
 */
export async function suggestCVComponents(
  jdAnalysis: string,
  jobTitle: string,
  companyName: string
): Promise<{success: boolean, suggested_component_ids?: string[], error?: string}> {
  try {
    const response = await fetch(`${BASE_URL}/api/orion/cv/suggest-components`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jd_analysis: jdAnalysis,
        job_title: jobTitle,
        company_name: companyName
      })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Error suggesting CV components:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Rephrase a CV component based on JD analysis
 */
export async function rephraseComponent(
  componentId: string,
  jdAnalysis: string,
  webResearchContext?: string
): Promise<{success: boolean, rephrased_content?: string, error?: string}> {
  try {
    const response = await fetch(`${BASE_URL}/api/orion/cv/rephrase-component`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component_id: componentId,
        jd_analysis: jdAnalysis,
        web_research_context: webResearchContext
      })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Error rephrasing CV component:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Tailor a CV summary based on JD analysis
 */
export async function tailorSummary(
  componentId: string,
  jdAnalysis: string,
  webResearchContext?: string
): Promise<{success: boolean, tailored_content?: string, error?: string}> {
  try {
    const response = await fetch(`${BASE_URL}/api/orion/cv/tailor-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        component_id: componentId,
        jd_analysis: jdAnalysis,
        web_research_context: webResearchContext
      })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Error tailoring CV summary:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Assemble a CV from selected components
 */
export async function assembleCV(
  selectedComponentIds: string[],
  templateName: "Standard" | "Modern" | "Compact",
  headerInfo: string,
  tailoredContentMap: Record<string, string>
): Promise<{success: boolean, assembled_cv?: string, error?: string}> {
  try {
    const response = await fetch(`${BASE_URL}/api/orion/cv/assemble`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selected_component_ids: selectedComponentIds,
        template_name: templateName,
        header_info: headerInfo,
        tailored_content_map: tailoredContentMap
      })
    });
    return await response.json();
  } catch (error: any) {
    console.error('Error assembling CV:', error);
    return { success: false, error: error.message };
  }
}
