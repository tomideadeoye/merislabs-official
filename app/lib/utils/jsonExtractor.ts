/**
 * @fileoverview Utility function for extracting the first JSON object from a string, especially useful for parsing LLM responses that might include conversational or markdown formatting around the JSON.
 * @description This utility helps in robustly parsing AI model outputs by identifying and isolating the JSON content within a larger string, such as a markdown code block or a thought process. It ensures that `JSON.parse` receives clean JSON.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To safely extract a JSON string from a text that might contain non-JSON elements (e.g., pre-text, post-text, markdown fences).
 *   - To specifically handle LLM outputs that wrap JSON in markdown code blocks (```json...``` or ```...```) or other conversational elements.
 *
 * FILEPATH: `app/lib/utils/jsonExtractor.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Consumed by API routes that receive LLM responses, such as `app/api/orion/opportunity/evaluate/route.ts`.
 *   - It is a standalone utility, designed to be imported and used wherever raw string responses need JSON extraction.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the desired JSON object is the first valid JSON structure encountered in the string.
 *   - Prioritizes ````json` code blocks, then generic ```` code blocks.
 *   - Returns `null` if no valid JSON object can be extracted.
 *
 * NOTES:
 *   - This utility is crucial for making LLM parsing more resilient to variations in output format.
 *   - **OPPORTUNITIES FOR IMPROVEMENT**: Could be extended to handle multiple JSON objects in a string, or to use a more sophisticated regex for edge cases.
 */
export function extractFirstJsonObject(text: string): string | null {
  // Regex to find JSON wrapped in ```json or ``` code blocks
  const jsonCodeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const jsonMatch = text.match(jsonCodeBlockRegex);

  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }

  // If no code block, try to find a standalone JSON object
  // This regex is a simple attempt to find the first {.*} block
  const jsonObjectRegex = /{[\s\S]*}/;
  const objectMatch = text.match(jsonObjectRegex);

  if (objectMatch && objectMatch[0]) {
    try {
      // Attempt to parse to validate it's indeed JSON, but return the string if successful
      JSON.parse(objectMatch[0]);
      return objectMatch[0].trim();
    } catch (e) {
      // Not a valid JSON object, continue or return null
    }
  }

  return null;
}
