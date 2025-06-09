/**
 * GOAL: Centralized Postgres DB interface for Orion, replacing SQLite for cloud scalability and reliability.
 * This file exports the Postgres query function and sql client from lib/postgres.ts.
 * This file exports the Postgres query function and sql client from lib/postgres.ts.
 * This file exports the Postgres query function and sql client from lib/postgres.ts.
 * All modules should use this for DB access. See lib/postgres.ts for logging and connection details.
 * Related: lib/postgres.ts, .env.local (DATABASE_URL)
 */
export { query, sql } from './postgres';
