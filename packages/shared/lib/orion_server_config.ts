/**
 * Server-side configuration for the Orion system.
 * This file contains sensitive information and should only be imported on the server.
 */

if (typeof window !== 'undefined') {
  throw new Error('orion_server_config.ts should not be imported on the client-side.');
}

export const NOTION_API_KEY = process.env.NOTION_API_KEY;
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Qdrant Configuration
export const QDRANT_HOST = process.env.QDRANT_HOST;
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// Add other server-only secrets here as needed
