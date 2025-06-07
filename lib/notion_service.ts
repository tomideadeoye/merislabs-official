import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from './orion_config';
import type { CVComponentShared } from '@/types/orion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// DEBUG: Log imported Notion config values at module load
console.info('[NOTION_SERVICE][DEBUG] Imported NOTION_API_KEY:', NOTION_API_KEY ? '[SET]' : '[NOT SET]');
console.info('[NOTION_SERVICE][DEBUG] Imported NOTION_DATABASE_ID:', NOTION_DATABASE_ID ? NOTION_DATABASE_ID : '[NOT SET]');

const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

// =====================
// Orion Notion Service
// =====================
// GOAL: Provide robust, context-rich, and level-based logging for all Notion operations.
// This file is the single source of truth for Notion integration in Orion.
// All Notion-related features (journal, contacts, CV, opportunities) depend on these functions.
// All logs include operation, parameters, and results for traceability and rapid debugging.

/**
 * Fetch journal entries from Notion database
 */
export async function fetchJournalEntriesFromNotion() {
  console.info('[NOTION][fetchJournalEntriesFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('[NOTION][fetchJournalEntriesFromNotion][WARN] Notion client or database ID not configured');
    return { success: false, error: 'Notion client not configured' };
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    const journalEntries = response.results.map((page: any) => {
      const properties = page.properties;

      // Extract title
      const title = properties.Name?.title?.[0]?.plain_text || 'Untitled Entry';

      // Extract date
      const dateProperty = properties.Date?.date?.start;
      const date = dateProperty ? new Date(dateProperty).toISOString() : new Date().toISOString();

      // Extract content
      const contentProperty = properties.Content?.rich_text;
      const content = contentProperty && contentProperty.length > 0
        ? contentProperty.map((text: any) => text.plain_text).join('')
        : '';

      // Extract mood
      const moodProperty = properties.Mood?.select?.name;
      const mood = moodProperty || undefined;

      // Extract tags
      const tagsProperty = properties.Tags?.multi_select;
      const tags = tagsProperty ? tagsProperty.map((tag: any) => tag.name) : [];

      return {
        title,
        date,
        content,
        contentType: 'journal_entry',
        notionPageId: page.id,
        mood,
        tags,
      };
    });

    console.info('[NOTION][fetchJournalEntriesFromNotion][SUCCESS]', { count: journalEntries.length });
    return { success: true, journalEntries };
  } catch (error: any) {
    console.error('[NOTION][fetchJournalEntriesFromNotion][ERROR]', { error: error.message, stack: error.stack });
    return { success: false, error: error.message || 'Failed to fetch journal entries from Notion' };
  }
}

/**
 * Fetch contacts from Notion database
 */
export async function fetchContactsFromNotion() {
  console.info('[NOTION][fetchContactsFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('[NOTION][fetchContactsFromNotion][WARN] Notion client or contacts database ID not configured');
    return { success: false, error: 'Notion client or contacts database not configured' };
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });

    const contacts = response.results.map((page: any) => {
      const properties = page.properties;

      // Extract name
      const name = properties.Name?.title?.[0]?.plain_text || 'Unknown Contact';

      // Extract email
      const emailProperty = properties.Email?.email;
      const email = emailProperty || '';

      // Extract company
      const companyProperty = properties.Company?.rich_text;
      const company = companyProperty && companyProperty.length > 0
        ? companyProperty.map((text: any) => text.plain_text).join('')
        : '';

      // Extract role
      const roleProperty = properties.Role?.rich_text;
      const role = roleProperty && roleProperty.length > 0
        ? roleProperty.map((text: any) => text.plain_text).join('')
        : '';

      // Extract tags
      const tagsProperty = properties.Tags?.multi_select;
      const tags = tagsProperty ? tagsProperty.map((tag: any) => tag.name) : [];

      return {
        name,
        email,
        company,
        role,
        tags,
        notionPageId: page.id,
      };
    });

    console.info('[NOTION][fetchContactsFromNotion][SUCCESS]', { count: contacts.length });
    return { success: true, contacts };
  } catch (error: any) {
    console.error('[NOTION][fetchContactsFromNotion][ERROR]', { error: error.message, stack: error.stack });
    return { success: false, error: error.message || 'Failed to fetch contacts from Notion' };
  }
}

/**
 * Create a new journal entry in Notion
 */
