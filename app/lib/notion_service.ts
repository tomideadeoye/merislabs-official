// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  RichTextItemResponse,
  DatePropertyItemObjectResponse as DatePropertyItemObject,
  QueryDatabaseParameters,
  UpdatePageParameters,
  BlockObjectResponse,
  UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  NOTION_API_KEY,
  NOTION_DATABASE_ID,
  NOTION_CV_DATABASE_ID,
} from './orion_server_config';

import { logger } from './logger'; // Import the shared logger
import { OpportunityStatus, OpportunityType, OpportunityPriority, OrionOpportunity, OpportunityNotionOutputShared, CVComponent, JournalEntryNotionInput } from '@/types';

let notion: Client | null = null;
if (NOTION_API_KEY) {
  notion = new Client({ auth: NOTION_API_KEY });
} else {
  logger.warn(
    '[NOTION_SERVICE] NOTION_API_KEY not found, Notion integration will be disabled.',
  );
}

logger.debug(
  `[NOTION_SERVICE] Imported NOTION_API_KEY: ${
    NOTION_API_KEY ? 'Loaded' : '[NOT SET]'
  }`,
);
logger.debug(
  `[NOTION_SERVICE] Imported NOTION_DATABASE_ID: ${
    NOTION_DATABASE_ID || '[NOT SET]'
  }`,
);
logger.debug(
  `[NOTION_SERVICE] Imported NOTION_CV_DATABASE_ID: ${
    NOTION_CV_DATABASE_ID || '[NOT SET]'
  }`,
);

/**
 * Maps a Notion status string to an OpportunityStatus enum value.
 * @param statusString - The status string from Notion.
 * @returns The corresponding OpportunityStatus enum value, or undefined if not a valid mapping.
 */
function mapNotionStatusToOpportunityStatus(
  statusString: string | null | undefined,
): OpportunityStatus | undefined {
  if (!statusString) return undefined;
  if (
    Object.values(OpportunityStatus).includes(statusString as OpportunityStatus)
  ) {
    return statusString as OpportunityStatus;
  }
  logger.warn(
    `[NOTION_SERVICE] Unknown OpportunityStatus encountered: ${statusString}`,
  );
  return undefined;
}

/**
 * Maps a Notion type string to an OpportunityType enum value.
 * @param typeString - The type string from Notion.
 * @returns The corresponding OpportunityType enum value, or undefined if not a valid mapping.
 */
function mapNotionTypeToOpportunityType(
  typeString: string | null | undefined,
): OpportunityType | undefined {
  if (!typeString) return undefined;
  if (Object.values(OpportunityType).includes(typeString as OpportunityType)) {
    return typeString as OpportunityType;
  }
  logger.warn(
    `[NOTION_SERVICE] Unknown OpportunityType encountered: ${typeString}`,
  );
  return undefined;
}

/**
 * Maps a Notion priority string to an OpportunityPriority enum value.
 * @param priorityString - The priority string from Notion.
 * @returns The corresponding OpportunityPriority enum value, or undefined if not a valid mapping.
 */
function mapNotionPriorityToOpportunityPriority(
  priorityString: string | null | undefined,
): OpportunityPriority | undefined {
  if (!priorityString) return undefined;
  if (
    Object.values(OpportunityPriority).includes(
      priorityString as OpportunityPriority,
    )
  ) {
    return priorityString as OpportunityPriority;
  }
  logger.warn(
    `[NOTION_SERVICE] Unknown OpportunityPriority encountered: ${priorityString}`,
  );
  return undefined;
}

/**
 * Extracts plain text content from a Notion rich_text property.
 * @param richText - The rich_text array from a Notion property.
 * @returns Concatenated plain text as a string, or an empty string if not found.
 */
function getRichTextContent(richText: Array<RichTextItemResponse>): string {
  return richText?.map((t) => t.plain_text).join('') || '';
}

/**
 * Extracts multi-select names from a Notion multi_select property.
 * @param multiSelect - The multi_select array from a Notion property value.
 * @returns An array of strings, or an empty array if not found.
 */
function getMultiSelectNames(multiSelect: Array<{ name: string }>): string[] {
  return multiSelect?.map((s) => s.name) || [];
}

/**
 * Extracts date string from a Notion date property.
 * @param date - The date object from a Notion property value.
 * @returns ISO date string, or null if not found.
 */
function getDateString(date: DatePropertyItemObject['date']): string | null {
  return date?.start || null;
}

/**
 * Helper to get a single property value based on expected Notion property type.
 */
