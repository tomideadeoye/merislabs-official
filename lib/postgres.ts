/**
 * GOAL: Centralized, robust, and absurdly well-logged Postgres client for Orion.
 *
 * This file provides a singleton Postgres connection pool and a query function for all database operations.
 * It is the backbone for all persistent data storage and retrieval in the Orion system, replacing SQLite for scalability and cloud compatibility.
 *
 * Connections:
 * - Used by all API routes and backend services that require database access (e.g., app/api/orion/emotions/log/route.ts).
 * - Ensures a single source of truth for database access, error handling, and logging.
 * - Designed for extensibility, reliability, and maximum observability.
 *
 * LOGGING STRATEGY:
 * - Logs pool creation, connection acquisition, query execution, and all errors with context.
 * - Includes timestamps, query text, parameters, and error details.
 * - All logs are designed to support rapid debugging, auditability, and system health monitoring.
 *
 * IMPROVEMENT LOOP:
 * - All changes to database access should be made here for consistency and maintainability.
 * - Add new logging, fallback, or error handling patterns as needed.
 * - Review and refactor for performance, security, and developer experience.
 */

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // This is a critical error: the system cannot function without a database connection.
  // Fail fast and log with maximum clarity.
  const errorMsg = '[POSTGRES] FATAL: DATABASE_URL environment variable is not set. Aborting startup.';
  console.error(errorMsg, { timestamp: new Date().toISOString() });
  throw new Error(errorMsg);
}

// Create a singleton pool instance with detailed logging
console.info('[POSTGRES] Creating connection pool...', { connectionString, timestamp: new Date().toISOString() });
const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: connectionString.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.on('connect', () => {
  console.info('[POSTGRES] New client connected to the pool.', { timestamp: new Date().toISOString() });
});
pool.on('error', (err) => {
  console.error('[POSTGRES] Pool error:', err, { timestamp: new Date().toISOString() });
});

/**
 * Run a SQL query using the shared Postgres pool.
 * @param text SQL query string
 * @param params Query parameters
 * @returns QueryResult<T>
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client: PoolClient = await pool.connect();
  const start = Date.now();
  console.debug('[POSTGRES] Acquired client from pool.', { timestamp: new Date().toISOString() });
  try {
    console.info('[POSTGRES] Executing query...', { text, params, timestamp: new Date().toISOString() });
    const res = await client.query<T>(text, params);
    const duration = Date.now() - start;
    console.info('[POSTGRES] Query executed successfully.', { duration, rowCount: res.rowCount, timestamp: new Date().toISOString() });
    return res;
  } catch (err) {
    // Log all errors with full context for rapid debugging
    console.error('[POSTGRES] Query error:', err, { text, params, timestamp: new Date().toISOString() });
    throw err;
  } finally {
    client.release();
    console.debug('[POSTGRES] Client released back to pool.', { timestamp: new Date().toISOString() });
  }
}

export { pool };
