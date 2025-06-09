import { neon } from '@neondatabase/serverless';
import { logger } from './logger';

const sql = neon(process.env.DATABASE_URL!);

export async function query<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    logger.info('Executing database query', { query, params });
    const result = await sql(query, params);
    logger.info('Query executed successfully', { rowCount: result.length });
    return result as T[];
  } catch (error) {
    logger.error('Query execution failed', { error, query, params });
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    logger.info('Initializing database schema');
    // Create tables if they don't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS opportunities (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database schema', { error });
    throw error;
  }
}