function getPropertyValue(
  properties: PageObjectResponse['properties'],
  propertyName: string,
  type: string,
): unknown {
  const prop = properties[propertyName];
  if (!prop) {
    logger.debug(`[NOTION_SERVICE] Property '${propertyName}' not found.`, {
      type,
    });
    return undefined;
  }

  switch (type) {
    case 'title':
      if (prop.type === 'title') {
        return prop.title?.[0]?.plain_text || '';
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a title type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'rich_text':
      if (prop.type === 'rich_text') {
        return getRichTextContent(prop.rich_text);
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a rich_text type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'url':
      if (prop.type === 'url') {
        return prop.url;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a url type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'select':
      if (prop.type === 'select') {
        return prop.select?.name;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a select type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'multi_select':
      if (prop.type === 'multi_select') {
        return getMultiSelectNames(prop.multi_select);
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a multi_select type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'date':
      if (prop.type === 'date') {
        return getDateString(prop.date);
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a date type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'number':
      if (prop.type === 'number') {
        return prop.number;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a number type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'checkbox':
      if (prop.type === 'checkbox') {
        return prop.checkbox;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a checkbox type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'email':
      if (prop.type === 'email') {
        return prop.email;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not an email type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'phone_number':
      if (prop.type === 'phone_number') {
        return prop.phone_number;
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a phone_number type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'files':
      if (prop.type === 'files') {
        return prop.files?.map((f) => {
          if (f.type === 'file') {
            return f.file?.url;
          } else if (f.type === 'external') {
            return f.external?.url;
          }
          return undefined;
        });
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a files type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'people':
      if (prop.type === 'people') {
        return prop.people?.map((p) => ('name' in p ? p.name : undefined));
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a people type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'relation':
      if (prop.type === 'relation') {
        return prop.relation?.map((r) => r.id);
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a relation type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    case 'formula':
      if (prop.type === 'formula') {
        if (!prop.formula) {
          logger.debug(
            '[NOTION_SERVICE] Formula property value is null or undefined.',
            { propertyName, type },
          );
          return undefined;
        }
        // Explicitly check the type of prop.formula before accessing its properties
        switch ((prop.formula as { type: string }).type) {
          case 'string':
            logger.debug('[NOTION_SERVICE] Returning formula string value.', {
              propertyName,
              value: (prop.formula as { string?: string }).string,
            });
            return (prop.formula as { string?: string }).string;
          case 'number':
            logger.debug('[NOTION_SERVICE] Returning formula number value.', {
              propertyName,
              value: (prop.formula as { number?: number }).number,
            });
            return (prop.formula as { number?: number }).number;
          case 'boolean':
            logger.debug('[NOTION_SERVICE] Returning formula boolean value.', {
              propertyName,
              value: (prop.formula as { boolean?: boolean }).boolean,
            });
            return (prop.formula as { boolean?: boolean }).boolean;
          case 'date':
            logger.debug('[NOTION_SERVICE] Returning formula date value.', {
              propertyName,
              value: (prop.formula as { date?: { start: string } }).date?.start,
            });
            return (prop.formula as { date?: { start: string } }).date?.start;
          default:
            logger.warn(
              `[NOTION_SERVICE] Unknown formula property type: ${(prop.formula as { type: string }).type}`,
              { propertyName, type },
            );
            return undefined;
        }
      }
      logger.warn(
        `[NOTION_SERVICE] Property ${propertyName} is not a formula type.`,
        { actualType: prop.type, expectedType: type },
      );
      return undefined;
    default:
      logger.warn(
        `[NOTION_SERVICE] Unknown property type encountered: ${type}`,
        { propertyName, properties },
      );
      return undefined;
  }
}

export async function createOpportunityInNotion(
  data: Partial<OrionOpportunity>,
) {
  logger.info('[NOTION][createOpportunityInNotion][START]', { data });
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][createOpportunityInNotion][WARN] Notion client or database ID not configured.',
    );
    return null;
  }
  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        'Aa Title': {
          title: [{ text: { content: data.title || '' } }],
        },
        companyOrInstitution: {
          rich_text: [
            {
              text: {
                content: data.companyOrInstitution || data.company || '',
              },
            },
          ],
        },
        URL: { url: data.url || null },
        Status: { select: { name: data.status || 'Not Started' } },
        Type: { select: { name: data.type || 'Other' } }, // Ensure 'Type' property is handled
        Content: { rich_text: [{ text: { content: data.content || '' } }] },
        Tags: {
          multi_select: data.tags?.map((tag: string) => ({ name: tag })) || [],
        },
        Date: {
          date: { start: data.dateIdentified || new Date().toISOString() },
        },
        Priority: { select: { name: data.priority || 'Low' } }, // Ensure 'Priority' is handled
      },
    });
    logger.info('[NOTION][createOpportunityInNotion][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    const errorContext =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { message: String(error) };
    logger.error('[NOTION][createOpportunityInNotion][ERROR]', errorContext);
    throw error; // Re-throw to propagate error
  }
}

export async function listOpportunitiesFromNotion(
  filters: {
    notionFilter?: QueryDatabaseParameters['filter'];
    sorts?: QueryDatabaseParameters['sorts'];
  } = {},
) {
  logger.info('[NOTION][listOpportunitiesFromNotion][START]', { filters });
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][listOpportunitiesFromNotion][WARN] Notion client or database ID not configured.',
    );
    return [];
  }

  try {
    const query: QueryDatabaseParameters = {
      database_id: NOTION_DATABASE_ID,
      filter: filters.notionFilter,
      sorts: filters.sorts,
    };

    logger.debug('[NOTION][listOpportunitiesFromNotion][QUERYING]', { query });
    const response = await notion.databases.query(query);
    logger.debug('[NOTION][listOpportunitiesFromNotion][RESULTS_COUNT]', {
      count: response.results.length,
    });

    // Filter results to ensure we only process PageObjectResponse types
    const pageResults = response.results.filter(
      (item): item is PageObjectResponse =>
        'properties' in item && 'id' in item && item.object === 'page',
    );

    const opportunities: OpportunityNotionOutputShared[] = pageResults.map(
      (page) => {
        const properties = page.properties;

        const title = getPropertyValue(
          properties,
          'Aa Title',
          'title',
        ) as string;
        const company = getPropertyValue(
          properties,
          'companyOrInstitution',
          'rich_text',
        ) as string;

        const statusString = getPropertyValue(
          properties,
          'Status',
          'select',
        ) as string | null | undefined;
        const status = mapNotionStatusToOpportunityStatus(statusString);

        const typeString = getPropertyValue(properties, 'Type', 'select') as
          | string
          | null
          | undefined;
        const type = mapNotionTypeToOpportunityType(typeString);

        const url = getPropertyValue(properties, 'URL', 'url') as string | null;
        const content = getPropertyValue(
          properties,
          'Content',
          'rich_text',
        ) as string;
        const tags = getPropertyValue(properties, 'Tags', 'multi_select') as
          | string[]
          | null;
        const dateIdentified = getPropertyValue(properties, 'Date', 'date') as
          | string
          | null;
        const lastEditedTime = page.last_edited_time; // last_edited_time is directly on PageObjectResponse

        const priorityString = getPropertyValue(
          properties,
          'Priority',
          'select',
        ) as string | null | undefined;
        const priority = mapNotionPriorityToOpportunityPriority(priorityString);

        const evaluationOutput = getPropertyValue(
          properties,
          'Evaluation Output',
          'rich_text',
        ) as string | null;
        const webResearchContext = getPropertyValue(
          properties,
          'Web Research Context',
          'rich_text',
        ) as string | null;
        const contentType = getPropertyValue(
          properties,
          'Content Type',
          'select',
        ) as string | null;
        const notes = getPropertyValue(properties, 'Notes', 'rich_text') as
          | string
          | null;
        const pros = getPropertyValue(properties, 'Pros', 'multi_select') as
          | string[]
          | null;
        const cons = getPropertyValue(properties, 'Cons', 'multi_select') as
          | string[]
          | null;
        const missingSkills = getPropertyValue(
          properties,
          'Missing Skills',
          'multi_select',
        ) as string[] | null;
        const relatedEvaluationId = getPropertyValue(
          properties,
          'Related Evaluation ID',
          'rich_text',
        ) as string | null;
        const lastStatusUpdate = getPropertyValue(
          properties,
          'Last Status Update',
          'date',
        ) as string | null;
        const deadline = getPropertyValue(properties, 'Deadline', 'date') as
          | string
          | null;
        const location = getPropertyValue(
          properties,
          'Location',
          'rich_text',
        ) as string | null;
        const contact = getPropertyValue(properties, 'Contact', 'rich_text') as
          | string
          | null;
        const position = getPropertyValue(
          properties,
          'Position',
          'rich_text',
        ) as string | null;
        const createdAt = page.created_time; // Directly from page, not properties
        const updatedAt = page.last_edited_time; // Directly from page, not properties

        return {
          id: page.id,
          title: title,
          company: company,
          companyOrInstitution: company,
          status: status,
          type: type,
          url: url,
          last_edited_time: lastEditedTime,
          content: content,
          tags: tags,
          dateIdentified: dateIdentified,
          priority: priority,
          evaluationOutput: evaluationOutput
            ? {
                summary: evaluationOutput,
                overallFitScore: 0,
                strengths: [],
                gaps: [],
                suggestedCvComponents: [],
                suggestedNextSteps: [],
                alignmentHighlights: [],
                gapAnalysis: [],
                fitScorePercentage: 0,
              }
            : null, // Providing a basic EvaluationOutput if summary exists
          webResearchContext: webResearchContext,
          contentType: contentType,
          notes: notes,
          pros: pros,
          cons: cons,
          missingSkills: missingSkills,
          relatedEvaluationId: relatedEvaluationId,
          lastStatusUpdate: lastStatusUpdate,
          deadline: deadline,
          location: location,
          contact: contact,
          position: position,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
      },
    );

    logger.info('[NOTION][listOpportunitiesFromNotion][SUCCESS]', {
      count: opportunities.length,
    });
    return opportunities;
  } catch (error: unknown) {
    const errorContext =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { message: String(error) };
    logger.error('[NOTION][listOpportunitiesFromNotion][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function getOpportunityDetails(pageId: string) {
  logger.info('[NOTION][getOpportunityDetails][START]', { pageId });
  if (!notion) {
    logger.warn(
      '[NOTION][getOpportunityDetails][WARN] Notion client not configured.',
    );
    return null;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    logger.debug('[NOTION][getOpportunityDetails][PAGE_RETRIEVED]', { page });

    if (!('properties' in page)) {
      logger.warn(
        '[NOTION][getOpportunityDetails][WARN] Retrieved page does not have properties.',
        { pageId },
      );
      return null;
    }

    const properties = page.properties;

    const title = getPropertyValue(properties, 'Aa Title', 'title') as string;
    const company = getPropertyValue(
      properties,
      'companyOrInstitution',
      'rich_text',
    ) as string;

    const statusString = getPropertyValue(properties, 'Status', 'select') as
      | string
      | null
      | undefined;
    const status = mapNotionStatusToOpportunityStatus(statusString);

    const typeString = getPropertyValue(properties, 'Type', 'select') as
      | string
      | null
      | undefined;
    const type = mapNotionTypeToOpportunityType(typeString);

    const url = getPropertyValue(properties, 'URL', 'url') as string | null;
    const content = getPropertyValue(
      properties,
      'Content',
      'rich_text',
    ) as string;
    const tags = getPropertyValue(properties, 'Tags', 'multi_select') as
      | string[]
      | null;
    const dateIdentified = getPropertyValue(properties, 'Date', 'date') as
      | string
      | null;
    const lastEditedTime = page.last_edited_time; // Direct from page

    const priorityString = getPropertyValue(
      properties,
      'Priority',
      'select',
    ) as string | null | undefined;
    const priority = mapNotionPriorityToOpportunityPriority(priorityString);

    const evaluationOutput = getPropertyValue(
      properties,
      'Evaluation Output',
      'rich_text',
    ) as string | null;
    const webResearchContext = getPropertyValue(
      properties,
      'Web Research Context',
      'rich_text',
    ) as string | null;
    const contentType = getPropertyValue(
      properties,
      'Content Type',
      'select',
    ) as string | null;
    const notes = getPropertyValue(properties, 'Notes', 'rich_text') as
      | string
      | null;
    const pros = getPropertyValue(properties, 'Pros', 'multi_select') as
      | string[]
      | null;
    const cons = getPropertyValue(properties, 'Cons', 'multi_select') as
      | string[]
      | null;
    const missingSkills = getPropertyValue(
      properties,
      'Missing Skills',
      'multi_select',
    ) as string[] | null;
    const relatedEvaluationId = getPropertyValue(
      properties,
      'Related Evaluation ID',
      'rich_text',
    ) as string | null;
    const lastStatusUpdate = getPropertyValue(
      properties,
      'Last Status Update',
      'date',
    ) as string | null;
    const deadline = getPropertyValue(properties, 'Deadline', 'date') as
      | string
      | null;
    const location = getPropertyValue(properties, 'Location', 'rich_text') as
      | string
      | null;
    const contact = getPropertyValue(properties, 'Contact', 'rich_text') as
      | string
      | null;
    const position = getPropertyValue(properties, 'Position', 'rich_text') as
      | string
      | null;
    const createdAt = page.created_time; // Directly from page, not properties
    const updatedAt = page.last_edited_time; // Directly from page, not properties

    const opportunity: OpportunityNotionOutputShared = {
      id: page.id,
      title: title,
      company: company,
      companyOrInstitution: company,
      status: status,
      type: type,
      url: url,
      last_edited_time: lastEditedTime,
      content: content,
      tags: tags,
      dateIdentified: dateIdentified,
      priority: priority,
      evaluationOutput: evaluationOutput
        ? {
            summary: evaluationOutput,
            overallFitScore: 0,
            strengths: [],
            gaps: [],
            suggestedCvComponents: [],
            suggestedNextSteps: [],
            alignmentHighlights: [],
            gapAnalysis: [],
            fitScorePercentage: 0,
          }
        : null, // Providing a basic EvaluationOutput if summary exists
      webResearchContext: webResearchContext,
      contentType: contentType,
      notes: notes,
      pros: pros,
      cons: cons,
      missingSkills: missingSkills,
      relatedEvaluationId: relatedEvaluationId,
      lastStatusUpdate: lastStatusUpdate,
      deadline: deadline,
      location: location,
      contact: contact,
      position: position,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    logger.info('[NOTION][getOpportunityDetails][SUCCESS]', { opportunity });
    return opportunity;
  } catch (error: unknown) {
    const errorContext =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) };
    logger.error('[NOTION][getOpportunityDetails][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function getOpportunityContent(pageId: string) {
  logger.info('[NOTION][getOpportunityContent][START]', { pageId });
  if (!notion) {
    logger.warn(
      '[NOTION][getOpportunityContent][WARN] Notion client not configured.',
    );
    return null;
  }

  try {
    const blockResponse = await notion.blocks.children.list({
      block_id: pageId,
    });
    logger.debug('[NOTION][getOpportunityContent][BLOCKS_RETRIEVED]', {
      blockResponse,
    });

    let content = '';
    for (const block of blockResponse.results) {
      if (block.object !== 'block') {
        logger.warn(
          '[NOTION][getOpportunityContent][WARN] Skipping non-block object.',
          { block },
        );
        continue;
      }
      const typedBlock = block as BlockObjectResponse; // Explicitly cast to BlockObjectResponse

      if (
        typedBlock.type === 'paragraph' &&
        'paragraph' in typedBlock &&
        typedBlock.paragraph.rich_text
      ) {
        content += getRichTextContent(typedBlock.paragraph.rich_text) + '\n';
      } else if (
        typedBlock.type === 'heading_1' &&
        'heading_1' in typedBlock &&
        typedBlock.heading_1.rich_text
      ) {
        content +=
          '# ' + getRichTextContent(typedBlock.heading_1.rich_text) + '\n';
      } else if (
        typedBlock.type === 'heading_2' &&
        'heading_2' in typedBlock &&
        typedBlock.heading_2.rich_text
      ) {
        content +=
          '## ' + getRichTextContent(typedBlock.heading_2.rich_text) + '\n';
      } else if (
        typedBlock.type === 'heading_3' &&
        'heading_3' in typedBlock &&
        typedBlock.heading_3.rich_text
      ) {
        content +=
          '### ' + getRichTextContent(typedBlock.heading_3.rich_text) + '\n';
      } else if (
        typedBlock.type === 'bulleted_list_item' &&
        'bulleted_list_item' in typedBlock &&
        typedBlock.bulleted_list_item.rich_text
      ) {
        content +=
          '* ' +
          getRichTextContent(typedBlock.bulleted_list_item.rich_text) +
          '\n';
      } else if (
        typedBlock.type === 'numbered_list_item' &&
        'numbered_list_item' in typedBlock &&
        typedBlock.numbered_list_item.rich_text
      ) {
        content +=
          '1. ' +
          getRichTextContent(typedBlock.numbered_list_item.rich_text) +
          '\n';
      } else if (
        typedBlock.type === 'to_do' &&
        'to_do' in typedBlock &&
        typedBlock.to_do.rich_text
      ) {
        content +=
          '- [ ] ' + getRichTextContent(typedBlock.to_do.rich_text) + '\n';
      } else if (
        typedBlock.type === 'code' &&
        'code' in typedBlock &&
        typedBlock.code.rich_text
      ) {
        content +=
          '```\n' + getRichTextContent(typedBlock.code.rich_text) + '\n```\n';
      } else if (
        typedBlock.type === 'quote' &&
        'quote' in typedBlock &&
        typedBlock.quote.rich_text
      ) {
        content += '> ' + getRichTextContent(typedBlock.quote.rich_text) + '\n';
      } else if (
        typedBlock.type === 'callout' &&
        'callout' in typedBlock &&
        typedBlock.callout.rich_text
      ) {
        content +=
          '> ' + getRichTextContent(typedBlock.callout.rich_text) + '\n';
      } else {
        logger.debug('[NOTION][getOpportunityContent][UNHANDLED_BLOCK_TYPE]', {
          blockType: typedBlock.type,
          block: typedBlock,
        });
      }
    }

    logger.info('[NOTION][getOpportunityContent][SUCCESS]');
    return content;
  } catch (error: unknown) {
    const errorContext =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) };
    logger.error('[NOTION][getOpportunityContent][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function updateOpportunityStatus(pageId: string, status: string) {
  logger.info('[NOTION][updateOpportunityStatus][START]', { pageId, status });
  if (!notion) {
    logger.warn(
      '[NOTION][updateOpportunityStatus][WARN] Notion client not configured.',
    );
    return null;
  }

  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: { select: { name: status } },
      },
    });
    logger.info('[NOTION][updateOpportunityStatus][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    const errorContext =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { message: String(error) };
    logger.error('[NOTION][updateOpportunityStatus][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function addStakeholderToOpportunity(
  pageId: string,
  stakeholder: { name: string; email?: string; role?: string }, // Assuming a structure for stakeholder
) {
  logger.info('[NOTION][addStakeholderToOpportunity][START]', {
    pageId,
    stakeholder,
  });
  if (!notion || !NOTION_DATABASE_ID) {
    // Ensure NOTION_DATABASE_ID is checked
    logger.warn(
      '[NOTION][addStakeholderToOpportunity][WARN] Notion client or database ID not configured.',
    );
    return null;
  }

  try {
    // First, retrieve the current page to get existing relation IDs
    const currentPage = await notion.pages.retrieve({ page_id: pageId });
    if (!('properties' in currentPage)) {
      logger.warn(
        '[NOTION][addStakeholderToOpportunity][WARN] Current page does not have properties.',
        { pageId },
      );
      return null;
    }

    // Assuming a Notion relation property named 'Stakeholders'
    const existingStakeholdersProp = currentPage.properties['Stakeholders'];
    let existingRelationIds: { id: string }[] = [];

    if (
      existingStakeholdersProp &&
      existingStakeholdersProp.type === 'relation'
    ) {
      existingRelationIds = existingStakeholdersProp.relation.map((r) => ({
        id: r.id,
      }));
    }

    // For this example, we'll create a new placeholder page for the stakeholder
    // In a real application, you might link to an existing 'Contact' page or create a more detailed one.
    const newStakeholderPage = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID }, // Use your contacts database ID here
      properties: {
        Name: { title: [{ text: { content: stakeholder.name } }] },
        Email: { email: stakeholder.email || null },
        Role: { rich_text: [{ text: { content: stakeholder.role || '' } }] },
        // Add other relevant properties for a stakeholder
      },
    });

    const newStakeholderId = newStakeholderPage.id;

    const updatedRelationIds = [
      ...existingRelationIds,
      { id: newStakeholderId },
    ];

    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        Stakeholders: { relation: updatedRelationIds },
      },
    });

    logger.info('[NOTION][addStakeholderToOpportunity][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    const errorContext = {
      message: error instanceof Error ? error.message : String(error),
    };
    logger.error('[NOTION][addStakeholderToOpportunity][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function saveOutreachToNotion(
  pageId: string,
  outreach: { stakeholder: string; message: string; platform: string },
) {
  logger.info('[NOTION][saveOutreachToNotion][START]', { pageId, outreach });
  if (!notion) {
    logger.warn(
      '[NOTION][saveOutreachToNotion][WARN] Notion client not configured.',
    );
    return null;
  }

  try {
    // In a real scenario, you might have a dedicated 'Outreach Log' database.
    // For this example, we'll add it as a rich_text property or a new page related to the opportunity.
    const response = await notion.pages.update({
      page_id: pageId,
      properties: {
        'Last Outreach': {
          rich_text: [
            {
              text: {
                content: `Platform: ${outreach.platform}\nStakeholder: ${outreach.stakeholder}\nMessage: ${outreach.message}`,
              },
            },
          ],
        },
        // You might also add a Date property for last outreach date
        'Last Outreach Date': { date: { start: new Date().toISOString() } },
      },
    });

    logger.info('[NOTION][saveOutreachToNotion][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    const errorContext = {
      message: error instanceof Error ? error.message : String(error),
    };
    logger.error('[NOTION][saveOutreachToNotion][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function getCVComponentsFromNotion(): Promise<CVComponent[]> {
  logger.info('[NOTION][getCVComponentsFromNotion][START]');
  if (!notion || !NOTION_CV_DATABASE_ID) {
    logger.warn(
      '[NOTION][getCVComponentsFromNotion][WARN] Notion client or CV database ID not configured.',
    );
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_CV_DATABASE_ID,
      filter: {
        property: 'Type',
        select: {
          is_not_empty: true,
        },
      },
    });
    logger.debug('[NOTION][getCVComponentsFromNotion][RESULTS_COUNT]', {
      count: response.results.length,
    });

    const pageResults = response.results.filter(
      (item): item is PageObjectResponse =>
        'properties' in item && 'id' in item && item.object === 'page',
    );

    const cvComponents: CVComponent[] = pageResults.map((page) => {
      const properties = page.properties;

      const name = getPropertyValue(properties, 'Name', 'title') as string;
      const content = getPropertyValue(
        properties,
        'Content',
        'rich_text',
      ) as string;
      const type = String(
        (getPropertyValue(properties, 'Type', 'select') as
          | string
          | null
          | undefined) ?? 'Unknown',
      ); // Using String() and nullish coalescing
      const keywords = getPropertyValue(
        properties,
        'Keywords',
        'multi_select',
      ) as string[] | null;
      const uniqueId = getPropertyValue(
        properties,
        'Unique ID',
        'rich_text',
      ) as string | null;
      const notionPageId = page.id;
      const componentName = getPropertyValue(
        properties,
        'Component Name',
        'rich_text',
      ) as string | null; // Assuming rich_text or title
      const componentType = String(
        (getPropertyValue(properties, 'Component Type', 'select') as
          | string
          | null
          | undefined) ?? 'Unknown',
      ); // Assuming select, providing fallback
      const contentPrimary = getPropertyValue(
        properties,
        'Content Primary',
        'rich_text',
      ) as string | null;
      const startDate = getPropertyValue(properties, 'Start Date', 'date') as
        | string
        | null;
      const endDate = getPropertyValue(properties, 'End Date', 'date') as
        | string
        | null;
      const associatedCompanyInstitution = getPropertyValue(
        properties,
        'Associated Company/Institution',
        'rich_text',
      ) as string | null;

      return {
        id: page.id,
        name: name,
        content: content,
        type: type,
        keywords: keywords || undefined, // Use undefined if null
        uniqueId: uniqueId || undefined,
        notionPageId: notionPageId,
        componentName: componentName || undefined,
        componentType: componentType,
        contentPrimary: contentPrimary || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        associatedCompanyInstitution: associatedCompanyInstitution || undefined,
      };
    });

    logger.info('[NOTION][getCVComponentsFromNotion][SUCCESS]', {
      count: cvComponents.length,
    });
    return cvComponents;
  } catch (error: unknown) {
    const errorContext = {
      message: error instanceof Error ? error.message : String(error),
    };
    logger.error('[NOTION][getCVComponentsFromNotion][ERROR]', errorContext);
    throw error; // Re-throw to propagate the error
  }
}

export async function fetchOpportunityByIdFromNotion(
  opportunityId: string,
): Promise<{
  success: boolean;
  OrionOpportunity?: OpportunityNotionOutputShared | null;
  error?: string;
}> {
  logger.info('[NOTION][fetchOpportunityByIdFromNotion][START]', {
    opportunityId,
  });
  if (!notion) {
    logger.warn(
      '[NOTION][fetchOpportunityByIdFromNotion][WARN] Notion client not configured.',
    );
    return { success: false, error: 'Notion client not configured' };
  }

  try {
    const response = await notion.pages.retrieve({
      page_id: opportunityId,
    });
    logger.debug('[NOTION][fetchOpportunityByIdFromNotion][PAGE_RETRIEVED]', {
      response,
    });

    if (!('properties' in response)) {
      logger.warn(
        '[NOTION][fetchOpportunityByIdFromNotion][WARN] Retrieved page does not have properties.',
        { opportunityId },
      );
      return { success: false, error: 'Page properties not found' };
    }

    const properties = response.properties;

    const title = getPropertyValue(properties, 'Aa Title', 'title') as string;
    const company = getPropertyValue(
      properties,
      'companyOrInstitution',
      'rich_text',
    ) as string;

    const statusString = getPropertyValue(properties, 'Status', 'select') as
      | string
      | null
      | undefined;
    const status = mapNotionStatusToOpportunityStatus(statusString);

    const typeString = getPropertyValue(properties, 'Type', 'select') as
      | string
      | null
      | undefined;
    const type = mapNotionTypeToOpportunityType(typeString);

    const url = getPropertyValue(properties, 'URL', 'url') as string | null;
    const content = getPropertyValue(
      properties,
      'Content',
      'rich_text',
    ) as string;
    const tags = getPropertyValue(properties, 'Tags', 'multi_select') as
      | string[]
      | null;
    const dateIdentified = getPropertyValue(properties, 'Date', 'date') as
      | string
      | null;
    const lastEditedTime = response.last_edited_time; // Direct from page

    const priorityString = getPropertyValue(
      properties,
      'Priority',
      'select',
    ) as string | null | undefined;
    const priority = mapNotionPriorityToOpportunityPriority(priorityString);

    const evaluationOutput = getPropertyValue(
      properties,
      'Evaluation Output',
      'rich_text',
    ) as string | null;
    const webResearchContext = getPropertyValue(
      properties,
      'Web Research Context',
      'rich_text',
    ) as string | null;
    const contentType = getPropertyValue(
      properties,
      'Content Type',
      'select',
    ) as string | null;
    const notes = getPropertyValue(properties, 'Notes', 'rich_text') as
      | string
      | null;
    const pros = getPropertyValue(properties, 'Pros', 'multi_select') as
      | string[]
      | null;
    const cons = getPropertyValue(properties, 'Cons', 'multi_select') as
      | string[]
      | null;
    const missingSkills = getPropertyValue(
      properties,
      'Missing Skills',
      'multi_select',
    ) as string[] | null;
    const relatedEvaluationId = getPropertyValue(
      properties,
      'Related Evaluation ID',
      'rich_text',
    ) as string | null;
    const lastStatusUpdate = getPropertyValue(
      properties,
      'Last Status Update',
      'date',
    ) as string | null;
    const deadline = getPropertyValue(properties, 'Deadline', 'date') as
      | string
      | null;
    const location = getPropertyValue(properties, 'Location', 'rich_text') as
      | string
      | null;
    const contact = getPropertyValue(properties, 'Contact', 'rich_text') as
      | string
      | null;
    const position = getPropertyValue(properties, 'Position', 'rich_text') as
      | string
      | null;
    const createdAt = response.created_time; // Directly from page, not properties
    const updatedAt = response.last_edited_time; // Directly from page, not properties

    const opportunity: OpportunityNotionOutputShared = {
      id: response.id,
      title: title,
      company: company,
      companyOrInstitution: company,
      status: status,
      type: type,
      url: url,
      last_edited_time: lastEditedTime,
      content: content,
      tags: tags,
      dateIdentified: dateIdentified,
      priority: priority,
      evaluationOutput: evaluationOutput
        ? {
            summary: evaluationOutput,
            overallFitScore: 0,
            strengths: [],
            gaps: [],
            suggestedCvComponents: [],
            suggestedNextSteps: [],
            alignmentHighlights: [],
            gapAnalysis: [],
            fitScorePercentage: 0,
          }
        : null, // Providing a basic EvaluationOutput if summary exists
      webResearchContext: webResearchContext,
      contentType: contentType,
      notes: notes,
      pros: pros,
      cons: cons,
      missingSkills: missingSkills,
      relatedEvaluationId: relatedEvaluationId,
      lastStatusUpdate: lastStatusUpdate,
      deadline: deadline,
      location: location,
      contact: contact,
      position: position,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    logger.info('[NOTION][fetchOpportunityByIdFromNotion][SUCCESS]', {
      opportunity,
    });
    return { success: true, OrionOpportunity: opportunity };
  } catch (error: unknown) {
    logger.error('[NOTION][fetchOpportunityByIdFromNotion][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, error: (error as Error).message };
  }
}

export async function updateNotionOpportunity(
  pageId: string,
  properties: UpdatePageParameters['properties'],
): Promise<{
  success: boolean;
  OrionOpportunity?: UpdatePageResponse | null;
  error?: string;
}> {
  logger.info('[NOTION][updateNotionOpportunity][START]', {
    pageId,
    properties,
  });
  if (!notion) {
    logger.warn(
      '[NOTION][updateNotionOpportunity][WARN] Notion client not configured.',
    );
    return { success: false, error: 'Notion client not configured' };
  }

  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    logger.info('[NOTION][updateNotionOpportunity][SUCCESS]', { response });
    return { success: true, OrionOpportunity: response };
  } catch (error: unknown) {
    logger.error('[NOTION][updateNotionOpportunity][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return { success: false, error: (error as Error).message };
  }
}

export async function getJournalEntriesFromNotion() {
  logger.info('[NOTION][getJournalEntriesFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][getJournalEntriesFromNotion][WARN] Notion client or database ID not configured.',
    );
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Type',
        select: {
          equals: 'Journal', // Assuming 'Journal' is the type for journal entries
        },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
    });
    logger.debug('[NOTION][getJournalEntriesFromNotion][RESULTS_COUNT]', {
      count: response.results.length,
    });

    const journalEntries = response.results
      .map((item) => {
        // Changed 'page' to 'item' to avoid re-declaration
        if (!('properties' in item)) {
          // Ensure item is PageObjectResponse
          logger.warn(
            '[NOTION][getJournalEntriesFromNotion][WARN] Page does not have properties.',
            { pageId: item.id },
          );
          return null; // Return null for invalid pages
        }
        const page = item as PageObjectResponse; // Cast to PageObjectResponse
        const properties = page.properties;

        const title = getPropertyValue(properties, 'Name', 'title') as string; // Assuming 'Name' is the title property for journals
        const date = getPropertyValue(properties, 'Date', 'date') as string;
        const content = getPropertyValue(
          properties,
          'Content',
          'rich_text',
        ) as string;
        const reflectionId = getPropertyValue(
          properties,
          'Reflection ID',
          'rich_text',
        ) as string | null;
        const original_entry_id = getPropertyValue(
          properties,
          'Original Entry ID',
          'rich_text',
        ) as string | null;
        const tags = getPropertyValue(properties, 'Tags', 'multi_select') as
          | string[]
          | null;
        const mood = getPropertyValue(properties, 'Mood', 'select') as
          | string
          | null;
        const createdAt = page.created_time; // Directly from page, not properties
        const updatedAt = page.last_edited_time; // Directly from page, not properties

        return {
          id: page.id,
          title: title,
          date: date,
          content: content,
          reflectionId: reflectionId,
          original_entry_id: original_entry_id,
          tags: tags || undefined,
          mood: mood || undefined,
          createdAt: createdAt || undefined,
          updatedAt: updatedAt || undefined,
        };
      })
      .filter((entry) => entry !== null); // Filter out null entries

    logger.info('[NOTION][getJournalEntriesFromNotion][SUCCESS]', {
      count: journalEntries.length,
    });
    return journalEntries;
  } catch (error: unknown) {
    logger.error('[NOTION][getJournalEntriesFromNotion][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error; // Re-throw to propagate the error
  }
}

export async function createJournalEntryInNotion(
  data: JournalEntryNotionInput,
) {
  logger.info('[NOTION][createJournalEntryInNotion][START]', { data });
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][createJournalEntryInNotion][WARN] Notion client or database ID not configured.',
    );
    return null;
  }
  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: data.title || '' } }] },
        Date: {
          date: {
            start:
              data.date instanceof Date ? data.date.toISOString() : data.date,
          },
        }, // Handle string or Date
        Content: { rich_text: [{ text: { content: data.content || '' } }] },
        Type: { select: { name: 'Journal' } }, // Explicitly set type for journal entries
        Tags: {
          multi_select: data.tags?.map((tag: string) => ({ name: tag })) || [],
        },
        Mood: { select: { name: data.mood || 'Neutral' } },
      },
    });
    logger.info('[NOTION][createJournalEntryInNotion][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    logger.error('[NOTION][createJournalEntryInNotion][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error; // Re-throw to propagate error
  }
}

