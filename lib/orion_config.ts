/**
 * Configuration for Orion system
 */

// DEBUG: Log Notion env variables at startup for troubleshooting
console.info('[ORION_CONFIG][DEBUG] NOTION_API_KEY:', process.env.NOTION_API_KEY ? '[SET]' : '[NOT SET]');
console.info('[ORION_CONFIG][DEBUG] NOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID ? process.env.NOTION_DATABASE_ID : '[NOT SET]');

// API URLs
export const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5002';
export const QDRANT_URL = process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333';
export const QDRANT_HOST = process.env.NEXT_PUBLIC_QDRANT_HOST || 'localhost';
export const QDRANT_PORT = Number(process.env.NEXT_PUBLIC_QDRANT_PORT || 6333);
export const VECTOR_SIZE = 384; // Default vector size for embeddings

// Email configuration
export const ORION_EMAIL_SENDER = process.env.EMAIL_SENDER;
export const ORION_EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// LLM Request Types
export const ASK_QUESTION_REQUEST_TYPE = 'ask_question';
export const JOURNAL_REFLECTION_REQUEST_TYPE = 'journal_reflection';
export const JD_ANALYSIS_REQUEST_TYPE = 'jd_analysis';
export const PATTERN_ANALYSIS_REQUEST_TYPE = 'pattern_analysis';
export const OPPORTUNITY_EVALUATION_REQUEST_TYPE = 'opportunity_evaluation';
export const OUTREACH_GENERATION_REQUEST_TYPE = 'outreach_generation';
export const NARRATIVE_GENERATION_REQUEST_TYPE = 'narrative_generation';
export const CV_COMPONENT_SELECTION_REQUEST_TYPE = 'cv_component_selection';
export const CV_COMPONENT_REPHRASING_REQUEST_TYPE = 'cv_component_rephrasing';
export const CV_SUMMARY_TAILORING_REQUEST_TYPE = 'cv_summary_tailoring';
export const DRAFT_APPLICATION_REQUEST_TYPE = 'draft_application';
export const DRAFT_COMMUNICATION_REQUEST_TYPE = 'draft_communication';
export const WHATSAPP_REPLY_HELPER_REQUEST_TYPE = 'whatsapp_reply_helper';
export const DAILY_REFLECTION_REQUEST_TYPE = 'daily_reflection';
export const THOUGHT_FOR_THE_DAY_REQUEST_TYPE = 'thought_for_the_day';

export const ORION_MEMORY_COLLECTION_NAME = 'orion_memory';
export const FEEDBACK_COLLECTION_NAME = 'feedback_memory';

export const MEMORY_TYPES = {
  JOURNAL: 'journal',
  REFLECTION: 'reflection',
  TASK: 'task',
  CONVERSATION: 'conversation',
  DOCUMENT: 'document',
  FEEDBACK: 'feedback'
};

// Local file system access
export const ORION_ACCESSIBLE_LOCAL_DIRECTORIES = [
  '/Users/mac/Documents/GitHub',
  '/Users/mac/Documents/Projects',
  '/Users/mac/Downloads'
];

export const NOTION_API_KEY = process.env.NOTION_API_KEY;
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
// ONE DATABASE ID FOR ALL NOTION DATABASES

// Authorization helper function
export async function checkAuthorization(role: string, request: Request) {
  // This is a placeholder implementation
  // In a real app, you would check user authentication and authorization
  return null; // Return null means authorized
}

// Default LLM Providers
export const DEFAULT_GENERATION_PROVIDERS = {
  [ASK_QUESTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [JOURNAL_REFLECTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [JD_ANALYSIS_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [OPPORTUNITY_EVALUATION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [OUTREACH_GENERATION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [NARRATIVE_GENERATION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [CV_COMPONENT_SELECTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [CV_COMPONENT_REPHRASING_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [CV_SUMMARY_TAILORING_REQUEST_TYPE]: 'groq/llama3-70b-8192',
};
