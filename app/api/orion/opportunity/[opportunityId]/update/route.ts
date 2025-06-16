/**
 * GOAL: Update OrionOpportunity details using Neon/Postgres, replacing SQLite for cloud reliability.
 * Related: lib/database.ts, reference.md, types/OrionOpportunity.d.ts
 * opportunties for consolidation and improvement:
 */
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import type { OpportunityUpdatePayload } from '@/lib/types';

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
// Oportuntiy for consolidation and improvement:

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const logContext = {
    route: '/api/orion/OrionOpportunity/[opportunityId]/update',
    filePath: 'app/api/orion/OrionOpportunity/[opportunityId]/update/route.ts',
    timestamp: new Date().toISOString(),
    user: 'public',
    opportunityId: params?.opportunityId,
  };

  console.info('[OPPORTUNITY_UPDATE][START]', logContext);

  try {
    const { opportunityId } = params;
    const body: OpportunityUpdatePayload = await request.json();
    console.info('[OPPORTUNITY_UPDATE][PAYLOAD]', { ...logContext, body });

    if (!opportunityId) {
      console.warn('[OPPORTUNITY_UPDATE][VALIDATION_FAIL][NO_ID]', {
        ...logContext,
        body,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'OrionOpportunity ID is required.',
        },
        { status: 400 }
      );
    }

    // Check if OrionOpportunity exists
    const checkQuery = 'SELECT * FROM opportunities WHERE id = $1';
    const checkResult = await query(checkQuery, [opportunityId]);
    const existingOpp = checkResult.rows[0];

    if (!existingOpp) {
      console.warn('[OPPORTUNITY_UPDATE][NOT_FOUND]', {
        ...logContext,
        opportunityId,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'OrionOpportunity not found.',
        },
        { status: 404 }
      );
    }

    const { status, priority, notes } = body;

    const updateQuery = `
      UPDATE opportunities
      SET
        status = COALESCE($1, status),
        priority = COALESCE($2, priority),
        notes = COALESCE($3, notes),
        "updatedAt" = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const result = await query(updateQuery, [status, priority, notes, opportunityId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, opportunity: result.rows[0] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
