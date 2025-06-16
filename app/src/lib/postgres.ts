/**
 * GOAL: Centralized, robust, and absurdly well-logged Postgres client for Orion (Edge/Serverless compatible).
 *
 * This file now uses the Neon HTTP driver (@neondatabase/serverless) for maximum compatibility with Vercel Edge, Cloudflare Workers, and other serverless platforms.
 * It is the backbone for all persistent data storage and retrieval in the Orion system, replacing SQLite for scalability and cloud compatibility.
 *
 * Connections:
 * - Used by all API routes and backend services that require database access (e.g., app/api/orion/emotions/log/route.ts).
 * - Ensures a single source of truth for database access, error handling, and logging.
 * - Designed for extensibility, reliability, and maximum observability.
 *
 * LOGGING STRATEGY:
 * - Logs client creation, query execution, and all errors with context.
 * - Includes timestamps, query text, parameters, and error details.
 * - All logs are designed to support rapid debugging, auditability, and system health monitoring.
 *
 * IMPROVEMENT LOOP:
 * - All changes to database access should be made here for consistency and maintainability.
 * - Add new logging, fallback, or error handling patterns as needed.
 * - Review and refactor for performance, security, and developer experience.
 */

import { neon, NeonQueryFunction } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // This is a critical error: the system cannot function without a database connection.
  // Fail fast and log with maximum clarity.
  const errorMsg = '[NEON] FATAL: DATABASE_URL environment variable is not set. Aborting startup.';
  console.error(errorMsg, { timestamp: new Date().toISOString() });
  throw new Error(errorMsg);
}

console.info('[NEON] Creating Neon HTTP client...', { connectionString, timestamp: new Date().toISOString() });
const sql: NeonQueryFunction<true, false> = neon(connectionString);

/**
 * Run a SQL query using the Neon HTTP driver.
 * @param text SQL query string
 * @param params Query parameters
 * @returns QueryResult<any>
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const start = Date.now();
  console.debug('[NEON] Preparing to execute query.', { timestamp: new Date().toISOString() });
  try {
    let res;
    if (params && params.length > 0) {
      // Use tagged template literal for parameterized queries
      res = await sql([text, ...params.map(() => '')] as any, ...params);
    } else {
      res = await sql([text] as any);
    }
    const duration = Date.now() - start;
    console.info('[NEON] Query executed successfully.', { duration, rowCount: res.length, timestamp: new Date().toISOString() });
    return { rows: res as T[], rowCount: res.length };
  } catch (err) {
    // Log all errors with full context for rapid debugging
    console.error('[NEON] Query error:', err, { text, params, timestamp: new Date().toISOString() });
    throw err;
  }
}

export { sql };
