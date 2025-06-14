import { NextResponse, NextRequest } from "next/server";
import { query } from "@repo/shared/database";
import { logger } from "@repo/shared/logger";
import { z } from "zod";
import { OrionOpportunity } from '@repo/shared';

const stakeholderSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().optional(),
  linkedin: z.string().optional(),
});

const applicationDraftSchema = z.object({
  id: z.string(),
  type: z.enum(["email", "linkedin"]),
  content: z.string(),
  createdAt: z.coerce.date(), // Coerce string to Date
});

// Using a partial schema for creation, as many fields are generated by the DB
const createOpportunitySchema = z.object({
  company: z.string(),
  position: z.string(),
  status: z.enum(["new", "applied", "interviewing", "offered", "rejected"]),
  location: z.string(),
  salary: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  notes: z.string().optional(),
  stakeholders: z.array(stakeholderSchema).optional(),
});

export async function GET() {
  try {
    logger.info("Fetching all opportunities");
    // The query now properly handles potential nulls from aggregations
    const result = await query<OrionOpportunity>(`
      SELECT
        o.id,
        o.company,
        o.position,
        o.status,
        o.location,
        o.salary,
        o.description,
        o.requirements,
        o.notes,
        o.created_at as "createdAt",
        o.updated_at as "updatedAt",
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'name', s.name,
              'title', s.title,
              'email', s.email,
              'linkedin', s.linkedin
            )
          ) FROM stakeholders s WHERE s.opportunity_id = o.id),
          '[]'::json
        ) as stakeholders,
        COALESCE(
          (SELECT json_agg(
            json_build_object(
              'id', d.id,
              'type', d.type,
              'content', d.content,
              'createdAt', d.created_at
            )
          ) FROM application_drafts d WHERE d.opportunity_id = o.id),
          '[]'::json
        ) as "applicationDrafts"
      FROM opportunities o
      ORDER BY o.created_at DESC
    `);

    logger.info("Successfully fetched opportunities", {
      count: result.rowCount,
    });
    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error("Error fetching opportunities", { error });
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch opportunities", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Use the creation schema for validation
    const validatedData = createOpportunitySchema.parse(body);

    logger.info("Creating new OrionOpportunity", { company: validatedData.company });

    const result = await query(
      `INSERT INTO opportunities (
        company, position, status, location, salary, description,
        requirements, notes, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        validatedData.company,
        validatedData.position,
        validatedData.status,
        validatedData.location,
        validatedData.salary,
        validatedData.description,
        validatedData.requirements ?? [],
        validatedData.notes,
        new Date(),
        new Date(),
      ]
    );

    const newOpportunity = result.rows[0];

    // Insert stakeholders if provided
    if (validatedData.stakeholders?.length) {
      await Promise.all(
        validatedData.stakeholders.map((stakeholder) =>
          query(
            `INSERT INTO stakeholders (
              opportunity_id, name, title, email, linkedin
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
              newOpportunity.id,
              stakeholder.name,
              stakeholder.title,
              stakeholder.email,
              stakeholder.linkedin,
            ]
          )
        )
      );
    }

    logger.info("Successfully created OrionOpportunity", { id: newOpportunity.id });
    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error) {
    logger.error("Error creating OrionOpportunity", { error });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid OrionOpportunity data", details: error.errors },
        { status: 400 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to create OrionOpportunity", details: errorMessage },
      { status: 500 }
    );
  }
}
