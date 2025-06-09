import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from './orion_server_config';
import type { CVComponentShared, JournalEntryNotionInput } from '@shared/types/orion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { OpportunityNotionOutputShared } from '@shared/types/opportunity';
import { logger } from "./logger";

let notion: Client | null = null;
if (NOTION_API_KEY) {
  notion = new Client({ auth: NOTION_API_KEY });
} else {
  console.warn('[NOTION_SERVICE] NOTION_API_KEY not found, Notion integration will be disabled.');
}

console.log(`[NOTION_SERVICE][DEBUG] Imported NOTION_API_KEY: ${NOTION_API_KEY ? 'Loaded' : '[NOT SET]'}`);
console.log(`[NOTION_SERVICE][DEBUG] Imported NOTION_DATABASE_ID: ${NOTION_DATABASE_ID || '[NOT SET]'}`);

/**
 * Extracts the title from a Notion page properties object.
 * In Notion, each page has exactly one property of type "title".
 * This function finds that property regardless of its user-defined name (e.g., "Name", "Aa Title").
 * @param properties - The properties object from a Notion page.
 * @returns The title content as a string, or an empty string if not found.
 */
function getTitleFromProperties(properties: any): string {
    if (!properties) return '';
    // The main title property of a Notion page always has the id 'title'.
    const titlePropertyKey = Object.keys(properties).find(key => properties[key].id === 'title');
    if (titlePropertyKey) {
        const titleObject = properties[titlePropertyKey].title;
        return titleObject?.[0]?.plain_text || '';
    }
    // Fallback for misconfigured pages, though this should rarely be hit.
    return properties['Aa Title']?.title?.[0]?.plain_text || properties['Name']?.title?.[0]?.plain_text || '';
}

export async function createOpportunityInNotion(data: any) {
  console.info('[NOTION][createOpportunityInNotion][START]', { data });
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('[NOTION][createOpportunityInNotion][WARN] Notion client or database ID not configured');
    return null;
  }
  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        'Aa Title': { title: [{ text: { content: data.title } }] },
        'companyOrInstitution': { rich_text: [{ text: { content: data.companyOrInstitution } }] },
        'URL': { url: data.url },
        'Status': { select: { name: data.status || 'Not Started' } },
        'Content': { rich_text: [{ text: { content: data.content } }] },
        'Tags': { multi_select: data.tags.map((tag: string) => ({ name: tag })) },
        'Date': { date: { start: data.dateIdentified || new Date().toISOString() } },
      },
    });
    console.info('[NOTION][createOpportunityInNotion][SUCCESS]', { response });
    return response;
  } catch (error) {
    console.error('[NOTION][createOpportunityInNotion][ERROR]', error);
    return null;
  }
}

export async function listOpportunitiesFromNotion(filters: any = {}) {
  console.log('[NOTION][listOpportunitiesFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    console.error('[NOTION][listOpportunitiesFromNotion][ERROR] Notion client or Database ID not configured.');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: filters.notionFilter,
      sorts: filters.sorts,
    });
    console.log(`[NOTION][listOpportunitiesFromNotion][SUCCESS] Found ${response.results.length} opportunities.`);

    // Map raw Notion pages to a structured Opportunity object
    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: getTitleFromProperties(properties) || properties.companyOrInstitution?.rich_text?.[0]?.text?.content || 'Unknown Title',
        company: properties.companyOrInstitution?.rich_text?.[0]?.text?.content || '',
        companyOrInstitution: properties.companyOrInstitution?.rich_text?.[0]?.text?.content || '',
        status: properties.Status?.select?.name || null,
        url: properties.URL?.url || null,
        last_edited_time: page.last_edited_time,
        // Add any other properties needed by the frontend card
      };
    });
  } catch (error) {
    console.error('[NOTION][listOpportunitiesFromNotion][ERROR]', error);
    return [];
  }
}

export async function getOpportunityDetails(pageId: string) {
  if (!notion) {
    console.error('Notion client not initialized');
    return null;
  }
  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error(`Failed to retrieve opportunity ${pageId}:`, error);
    return null;
  }
}

