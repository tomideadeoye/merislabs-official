/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provides the centralized, robust, and absurdly well-logged Postgres client for Orion, specifically designed for Edge/Serverless compatibility.
 *   - Utilizes the Neon HTTP driver (`@neondatabase/serverless`) for optimal performance and compatibility with serverless environments like Vercel Edge and Cloudflare Workers.
 *   - Acts as the primary interface for all persistent data storage and retrieval operations within the Orion system, having replaced SQLite for enhanced scalability and cloud integration.
 *
 * FILEPATH: `app/lib/postgres.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/database.ts`: This file is re-exported by `database.ts`, making its `sql` function the single point of truth for all database access throughout the application.
 *   - All API routes and backend services that require database interaction (e.g., `app/api/orion/emotions/log/route.ts`, `app/lib/opportunity_db_service.ts`) directly or indirectly use the `sql` function exported from here.
 *   - `process.env.DATABASE_URL`: Relies on this environment variable for establishing the database connection. A critical error is thrown if it's not set.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `DATABASE_URL` is correctly configured in the environment.
 *   - NOTE: Comprehensive logging is integrated, including client creation, query execution, and detailed error information, crucial for rapid debugging and system monitoring.
 *   - NOTE: The `sql` tagged template literal directly handles SQL injection prevention by safely parameterizing queries.
 *
 * NOTES:
 *   - OPPORTUNITIES FOR IMPROVEMENT: Consider adding more sophisticated connection pooling or retry mechanisms if advanced reliability beyond Neon's built-in features is required. Implement more detailed metrics collection for query performance.
 *   - OPPORTUNITIES TO CONSOLIDATE: This file centralizes all core Postgres client setup and interaction logic.
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

// The `query` function has been removed as it was a redundant wrapper.
// Direct usage of `sql` tagged template literal is preferred for type safety and clarity.

export { sql };
