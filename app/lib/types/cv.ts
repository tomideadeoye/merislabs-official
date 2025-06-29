import { Prisma } from '@/generated/prisma'; // Import Prisma for JsonValue type

export interface CVComponent {
  id: string; // Add id as it's an @id in Prisma
  name: string;
  type: string; // e.g., "experience", "project", "skill_summary", "education"
  content: Prisma.JsonValue | null; // Store structured content, allow null
  tags?: string[]; // Make optional as it has a default in Prisma
  userId: string; // To associate with a user, required as per Prisma schema
  uniqueId?: string | null; // To store the UniqueID from the JSON file, allow null
  createdAt?: Date; // Add createdAt as Date
  updatedAt?: Date; // Add updatedAt as Date

  // Remove old properties if they are not in the Prisma schema
  // WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILESPageId?: string;
  // unique_id?: string;
  // component_name?: string;
  // component_type?: string;
  // content_primary?: string;
}

/**
 * @fileoverview Defines the data structures for CV components and Career Milestones within the Orion system.
 * @description This file provides TypeScript interfaces that ensure type safety and consistency across
 *   the application when dealing with user-generated CV content and structured career achievements.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To define the `CVComponent` interface for standardizing various elements of a user's CV.
 *   - To define the `CareerMilestone` interface for structuring and managing significant career achievements.
 *   - To ensure type consistency for data flowing between frontend components, API routes, and database interactions.
 *
 * FILEPATH: `app/lib/types/cv.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/cv-components/route.ts`: API routes for managing CV components interact with these types.
 *   - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: Uses `CareerMilestone` for its milestone management features.
 *   - `app/components/orion/narrative-clarity-studio/CareerMilestoneForm.tsx`: Utilizes `CareerMilestone` for form inputs.
 *   - `app/lib/cv.ts`: Utility functions for CV operations may use these types.
 *   - `app/lib/database.ts`: Database interactions for storing and retrieving CV data and milestones adhere to these types.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `id` fields are typically UUIDs generated either by the database or a unique identifier system.
 *   - `content` and `content_primary` distinguish between raw user input and processed/primary content.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:** None immediately apparent, this file is dedicated to type definitions.
 *   - **PERFORMANCE OPTIMIZATIONS:** Type definitions themselves don't directly impact runtime performance, but well-defined types prevent runtime errors.
 *   - **ERROR HANDLING ROBUSTNESS:** Proper typing reduces a class of runtime errors, acting as a compile-time check.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   **1. Enriched Data Fields for Career Milestones:**
 *     - **Goal:** Expand the `CareerMilestone` interface to capture more granular and insightful data points about each achievement.
 *     - **How to Implement:** Add optional fields like `quantifiableResults` (string), `lessonsLearned` (string), `challengesFaced` (string), `keyTakeaways` (string), `associatedSkills` (string[]), and `recognitionAwards` (string[]).
 *   **2. Versioning and Schema Migration:**
 *     - **Goal:** Establish a strategy for managing schema changes over time without breaking existing data.
 *     - **How to Implement:** Consider using tools or practices for schema versioning if `CVComponent` or `CareerMilestone` structures evolve significantly.
 *   **3. Validation Schemas Integration:**
 *     - **Goal:** Integrate Zod or similar validation schemas directly with these interfaces for robust input validation.
 *     - **How to Implement:** Define Zod schemas that align with `CVComponent` and `CareerMilestone` to validate data at API entry points and form submissions.
 */

export interface CareerMilestone {
  id?: string; // Optional ID for existing milestones
  userId?: string; // Associated user ID
  title: string;
  description?: string;
  organization?: string;
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
  achievements?: string[]; // List of specific achievements (e.g., bullet points)
  skills?: string[]; // List of skills applied or developed
  impact?: string; // Quantifiable impact or outcome
  order?: number; // For manual ordering in UI
  // OPPORTUNITIES FOR ENRICHMENT (Future):
  quantifiableResults?: string; // E.g., "Increased revenue by 15%"
  lessonsLearned?: string; // Key learnings from the experience
  challengesFaced?: string; // Obstacles encountered and overcome
  keyTakeaways?: string; // Broader insights or conclusions
  associatedSkills?: string[]; // Explicitly list skills associated with this milestone (can be distinct from `skills`)
  recognitionAwards?: string[]; // Any awards or recognition received
  status?: 'planned' | 'in-progress' | 'completed' | 'on-hold'; // For progress tracking
}
