// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - API route for managing a single Persona entity by its ID (retrieving, updating, deleting).
//   - Provides endpoints for GET (retrieve a specific persona), PUT (update an existing persona), and DELETE (remove a persona).
// FILEPATH:
//   app/api/orion/personas/[id]/route.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Interacts with: app/lib/persona_service.ts (for database operations)
//                     app/lib/types (for Persona type definition)
//   - Used by: app/components/orion/networking-hub/PersonaList.tsx (for edit/delete actions)
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
//   - Assumes persona_service.ts provides `getPersonaById`, `updatePersona`, and `deletePersona` functions.
//   - Assumes request body for PUT contains valid Persona update data.
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunities to consolidate
//   - Standard RESTful API structure for resource management by ID.
// TODOS:
//   - Implement more robust input validation (e.g., using Zod).
//   - Add authentication/authorization checks.
// SUGGESTIONS:
//   - Consider soft deletes instead of hard deletes for data retention.

import { NextResponse } from 'next/server';
import { getPersonaById, updatePersona, deletePersona } from '@/lib/persona_service';
import type { Persona } from '@/lib/types';
import logger from '@/lib/logger';

interface Context {
  params: { id: string };
}

export async function GET(request: Request, context: Context) {
  const { id } = context.params;
  logger.info(`[API] GET /api/orion/personas/${id} - Request received.`);
  try {
    const persona = await getPersonaById(id);

    if (!persona) {
      logger.warn(`[API] GET /api/orion/personas/${id} - Persona not found.`, { personaId: id });
      return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
    }

    logger.success(`[API] GET /api/orion/personas/${id} - Persona fetched successfully.`, { personaId: id });
    return NextResponse.json({ success: true, persona });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error(`[API] GET /api/orion/personas/${id} - Failed to fetch persona.`, {
      personaId: id,
      error: errorMessage,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request, context: Context) {
  const { id } = context.params;
  logger.info(`[API] PUT /api/orion/personas/${id} - Request received.`);
  try {
    const updatedPersonaData: Partial<Persona> = await request.json();
    logger.debug(`[API] PUT /api/orion/personas/${id} - Received data`, { personaId: id, updatedPersonaData });

    if (Object.keys(updatedPersonaData).length === 0) {
      logger.warn(`[API] PUT /api/orion/personas/${id} - No update data provided.`, { personaId: id });
      return NextResponse.json({ success: false, error: 'No update data provided' }, { status: 400 });
    }

    const updatedPersona = await updatePersona(id, updatedPersonaData);

    if (!updatedPersona) {
      logger.warn(`[API] PUT /api/orion/personas/${id} - Persona not found for update.`, {
        personaId: id,
        updatedPersonaData,
      });
      return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
    }

    logger.success(`[API] PUT /api/orion/personas/${id} - Persona updated successfully.`, {
      personaId: id,
      updatedPersona,
    });
    return NextResponse.json({ success: true, persona: updatedPersona });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error(`[API] PUT /api/orion/personas/${id} - Failed to update persona.`, {
      personaId: id,
      error: errorMessage,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: Context) {
  const { id } = context.params;
  logger.info(`[API] DELETE /api/orion/personas/${id} - Request received.`);
  try {
    const deleted = await deletePersona(id);

    if (!deleted) {
      logger.warn(`[API] DELETE /api/orion/personas/${id} - Persona not found for deletion.`, { personaId: id });
      return NextResponse.json({ success: false, error: 'Persona not found' }, { status: 404 });
    }

    logger.success(`[API] DELETE /api/orion/personas/${id} - Persona deleted successfully.`, { personaId: id });
    return NextResponse.json({ success: true, message: 'Persona deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error(`[API] DELETE /api/orion/personas/${id} - Failed to delete persona.`, {
      personaId: id,
      error: errorMessage,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