export async function fetchContactsFromNotion() {
  logger.info('[NOTION][fetchContactsFromNotion][START]');
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][fetchContactsFromNotion][WARN] Notion client or database ID not configured.',
    );
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Type',
        select: {
          equals: 'Contact', // Assuming 'Contact' is the type for contacts
        },
      },
    });

    logger.debug('[NOTION][fetchContactsFromNotion][RESULTS_COUNT]', {
      count: response.results.length,
    });

    const contacts = response.results
      .map((item) => {
        if (!('properties' in item)) {
          logger.warn(
            '[NOTION][fetchContactsFromNotion][WARN] Page does not have properties.',
            { pageId: item.id },
          );
          return null; // Return null for invalid pages
        }
        const page = item as PageObjectResponse; // Cast to PageObjectResponse
        const properties = page.properties;

        const name = getPropertyValue(properties, 'Name', 'title') as string;
        const email = getPropertyValue(properties, 'Email', 'email') as
          | string
          | null;
        const role = getPropertyValue(properties, 'Role', 'rich_text') as
          | string
          | null;
        const company = getPropertyValue(properties, 'Company', 'rich_text') as
          | string
          | null;
        const linkedinUrl = getPropertyValue(
          properties,
          'LinkedIn URL',
          'url',
        ) as string | null;

        return {
          id: page.id,
          name: name,
          email: email || undefined,
          role: role || undefined,
          company: company || undefined,
          linkedinUrl: linkedinUrl || undefined,
        };
      })
      .filter((contact) => contact !== null); // Filter out null entries

    logger.info('[NOTION][fetchContactsFromNotion][SUCCESS]', {
      count: contacts.length,
    });
    return contacts;
  } catch (error: unknown) {
    logger.error('[NOTION][fetchContactsFromNotion][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error; // Re-throw to propagate the error
  }
}

