import { NextRequest, NextResponse } from 'next/server';
import { getValueProposition, saveValueProposition } from '@/lib/narrative_service';
import { ValueProposition } from '@/lib/types/narrative-clarity';

/**
 * GET handler for value proposition
 */
export async function GET() {
  try {
    const valueProposition = await getValueProposition();

    if (!valueProposition) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value proposition not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, valueProposition });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in GET /api/orion/narrative/value-proposition:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create or update value proposition
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ValueProposition>;

    // Validate required fields
    if (!body.valueStatement) {
      return NextResponse.json(
        {
          success: false,
          error: 'Value statement is required',
        },
        { status: 400 }
      );
    }

    // Construct title and content based on available data
    const title = body.valueStatement
      ? `Value Proposition: ${body.valueStatement.substring(0, 50)}...`
      : 'Generated Value Proposition';
    const content =
      `Value Statement: ${body.valueStatement || 'N/A'}\n` +
      `Core Strengths: ${body.coreStrengths?.join(', ') || 'N/A'}\n` +
      `Unique Skills: ${body.uniqueSkills?.join(', ') || 'N/A'}\n` +
      `Passions: ${body.passions?.join(', ') || 'N/A'}\n` +
      `Vision: ${body.vision || 'N/A'}\n` +
      `Target Audience: ${body.targetAudience || 'N/A'}`;

    const valueProposition = await saveValueProposition({
      title: title,
      content: content,
      coreStrengths: body.coreStrengths || [],
      uniqueSkills: body.uniqueSkills || [],
      passions: body.passions || [],
      vision: body.vision || '',
      targetAudience: body.targetAudience || '',
      valueStatement: body.valueStatement,
    });

    return NextResponse.json({ success: true, valueProposition });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in POST /api/orion/narrative/value-proposition:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
