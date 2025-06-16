import { NextRequest, NextResponse } from 'next/server';
import {
  createPersona,
  getPersonas,
  getPersonaById,
  updatePersona,
  deletePersona,
  searchPersonas,
} from '@repo/shared/persona_service';
import { Persona } from '@repo/shared/types/orion';
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component
/**
 * GET handler for personas
 * - Get all personas
 * - Get a specific persona by ID
 * - Search personas by query
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const query = url.searchParams.get('query');

    if (id) {
      // Get persona by ID
      const persona = await getPersonaById(id);
      if (!persona) {
        return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, persona });
    } else if (query) {
      // Search personas
      const personas = await searchPersonas(query);
      return NextResponse.json({ success: true, personas });
    } else {
      // Get all personas
      const personas = await getPersonas();
      return NextResponse.json({ success: true, personas });
    }
  } catch (error: unknown) {
    console.error('Error in GET /api/orion/personas:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for personas
 * Creates a new persona
 */
export async function POST(req: NextRequest) {
  try {
    const body: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'> = await req.json();
    const { name, company, role, industry, values, challenges, interests, valueProposition, notes, tags } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const newPersona = await createPersona({
      name,
      company,
      role,
      industry,
      values,
      challenges,
      interests,
      valueProposition,
      notes,
      tags,
    });

    return NextResponse.json({ success: true, persona: newPersona });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/personas:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for personas
 * Updates an existing persona
 */
export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Persona ID is required' }, { status: 400 });
    }

    const body: Partial<Persona> = await req.json();

    const updatedPersona = await updatePersona(id, body);

    if (!updatedPersona) {
      return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, persona: updatedPersona });
  } catch (error: unknown) {
    console.error('Error in PUT /api/orion/personas:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to remove a persona
 */
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona ID is required',
        },
        { status: 400 }
      );
    }

    const success = await deletePersona(id);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona not found or could not be deleted',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/orion/personas:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
