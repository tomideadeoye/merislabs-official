/**
 * GOAL: Provide a single, centralized Prisma Client instance for the entire application.
 * This prevents connection pool exhaustion and improves performance by reusing connections.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - Consumed by all database service files (e.g., `cv_components_db_service.ts`, `opportunity_db_service.ts`).
 * - Interacts with the Neon/PostgreSQL database defined by `DATABASE_URL` in `.env`.
 * - `prisma/schema.prisma`: Defines the database schema that this client interacts with.
 *
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/lib/prisma.ts
 * NOTES:
 * - This approach is recommended by Prisma documentation for managing client instances.
 * - It helps ensure that the application does not exceed the database connection limit, especially in serverless environments.
 */
import { PrismaClient } from '@/generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
