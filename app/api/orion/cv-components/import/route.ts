/**
 * @fileoverview API route for bulk importing CV components from a local JSON file into the database.
 * @description This is intended as a one-time or occasional utility to seed the database.
 * It reads from `data/cv-data.json` and uses the cv_components_db_service.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `@/lib/cv_components_db_service.ts`: Consumes `saveOrUpdateCvComponent` to persist data.
 * - `data/cv-data.json`: The source file for CV components.
 * - `@/lib/logger`: For logging the import process.
 * - `@/lib/types/index.ts`: Uses `RawCvComponentJsonData`.
 * - Triggered by `ImportCvComponentsButton.tsx` on the admin dashboard.
 *
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/api/orion/cv-components/import/route.ts
 * NOTES:
 * - This endpoint should be protected and ideally used only by administrators.
 * - Error handling is included for individual component import failures and critical file read/parse errors.
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
