import { getConfiguredDirectories } from '@/lib/orion_config';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import logger from '@/lib/logger';
import { LocalFileIndexRequest } from '@/lib/types';
import path from 'path';
import { promises as fs } from 'fs';

// Dummy function for now, replace with actual indexing logic later
async function indexFilePath(filePath: string) {
  logger.info(`[LOCAL_FS_INDEX] Indexing placeholder for: ${filePath}`);
  // TODO: Implement actual vector embedding and Qdrant storage for file content
  return { success: true, message: `Successfully indexed (placeholder) ${filePath}` };
}

// Dummy function for now, replace with actual deletion logic later
async function deleteFilePath(filePath: string) {
  logger.info(`[LOCAL_FS_INDEX] Deleting placeholder for: ${filePath}`);
  // TODO: Implement actual deletion from Qdrant
  return { success: true, message: `Successfully deleted (placeholder) ${filePath}` };
}

// Dummy function for now, replace with actual listing logic later
async function listIndexedPaths(): Promise<string[]> {
  logger.info(`[LOCAL_FS_INDEX] Listing indexed paths (placeholder).`);
  // TODO: Implement actual listing from Qdrant
  return [];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const directoryPath = searchParams.get('path');

  if (!directoryPath) {
    return NextResponse.json({ success: false, error: 'Directory path is required.' }, { status: 400 });
  }

  const configuredDirs = getConfiguredDirectories();
  const normalizedDirectoryPath = path.normalize(directoryPath);

  const isAuthorized = configuredDirs.some((dir) => normalizedDirectoryPath.startsWith(path.normalize(dir)));

  if (!isAuthorized) {
    logger.warn(`[LOCAL_FS_INDEX][GET] Unauthorized access attempt to directory: ${directoryPath}`, {
      userId: session.user.id,
    });
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
      userId: session.user.id,
    });
    return NextResponse.json({ success: true, files, directories });
  } catch (error: unknown) {
    logger.error(`[LOCAL_FS_INDEX][GET] Error listing directory contents: ${directoryPath}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: session.user.id,
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: LocalFileIndexRequest = await request.json();
    const { action, filePath } = body;

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'File path is required for indexing action.' },
        { status: 400 }
      );
    }

    const configuredDirs = getConfiguredDirectories();
    const normalizedFilePath = path.normalize(filePath);

    const isAuthorized = configuredDirs.some((dir) => normalizedFilePath.startsWith(path.normalize(dir)));

    if (!isAuthorized) {
      logger.warn(`[LOCAL_FS_INDEX][POST] Unauthorized indexing attempt for path: ${filePath}`, {
        userId: session.user.id,
      });
      return NextResponse.json(
        { success: false, error: 'Access to this file path is not allowed for indexing.' },
        { status: 403 }
      );
    }

    switch (action) {
      case 'index': {
        // Check if path exists and is a file
        let stats;
        try {
          stats = await fs.stat(filePath);
        } catch (e) {
          logger.error(`[LOCAL_FS_INDEX][POST] Path does not exist or is inaccessible: ${filePath}`, { error: e });
          return NextResponse.json(
            { success: false, error: 'Path does not exist or is inaccessible.' },
            { status: 404 }
          );
        }

        if (!stats.isFile()) {
          logger.warn(`[LOCAL_FS_INDEX][POST] Cannot index: Path is not a file: ${filePath}`);
          return NextResponse.json({ success: false, error: 'Only files can be indexed.' }, { status: 400 });
        }

        const result = await indexFilePath(filePath);
        if (result.success) {
          logger.info(`[LOCAL_FS_INDEX][POST] Successfully initiated indexing for file: ${filePath}`, {
            userId: session.user.id,
          });
          return NextResponse.json({ success: true, message: result.message });
        } else {
          logger.error(`[LOCAL_FS_INDEX][POST] Failed to initiate indexing for file: ${filePath}`, {
            error: result.message,
            userId: session.user.id,
          });
          return NextResponse.json({ success: false, error: result.message }, { status: 500 });
        }
      }
      case 'delete': {
        const result = await deleteFilePath(filePath);
        if (result.success) {
          logger.info(`[LOCAL_FS_INDEX][POST] Successfully initiated deletion for file: ${filePath}`, {
            userId: session.user.id,
          });
          return NextResponse.json({ success: true, message: result.message });
        } else {
          logger.error(`[LOCAL_FS_INDEX][POST] Failed to initiate deletion for file: ${filePath}`, {
            error: result.message,
            userId: session.user.id,
          });
          return NextResponse.json({ success: false, error: result.message }, { status: 500 });
        }
      }
      case 'list': {
        const indexedPaths = await listIndexedPaths();
        logger.info(`[LOCAL_FS_INDEX][POST] Successfully listed indexed paths.`, {
          count: indexedPaths.length,
          userId: session.user.id,
        });
        return NextResponse.json({ success: true, indexedPaths });
      }
      default:
        logger.warn(`[LOCAL_FS_INDEX][POST] Unknown action: ${action}`, { userId: session.user.id });
        return NextResponse.json({ success: false, error: 'Unknown action.' }, { status: 400 });
    }
  } catch (error: unknown) {
    logger.error('[LOCAL_FS_INDEX][POST] Unexpected error during file system operation:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: session.user.id,
    });
    return NextResponse.json(
      {
        success: false,
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