export async function saveJournalEntryToNotion(data: JournalEntryNotionInput) {
  logger.info('[NOTION][saveJournalEntryToNotion][START]', { data });
  if (!notion || !NOTION_DATABASE_ID) {
    logger.warn(
      '[NOTION][saveJournalEntryToNotion][WARN] Notion client or database ID not configured.',
    );
    return null;
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: data.title || '' } }] },
        Date: {
          date: {
            start:
              data.date instanceof Date ? data.date.toISOString() : data.date,
          },
        },
        Content: { rich_text: [{ text: { content: data.content || '' } }] },
        Type: { select: { name: 'Journal' } },
        Tags: {
          multi_select: data.tags?.map((tag: string) => ({ name: tag })) || [],
        },
        Mood: { select: { name: data.mood || 'Neutral' } },
        'Reflection ID': {
          rich_text: [{ text: { content: data.reflectionId || '' } }],
        },
        'Original Entry ID': {
          rich_text: [{ text: { content: data.original_entry_id || '' } }],
        },
      },
    });
    logger.info('[NOTION][saveJournalEntryToNotion][SUCCESS]', { response });
    return response;
  } catch (error: unknown) {
    logger.error('[NOTION][saveJournalEntryToNotion][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error; // Re-throw to propagate error
  }
}

