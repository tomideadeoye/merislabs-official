/**
 * GOAL: Update OrionOpportunity details using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, prd.md, types/OrionOpportunity.d.ts
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth";
import { query, sql } from "@repo/shared/database";
import type { OpportunityUpdatePayload } from '@repo/shared';

interface RouteParams {
  params: {
    opportunityId: string;
  };
}

// =====================
// OrionOpportunity Pipeline Update API
// =====================
// GOAL: Provide comprehensive, context-rich, level-based logging for all OrionOpportunity update actions.
// All logs include operation, user/session, parameters, validation, and results for traceability and rapid debugging.

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const logContext = {
    route: "/api/orion/OrionOpportunity/[opportunityId]/update",
    filePath: "app/api/orion/OrionOpportunity/[opportunityId]/update/route.ts",
    timestamp: new Date().toISOString(),
    user: "public",
    opportunityId: params?.opportunityId,
  };

  console.info("[OPPORTUNITY_UPDATE][START]", logContext);

  try {
    const { opportunityId } = params;
    const body: OpportunityUpdatePayload = await request.json();
    console.info("[OPPORTUNITY_UPDATE][PAYLOAD]", { ...logContext, body });

    if (!opportunityId) {
      console.warn("[OPPORTUNITY_UPDATE][VALIDATION_FAIL][NO_ID]", {
        ...logContext,
        body,
      });
      return NextResponse.json(
        {
          success: false,
          error: "OrionOpportunity ID is required.",
        },
        { status: 400 }
      );
    }

    // Check if OrionOpportunity exists
    const checkQuery = "SELECT * FROM opportunities WHERE id = $1";
    const checkResult = await query(checkQuery, [opportunityId]);
    const existingOpp = checkResult.rows[0];

    if (!existingOpp) {
      console.warn("[OPPORTUNITY_UPDATE][NOT_FOUND]", {
        ...logContext,
        opportunityId,
      });
      return NextResponse.json(
        {
          success: false,
          error: "OrionOpportunity not found.",
        },
        { status: 404 }
      );
    }

    // Prepare update fields
    const updateFields: Record<string, any> = {
      laststatusupdate: new Date().toISOString(),
    };

    // Basic fields
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.company !== undefined) updateFields.company = body.company;
    if (body.type !== undefined) updateFields.type = body.type;
    if (body.content !== undefined) updateFields.content = body.content;
    if (body.sourceURL !== undefined) updateFields.sourceurl = body.sourceURL;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.priority !== undefined) updateFields.priority = body.priority;
    if (body.nextActionDate !== undefined)
      updateFields.nextactiondate = body.nextActionDate;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.relatedEvaluationId !== undefined)
      updateFields.relatedevaluationid = body.relatedEvaluationId;

    // Handle array fields that need special processing
    if (body.tags !== undefined) {
      updateFields.tags = JSON.stringify(body.tags);
    }

    // Handle adding/removing from arrays
    if (body.addApplicationMaterialId || body.removeApplicationMaterialId) {
      const currentIds = existingOpp.applicationmaterialids
        ? JSON.parse(existingOpp.applicationmaterialids)
        : [];

      if (
        body.addApplicationMaterialId &&
        !currentIds.includes(body.addApplicationMaterialId)
      ) {
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
      const currentIds = existingOpp.stakeholdercontactids
        ? JSON.parse(existingOpp.stakeholdercontactids)
        : [];

      if (
        body.addStakeholderContactId &&
        !currentIds.includes(body.addStakeholderContactId)
      ) {
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
      const currentIds = existingOpp.relatedhabiticataskids
        ? JSON.parse(existingOpp.relatedhabiticataskids)
        : [];

      if (
        body.addRelatedHabiticaTaskId &&
        !currentIds.includes(body.addRelatedHabiticaTaskId)
      ) {
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
      .join(", ");

    const updateQuery = `UPDATE opportunities SET ${setClause} WHERE id = $1`;
    await query(updateQuery, [opportunityId, ...Object.values(updateFields)]);
    console.info("[OPPORTUNITY_UPDATE][DB_UPDATED]", {
      ...logContext,
      updateFields,
    });

    // Fetch the updated OrionOpportunity
    const updatedQuery = "SELECT * FROM opportunities WHERE id = $1";
    const updatedResult = await query(updatedQuery, [opportunityId]);
    const updatedOppRaw = updatedResult.rows[0];

    // Deserialize JSON string fields
    const updatedOpportunity = {
      ...updatedOppRaw,
      tags: updatedOppRaw.tags ? JSON.parse(updatedOppRaw.tags) : [],
      applicationMaterialIds: updatedOppRaw.applicationmaterialids
        ? JSON.parse(updatedOppRaw.applicationmaterialids)
        : [],
      stakeholderContactIds: updatedOppRaw.stakeholdercontactids
        ? JSON.parse(updatedOppRaw.stakeholdercontactids)
        : [],
      relatedHabiticaTaskIds: updatedOppRaw.relatedhabiticataskids
        ? JSON.parse(updatedOppRaw.relatedhabiticataskids)
        : [],
    };

    console.info("[OPPORTUNITY_UPDATE][SUCCESS]", {
      ...logContext,
      opportunityId,
      updatedOpportunity,
    });

    return NextResponse.json({
      success: true,
      message: "OrionOpportunity updated successfully.",
      OrionOpportunity: updatedOpportunity,
    });
  } catch (error: any) {
    console.error("[OPPORTUNITY_UPDATE][ERROR]", {
      ...logContext,
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update OrionOpportunity.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
