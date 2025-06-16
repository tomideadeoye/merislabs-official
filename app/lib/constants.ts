/**
 * Application constants
 */

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, usage patterns, next steps if any

export const API_KEY_ERROR_MESSAGE = 'API key error';

// Memory collection names
export const MEMORY_COLLECTION_NAME = 'orion_memory';

// API endpoints
const getBaseUrl = () => process.env.NEXTAUTH_URL || 'http://localhost:3000';
export const TOMIDES_PROFILE_DATA = '';
export const LLM_API_ENDPOINT = `${getBaseUrl()}/api/orion/llm`;
export const MEMORY_API_ENDPOINT = `${getBaseUrl()}/api/orion/memory`;

// Ask a Question parameters
export const DEFAULT_REQUEST_TYPE = 'general_question';
export const DEFAULT_PRIMARY_CONTEXT = 'user_profile';

export const ASK_QUESTION_REQUEST_TYPE = 'ask_question_request';

export const REQUEST_TYPES = {
  GENERAL_QUESTION: 'general_question',
  IDEA_BRAINSTORM: 'idea_brainstorm',
  OPPORTUNITY_EVALUATION: 'opportunity_evaluation',
  CV_TAILORING: 'cv_tailoring',
  WHATSAPP_CHAT_ANALYSIS: 'whatsapp_chat_analysis',
  OUTREACH_DRAFTING: 'outreach_drafting',
  NARRATIVE_GENERATION: 'narrative_generation',
  ASK_QUESTION_REQUEST: 'ask_question_request',
};