export async function updateNotionDatabaseSchema(
  databaseId: string,
  properties: Record<string, any>, // Changed type to any for placeholder function. Note: Notion API for schema updates is complex.
): Promise<{ success: boolean; error?: string }> {
  // Explicitly define return type for errors
  logger.info('[NOTION][updateNotionDatabaseSchema][START]', {
    databaseId,
    properties,
  });
  if (!notion) {
    logger.warn(
      '[NOTION][updateNotionDatabaseSchema][WARN] Notion client not configured.',
    );
    return { success: false, error: 'Notion client not configured' };
  }

  try {
    // Note: The Notion API for updating database schema is quite complex and requires
    // handling different property types and their specific structures.
    // This is a simplified example and might need significant expansion
    // based on the exact schema changes required.
    // As of @notionhq/client v2.2.0, there is no direct `databases.update` method
    // that takes a full `properties` object for schema modification in the same way `pages.create` does.
    // Schema updates are typically done via `databases.retrieve` to get current schema,
    // modify it, and then potentially recreate or use more advanced Notion API features
    // if direct schema modification endpoints become available or are found.

    logger.warn(
      '[NOTION][updateNotionDatabaseSchema][WARN] Direct database schema update is not fully supported by Notion API client in this manner. This function is a placeholder.',
      { databaseId, properties },
    );

    // Placeholder for actual schema update logic if Notion API supports it directly in the future
    // For now, this function will primarily log the intent.

    logger.info('[NOTION][updateNotionDatabaseSchema][SUCCESS]', {
      message: 'Schema update request logged (no direct API call).',
    });
    return { success: true };
  } catch (error: unknown) {
    // Use unknown for caught error
    logger.error('[NOTION][updateNotionDatabaseSchema][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
    }; // Return error message
  }
}
