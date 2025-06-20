/**
 * GOAL: Fetch and manage OrionOpportunity stakeholders using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, reference.md, types/OrionOpportunity.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { Client, APIResponseError } from '@notionhq/client';
import { GetPageResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { Stakeholder, OrionOpportunity } from '@/lib/types';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // This is the central database ID
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

// Helper function to extract Notion page properties into a Stakeholder object
// Assumes Notion database has properties: 'Name' (title), 'Job Title' (rich_text), 'Email' (email), 'LinkedIn URL' (url)
const notionPageToStakeholder = (page: GetPageResponse): Stakeholder => {
  const properties: any = (page as any).properties; // Cast to any to access properties dynamically

  return {
    id: page.id,
    name: properties['Name']?.title[0]?.plain_text || '',
    title: properties['Job Title']?.rich_text[0]?.plain_text || '',
    email: properties['Email']?.email || undefined,
    linkedinUrl: properties['LinkedIn URL']?.url || undefined,
    // Assuming 'Company' is a text property on the Stakeholder page, or a relation to a Company DB
    // For simplicity, let's assume it's a rich_text for now
    company: properties['Company']?.rich_text[0]?.plain_text || undefined,
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

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[STAKEHOLDERS_GET][AUTH_FAIL] Unauthorized access attempt.', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_GET][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const { opportunityId } = params;

    // --- Step 1: Fetch the Opportunity Notion Page ---
    logger.debug('[STAKEHOLDERS_GET][NOTION_FETCH_OPPORTUNITY] Fetching opportunity from Notion.', logContext);
    let opportunityPage: GetPageResponse;
    try {
      opportunityPage = await notion.pages.retrieve({ page_id: opportunityId });
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

    const opportunityProperties: any = (opportunityPage as any).properties; // Cast to any for dynamic access

    // --- Step 2: Extract Stakeholder Relation IDs from Opportunity Page ---
    // Assuming a relation property named 'Stakeholders' on the Opportunity page
    const stakeholderRelationIds =
      opportunityProperties['Stakeholders']?.relation?.map((rel: { id: string }) => rel.id) || [];

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
    let errorDetails: any = {};

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

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[STAKEHOLDERS_POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_POST][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const { opportunityId } = params;
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
      opportunityId,
    });

    try {
      const opportunityPage = await notion.pages.retrieve({ page_id: opportunityId });
      const currentStakeholderRelations = (opportunityPage as any).properties['Stakeholders']?.relation || [];

      const updatedStakeholderRelations = [...currentStakeholderRelations, { id: newStakeholderPage.id }];

      await notion.pages.update({
        page_id: opportunityId,
        properties: {
          Stakeholders: {
            relation: updatedStakeholderRelations,
          },
        },
      });
      logger.success(
        '[STAKEHOLDERS_POST][NOTION_LINK_OPPORTUNITY_SUCCESS] Stakeholder successfully linked to opportunity.',
        {
          ...logContext,
          newStakeholderId: newStakeholderPage.id,
          opportunityId,
        }
      );
    } catch (notionLinkError: unknown) {
      logger.error('[STAKEHOLDERS_POST][NOTION_LINK_OPPORTUNITY_ERROR] Error linking stakeholder to opportunity.', {
        ...logContext,
        error: notionLinkError,
      });
      // This is critical, but we might still return success for stakeholder creation if link fails
      // based on whether the stakeholder themselves was created successfully.
      // For now, consider it a failure of the overall POST operation if linking fails.
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to link stakeholder to opportunity.',
          details: notionLinkError instanceof Error ? notionLinkError.message : String(notionLinkError),
        },
        { status: 500 }
      );
    }

    const createdStakeholder = notionPageToStakeholder(newStakeholderPage);

    logger.success('[STAKEHOLDERS_POST][SUCCESS] Stakeholder created and linked successfully.', {
      ...logContext,
      stakeholderId: createdStakeholder.id,
      name: createdStakeholder.name,
    });

    return NextResponse.json({ success: true, stakeholder: createdStakeholder });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: any = {};

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

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[STAKEHOLDERS_PATCH][AUTH_FAIL] Unauthorized access attempt.', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_PATCH][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const { opportunityId } = params; // opportunityId is relevant for logging context, but not for stakeholder update directly
    const body = await request.json();
    const { id: stakeholderId, name, title, email, linkedinUrl, company } = body; // Expecting stakeholderId in body

    // --- Step 1: Validate Incoming Data ---
    if (!stakeholderId || typeof stakeholderId !== 'string' || stakeholderId.trim() === '') {
      logger.warn('[STAKEHOLDERS_PATCH][VALIDATION_FAIL] Stakeholder ID is required for update.', {
        ...logContext,
        body,
      });
      return NextResponse.json({ success: false, error: 'Stakeholder ID is required for update.' }, { status: 400 });
    }

    if (Object.keys(body).length < 2) {
      // id + at least one other field
      logger.warn('[STAKEHOLDERS_PATCH][VALIDATION_FAIL] No update fields provided.', { ...logContext, body });
      return NextResponse.json({ success: false, error: 'No update fields provided.' }, { status: 400 });
    }

    // --- Step 2: Construct Notion Properties for Update ---
    const propertiesToUpdate: any = {};
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
      logger.warn('[STAKEHOLDERS_PATCH][NO_VALID_FIELDS] No valid fields to update found in request body.', {
        ...logContext,
        body,
      });
      return NextResponse.json({ success: false, error: 'No valid fields to update provided.' }, { status: 400 });
    }

    // --- Step 3: Update Stakeholder Page in Notion ---
    logger.debug('[STAKEHOLDERS_PATCH][NOTION_UPDATE] Updating stakeholder page in Notion.', {
      ...logContext,
      stakeholderId,
      propertiesToUpdate,
    });

    let updatedStakeholderPage;
    try {
      updatedStakeholderPage = await notion.pages.update({
        page_id: stakeholderId,
        properties: propertiesToUpdate,
      });
      logger.success('[STAKEHOLDERS_PATCH][NOTION_UPDATE_SUCCESS] Stakeholder page updated in Notion.', {
        ...logContext,
        stakeholderId: updatedStakeholderPage.id,
      });
    } catch (notionUpdateError: unknown) {
      logger.error('[STAKEHOLDERS_PATCH][NOTION_UPDATE_ERROR] Error updating stakeholder page in Notion.', {
        ...logContext,
        stakeholderId,
        error: notionUpdateError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update stakeholder in Notion.',
          details: notionUpdateError instanceof Error ? notionUpdateError.message : String(notionUpdateError),
        },
        { status: 500 }
      );
    }

    const updatedStakeholder = notionPageToStakeholder(updatedStakeholderPage);

    logger.success('[STAKEHOLDERS_PATCH][SUCCESS] Stakeholder updated successfully.', {
      ...logContext,
      stakeholderId: updatedStakeholder.id,
      name: updatedStakeholder.name,
    });

    return NextResponse.json({ success: true, stakeholder: updatedStakeholder });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: any = {};

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

  const session = await auth();
  if (!session || !session.user) {
    logger.warn('[STAKEHOLDERS_DELETE][AUTH_FAIL] Unauthorized access attempt.', logContext);
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!notion || !NOTION_DATABASE_ID) {
    logger.error('[STAKEHOLDERS_DELETE][NOTION_CONFIG_FAIL] Notion client or Database ID not configured.', logContext);
    return NextResponse.json(
      { success: false, error: 'Notion client or Database ID not configured.' },
      { status: 500 }
    );
  }

  try {
    const { opportunityId } = params;
    const body = await request.json();
    const { stakeholderId } = body; // Expecting stakeholderId in body

    // --- Step 1: Validate Incoming Data ---
    if (!stakeholderId || typeof stakeholderId !== 'string' || stakeholderId.trim() === '') {
      logger.warn('[STAKEHOLDERS_DELETE][VALIDATION_FAIL] Stakeholder ID is required for deletion.', {
        ...logContext,
        body,
      });
      return NextResponse.json({ success: false, error: 'Stakeholder ID is required for deletion.' }, { status: 400 });
    }

    // --- Step 2: Remove Relation from Opportunity Page in Notion ---
    logger.debug('[STAKEHOLDERS_DELETE][NOTION_REMOVE_LINK] Removing stakeholder link from opportunity page.', {
      ...logContext,
      stakeholderId,
      opportunityId,
    });
    try {
      const opportunityPage = await notion.pages.retrieve({ page_id: opportunityId });
      const currentStakeholderRelations = (opportunityPage as any).properties['Stakeholders']?.relation || [];

      const updatedStakeholderRelations = currentStakeholderRelations.filter(
        (rel: { id: string }) => rel.id !== stakeholderId
      );

      await notion.pages.update({
        page_id: opportunityId,
        properties: {
          Stakeholders: {
            relation: updatedStakeholderRelations,
          },
        },
      });
      logger.success('[STAKEHOLDERS_DELETE][NOTION_REMOVE_LINK_SUCCESS] Stakeholder link removed from opportunity.', {
        ...logContext,
        stakeholderId,
        opportunityId,
      });
    } catch (notionRemoveLinkError: unknown) {
      logger.error(
        '[STAKEHOLDERS_DELETE][NOTION_REMOVE_LINK_ERROR] Error removing stakeholder link from opportunity.',
        {
          ...logContext,
          error: notionRemoveLinkError,
        }
      );
      // Proceed to archive stakeholder even if unlink fails, but log the error
      // For now, consider it a failure of the overall DELETE operation if unlinking fails.
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to unlink stakeholder from opportunity.',
          details:
            notionRemoveLinkError instanceof Error ? notionRemoveLinkError.message : String(notionRemoveLinkError),
        },
        { status: 500 }
      );
    }

    // --- Step 3: Archive Stakeholder Page in Notion ---
    logger.debug('[STAKEHOLDERS_DELETE][NOTION_ARCHIVE] Archiving stakeholder page in Notion.', {
      ...logContext,
      stakeholderId,
    });

    let archivedStakeholderPage;
    try {
      archivedStakeholderPage = await notion.pages.update({
        page_id: stakeholderId,
        archived: true,
      });
      logger.success('[STAKEHOLDERS_DELETE][NOTION_ARCHIVE_SUCCESS] Stakeholder page archived in Notion.', {
        ...logContext,
        stakeholderId: archivedStakeholderPage.id,
      });
    } catch (notionArchiveError: unknown) {
      logger.error('[STAKEHOLDERS_DELETE][NOTION_ARCHIVE_ERROR] Error archiving stakeholder page in Notion.', {
        ...logContext,
        stakeholderId,
        error: notionArchiveError,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to archive stakeholder in Notion.',
          details: notionArchiveError instanceof Error ? notionArchiveError.message : String(notionArchiveError),
        },
        { status: 500 }
      );
    }

    logger.success('[STAKEHOLDERS_DELETE][SUCCESS] Stakeholder archived and unlinked successfully.', {
      ...logContext,
      stakeholderId,
    });

    return NextResponse.json({ success: true, message: 'Stakeholder archived and unlinked successfully.' });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: any = {};

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