export async function createJournalEntryInNotion(entry: {
  title: string;
  content: string;
  date?: string;
  mood?: string;
  tags?: string[];
}) {
  console.info('[NOTION][createJournalEntryInNotion][START]', { entry });
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('[NOTION][createJournalEntryInNotion][WARN] Notion client or database ID not configured');
    return { success: false, error: 'Notion client not configured' };
  }

  try {
    const properties: any = {
      Name: {
        title: [
          {
            text: {
              content: entry.title,
            },
          },
        ],
      },
      Content: {
        rich_text: [
          {
            text: {
              content: entry.content,
            },
          },
        ],
      },
      Date: {
        date: {
          start: entry.date || new Date().toISOString(),
        },
      },
    };

    // Add mood if provided
    if (entry.mood) {
      properties.Mood = {
        select: {
          name: entry.mood,
        },
      };
    }

    // Add tags if provided
    if (entry.tags && entry.tags.length > 0) {
      properties.Tags = {
        multi_select: entry.tags.map(tag => ({ name: tag })),
      };
    }

    const response = await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID,
      },
      properties,
    });

    console.info('[NOTION][createJournalEntryInNotion][SUCCESS]', { entryId: response.id });
    return {
      success: true,
      entryId: response.id,
      entry: {
        ...entry,
        notionPageId: response.id,
      }
    };
  } catch (error: any) {
    console.error('[NOTION][createJournalEntryInNotion][ERROR]', { error: error.message, stack: error.stack });
    return { success: false, error: error.message || 'Failed to create journal entry in Notion' };
  }
}

/**
 * List all opportunities from Notion.
 * Returns an array of OpportunityNotionOutputShared objects.
 */
/**
 * TODO: Stub for fetchCVComponentsFromNotion. Implement actual Notion logic.
 */
export async function fetchCVComponentsFromNotion() {
  // Always use the main Notion DB for CV components (per user requirements)
  console.info('[NOTION][fetchCVComponentsFromNotion][START]', { database_id: NOTION_DATABASE_ID });
  if (!notion || !NOTION_DATABASE_ID) {
    console.error('[NOTION][fetchCVComponentsFromNotion][ERROR] Notion client or main database ID not configured.');
    console.error('[NOTION][fetchCVComponentsFromNotion][DEBUG] NOTION_API_KEY:', NOTION_API_KEY ? '[SET]' : '[NOT SET]');
    console.error('[NOTION][fetchCVComponentsFromNotion][DEBUG] NOTION_DATABASE_ID:', NOTION_DATABASE_ID ? NOTION_DATABASE_ID : '[NOT SET]');
    return { success: false, error: 'Notion client or main database ID not configured.' };
  }
  try {
    const response = await notion.databases.query({ database_id: NOTION_DATABASE_ID });
    console.info('[NOTION][fetchCVComponentsFromNotion][DEBUG] response.results.length:', response.results.length);
    // DEBUG: Log all property keys for the first page
    if (response.results.length > 0) {
      const firstResult = response.results[0];
      if ('properties' in firstResult) {
        // [LOG][DEBUG] Accessing properties of first Notion result
        const firstProps = firstResult.properties;
        console.info('[NOTION][fetchCVComponentsFromNotion][DEBUG] First page property keys:', Object.keys(firstProps));
        // Also log the full property object for inspection
        console.info('[NOTION][fetchCVComponentsFromNotion][DEBUG] First page full properties:', JSON.stringify(firstProps, null, 2));
      } else {
        console.error('[NOTION_SERVICE][ERROR] First result does not have properties', { firstResult });
        throw new Error('First Notion result does not have properties');
      }
    }
    const components: CVComponentShared[] = response.results.map((page: any) => {
      const props = page.properties || {};
      return {
        notionPageId: page.id,
        unique_id: props['Unique ID']?.rich_text?.[0]?.plain_text || page.id,
        component_name: props.Title?.title?.[0]?.plain_text || 'Untitled Component',
        component_type: props['Component Type']?.select?.name || 'Uncategorized',
        content_primary: props.Content?.rich_text?.[0]?.plain_text || '',
        contentType: 'CV Component',
        keywords: (props.Keywords?.multi_select || []).map((k: any) => k.name),
        associated_company_institution: props.companyOrInstitution?.rich_text?.[0]?.plain_text || '',
        start_date: props['Start Date']?.date?.start || undefined,
        end_date: props['End Date']?.date?.start || undefined,
        tags: (props.Tags?.multi_select || []).map((k: any) => k.name),
      };
    });
    console.info('[NOTION][fetchCVComponentsFromNotion][SUCCESS]', { count: components.length });
    return { success: true, components };
  } catch (error: any) {
    console.error('[NOTION][fetchCVComponentsFromNotion][ERROR]', { error: error.message, stack: error.stack });
    return { success: false, error: error.message || 'Failed to fetch CV components from Notion.' };
  }
}

/**
 * Fetch a single opportunity by Notion page ID, map all relevant fields, and add extensive logging.
 * This will replace the stub and ensure the actual opportunity is shown instead of the stub.
 */
