import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from '@/lib/database';
import type { OpportunityUpdatePayload } from '@/types/opportunity';

interface RouteParams {
  params: {
    opportunityId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    const body: OpportunityUpdatePayload = await request.json();

    if (!opportunityId) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity ID is required.'
      }, { status: 400 });
    }

    // Check if opportunity exists
    const checkStmt = db.prepare("SELECT * FROM opportunities WHERE id = ?");
    const existingOpp = checkStmt.get(opportunityId) as any;

    if (!existingOpp) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity not found.'
      }, { status: 404 });
    }

    // Prepare update fields
    const updateFields: Record<string, any> = {
      lastStatusUpdate: new Date().toISOString()
    };

    // Basic fields
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.companyOrInstitution !== undefined) updateFields.companyOrInstitution = body.companyOrInstitution;
    if (body.type !== undefined) updateFields.type = body.type;
    if (body.descriptionSummary !== undefined) updateFields.descriptionSummary = body.descriptionSummary;
    if (body.sourceURL !== undefined) updateFields.sourceURL = body.sourceURL;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.priority !== undefined) updateFields.priority = body.priority;
    if (body.nextActionDate !== undefined) updateFields.nextActionDate = body.nextActionDate;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.relatedEvaluationId !== undefined) updateFields.relatedEvaluationId = body.relatedEvaluationId;

    // Handle array fields that need special processing
    if (body.tags !== undefined) {
      updateFields.tags = JSON.stringify(body.tags);
    }

    // Handle adding/removing from arrays
    if (body.addApplicationMaterialId || body.removeApplicationMaterialId) {
      const currentIds = existingOpp.applicationMaterialIds ?
        JSON.parse(existingOpp.applicationMaterialIds) : [];

      if (body.addApplicationMaterialId && !currentIds.includes(body.addApplicationMaterialId)) {
        currentIds.push(body.addApplicationMaterialId);
      }

      if (body.removeApplicationMaterialId) {
        const index = currentIds.indexOf(body.removeApplicationMaterialId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.applicationMaterialIds = JSON.stringify(currentIds);
    }

    if (body.addStakeholderContactId || body.removeStakeholderContactId) {
      const currentIds = existingOpp.stakeholderContactIds ?
        JSON.parse(existingOpp.stakeholderContactIds) : [];

      if (body.addStakeholderContactId && !currentIds.includes(body.addStakeholderContactId)) {
        currentIds.push(body.addStakeholderContactId);
      }

      if (body.removeStakeholderContactId) {
        const index = currentIds.indexOf(body.removeStakeholderContactId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.stakeholderContactIds = JSON.stringify(currentIds);
    }

    if (body.addRelatedHabiticaTaskId || body.removeRelatedHabiticaTaskId) {
      const currentIds = existingOpp.relatedHabiticaTaskIds ?
        JSON.parse(existingOpp.relatedHabiticaTaskIds) : [];

      if (body.addRelatedHabiticaTaskId && !currentIds.includes(body.addRelatedHabiticaTaskId)) {
        currentIds.push(body.addRelatedHabiticaTaskId);
      }

      if (body.removeRelatedHabiticaTaskId) {
        const index = currentIds.indexOf(body.removeRelatedHabiticaTaskId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.relatedHabiticaTaskIds = JSON.stringify(currentIds);
    }

    // Build the SQL update statement
    const setClause = Object.keys(updateFields)
      .map(key => `${key} = @${key}`)
      .join(', ');

    const updateStmt = db.prepare(`UPDATE opportunities SET ${setClause} WHERE id = @id`);
    updateStmt.run({ ...updateFields, id: opportunityId });

    // Fetch the updated opportunity
    const getUpdatedStmt = db.prepare("SELECT * FROM opportunities WHERE id = ?");
    const updatedOppRaw = getUpdatedStmt.get(opportunityId) as any;

    // Deserialize JSON string fields
    const updatedOpportunity = {
      ...updatedOppRaw,
      tags: updatedOppRaw.tags ? JSON.parse(updatedOppRaw.tags) : [],
      applicationMaterialIds: updatedOppRaw.applicationMaterialIds ? JSON.parse(updatedOppRaw.applicationMaterialIds) : [],
      stakeholderContactIds: updatedOppRaw.stakeholderContactIds ? JSON.parse(updatedOppRaw.stakeholderContactIds) : [],
      relatedHabiticaTaskIds: updatedOppRaw.relatedHabiticaTaskIds ? JSON.parse(updatedOppRaw.relatedHabiticaTaskIds) : [],
    };

    return NextResponse.json({
      success: true,
      message: 'Opportunity updated successfully.',
      opportunity: updatedOpportunity
    });

  } catch (error: any) {
    console.error('[OPP_TRACKER_API_UPDATE_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to update opportunity.',
      details: error.message
    }, { status: 500 });
  }
}
