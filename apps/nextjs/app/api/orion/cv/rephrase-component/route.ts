import { NextRequest, NextResponse } from "next/server";
import { generateLLMResponse } from "@repo/shared"; // Import LLM utility
import { fetchCVComponents } from "@repo/shared/cv"; // Import function to fetch all CV components
import { getCVComponentsFromNotion } from "@repo/shared/notion_service"; // Import from notion_service
import { CV_COMPONENT_REPHRASING_REQUEST_TYPE } from "@repo/shared/orion_config"; // Import request type
import { CVComponentShared } from "@repo/shared"; // Import the shared CV component type

/**
 * API route for rephrasing a CV component based on JD analysis using LLM
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { component_id, jd_analysis, web_research_context } = body;

    if (!component_id || !jd_analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Component ID and JD analysis are required",
        },
        { status: 400 }
      );
    }

    const allComponents = await getCVComponentsFromNotion();
    const componentToRephrase = allComponents.find(
      (c) => c.unique_id === component_id || c.notionPageId === component_id
    );

    if (!componentToRephrase) {
      return NextResponse.json(
        { success: false, error: "CV component not found." },
        { status: 404 }
      );
    }

    const componentContent = componentToRephrase.content_primary;
    const componentName = componentToRephrase.component_name;

    // Construct the prompt for the LLM
    const prompt = `You are an expert CV writer. Rephrase the following CV component content to be highly relevant to the provided job description analysis. Incorporate keywords and themes from the analysis. \n\n**CV Component Name:** ${componentName}\n**Original Content:**\n${componentContent}\n\n**Job Description Analysis:**\n${jd_analysis}\n\n${
      web_research_context
        ? `**Relevant Web Research Context:**\n${web_research_context}\n\n`
        : ""
    }**Instructions:**\nRephrase the Original Content. Focus on highlighting relevant skills and experiences. Maintain a professional tone. Provide ONLY the rephrased content, without any introductory or concluding remarks.`;

    console.log(
      `Sending rephrasing prompt for component ${component_id} to LLM...`
    );

    // Call the LLM
    try {
      const llmContent = await generateLLMResponse(
        CV_COMPONENT_REPHRASING_REQUEST_TYPE, // Use specific request type
        prompt, // Pass the constructed prompt
        {
          temperature: 0.7, // Moderate temperature for creative rephrasing
          maxTokens: 500, // Adjust based on expected length of rephrased content
        }
      );
      return NextResponse.json({
        success: true,
        rephrased_content: llmContent,
      });
    } catch (err: any) {
      console.error("LLM failed to rephrase component:", err);
      return NextResponse.json(
        {
          success: false,
          error: err.message || "Failed to rephrase component using LLM",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in CV component rephrasing API:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || "An unexpected error occurred in rephrasing API",
      },
      { status: 500 }
    );
  }
}
