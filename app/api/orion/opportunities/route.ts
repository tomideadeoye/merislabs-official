import { NextResponse } from 'next/server';
import { query } from '@shared/lib/database';
import { logger } from '@shared/lib/logger';
import { z } from 'zod';

const opportunitySchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  status: z.enum(['new', 'applied', 'interviewing', 'offered', 'rejected']),
  location: z.string(),
  salary: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  stakeholders: z.array(z.object({
    name: z.string(),
    title: z.string(),
    email: z.string().optional(),
    linkedin: z.string().optional(),
  })).optional(),
  applicationDrafts: z.array(z.object({
    id: z.string(),
    type: z.enum(['email', 'linkedin']),
    content: z.string(),
    createdAt: z.date(),
  })).optional(),
});

export async function GET() {
  try {
    logger.info('Fetching all opportunities');
    const result = await query(`
      SELECT
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'name', s.name,
              'title', s.title,
              'email', s.email,
              'linkedin', s.linkedin
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as stakeholders,
        COALESCE(
          json_agg(
            json_build_object(
              'id', d.id,
              'type', d.type,
              'content', d.content,
              'createdAt', d.created_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'
        ) as application_drafts
      FROM opportunities o
      LEFT JOIN stakeholders s ON s.opportunity_id = o.id
      LEFT JOIN application_drafts d ON d.opportunity_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    logger.info('Successfully fetched opportunities', { count: result.length });
    return NextResponse.json(result.rows);
  } catch (error) {
    logger.error('Error fetching opportunities', { error });
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = opportunitySchema.parse(body);

    logger.info('Creating new opportunity', { company: validatedData.company });

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
        validatedData.requirements,
        validatedData.notes,
        new Date(),
        new Date(),
      ]
    );

    // Insert stakeholders if provided
    if (validatedData.stakeholders?.length) {
      await Promise.all(
        validatedData.stakeholders.map((stakeholder) =>
          query(
            `INSERT INTO stakeholders (
              opportunity_id, name, title, email, linkedin
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
              result.rows[0].id,
              stakeholder.name,
              stakeholder.title,
              stakeholder.email,
              stakeholder.linkedin,
            ]
          )
        )
      );
    }

    logger.info('Successfully created opportunity', { id: result.rows[0].id });
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating opportunity', { error });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid opportunity data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
