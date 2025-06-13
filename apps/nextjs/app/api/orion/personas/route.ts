import { NextRequest, NextResponse } from "next/server";
import {
  createPersona,
  getPersonas,
  getPersonaById,
  updatePersona,
  deletePersona,
  searchPersonas,
} from "@repo/shared/persona_service";
import { PersonaMap } from "@repo/shared/types/strategic-outreach";

/**
 * GET handler for personas
 * - Get all personas
 * - Get a specific persona by ID
 * - Search personas by query
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const query = url.searchParams.get("query");

    if (id) {
      // Get persona by ID
      const persona = await getPersonaById(id);
      if (!persona) {
        return NextResponse.json(
          { success: false, error: "Persona not found" },
          { status: 404 }
        );
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
  } catch (error: any) {
    console.error("Error in GET /api/orion/personas:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new persona
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required",
        },
        { status: 400 }
      );
    }

    const persona = await createPersona(body);
    return NextResponse.json({ success: true, persona });
  } catch (error: any) {
    console.error("Error in POST /api/orion/personas:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT handler to update an existing persona
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Persona ID is required",
        },
        { status: 400 }
      );
    }

    const updatedPersona = await updatePersona(body.id, body);
    if (!updatedPersona) {
      return NextResponse.json(
        {
          success: false,
          error: "Persona not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, persona: updatedPersona });
  } catch (error: any) {
    console.error("Error in PUT /api/orion/personas:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
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
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Persona ID is required",
        },
        { status: 400 }
      );
    }

    const success = await deletePersona(id);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Persona not found or could not be deleted",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/orion/personas:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
