import { neon } from '@neondatabase/serverless';
import { query } from '@shared/lib/database';
import { logger } from '@shared/lib/logger';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool using the Neon serverless driver
export const pool = neon(process.env.DATABASE_URL);

// Test database connection
export async function testConnection() {
  try {
    logger.info('Testing database connection');
    const result = await query('SELECT NOW()');
    logger.info('Database connection successful', { timestamp: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error });
    throw error;
  }
}

// Initialize database schema
export async function initializeDatabase() {
  try {
    logger.info('Initializing database schema');
    const schema = await import('./database/schema.sql');
    await query(schema.default);
    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database schema', { error });
    throw error;
  }
}

// Export a function to execute queries with proper error handling
export async function executeQuery<T>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    logger.info('Executing database query', { query, params });
    const result = await query(query, params);
    logger.info('Query executed successfully', { rowCount: result.rows.length });
    return result.rows as T[];
  } catch (error) {
    logger.error('Query execution failed', { error, query, params });
    throw error;
  }
}
