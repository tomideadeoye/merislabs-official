/**
 * GOAL: Update opportunity details using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, prd.md, types/opportunity.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import { pool } from '@/lib/database';
import type { OpportunityUpdatePayload } from '@/types/opportunity';

interface RouteParams {
  params: {
    opportunityId: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
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
    const checkQuery = "SELECT * FROM opportunities WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [opportunityId]);
    const existingOpp = checkResult.rows[0];

    if (!existingOpp) {
      return NextResponse.json({
        success: false,
        error: 'Opportunity not found.'
      }, { status: 404 });
    }

    // Prepare update fields
    const updateFields: Record<string, any> = {
      laststatusupdate: new Date().toISOString()
    };

    // Basic fields
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.company !== undefined) updateFields.company = body.company;
    if (body.type !== undefined) updateFields.type = body.type;
    if (body.content !== undefined) updateFields.content = body.content;
    if (body.sourceURL !== undefined) updateFields.sourceurl = body.sourceURL;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.priority !== undefined) updateFields.priority = body.priority;
    if (body.nextActionDate !== undefined) updateFields.nextactiondate = body.nextActionDate;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.relatedEvaluationId !== undefined) updateFields.relatedevaluationid = body.relatedEvaluationId;

    // Handle array fields that need special processing
    if (body.tags !== undefined) {
      updateFields.tags = JSON.stringify(body.tags);
    }

    // Handle adding/removing from arrays
    if (body.addApplicationMaterialId || body.removeApplicationMaterialId) {
      const currentIds = existingOpp.applicationmaterialids ?
        JSON.parse(existingOpp.applicationmaterialids) : [];

      if (body.addApplicationMaterialId && !currentIds.includes(body.addApplicationMaterialId)) {
        currentIds.push(body.addApplicationMaterialId);
      }

      if (body.removeApplicationMaterialId) {
        const index = currentIds.indexOf(body.removeApplicationMaterialId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.applicationmaterialids = JSON.stringify(currentIds);
    }

    if (body.addStakeholderContactId || body.removeStakeholderContactId) {
      const currentIds = existingOpp.stakeholdercontactids ?
        JSON.parse(existingOpp.stakeholdercontactids) : [];

      if (body.addStakeholderContactId && !currentIds.includes(body.addStakeholderContactId)) {
        currentIds.push(body.addStakeholderContactId);
      }

      if (body.removeStakeholderContactId) {
        const index = currentIds.indexOf(body.removeStakeholderContactId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.stakeholdercontactids = JSON.stringify(currentIds);
    }

    if (body.addRelatedHabiticaTaskId || body.removeRelatedHabiticaTaskId) {
      const currentIds = existingOpp.relatedhabiticataskids ?
        JSON.parse(existingOpp.relatedhabiticataskids) : [];

      if (body.addRelatedHabiticaTaskId && !currentIds.includes(body.addRelatedHabiticaTaskId)) {
        currentIds.push(body.addRelatedHabiticaTaskId);
      }

      if (body.removeRelatedHabiticaTaskId) {
        const index = currentIds.indexOf(body.removeRelatedHabiticaTaskId);
        if (index !== -1) {
          currentIds.splice(index, 1);
        }
      }

      updateFields.relatedhabiticataskids = JSON.stringify(currentIds);
    }

    // Build the SQL update statement
    const setClause = Object.keys(updateFields)
      .map((key, idx) => `${key} = $${idx + 2}`)
      .join(', ');

    const updateQuery = `UPDATE opportunities SET ${setClause} WHERE id = $1`;
    await pool.query(updateQuery, [
      opportunityId,
      ...Object.values(updateFields)
    ]);

    // Fetch the updated opportunity
    const updatedQuery = "SELECT * FROM opportunities WHERE id = $1";
    const updatedResult = await pool.query(updatedQuery, [opportunityId]);
    const updatedOppRaw = updatedResult.rows[0];

    // Deserialize JSON string fields
    const updatedOpportunity = {
      ...updatedOppRaw,
      tags: updatedOppRaw.tags ? JSON.parse(updatedOppRaw.tags) : [],
      applicationMaterialIds: updatedOppRaw.applicationmaterialids ? JSON.parse(updatedOppRaw.applicationmaterialids) : [],
      stakeholderContactIds: updatedOppRaw.stakeholdercontactids ? JSON.parse(updatedOppRaw.stakeholdercontactids) : [],
      relatedHabiticaTaskIds: updatedOppRaw.relatedhabiticataskids ? JSON.parse(updatedOppRaw.relatedhabiticataskids) : [],
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
