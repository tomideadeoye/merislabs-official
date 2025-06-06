import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_CONTACTS_DATABASE_ID } from './orion_config';
import type { CVComponentShared } from '@/types/orion';

// Initialize Notion client
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

// the greate cycle of iterative improvement and development and question asking

// summarize what we have implemented so far, the files modified, why the modifications were made. ask for how to test extensively (write tests into run-all-tests.ts), ask for ideas, ask for suggestions. Ask for comprehensive next steps (the goal of the feature, how to implement it, the relevant and related files, example code etc.)

// Review orion_prd.md file and determine features not yet implemented.

// it is a useCycle, patterns -- all towards greatnes and wealth


/**
 * Fetch journal entries from Notion database
 */
export async function fetchJournalEntriesFromNotion() {
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('Notion client or database ID not configured');
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

    return { success: true, journalEntries };
  } catch (error: any) {
    console.error('Error fetching journal entries from Notion:', error);
    return { success: false, error: error.message || 'Failed to fetch journal entries from Notion' };
  }
}

/**
 * Fetch contacts from Notion database
 */
export async function fetchContactsFromNotion() {
  if (!notion || !NOTION_CONTACTS_DATABASE_ID) {
    console.warn('Notion client or contacts database ID not configured');
    return { success: false, error: 'Notion client or contacts database not configured' };
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_CONTACTS_DATABASE_ID,
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

    return { success: true, contacts };
  } catch (error: any) {
    console.error('Error fetching contacts from Notion:', error);
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
  if (!notion || !NOTION_DATABASE_ID) {
    console.warn('Notion client or database ID not configured');
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

    return {
      success: true,
      entryId: response.id,
      entry: {
        ...entry,
        notionPageId: response.id,
      }
    };
  } catch (error: any) {
    console.error('Error creating journal entry in Notion:', error);
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
  if (!notion || !NOTION_DATABASE_ID) {
    console.error('[fetchCVComponentsFromNotion] Notion client or database ID not configured.');
    return { success: false, error: 'Notion client or database ID not configured.' };
  }
  try {
    const response = await notion.databases.query({ database_id: NOTION_DATABASE_ID });
    const components: CVComponentShared[] = response.results.map((page: any) => {
      const props = page.properties || {};
      return {
        notionPageId: page.id,
        unique_id: props.UniqueID?.rich_text?.[0]?.plain_text || page.id,
        component_name: props['Component Name']?.title?.[0]?.plain_text || 'Untitled Component',
        component_type: props['Component Type']?.select?.name || 'Uncategorized',
        content_primary: props['Content (Primary)']?.rich_text?.[0]?.plain_text || '',
        contentType: 'CV Component',
        keywords: (props.Keywords?.multi_select || []).map((k: any) => k.name),
        associated_company_institution: props['Associated Company/Institution']?.rich_text?.[0]?.plain_text || '',
        start_date: props['Start Date']?.date?.start || undefined,
        end_date: props['End Date']?.date?.start || undefined,
      };
    });
    return { success: true, components };
  } catch (error: any) {
    console.error('[fetchCVComponentsFromNotion] Error:', error.message, error.stack);
    return { success: false, error: error.message || 'Failed to fetch CV components from Notion.' };
  }
}

/**
 * TODO: Stub for fetchOpportunityByIdFromNotion. Implement actual Notion logic.
 */
export async function fetchOpportunityByIdFromNotion(id: string) {
  console.warn('[NOTION_SERVICE] fetchOpportunityByIdFromNotion is a stub. Implement this function.');
  return {
    success: true,
    error: null,
    opportunity: {
      notion_page_id: id,
      id: id,
      title: 'Stub Opportunity',
      company: 'Stub Company',
      status: 'Open',
      url: '',
      last_edited_time: new Date().toISOString(),
      content: '',
      type: 'Full-Time',
      priority: 'Normal',
      dateIdentified: new Date().toISOString(),
      tags: [],
      nextActionDate: new Date().toISOString(),
    }
  };
}

/**
 * TODO: Stub for updateNotionOpportunity. Implement actual Notion logic.
 */
export async function updateNotionOpportunity(id: string, data: any) {
  console.warn('[NOTION_SERVICE] updateNotionOpportunity is a stub. Implement this function.');
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
 * TODO: Stub for parseNotionPageProperties. Implement actual Notion logic.
 */
/**
 * Robustly parses Notion page properties for CV components, opportunities, etc.
 * Logs all actions and fallbacks for traceability.
 * Returns a normalized object with all expected fields.
 */
export function parseNotionPageProperties(page: any) {
  if (!page || !page.properties) {
    console.error('[NOTION_SERVICE] parseNotionPageProperties: Invalid page object', { page });
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
  console.info('[NOTION_SERVICE] parseNotionPageProperties: Parsed properties', { result, pageId: page.id });

  // Fallbacks and warnings for missing critical fields
  if (!result.UniqueID) {
    console.warn('[NOTION_SERVICE] parseNotionPageProperties: UniqueID missing', { pageId: page.id });
  }
  if (!result.ComponentName) {
    console.warn('[NOTION_SERVICE] parseNotionPageProperties: ComponentName missing', { pageId: page.id });
  }

  return result;
}

/**
 * TODO: Stub for createOpportunityInNotion. Implement actual Notion logic.
 */
export async function createOpportunityInNotion(data: any) {
  console.warn('[NOTION_SERVICE] createOpportunityInNotion is a stub. Implement this function.');
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
  console.warn('[NOTION_SERVICE] saveJournalEntryToNotion is a stub. Implement this function.');
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
  console.warn('[NOTION_SERVICE] updateNotionDatabaseSchema is a stub. Implement this function.');
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
  if (!notion || !NOTION_DATABASE_ID) {
    console.error("Notion client or Database ID not configured.");
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
          property: 'Last Edited',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        notion_page_id: page.id,
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'Untitled Opportunity',
        company: properties.Company?.rich_text?.[0]?.plain_text || '',
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
  } catch (error: any) {
    const errorMsg = `Error listing opportunities from Notion: ${error.body || error.message}`;
    console.error(errorMsg);
    return [];
  }
}