export async function fetchOpportunityByIdFromNotion(id: string) {
  console.info('[NOTION][fetchOpportunityByIdFromNotion][START]', { id });
  if (!notion || !NOTION_DATABASE_ID) {
    console.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR] Notion client or Database ID not configured.');
    return { success: false, error: 'Notion client or Database ID not configured.' };
  }
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    console.info('[NOTION][fetchOpportunityByIdFromNotion][RAW_RESPONSE]', JSON.stringify(response, null, 2));
    if ((response as PageObjectResponse).object !== 'page') {
      console.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR] Not a full page object', { id, response });
      return { success: false, error: 'Notion did not return a full page object.' };
    }
    const page = response as PageObjectResponse;
    const properties = page.properties;
    console.info('[NOTION][fetchOpportunityByIdFromNotion][PAGE_PROPERTIES]', { pageId: page.id, properties });
    const company = (properties.companyOrInstitution && properties.companyOrInstitution.type === 'rich_text') ? properties.companyOrInstitution.rich_text[0]?.plain_text || '' : '';
    if (!company) {
      console.warn('[NOTION][fetchOpportunityByIdFromNotion][MISSING_COMPANY]', { pageId: page.id, properties });
    }
    const title = (properties.Title && properties.Title.type === 'title') ? properties.Title.title[0]?.plain_text || 'Untitled Opportunity' : 'Untitled Opportunity';
    const status = (properties.Status && properties.Status.type === 'status') ? properties.Status.status?.name || null : null;
    const url = (properties.URL && properties.URL.type === 'url') ? properties.URL.url || null : null;
    const content = (properties.Content && properties.Content.type === 'rich_text') ? properties.Content.rich_text.map((t: any) => t.plain_text).join('') || null : null;
    const type = (properties['Job Type'] && properties['Job Type'].type === 'select') ? properties['Job Type'].select?.name || null : null;
    const priority = (properties.Priority && properties.Priority.type === 'select') ? properties.Priority.select?.name || null : null;
    const dateIdentified = (properties['Date Identified'] && properties['Date Identified'].type === 'date') ? properties['Date Identified'].date?.start || null : null;
    const tags = (properties.Tags && properties.Tags.type === 'multi_select') ? properties.Tags.multi_select.map((tag: any) => tag.name) || [] : [];
    const nextActionDate = (properties['Next Action Date'] && properties['Next Action Date'].type === 'date') ? properties['Next Action Date'].date?.start || null : null;
    const opportunity = {
      notion_page_id: page.id,
      id: page.id,
      title,
      company,
      status,
      url,
      last_edited_time: page.last_edited_time ? new Date(page.last_edited_time) : new Date(),
      content,
      type,
      priority,
      dateIdentified,
      tags,
      nextActionDate,
    };
    console.info('[NOTION][fetchOpportunityByIdFromNotion][MAPPED_OPPORTUNITY]', JSON.stringify(opportunity, null, 2));
    return { success: true, opportunity };
  } catch (error: any) {
    const errorMsg = `[NOTION][fetchOpportunityByIdFromNotion][ERROR] ${error.body || error.message}`;
    console.error(errorMsg, { stack: error.stack });
    return { success: false, error: error.message || 'Failed to fetch opportunity from Notion.' };
  }
}

/**
 * TODO: Stub for updateNotionOpportunity. Implement actual Notion logic.
 */
export async function updateNotionOpportunity(id: string, data: any) {
  console.warn('[NOTION][updateNotionOpportunity][STUB] Not implemented.', { id, data });
  return {
    success: true,
    error: null,
    opportunity: {
      notion_page_id: id,
      id: id,
      title: data?.title || 'Stub Opportunity',
      company: data?.company || 'Stub Company',
      status: data?.status || 'Open',
      url: data?.url || '',
      last_edited_time: new Date().toISOString(),
      content: data?.content || '',
      type: data?.type || 'Full-Time',
      priority: data?.priority || 'Normal',
      dateIdentified: data?.dateIdentified || new Date().toISOString(),
      tags: data?.tags || [],
      nextActionDate: data?.nextActionDate || new Date().toISOString(),
    }
  };
}

/**
 * Robustly parses Notion page properties for CV components, opportunities, etc.
 * Logs all actions and fallbacks for traceability.
 * Returns a normalized object with all expected fields.
 */