export async function getOpportunityContent(pageId: string) {
  if (!notion) {
    console.error('Notion client not initialized');
    return null;
  }
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    return response.results;
  } catch (error) {
    console.error(`Failed to retrieve content for opportunity ${pageId}:`, error);
    return null;
  }
}

export async function updateOpportunityStatus(pageId: string, status: string) {
  if (!notion) {
    console.error('Notion client not initialized');
    return null;
  }
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Status': { select: { name: status } },
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to update status for opportunity ${pageId}:`, error);
    return { success: false, error };
  }
}

export async function addStakeholderToOpportunity(pageId: string, stakeholder: any) {
  if (!notion) {
    console.error('Notion client not initialized');
    return null;
  }
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Identified Stakeholders': {
          rich_text: [
            {
              text: {
                content: stakeholder.name,
                link: stakeholder.linkedin_url ? { url: stakeholder.linkedin_url } : undefined,
              },
            },
          ],
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to add stakeholder to opportunity ${pageId}:`, error);
    return { success: false, error };
  }
}

export async function saveOutreachToNotion(pageId: string, outreach: { stakeholder: string, message: string, platform: string }) {
  if (!notion) {
    console.error('Notion client not initialized');
    return null;
  }

  const content = `
## ${outreach.platform} Outreach to ${outreach.stakeholder}
${new Date().toISOString()}

${outreach.message}
---
  `;

  try {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content } }],
          },
        },
      ],
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to save outreach to opportunity ${pageId}:`, error);
    return { success: false, error };
  }
}

export async function getCVComponentsFromNotion(): Promise<CVComponentShared[]> {
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('[NOTION][getCVComponentsFromNotion][WARN] Notion client or CV database ID not configured');
    return [];
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Component Type',
        select: {
          equals: 'CV',
        },
      },
    });
    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        notionPageId: page.id,
        unique_id: properties['Unique ID']?.rich_text?.[0]?.text?.content,
        component_name: properties['Component Name']?.title?.[0]?.text?.content,
        component_type: properties['Component Type']?.select?.name,
        content_primary: properties['Content (Primary)']?.rich_text?.[0]?.text?.content,
        id: page.id,
        content: properties['Content (Primary)']?.rich_text?.[0]?.text?.content,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        user_id: properties['User ID']?.rich_text?.[0]?.text?.content,
      };
    });
  } catch (error) {
    console.error('[NOTION][getCVComponentsFromNotion][ERROR] Failed to get CV components from Notion', error);
    return [];
  }
}

export async function fetchOpportunityByIdFromNotion(opportunityId: string): Promise<{ success: boolean; opportunity?: OpportunityNotionOutputShared | null, error?: string }> {
  logger.info('[NOTION][fetchOpportunityByIdFromNotion][START] Fetching opportunity', { opportunityId });
  if (!notion) {
    logger.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR] Notion client not configured', { opportunityId });
    return { success: false, error: 'Notion client not configured' };
  }
  if (!opportunityId || typeof opportunityId !== 'string') {
    logger.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR] Invalid opportunityId', { opportunityId });
    return { success: false, error: 'Invalid opportunity ID' };
  }
  try {
    const response = await notion.pages.retrieve({ page_id: opportunityId });
    const page = response as PageObjectResponse;
    const properties = page.properties;
    const opportunity = {
      notion_page_id: page.id,
      id: page.id,
      title: getTitleFromProperties(properties) || (properties.companyOrInstitution as any)?.rich_text?.[0]?.text?.content || 'Unknown Title',
      company: (properties.companyOrInstitution as any)?.rich_text?.[0]?.text?.content || 'Unknown',
      companyOrInstitution: (properties.companyOrInstitution as any)?.rich_text?.[0]?.text?.content || 'Unknown',
      status: (properties.Status as any)?.select?.name,
      url: (properties.URL as any)?.url,
      last_edited_time: page.last_edited_time,
      content: (properties.Content as any)?.rich_text.map((t: any) => t.text.content).join(''),
      type: (properties['Job Type'] as any)?.select?.name,
      priority: (properties.Priority as any)?.select?.name,
      dateIdentified: (properties.Date as any)?.date?.start,
      tags: (properties.Tags as any)?.multi_select.map((t: any) => t.name),
      nextActionDate: (properties['Next Action Date'] as any)?.date?.start,
    };
    logger.success('[NOTION][fetchOpportunityByIdFromNotion][SUCCESS] Opportunity fetched', { opportunityId });
    return { success: true, opportunity: opportunity as OpportunityNotionOutputShared };
  } catch (error: any) {
    let errorMsg = 'Unknown error';
    if (error?.code === 'ENOTFOUND' || error?.message?.includes('fetch failed')) {
      errorMsg = 'Network error: Unable to reach Notion API';
    } else if (error?.status === 401 || error?.message?.includes('unauthorized')) {
      errorMsg = 'Notion API unauthorized: Check your NOTION_API_KEY';
    } else if (error?.status === 404) {
      errorMsg = 'Opportunity not found in Notion';
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    logger.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR] Failed to fetch opportunity', { opportunityId, error: errorMsg, raw: error });
    return { success: false, error: errorMsg };
  }
}

export async function updateNotionOpportunity(pageId: string, properties: any): Promise<{ success: boolean; opportunity?: any, error?: string }> {
  if (!notion) {
    console.warn('[NOTION][updateNotionOpportunity][WARN] Notion client not configured');
    return { success: false, error: 'Notion client not configured' };
  }
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties,
    });
    return { success: true, opportunity: response };
  } catch (error) {
    console.error(`[NOTION][updateNotionOpportunity][ERROR] Failed to update opportunity ${pageId}`, error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function getJournalEntriesFromNotion() {
    if (!notion || !NOTION_DATABASE_ID) {
        console.error('[NOTION][getJournalEntriesFromNotion][ERROR] Notion client or Database ID not configured.');
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: NOTION_DATABASE_ID,
            filter: {
                property: 'Content Type',
                select: {
                    equals: 'journal_entry',
                },
            },
        });
        return response.results.map((page: any) => {
            const properties = page.properties;
            return {
                notionPageId: page.id,
                title: properties['Name']?.title?.[0]?.text?.content,
                date: properties['Date']?.date?.start,
                content: properties['Content']?.rich_text?.[0]?.text?.content,
                mood: properties['Mood']?.select?.name,
                tags: properties['Tags']?.multi_select?.map((t: any) => t.name) || [],
                contentType: properties['Content Type']?.select?.name || 'journal_entry',
            };
        });
    } catch (error) {
        console.error('[NOTION][getJournalEntriesFromNotion][ERROR]', error);
        return [];
    }
}

export async function createJournalEntryInNotion(data: JournalEntryNotionInput) {
    console.info('[NOTION][createJournalEntryInNotion][START]', { data });
    if (!notion || !NOTION_DATABASE_ID) {
        console.warn('[NOTION][createJournalEntryInNotion][WARN] Notion client or database ID not configured');
        return null;
    }
    try {
        const response = await notion.pages.create({
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
                'Name': { title: [{ text: { content: data.title } }] },
                'Date': { date: { start: data.date.toISOString() } },
                'Content': { rich_text: [{ text: { content: data.content } }] },
                'Mood': { select: { name: data.mood || 'Neutral' } },
                'Tags': { multi_select: (data.tags || []).map((tag: string) => ({ name: tag })) },
                'Content Type': { select: { name: 'journal_entry' } },
            },
        });
        console.info('[NOTION][createJournalEntryInNotion][SUCCESS]', { response });
        return { success: true, entry: { notionPageId: response.id } };
    } catch (error) {
        console.error('[NOTION][createJournalEntryInNotion][ERROR]', error);
        return null;
    }
}

export async function fetchContactsFromNotion() {
    console.warn('[NOTION][fetchContactsFromNotion] This function is not yet implemented.');
    return [];
}

export async function saveJournalEntryToNotion(data: any) {
    console.warn('[NOTION][saveJournalEntryToNotion] This function is deprecated. Use createJournalEntryInNotion instead.');
    return createJournalEntryInNotion(data);
}

export async function updateNotionDatabaseSchema(databaseId: string, properties: Record<string, any>) {
    console.warn('[NOTION][updateNotionDatabaseSchema] This function is not yet implemented.');
    return { success: false, error: 'Not implemented' };
}
