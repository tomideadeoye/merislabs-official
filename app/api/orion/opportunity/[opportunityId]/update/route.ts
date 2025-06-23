/**
 * GOAL: Update OrionOpportunity details using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, reference.md, types/OrionOpportunity.d.ts
 * opportunties for consolidation and improvement:
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { Client, APIResponseError } from '@notionhq/client';
import { UpdatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { OpportunityUpdatePayload, OpportunityType, OpportunityStatus, OpportunityPriority } from '@/lib/types';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
// const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // Assuming this is used for validating database type, though not directly in page update
const notion = NOTION_API_KEY ? new Client({ auth: NOTION_API_KEY }) : null;

interface RouteParams {
  params: {
    opportunityId: string;
  };
}

// Helper function to map enum values to Notion select/multi-select names
const mapEnumToNotionName = (enumValue: OpportunityType | OpportunityStatus | OpportunityPriority) => {
  // Notion select properties use plain text names
  // Ensure these match exactly with your Notion database property options
  switch (enumValue) {
    case OpportunityType.JOB:
      return 'Job';
    case OpportunityType.PROJECT:
      return 'Project';
    case OpportunityType.COLLABORATION:
      return 'Collaboration';
    case OpportunityType.GIG:
      return 'Gig';
    case OpportunityType.OTHER:
      return 'Other';
    case OpportunityType.EDUCATION_PROGRAM:
      return 'Education Program';
    case OpportunityType.PROJECT_COLLABORATION:
      return 'Project Collaboration';
    case OpportunityType.FUNDING:
      return 'Funding';
    case OpportunityType.NEGOTIATING:
      return 'Negotiating';
    case OpportunityType.DECLINED:
      return 'Declined';
    case OpportunityType.APPLICATION_READY:
      return 'Application Ready';
    case OpportunityType.OUTREACH_PLANNED:
      return 'Outreach Planned';
    case OpportunityType.OUTREACH_SENT:
      return 'Outreach Sent';
    case OpportunityType.OFFER_RECEIVED:
      return 'Offer Received';

    case OpportunityStatus.IDENTIFIED:
      return 'Identified';
    case OpportunityStatus.RESEARCHING:
      return 'Researching';
    case OpportunityStatus.APPLYING:
      return 'Applying';
    case OpportunityStatus.INTERVIEWING:
      return 'Interviewing';
    case OpportunityStatus.OFFERED:
      return 'Offered';
    case OpportunityStatus.REJECTED:
      return 'Rejected';
    case OpportunityStatus.ACCEPTED:
      return 'Accepted';
    case OpportunityStatus.ARCHIVED:
      return 'Archived';
    case OpportunityStatus.EVALUATING:
      return 'Evaluating';
    case OpportunityStatus.EVALUATED_POSITIVE:
      return 'Evaluated Positive';
    case OpportunityStatus.EVALUATED_NEGATIVE:
      return 'Evaluated Negative';
    case OpportunityStatus.APPLICATION_DRAFTING:
      return 'Application Drafting';
    case OpportunityStatus.INTERVIEW_SCHEDULED:
      return 'Interview Scheduled';
    case OpportunityStatus.INTERVIEW_COMPLETED:
      return 'Interview Completed';
    case OpportunityStatus.APPLIED:
      return 'Applied';
    case OpportunityStatus.PURSUING:
      return 'Pursuing';
    case OpportunityStatus.NEGOTIATING:
      return 'Negotiating';
    case OpportunityStatus.DECLINED:
      return 'Declined';
    case OpportunityStatus.APPLICATION_READY:
      return 'Application Ready';
    case OpportunityStatus.OUTREACH_PLANNED:
      return 'Outreach Planned';
    case OpportunityStatus.OUTREACH_SENT:
      return 'Outreach Sent';
    case OpportunityStatus.FOLLOW_UP_NEEDED:
      return 'Follow-up Needed';
    case OpportunityStatus.FOLLOW_UP_SENT:
      return 'Follow-up Sent';
    case OpportunityStatus.OFFER_RECEIVED:
      return 'Offer Received';
    case OpportunityStatus.APPLYING_NEXT_STEP:
      return 'Applying Next Step';
    case OpportunityStatus.INTERVIEWING_ROUND_1:
      return 'Interviewing Round 1';
    case OpportunityStatus.INTERVIEWING_ROUND_2:
      return 'Interviewing Round 2';
    case OpportunityStatus.FINAL_INTERVIEW:
      return 'Final Interview';
    case OpportunityStatus.OFFER_RECEIVED_PENDING_REVIEW:
      return 'Offer Received Pending Review';
    case OpportunityStatus.OFFER_ACCEPTED:
      return 'Offer Accepted';
    case OpportunityStatus.OFFER_REJECTED:
      return 'Offer Rejected';
    case OpportunityStatus.ACTIVE_OUTREACH:
      return 'Active Outreach';
    case OpportunityStatus.FOLLOW_UP:
      return 'Follow Up';
    case OpportunityStatus.ON_HOLD:
      return 'On Hold';
    case OpportunityStatus.CONVERTED:
      return 'Converted';
    case OpportunityStatus.REJECTED_BY_THEM:
      return 'Rejected By Them';
    case OpportunityStatus.DECLINED_BY_ME:
      return 'Declined By Me';

    case OpportunityPriority.HIGH:
      return 'High';
    case OpportunityPriority.MEDIUM:
      return 'Medium';
    case OpportunityPriority.LOW:
      return 'Low';
    default:
      return String(enumValue); // Fallback for unknown values
  }
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const logContext = {
    route: '/api/orion/opportunity/[opportunityId]/update',
    opportunityId: params?.opportunityId,
    timestamp: new Date().toISOString(),
    operation: 'PATCH',
  };
  logger.info('[OPPORTUNITY_UPDATE][START] Received request to update opportunity.', logContext);

  if (!notion || !NOTION_API_KEY) {
    logger.error('[OPPORTUNITY_UPDATE][NOTION_CONFIG_FAIL] Notion client or API key not configured.', logContext);
    return NextResponse.json({ success: false, error: 'Notion client or API key not configured.' }, { status: 500 });
  }

  try {
    const { opportunityId } = params;
    if (!opportunityId) {
      logger.warn('[OPPORTUNITY_UPDATE][VALIDATION_FAIL] Opportunity ID is required.', logContext);
      return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
    }

    const body: OpportunityUpdatePayload = await request.json();
    logger.debug('[OPPORTUNITY_UPDATE][PAYLOAD]', { ...logContext, body });

    if (Object.keys(body).length === 0) {
      logger.warn('[OPPORTUNITY_UPDATE][NO_FIELDS] No fields provided for update.', logContext);
      return NextResponse.json({ success: false, error: 'No fields provided for update.' }, { status: 400 });
    }

    const propertiesToUpdate: UpdatePageParameters['properties'] = {};

    // Map incoming payload fields to Notion properties
    if (body.title !== undefined) {
      propertiesToUpdate['Title'] = { title: [{ text: { content: body.title } }] };
    }
    if (body.company !== undefined) {
      propertiesToUpdate['Company'] = { rich_text: [{ text: { content: body.company } }] };
    }
    if (body.companyOrInstitution !== undefined) {
      // This might map to 'Company' or another specific property in Notion
      propertiesToUpdate['Company/Institution'] = { rich_text: [{ text: { content: body.companyOrInstitution } }] };
    }
    if (body.type !== undefined && body.type !== null) {
      propertiesToUpdate['Type'] = { select: { name: mapEnumToNotionName(body.type) } };
    }
    if (body.status !== undefined && body.status !== null) {
      propertiesToUpdate['Status'] = { select: { name: mapEnumToNotionName(body.status) } };
    }
    if (body.content !== undefined) {
      propertiesToUpdate['Content'] = { rich_text: [{ text: { content: body.content } }] };
    }
    if (body.url !== undefined) {
      propertiesToUpdate['URL'] = { url: body.url };
    }
    if (body.sourceURL !== undefined) {
      propertiesToUpdate['Source URL'] = { url: body.sourceURL };
    }
    if (body.tags !== undefined) {
      propertiesToUpdate['Tags'] = { multi_select: body.tags.map((tag) => ({ name: tag })) };
    }
    if (body.dateIdentified !== undefined && body.dateIdentified !== null) {
      propertiesToUpdate['Date Identified'] = { date: { start: body.dateIdentified } };
    }
    if (body.notes !== undefined) {
      propertiesToUpdate['Notes'] = { rich_text: [{ text: { content: body.notes } }] };
    }
    if (body.contactPerson !== undefined) {
      propertiesToUpdate['Contact Person'] = { rich_text: [{ text: { content: body.contactPerson } }] };
    }
    if (body.contactEmail !== undefined) {
      propertiesToUpdate['Contact Email'] = { email: body.contactEmail };
    }
    if (body.stage !== undefined) {
      propertiesToUpdate['Stage'] = { rich_text: [{ text: { content: body.stage } }] };
    }
    if (body.attachments !== undefined) {
      // Notion doesn't have a direct 'attachments' property like this. Might need to use files property or another relation.
      // For now, if we need to store attachment URLs, it could be a rich_text field or array of URLs.
      // Skipping for now, or consider a dedicated linked property.
      logger.warn(
        '[OPPORTUNITY_UPDATE][ATTACHMENTS_SKIP] Attachments update is not directly supported in Notion API through this flow. Skipping.',
        logContext
      );
    }
    if (body.priority !== undefined && body.priority !== null) {
      propertiesToUpdate['Priority'] = { select: { name: mapEnumToNotionName(body.priority) } };
    }
    if (body.nextActionDate !== undefined && body.nextActionDate !== null) {
      propertiesToUpdate['Next Action Date'] = { date: { start: body.nextActionDate } };
    }
    if (body.deadline !== undefined && body.deadline !== null) {
      propertiesToUpdate['Deadline'] = { date: { start: body.deadline } };
    }
    if (body.location !== undefined) {
      propertiesToUpdate['Location'] = { rich_text: [{ text: { content: body.location ?? '' } }] };
    }
    if (body.salary !== undefined) {
      propertiesToUpdate['Salary'] = { rich_text: [{ text: { content: body.salary ?? '' } }] };
    }
    if (body.position !== undefined) {
      propertiesToUpdate['Position'] = { rich_text: [{ text: { content: body.position ?? '' } }] };
    }
    if (body.tailoredCv !== undefined) {
      propertiesToUpdate['Tailored CV'] = {
        rich_text: [{ text: { content: (body as { tailoredCv: string }).tailoredCv } }],
      };
    }
    // Handle relations for applicationMaterialIds, stakeholderContactIds, relatedHabiticaTaskId
    // These require fetching the current page, modifying the relation, and then updating.
    // Given the complexity for a PATCH endpoint, these might be better handled by separate specific endpoints,
    // or fetched and merged here carefully.

    // For simplicity for now, let's assume direct string/ID based relations are handled elsewhere
    // or require a full GET-modify-PUT cycle if they are relations in Notion.

    if (body.addApplicationMaterialId || body.removeApplicationMaterialId) {
      logger.warn(
        '[OPPORTUNITY_UPDATE][RELATION_SKIP] Application material relations update is not directly supported in this PATCH flow. Skipping.',
        logContext
      );
    }
    if (body.addStakeholderContactId || body.removeStakeholderContactId) {
      logger.warn(
        '[OPPORTUNITY_UPDATE][RELATION_SKIP] Stakeholder relations update is not directly supported in this PATCH flow. Skipping.',
        logContext
      );
    }
    if (body.addRelatedHabiticaTaskId || body.removeRelatedHabiticaTaskId) {
      logger.warn(
        '[OPPORTUNITY_UPDATE][RELATION_SKIP] Habitica task relations update is not directly supported in this PATCH flow. Skipping.',
        logContext
      );
    }

    // Notion Page Update
    logger.debug('[OPPORTUNITY_UPDATE][NOTION_CALL] Calling Notion API to update page.', {
      ...logContext,
      propertiesToUpdate,
    });
    const updatedPage = await notion.pages.update({
      page_id: opportunityId,
      properties: propertiesToUpdate,
    });
    logger.success('[OPPORTUNITY_UPDATE][NOTION_SUCCESS] Opportunity updated successfully in Notion.', {
      ...logContext,
      pageId: updatedPage.id,
    });

    // For the response, we might want to fetch the full updated opportunity from Notion
    // or construct a partial response based on the updated fields.
    // Fetching the full page ensures we return the latest state, including Notion-managed fields like last_edited_time.
    // However, for a PATCH response, often just a success confirmation is enough, or the updated fields.
    // Let's return a success message for now.

    return NextResponse.json({ success: true, message: 'Opportunity updated successfully.', opportunityId });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: Record<string, unknown> = {};

    if (error instanceof APIResponseError) {
      errorMessage = `Notion API Error (${error.status}): ${error.message}`;
      errorDetails = { code: error.code, status: error.status, body: error.body };
      logger.error('[OPPORTUNITY_UPDATE][NOTION_API_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = { stack: error.stack };
      logger.error('[OPPORTUNITY_UPDATE][GENERAL_ERROR]', {
        ...logContext,
        error: errorMessage,
        details: errorDetails,
      });
    } else {
      logger.error('[OPPORTUNITY_UPDATE][UNKNOWN_ERROR]', { ...logContext, error: String(error) });
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