export function parseNotionPageProperties(page: any) {
  if (!page || !page.properties) {
    console.error('[NOTION][parseNotionPageProperties][ERROR] Invalid page object', { page });
    return {
      StartDate: null,
      EndDate: null,
      UniqueID: null,
      ComponentName: null,
      ComponentType: null,
      ContentPrimary: null,
      Keywords: [],
      AssociatedCompany: null,
    };
  }

  const props = page.properties;
  const getText = (field: any) =>
    field?.rich_text?.map((t: any) => t.plain_text).join('') || field?.title?.[0]?.plain_text || null;

  const result = {
    StartDate: props['Start Date']?.date?.start || null,
    EndDate: props['End Date']?.date?.start || null,
    UniqueID: getText(props['UniqueID']) || null,
    ComponentName: getText(props['Component Name']) || null,
    ComponentType: props['Component Type']?.select?.name || null,
    ContentPrimary: getText(props['Content Primary']) || null,
    Keywords: props['Keywords']?.multi_select?.map((tag: any) => tag.name) || [],
    AssociatedCompany: getText(props['Associated Company']) || null,
  };

  // Logging for traceability and debugging
  console.debug('[NOTION][parseNotionPageProperties][DEBUG] Parsed properties', { result, pageId: page.id });

  // Fallbacks and warnings for missing critical fields
  if (!result.UniqueID) {
    console.warn('[NOTION][parseNotionPageProperties][WARN] UniqueID missing', { pageId: page.id });
  }
  if (!result.ComponentName) {
    console.warn('[NOTION][parseNotionPageProperties][WARN] ComponentName missing', { pageId: page.id });
  }

  return result;
}

/**
 * TODO: Stub for createOpportunityInNotion. Implement actual Notion logic.
 */
export async function createOpportunityInNotion(data: any) {
  console.warn('[NOTION][createOpportunityInNotion][STUB] Not implemented.', { data });
  return {
    success: true,
    error: null,
    opportunity: {
      notion_page_id: 'stub',
      id: 'stub',
      title: data?.title || 'Stub Opportunity',
      company: data?.company || 'Stub Company',
      status: data?.status || 'Open',
      url: data?.url || '',
      last_edited_time: new Date().toISOString(),
      content: data?.content || '',
      type: data?.type || 'Full-Time',
      priority: data?.priority || 'Normal',
      dateIdentified: data?.dateIdentified || new Date().toISOString(),
      tags: data?.tags || [],
      nextActionDate: data?.nextActionDate || new Date().toISOString(),
    }
  };
}

/**
 * TODO: Stub for saveJournalEntryToNotion. Implement actual Notion logic.
 */
export async function saveJournalEntryToNotion(entry: any) {
  console.warn('[NOTION][saveJournalEntryToNotion][STUB] Not implemented.', { entry });
  return {
    success: true,
    error: undefined,
    entry: {
      ...entry,
      notionPageId: 'stub'
    }
  };
}

/**
 * TODO: Stub for updateNotionDatabaseSchema. Implement actual Notion logic.
 */
export async function updateNotionDatabaseSchema(databaseId: string, properties: any) {
  console.warn('[NOTION][updateNotionDatabaseSchema][STUB] Not implemented.', { databaseId, properties });
  return {
    success: true,
    error: undefined,
    database: {
      id: databaseId,
      properties
    }
  };
}

export async function listOpportunitiesFromNotion() {
  console.info('[NOTION][listOpportunitiesFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    console.error('[NOTION][listOpportunitiesFromNotion][ERROR] Notion client or Database ID not configured.');
    return [];
  }
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Content Type',
        select: { equals: 'Opportunity' },
      },
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    });
    console.info('[NOTION][listOpportunitiesFromNotion][RAW_RESPONSE]', JSON.stringify(response, null, 2));

    const opportunities = response.results.map((page: any) => {
      const properties = page.properties;
      console.info('[NOTION][listOpportunitiesFromNotion][PAGE_PROPERTIES]', { pageId: page.id, properties });
      const company = properties.companyOrInstitution?.rich_text?.[0]?.plain_text || '';
      if (!company) {
        console.warn('[NOTION][listOpportunitiesFromNotion][MISSING_COMPANY]', { pageId: page.id, properties });
      }
      return {
        notion_page_id: page.id,
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled Opportunity',
        company,
        status: properties.Status?.status?.name || null,
        url: properties.URL?.url || null,
        last_edited_time: page.last_edited_time ? new Date(page.last_edited_time) : new Date(),
        content: properties.Content?.rich_text?.map((t: any) => t.plain_text).join('') || null,
        type: properties['Job Type']?.select?.name || null,
        priority: properties.Priority?.select?.name || null,
        dateIdentified: properties['Date Identified']?.date?.start || null,
        tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
        nextActionDate: properties['Next Action Date']?.date?.start || null,
      };
    });

    console.info('[NOTION][listOpportunitiesFromNotion][MAPPED_OPPORTUNITIES]', JSON.stringify(opportunities, null, 2));
    return opportunities;
  } catch (error: any) {
    const errorMsg = `[NOTION][listOpportunitiesFromNotion][ERROR] ${error.body || error.message}`;
    console.error(errorMsg, { stack: error.stack });
    return [];
  }
}
