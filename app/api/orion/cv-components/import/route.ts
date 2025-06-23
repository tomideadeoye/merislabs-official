/**
 * @fileoverview API route for bulk importing CV components from a local JSON file into the database.
 * @description This route provides a utility to seed the database with CV components from `data/cv-data.json`.
 *   It is designed for one-time or occasional use, primarily by administrators, to populate the system
 *   with initial CV data. It ensures that components are properly saved or updated using the
 *   `cv_components_db_service`.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To read CV component data from a specified local JSON file (`data/cv-data.json`).
 *   - To iterate through the parsed data and save or update each CV component in the Neon/PostgreSQL database.
 *   - To provide robust logging for the import process, including success and failure counts.
 *   - To serve as a utility for initializing the CV component database.
 *
 * FILEPATH: `app/api/orion/cv-components/import/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/cv_components_db_service.ts`: Consumes `saveOrUpdateCvComponent` to interact with the database.
 *   - `data/cv-data.json`: The external JSON file containing the raw CV component data to be imported.
 *   - `@/lib/logger.ts`: Used for comprehensive logging of the import operation's progress and errors.
 *   - `@/lib/types/index.ts`: Defines `RawCvComponentJsonData` for type consistency with the incoming JSON data.
 *   - `@/lib/prisma.ts`: Provides the Prisma client for direct database interactions (e.g., counting records).
 *   - `app/components/orion/admin/ImportCvComponentsButton.tsx` (hypothetical): A frontend component might trigger this route.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `data/cv-data.json` exists in the project root and contains a valid JSON array of CV components.
 *   - Assumes the structure of JSON data in `cv-data.json` conforms to `RawCvComponentJsonData`.
 *   - This endpoint is intended for administrative use and should ideally be protected by authentication/authorization (currently logging as 'unauthenticated_import').
 *
 * NOTES:
 *   - This is primarily a data seeding utility, not a core application feature for end-users.
 *   - Error handling is implemented for file reading, JSON parsing, and individual component import failures.
 *   - The `userId` is currently a placeholder (`unauthenticated_import`); proper authentication should be enforced for production use.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Authentication**: Implement full authentication for this endpoint to restrict access to authorized users only.
 *   - **Zod Validation**: Add Zod schema validation for the incoming JSON data from `cv-data.json` to ensure its structure before processing.
 *   - **Asynchronous Processing**: For very large import files, consider implementing a background job or streaming approach to prevent API timeouts.
 *   - **User Feedback**: Provide more detailed feedback to the user on import progress and specific errors for failed components.
 *   - **Rollback Mechanism**: Implement a transaction or a rollback mechanism in case of partial import failures to ensure data consistency.
 *   - **Dynamic File Selection**: Allow administrators to specify the import file path via the request, instead of hardcoding `data/cv-data.json`.
 */

import { NextResponse } from 'next/server';
import { saveOrUpdateCvComponent } from '@/lib/cv_components_db_service';
import path from 'path';
import fs from 'fs/promises';
import logger from '@/lib/logger'; // Standard logger import
import type { RawCvComponentJsonData } from '@/lib/types';
import { prisma } from '@/lib/prisma'; // Assuming prisma is imported from a file

export async function POST() {
  logger.info('[CV_IMPORT_API][POST] Starting bulk import of CV components.', { userId: 'unauthenticated_import' }); // Log with a placeholder user ID
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'cv-data.json');
    logger.debug('[CV_IMPORT_API][POST] Attempting to read JSON file from:', { jsonPath });
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    const components: RawCvComponentJsonData[] = JSON.parse(jsonData);
    logger.info('[CV_IMPORT_API][POST] Successfully read and parsed CV data.', { numComponents: components.length });

    let successCount = 0;
    let failureCount = 0;

    for (const component of components) {
      try {
        const savedComponent = await saveOrUpdateCvComponent(component);
        successCount++;
        logger.debug('[CV_IMPORT_API][POST] Successfully imported CV component.', {
          uniqueId: component.UniqueID,
          dbId: savedComponent.id,
          name: component['Component Name'],
        });
      } catch (e: unknown) {
        failureCount++;
        const errorMessage = e instanceof Error ? e.message : String(e);
        logger.error('[CV_IMPORT_API][POST] Failed to import a single CV component during bulk process.', {
          componentName: component['Component Name'],
          uniqueId: component.UniqueID,
          error: errorMessage,
          stack: e instanceof Error ? e.stack : 'N/A',
        });
      }
    }

    const finalCount = await prisma.cVComponent.count();

    const message = `CV Component import complete. Success: ${successCount}, Failures: ${failureCount}. Total CV Components in DB: ${finalCount}.`;
    logger.info(`[CV_IMPORT_API][POST] ${message}`);
    return NextResponse.json({ success: true, message, successCount, failureCount, totalCount: finalCount });
  } catch (error: unknown) {
    logger.error('[CV_IMPORT_API][POST] A critical error occurred during the import process.', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: 'Failed to read or process cv-data.json.' }, { status: 500 });
  }
}
