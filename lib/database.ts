import { Pool, neon, neonConfig } from '@neondatabase/serverless';
// import { PrismaClient } from '@prisma/client'; // Removed unused import
import { logger } from './logger';
import { readFileSync } from 'fs';
import { join } from 'path';

// This is a placeholder for Prisma initialization if you use it.
// const prisma = new PrismaClient();

// For direct Neon connection
neonConfig.fetchConnectionCache = true;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const sql = neon(process.env.DATABASE_URL!);

export async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    if (result.rows && result.rows.length > 0) {
      logger.info('Database connection successful', { timestamp: result.rows[0].now });
    } else {
      logger.warn('Database connection test returned no rows.');
    }
  } catch (error) {
    logger.error('Database connection failed', { error });
    throw new Error('Could not connect to the database.');
  }
}

export async function initializeDatabaseSchema() {
  try {
    // Correct way to read a local SQL file in Node.js
    const schemaPath = join(process.cwd(), 'lib/database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    logger.info('Database schema initialized/verified successfully.');
  } catch (error) {
    logger.error('Failed to initialize database schema', { error });
  }
}

export async function query<T>(queryString: string, params: any[] = []): Promise<{ rows: T[], rowCount: number }> {
    const start = Date.now();
    try {
        const result = await pool.query(queryString, params);
        const duration = Date.now() - start;
        logger.debug('Database query executed', { duration, query: queryString, params, rowCount: result.rowCount });
        return {
            rows: result.rows as T[],
            rowCount: result.rowCount ?? 0
        };
    } catch (error) {
        const duration = Date.now() - start;
        const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
        logger.error('Database query failed', { error: errorMessage, duration, query: queryString });
        throw error;
    }
}
