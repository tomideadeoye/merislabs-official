import { NextRequest, NextResponse } from "next/server";
import { generateLLMResponse } from '@repo/shared';

export async function POST(request: NextRequest) {
  try {
    const { OrionOpportunity, jd, memory, profile } = await request.json();

    if (!OrionOpportunity || !jd) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: OrionOpportunity and jd.",
        },
        { status: 400 }
      );
    }

    // Compose a prompt for the LLM
    const prompt = `
You are an expert CV writer and AI assistant. Using the following information, generate a complete, job-specific CV tailored for the OrionOpportunity. Use the most relevant details from the user's profile and memory. Structure the CV for maximum impact and clarity, and ensure it is highly relevant to the job description.

--- Job Description ---
${jd}

--- OrionOpportunity Details ---
Title: ${OrionOpportunity.title || "N/A"}
Company: ${OrionOpportunity.company || "N/A"}
Description: ${OrionOpportunity.description || "N/A"}

--- User Profile ---
${profile ? JSON.stringify(profile, null, 2) : "N/A"}

--- User Memory (notes, highlights, evaluations) ---
${
  Array.isArray(memory) && memory.length > 0
    ? memory.map((m: any) => `- [${m.type}] ${m.content}`).join("\n")
    : "N/A"
}

--- Instructions ---
- Structure the CV as you see fit for this job.
- Use markdown formatting.
- Only include information that is relevant and impactful for this OrionOpportunity.
- Do not include any placeholder or dummy content.
`;

    const llmContent = await generateLLMResponse("CV_ASSEMBLE", prompt, {
      temperature: 0.5,
      maxTokens: 1200,
    });

    return NextResponse.json({ success: true, cv: llmContent });
  } catch (err: any) {
    console.error("[CV ASSEMBLE][ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to generate tailored CV.",
      },
      { status: 500 }
    );
  }
}
