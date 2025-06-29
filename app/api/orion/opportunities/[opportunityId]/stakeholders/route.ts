/**
 * GOAL: Fetch and manage OrionOpportunity stakeholders using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, reference.md, types/OrionOpportunity.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { Client, APIResponseError } from '@notionhq/client';
import { GetPageResponse, UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { Stakeholder } from '@/lib/types';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // This is the central database ID
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

// Helper function to extract Notion page properties into a Stakeholder object
// Assumes Notion database has properties: 'Name' (title), 'Job Title' (rich_text), 'Email' (email), 'LinkedIn URL' (url)
const notionPageToStakeholder = (page: GetPageResponse): Stakeholder => {
  const properties: Record<string, unknown> = (page as { properties: Record<string, unknown> }).properties; // Cast to Record<string, unknown> to access properties dynamically

  return {
    id: page.id,
    name: (properties['Name'] as { title: { plain_text: string }[] })?.title[0]?.plain_text || '',
    title: (properties['Job Title'] as { rich_text: { plain_text: string }[] })?.rich_text[0]?.plain_text || '',
    email: (properties['Email'] as { email: string | null | undefined })?.email || undefined,
    linkedinUrl: (properties['LinkedIn URL'] as { url: string | null | undefined })?.url || undefined,
    // Assuming 'Company' is a text property on the Stakeholder page, or a relation to a Company DB
    // For simplicity, let's assume it's a rich_text for now
    company:
      (properties['Company'] as { rich_text: { plain_text: string | null | undefined }[] })?.rich_text[0]?.plain_text ||
      undefined,
    // Add other relevant properties as needed
  };
};

export async function GET(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/stakeholders',
    opportunityId: params.opportunityId,
    timestamp: new Date().toISOString(),
  };
  logger.info('[STAKEHOLDERS_GET][START] Received request to fetch stakeholders.', logContext);

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_GET][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    // --- Step 1: Fetch the Opportunity Notion Page ---
    logger.debug('[STAKEHOLDERS_GET][NOTION_FETCH_OPPORTUNITY] Fetching opportunity from Notion.', logContext);
    let opportunityPage: GetPageResponse;
    try {
      opportunityPage = await notion.pages.retrieve({ page_id: params.opportunityId }); // Use params.opportunityId here
    } catch (notionFetchError: unknown) {
      logger.error('[STAKEHOLDERS_GET][NOTION_FETCH_OPPORTUNITY_ERROR] Error fetching opportunity page from Notion.', {
        ...logContext,
        error: notionFetchError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch opportunity from Notion.',
          details: notionFetchError instanceof Error ? notionFetchError.message : String(notionFetchError),
        },
        { status: 500 }
      );
    }

    const opportunityProperties: Record<string, unknown> = (opportunityPage as { properties: Record<string, unknown> })
      .properties; // Cast to Record<string, unknown> for dynamic access

    // --- Step 2: Extract Stakeholder Relation IDs from Opportunity Page ---
    // Assuming a relation property named 'Stakeholders' on the Opportunity page
    const stakeholderRelationIds =
      (opportunityProperties['Stakeholders'] as { relation: { id: string }[] })?.relation?.map(
        (rel: { id: string }) => rel.id
      ) || [];

    logger.debug('[STAKEHOLDERS_GET][EXTRACT_RELATION_IDS] Extracted stakeholder relation IDs.', {
      ...logContext,
      count: stakeholderRelationIds.length,
    });

    if (stakeholderRelationIds.length === 0) {
      logger.info(
        '[STAKEHOLDERS_GET][NO_STAKEHOLDERS] No stakeholders found via relation for this opportunity.',
        logContext
      );
      return NextResponse.json({
        success: true,
        stakeholders: [],
        message: 'No stakeholders linked to this opportunity.',
      });
    }

    // --- Step 3: Query Notion for Stakeholder Pages ---
    // Fetch individual stakeholder pages using their IDs
    logger.debug('[STAKEHOLDERS_GET][NOTION_QUERY_STAKEHOLDERS] Querying Notion for individual stakeholder pages.', {
      ...logContext,
      stakeholderIds: stakeholderRelationIds,
    });
    const stakeholders: Stakeholder[] = [];
    for (const stakeholderId of stakeholderRelationIds) {
      try {
        const stakeholderPage = await notion.pages.retrieve({ page_id: stakeholderId });
        stakeholders.push(notionPageToStakeholder(stakeholderPage));
      } catch (singleStakeholderFetchError: unknown) {
        logger.warn('[STAKEHOLDERS_GET][NOTION_FETCH_SINGLE_ERROR] Could not fetch individual stakeholder page.', {
          ...logContext,
          stakeholderId,
          error: singleStakeholderFetchError,
        });
        // Continue to fetch others even if one fails
      }
    }

    logger.success('[STAKEHOLDERS_GET][SUCCESS] Successfully fetched stakeholders.', {
      ...logContext,
      count: stakeholders.length,
    });
    return NextResponse.json({ success: true, stakeholders });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[STAKEHOLDERS_GET][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[STAKEHOLDERS_GET][GENERAL_ERROR]', { ...logContext, error: errorMessage, details: errorDetails });
    } else {
      logger.error('[STAKEHOLDERS_GET][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/stakeholders',
    opportunityId: params.opportunityId,
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[STAKEHOLDERS_POST][START] Received request to create new stakeholder.', logContext);

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_POST][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, title, email, linkedinUrl, company } = body;

    // --- Step 1: Validate Incoming Stakeholder Data ---
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logger.warn('[STAKEHOLDERS_POST][VALIDATION_FAIL] Stakeholder name is required.', { ...logContext, body });
      return NextResponse.json({ success: false, error: 'Stakeholder name is required.' }, { status: 400 });
    }

    // --- Step 2: Create New Stakeholder Page in Notion ---
    logger.debug('[STAKEHOLDERS_POST][NOTION_CREATE] Creating new stakeholder page in Notion.', {
      ...logContext,
      name,
    });

    let newStakeholderPage;
    try {
      newStakeholderPage = await notion.pages.create({
        parent: { database_id: NOTION_DATABASE_ID! },
        properties: {
          Name: { title: [{ text: { content: name.trim() } }] },
          'Job Title': { rich_text: [{ text: { content: title?.trim() || '' } }] },
          Email: email ? { email: email.trim() } : { email: null },
          'LinkedIn URL': linkedinUrl ? { url: linkedinUrl.trim() } : { url: null },
          Company: company ? { rich_text: [{ text: { content: company.trim() } }] } : { rich_text: [] },
          Type: { select: { name: 'Stakeholder' } }, // Important for central database differentiation
        },
      });
      logger.success('[STAKEHOLDERS_POST][NOTION_CREATE_SUCCESS] New stakeholder page created in Notion.', {
        ...logContext,
        stakeholderPageId: newStakeholderPage.id,
      });
    } catch (notionCreateError: unknown) {
      logger.error('[STAKEHOLDERS_POST][NOTION_CREATE_ERROR] Error creating stakeholder page in Notion.', {
        ...logContext,
        error: notionCreateError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create stakeholder in Notion.',
          details: notionCreateError instanceof Error ? notionCreateError.message : String(notionCreateError),
        },
        { status: 500 }
      );
    }

    // --- Step 3: Link New Stakeholder to Opportunity Page in Notion ---
    logger.debug('[STAKEHOLDERS_POST][NOTION_LINK_OPPORTUNITY] Linking new stakeholder to opportunity page.', {
      ...logContext,
      newStakeholderId: newStakeholderPage.id,
      opportunityId: params.opportunityId, // Use params.opportunityId directly
    });

    try {
      const opportunityPage = await notion.pages.retrieve({ page_id: params.opportunityId });
      const stakeholderProperty = (opportunityPage as { properties: Record<string, unknown> }).properties[
        'Stakeholders'
      ];

      const currentStakeholderRelations =
        stakeholderProperty &&
        typeof stakeholderProperty === 'object' &&
        'relation' in stakeholderProperty &&
        Array.isArray((stakeholderProperty as { relation: { id: string }[] }).relation)
          ? (stakeholderProperty as { relation: { id: string }[] }).relation
          : [];

      const updatedStakeholderRelations = [...currentStakeholderRelations, { id: newStakeholderPage.id }];

      await notion.pages.update({
        page_id: params.opportunityId,
        properties: {
          Stakeholders: {
            relation: updatedStakeholderRelations,
          },
        },
      });
      logger.success('[STAKEHOLDERS_POST][NOTION_LINK_SUCCESS] New stakeholder linked to opportunity page.', {
        ...logContext,
        newStakeholderId: newStakeholderPage.id,
        opportunityId: params.opportunityId,
      });
    } catch (notionLinkError: unknown) {
      logger.error('[STAKEHOLDERS_POST][NOTION_LINK_ERROR] Error linking stakeholder to opportunity page.', {
        ...logContext,
        error: notionLinkError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to link stakeholder to opportunity.',
          details: notionLinkError instanceof Error ? notionLinkError.message : String(notionLinkError),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stakeholder: notionPageToStakeholder(newStakeholderPage),
      message: 'Stakeholder created and linked successfully.',
    });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[STAKEHOLDERS_POST][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[STAKEHOLDERS_POST][GENERAL_ERROR]', { ...logContext, error: errorMessage, details: errorDetails });
    } else {
      logger.error('[STAKEHOLDERS_POST][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/stakeholders',
    opportunityId: params.opportunityId,
    timestamp: new Date().toISOString(),
    operation: 'PATCH',
  };
  logger.info('[STAKEHOLDERS_PATCH][START] Received request to update stakeholder.', logContext);

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_PATCH][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { stakeholderId, name, title, email, linkedinUrl, company } = body;

    if (!stakeholderId || typeof stakeholderId !== 'string' || stakeholderId.trim() === '') {
      logger.warn('[STAKEHOLDERS_PATCH][VALIDATION_FAIL] Stakeholder ID is required.', { ...logContext, body });
      return NextResponse.json({ success: false, error: 'Stakeholder ID is required.' }, { status: 400 });
    }

    logger.debug('[STAKEHOLDERS_PATCH][NOTION_UPDATE] Updating stakeholder page in Notion.', {
      ...logContext,
      stakeholderId,
    });

    // --- Step 1: Construct Notion Properties for Update ---
    const propertiesToUpdate: UpdatePageParameters['properties'] = {};
    if (name !== undefined) {
      propertiesToUpdate['Name'] = { title: [{ text: { content: name.trim() } }] };
    }
    if (title !== undefined) {
      propertiesToUpdate['Job Title'] = { rich_text: [{ text: { content: title.trim() } }] };
    }
    if (email !== undefined) {
      propertiesToUpdate['Email'] = email ? { email: email.trim() } : { email: null };
    }
    if (linkedinUrl !== undefined) {
      propertiesToUpdate['LinkedIn URL'] = linkedinUrl ? { url: linkedinUrl.trim() } : { url: null };
    }
    if (company !== undefined) {
      propertiesToUpdate['Company'] = company
        ? { rich_text: [{ text: { content: company.trim() } }] }
        : { rich_text: [] };
    }

    if (Object.keys(propertiesToUpdate).length === 0) {
      logger.warn('[STAKEHOLDERS_PATCH][NO_CHANGES] No valid properties provided for update.', { ...logContext, body });
      return NextResponse.json({ success: true, message: 'No changes to apply.' });
    }

    await notion.pages.update({
      page_id: stakeholderId,
      properties: propertiesToUpdate,
    });

    logger.success('[STAKEHOLDERS_PATCH][SUCCESS] Stakeholder updated successfully.', {
      ...logContext,
      stakeholderId,
    });
    return NextResponse.json({
      success: true,
      message: 'Stakeholder updated successfully.',
    });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[STAKEHOLDERS_PATCH][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[STAKEHOLDERS_PATCH][GENERAL_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else {
      logger.error('[STAKEHOLDERS_PATCH][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/stakeholders',
    opportunityId: params.opportunityId,
    timestamp: new Date().toISOString(),
    operation: 'DELETE',
  };
  logger.info('[STAKEHOLDERS_DELETE][START] Received request to delete stakeholder.', logContext);

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_DELETE][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { stakeholderId } = body;

    if (!stakeholderId || typeof stakeholderId !== 'string' || stakeholderId.trim() === '') {
      logger.warn('[STAKEHOLDERS_DELETE][VALIDATION_FAIL] Stakeholder ID is required for deletion.', {
        ...logContext,
        body,
      });
      return NextResponse.json({ success: false, error: 'Stakeholder ID is required.' }, { status: 400 });
    }

    logger.debug('[STAKEHOLDERS_DELETE][NOTION_UNLINK] Unlinking stakeholder from opportunity in Notion.', {
      ...logContext,
      stakeholderId,
      opportunityId: params.opportunityId, // Use params.opportunityId directly
    });

    try {
      const opportunityPage = await notion.pages.retrieve({ page_id: params.opportunityId });
      const stakeholderProperty = (opportunityPage as { properties: Record<string, unknown> }).properties[
        'Stakeholders'
      ];

      const currentStakeholderRelations =
        stakeholderProperty &&
        typeof stakeholderProperty === 'object' &&
        'relation' in stakeholderProperty &&
        Array.isArray((stakeholderProperty as { relation: { id: string }[] }).relation)
          ? (stakeholderProperty as { relation: { id: string }[] }).relation
          : [];

      const updatedStakeholderRelations = currentStakeholderRelations.filter(
        (rel: { id: string }) => rel.id !== stakeholderId
      );

      await notion.pages.update({
        page_id: params.opportunityId,
        properties: {
          Stakeholders: {
            relation: updatedStakeholderRelations,
          },
        },
      });
      logger.success('[STAKEHOLDERS_DELETE][NOTION_UNLINK_SUCCESS] Stakeholder unlinked from opportunity.', {
        ...logContext,
        stakeholderId,
        opportunityId: params.opportunityId,
      });
    } catch (notionUnlinkError: unknown) {
      logger.error('[STAKEHOLDERS_DELETE][NOTION_UNLINK_ERROR] Error unlinking stakeholder from opportunity.', {
        ...logContext,
        error: notionUnlinkError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to unlink stakeholder from opportunity.',
          details: notionUnlinkError instanceof Error ? notionUnlinkError.message : String(notionUnlinkError),
        },
        { status: 500 }
      );
    }

    // --- Step 3: Delete Stakeholder Page in Notion ---
    logger.debug('[STAKEHOLDERS_DELETE][NOTION_DELETE] Deleting stakeholder page in Notion.', {
      ...logContext,
      stakeholderId,
    });

    await notion.pages.update({
      page_id: stakeholderId,
      archived: true, // Archive the page instead of directly deleting
    });

    logger.success('[STAKEHOLDERS_DELETE][SUCCESS] Stakeholder page archived successfully.', {
      ...logContext,
      stakeholderId,
    });
    return NextResponse.json({
      success: true,
      message: 'Stakeholder archived successfully.',
    });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error: ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[STAKEHOLDERS_DELETE][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[STAKEHOLDERS_DELETE][GENERAL_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else {
      logger.error('[STAKEHOLDERS_DELETE][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
