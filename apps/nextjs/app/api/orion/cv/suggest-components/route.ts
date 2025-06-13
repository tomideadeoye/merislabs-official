import { NextRequest, NextResponse } from "next/server";
import { generateLLMResponse } from "@repo/shared"; // Import LLM utility
import { fetchCVComponents } from "@repo/shared/cv"; // Import function to fetch all CV components
import { getCVComponentsFromNotion } from "@repo/shared/notion_service"; // Import from notion_service
import { CV_COMPONENT_SELECTION_REQUEST_TYPE } from "@repo/shared/orion_config"; // Import request type
import { CVComponentShared } from "@repo/shared"; // Import the shared CV component type

/**
 * API route for suggesting CV components based on JD analysis using LLM
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { jd_analysis, job_title, company_name } = body;
    console.log(
      `[${new Date().toISOString()}] [INFO] [CV Suggest] POST /api/orion/cv/suggest-components - Params:`,
      {
        job_title,
        company_name,
        jd_analysis: jd_analysis?.slice(0, 100) + "...",
      }
    );

    if (!jd_analysis) {
      console.warn(
        `[${new Date().toISOString()}] [WARN] [CV Suggest] Missing JD analysis in request body.`
      );
      return NextResponse.json(
        {
          success: false,
          error: "JD analysis is required",
        },
        { status: 400 }
      );
    }

    // Fetch all available CV components
    console.log(
      `[${new Date().toISOString()}] [INFO] [CV Suggest] Fetching CV components from Notion...`
    );
    const allComponents = await getCVComponentsFromNotion();

    if (!allComponents || allComponents.length === 0) {
      console.warn(
        `[${new Date().toISOString()}] [WARN] [CV Suggest] No CV components available for suggestion.`
      );
      return NextResponse.json(
        { success: false, error: "No CV components available for suggestion." },
        { status: 404 }
      );
    }

    // Format components for the LLM prompt
    const componentsList = allComponents
      .map(
        (comp: CVComponentShared) =>
          `ID: ${comp.unique_id}\nName: ${comp.component_name}\nType: ${
            comp.component_type
          }\nContent Preview: ${comp.content_primary.substring(0, 200)}...`
      )
      .join("\n---\n");

    // Construct the prompt for the LLM
    const prompt = `You are an AI assistant specialized in CV tailoring. Based on the following job description analysis, job title, and company name, suggest the most relevant CV components from the provided list of available components. \n\n**Job Details:**\nJob Title: ${
      job_title || "N/A"
    }\nCompany: ${
      company_name || "N/A"
    }\nJob Description Analysis:\n${jd_analysis}\n\n**Available CV Components:**\n${componentsList}\n\n**Instructions:**\nList the unique IDs of the most relevant CV components from the "Available CV Components" list. Prioritize components that directly align with the skills, experience, and requirements mentioned in the Job Description Analysis. Respond ONLY with a comma-separated list of the suggested component unique IDs. Do NOT include any other text, explanation, or formatting.\n\nSuggested Component IDs:`;

    console.log(
      `[${new Date().toISOString()}] [INFO] [CV Suggest] Sending suggestion prompt to LLM...`
    );
    const llmStart = Date.now();
    // Call the LLM
    const llmResponse = await generateLLMResponse(
      CV_COMPONENT_SELECTION_REQUEST_TYPE,
      prompt,
      {
        model: "deepseek-r1",
        temperature: 0.3,
        maxTokens: 100,
      }
    );
    const llmDuration = Date.now() - llmStart;
    console.log(
      `[${new Date().toISOString()}] [INFO] [CV Suggest] LLM call completed in ${llmDuration}ms.`
    );

    if (llmResponse && typeof llmResponse === "string") {
      // Parse the LLM's response (comma-separated IDs)
      const suggestedIds = llmResponse
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      // Validate suggested IDs against available components
      const validSuggestedIds = suggestedIds.filter((id) =>
        allComponents.some((comp: CVComponentShared) => comp.unique_id === id)
      );
      console.log(
        `[${new Date().toISOString()}] [INFO] [CV Suggest] Suggested component IDs:`,
        validSuggestedIds
      );
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] [INFO] [CV Suggest] Request completed in ${duration}ms.`
      );
      return NextResponse.json({
        success: true,
        suggested_component_ids: validSuggestedIds,
      });
    } else {
      console.error(
        `[${new Date().toISOString()}] [ERROR] [CV Suggest] LLM failed to provide suggestions.`
      );
      const duration = Date.now() - startTime;
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get suggestions from LLM",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] [ERROR] [CV Suggest] Exception:`,
      error
    );
    const duration = Date.now() - startTime;
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "An unexpected error occurred in suggestion API",
      },
      { status: 500 }
    );
  }
}
