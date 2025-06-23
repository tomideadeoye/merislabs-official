/**
 * @fileoverview API route for handling local file system operations, including listing, indexing, and deleting files.
 * @description This file provides endpoints to interact with the local file system, specifically for indexing file content into the Orion memory system (Qdrant) and managing configured directories. It ensures that operations are restricted to pre-defined and authorized paths.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a secure API for listing contents of configured local directories.
 *   - Enable indexing of file content into the Orion memory for search and retrieval.
 *   - Allow deletion of indexed file paths from the Orion memory.
 *   - Ensure all file system operations respect configured directory restrictions for security.
 *
 * FILEPATH: `app/api/orion/local-fs/index-path/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/orion_config.ts`: Used to retrieve the list of configured (authorized) directories.
 *   - `@/lib/types.ts`: Defines types like `LocalFileIndexRequest`, `LocalFileIndexResponse`, and `FilePath` used for API request/response contracts.
 *   - `app/lib/logger.ts`: Utilized for comprehensive, context-rich logging of API operations, errors, and security warnings.
 *   - `axios`: Used to make internal API calls to `/api/orion/memory/index-text` and `/api/orion/memory/delete` for actual memory operations.
 *   - `app/api/orion/memory/index-text/route.ts`: The endpoint responsible for creating vector embeddings and storing text in Qdrant.
 *   - `app/api/orion/memory/delete/route.ts`: The endpoint responsible for deleting entries from Qdrant.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `getConfiguredDirectories()` provides a valid and up-to-date list of allowed directories.
 *   - Assumes that the `/api/orion/memory/index-text` and `/api/orion/memory/delete` endpoints are functional and correctly handle memory operations.
 *   - The authentication check is currently commented out as per the authentication removal strategy, using a placeholder `userId`. This needs to be reviewed and re-implemented securely in a production environment.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: Consider consolidating local file system interactions if similar logic emerges in other parts of the application.
 *   - **PERFORMANCE OPTIMIZATIONS**: For very large directories, consider implementing pagination or streaming for the `list` action to improve performance and reduce memory usage.
 *   - **ERROR HANDLING ROBUSTNESS**: Enhance error handling with more specific error codes or custom error types to provide clearer feedback to the client.
 *   - **SECURITY**: The placeholder `userId` needs to be replaced with actual authenticated user identification for production.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement Zod schema validation for incoming request bodies (`action`, `filePath`) to ensure data integrity and provide more precise error messages.
 *   - Introduce more granular logging within the `index` and `delete` operations, especially around external API calls to the memory service.
 *   - Explore adding a mechanism to re-index files that have been modified, rather than just indexing new ones or deleting.
 */

