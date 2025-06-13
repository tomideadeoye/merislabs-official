/**
 * Application constants
 */

export const API_KEY_ERROR_MESSAGE = "API key error";

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
