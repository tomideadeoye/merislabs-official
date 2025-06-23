import { parseWhatsAppChat } from './whatsapp_parser';
import { generateLLMResponse, REQUEST_TYPES } from './orion_llm';
import { UserProfileFetchResponse } from './types';
import logger from './logger';

/**
 * GOAL: Define the structure for WhatsApp chat analysis data.
 * This interface provides a basic structure for the output of chat analysis.
 * You can expand it based on the actual analysis results (e.g., sentiment, topics, action items).
 */
export interface WhatsAppAnalysisResult {
  summary: string;
  keyThemes: string[];
  sentimentAnalysis?: {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
  };
  identifiedPatterns?: {
    pattern: string;
    messages: string[];
  }[];
  suggested_replies?: string[]; // Added for consistency with API response
  // Add other properties as needed, e.g., suggested replies, action items
}

/**
 * @function analyzeWhatsAppChat
 * @description Analyzes a WhatsApp chat transcript using LLM and user profile context.
 * @param chatTranscript The raw WhatsApp chat export text.
 * @param userId The user ID for personalization.
 * @param userProfileContext User profile information for personalization.
 */
/**
 * Analyzes a WhatsApp chat transcript using LLM and user profile context.
 * @param chatTranscript The raw WhatsApp chat export text.
 * @param userId The user ID for personalization.
 * @param userProfileContext User profile information for personalization.
 * @returns An object containing the analysis result, or an error.
 */
export async function analyzeWhatsAppChat(
  chatTranscript: string,
  userId: string,
  userProfileContext?: UserProfileFetchResponse
): Promise<WhatsAppAnalysisResult> {
  try {
    const chatData = parseWhatsAppChat(chatTranscript);

    // Construct a comprehensive prompt for the LLM
    let prompt = `Analyze the following WhatsApp chat transcript:\n\n`;
    prompt += `Chat Participants: ${chatData.participants.join(', ')}\n`;
    prompt += `Chat Duration: ${chatData.startDate.toDateString()} - ${chatData.endDate.toDateString()}\n\n`;
    prompt += `Messages:\n`;
    chatData.messages.forEach((msg) => {
      prompt += `[${msg.date.toLocaleDateString()} ${msg.date.toLocaleTimeString()}] ${msg.sender}: ${msg.content}\n`;
    });
    prompt += `\nBased on the chat, please provide the following:\n`;
    prompt += `- A concise summary of the conversation.\n`;
    prompt += `- Key themes discussed.\n`;
    prompt += `- (Optional) Suggested replies for the user (if 'userProfileContext' is provided, use it to personalize replies).\n`;

    if (userProfileContext && userProfileContext.profileText) {
      prompt += `\nUser Profile Context: ${userProfileContext.profileText}\n`;
    }

    // Call LLM for analysis
    const llmResponse = await generateLLMResponse(REQUEST_TYPES.WHATSAPP_CHAT_ANALYSIS, prompt, userId);

    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM analysis failed.');
    }

    // Assume LLM response content is a JSON string that can be parsed into WhatsAppAnalysisResult
    // You might need more robust parsing here depending on LLM output format
    let analysisResult: WhatsAppAnalysisResult;
    try {
      analysisResult = JSON.parse(llmResponse.content);
    } catch (parseError) {
      logger.error('Error parsing LLM response as JSON, treating as raw summary.', {
        operation: 'analyzeWhatsAppChat:parseLLMResponse',
        error: parseError instanceof Error ? parseError.message : String(parseError),
        llmContent: llmResponse.content,
      });
      // If LLM doesn't return valid JSON, treat its content as a summary
      analysisResult = {
        summary: llmResponse.content,
        keyThemes: ['General Analysis'],
        suggested_replies: [llmResponse.content], // Use LLM content as a suggested reply
      };
    }

    return analysisResult;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze WhatsApp chat';
    throw new Error(`WhatsApp Chat Analysis Error: ${errorMessage}`);
  }
}