import { getConfiguredDirectories } from '@/lib/orion_config';
import { NextRequest, NextResponse } from 'next/server';
import { searchMemory } from '@/lib/orion_memory'; // Kept searchMemory in case it's used elsewhere or planned.
import { LocalFileIndexRequest, LocalFileIndexResponse, FilePath } from '@/lib/types';
import path from 'path';
import { promises as fs } from 'fs';
import logger from '@/lib/logger';
import axios from 'axios';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const directoryPath = searchParams.get('path');

  // Placeholder userId as authentication is removed for now
  const userId = 'unauthenticated_user';

  if (!directoryPath) {
    logger.warn('[LOCAL_FS_INDEX][GET] Directory path is required.', { userId });
    return NextResponse.json({ success: false, error: 'Directory path is required.' }, { status: 400 });
  }

  const configuredDirs = getConfiguredDirectories();
  const normalizedDirectoryPath = path.normalize(directoryPath);

  const isAuthorized = configuredDirs.some((dir) => normalizedDirectoryPath.startsWith(path.normalize(dir)));

  if (!isAuthorized) {
    logger.warn(`[LOCAL_FS_INDEX][GET] Unauthorized access attempt to directory: ${directoryPath}`, { userId });
    return NextResponse.json({ success: false, error: 'Access to this directory is not allowed.' }, { status: 403 });
  }

  try {
    const allFiles = await fs.readdir(directoryPath, { withFileTypes: true, encoding: 'utf-8' });
    const files = allFiles
      .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.')) // Filter out directories and hidden files
      .map((dirent) => ({ name: dirent.name, path: path.join(directoryPath, dirent.name), type: 'file' }));

    const directories = allFiles
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.')) // Filter out files and hidden directories
      .map((dirent) => ({ name: dirent.name, path: path.join(directoryPath, dirent.name), type: 'directory' }));

    logger.info(`[LOCAL_FS_INDEX][GET] Successfully listed contents of directory: ${directoryPath}`, {
      fileCount: files.length,
      dirCount: directories.length,
      userId: userId, // Use placeholder userId
    });
    return NextResponse.json({ success: true, files, directories });
  } catch (error: unknown) {
    logger.error(`[LOCAL_FS_INDEX][GET] Error listing directory contents: ${directoryPath}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: userId, // Use placeholder userId
    });
    return NextResponse.json(
      {
        success: false,
        error: `Failed to list contents of directory: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse<LocalFileIndexResponse>> {
  const logContext: LogContextType = {
    route: '/api/orion/local-fs/index-path',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[LOCAL_FS_API][POST][START] Received request for local file system operation.', logContext);

  // Authentication check removed as per the authentication removal strategy
  // const session = await getServerSession(authConfig);
  // if (!session || !session.user || !session.user.id) {
  //   logger.warn('[LOCAL_FS_API][POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  const userId = 'unauthenticated_user'; // Placeholder userId
  logContext.userId = userId;

  try {
    const { action, filePath } = (await request.json()) as LocalFileIndexRequest;

    if (!action || !filePath) {
      logger.warn('[LOCAL_FS_API][POST][VALIDATION_FAIL] Missing action or filePath.', logContext);
      return NextResponse.json({ success: false, error: 'Action and filePath are required.' }, { status: 400 });
    }

    // Validate that the requested path is within a configured directory
    const configuredDirectories = getConfiguredDirectories();
    const isPathAllowed = configuredDirectories.some((dir) => filePath.startsWith(dir));

    if (!isPathAllowed) {
      logger.warn('[LOCAL_FS_API][POST][SECURITY_FAIL] Attempt to access disallowed path.', {
        ...logContext,
        filePath,
      });
      return NextResponse.json({ success: false, error: 'Access to this path is not allowed.' }, { status: 403 });
    }

    switch (action) {
      case 'index': {
        logger.info('[LOCAL_FS_API][INDEX][START]', { ...logContext, filePath });
        const fileContent = await fs.readFile(filePath, 'utf8');
        // Call the /api/orion/memory/index-text endpoint
        await axios.post('/api/orion/memory/index-text', {
          userId, // Pass the placeholder userId
          text: fileContent,
          sourceId: filePath,
          type: 'document',
          tags: [], // Assuming no tags for now, or derive from filePath if needed
          metadata: { filePath }, // Pass filePath as metadata
        });
        logger.success('[LOCAL_FS_API][INDEX][SUCCESS] Path indexed successfully.', { ...logContext, filePath });
        return NextResponse.json({ success: true, message: 'Path indexed successfully.' });
      }

      case 'delete': {
        logger.info('[LOCAL_FS_API][DELETE][START]', { ...logContext, filePath });
        // Call the /api/orion/memory/delete endpoint
        await axios.post('/api/orion/memory/delete', {
          userId, // Pass the placeholder userId
          sourceId: filePath, // Identify memory by sourceId
        });
        logger.success('[LOCAL_FS_API][DELETE][SUCCESS] Path deleted successfully.', { ...logContext, filePath });
        return NextResponse.json({ success: true, message: 'Path deleted successfully.' });
      }

      case 'list': {
        logger.info('[LOCAL_FS_API][LIST][START]', { ...logContext, filePath });
        const contents = await fs.readdir(filePath, { withFileTypes: true });
        const files: FilePath[] = [];
        const directories: FilePath[] = [];

        for (const dirent of contents) {
          const fullPath = path.join(filePath, dirent.name);
          if (dirent.isFile()) {
            files.push({ name: dirent.name, path: fullPath, type: 'file' });
          } else if (dirent.isDirectory()) {
            directories.push({ name: dirent.name, path: fullPath, type: 'directory' });
          }
        }

        logger.success('[LOCAL_FS_API][LIST][SUCCESS] Directory listed successfully.', { ...logContext, filePath });
        return NextResponse.json({ success: true, files, directories });
      }

      default:
        logger.warn('[LOCAL_FS_API][INVALID_ACTION] Invalid action received.', { ...logContext, action });
        return NextResponse.json({ success: false, error: 'Invalid action.' }, { status: 400 });
    }
  } catch (error: unknown) {
    logger.error('[LOCAL_FS_API][ERROR] Failed to perform local file system operation.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to perform operation.' }, { status: 500 });
  }
}
