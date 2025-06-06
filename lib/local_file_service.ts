/**
 * Local file system service
 * Provides secure access to local files within configured directories
 */

import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from './orion_config';
import fs from 'fs/promises';
import path from 'path';

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
}

interface FileMetadata {
  name: string;
  size: number;
  modified: Date;
  created: Date;
}

export function isPathWithinConfiguredDirectories(filePath: string): boolean {
  const normalizedFilePath = path.normalize(filePath);
  return ORION_ACCESSIBLE_LOCAL_DIRECTORIES.some(allowedDir => {
    const normalizedAllowedDir = path.normalize(allowedDir);
    return normalizedFilePath.startsWith(normalizedAllowedDir);
  });
}

export async function listDirectoryContents(directoryPath: string): Promise<FileSystemItem[]> {
  if (!isPathWithinConfiguredDirectories(directoryPath)) {
    throw new Error(`Access denied: Path '${directoryPath}' is not within configured accessible directories`);
  }

  const items = await fs.readdir(directoryPath, { withFileTypes: true });
  return items.map(item => ({
    name: item.name,
    type: item.isDirectory() ? 'directory' : 'file',
    path: path.join(directoryPath, item.name)
  }));
}

export async function readFileContent(filePath: string): Promise<string> {
  if (!isPathWithinConfiguredDirectories(filePath)) {
    throw new Error(`Access denied: Path '${filePath}' is not within configured accessible directories`);
  }

  const extension = path.extname(filePath).toLowerCase();
  const allowedExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css', '.csv'];

  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file type for reading content: ${extension}`);
  }

  return fs.readFile(filePath, 'utf-8');
}

export async function getFileMetadata(filePath: string): Promise<FileMetadata> {
  if (!isPathWithinConfiguredDirectories(filePath)) {
    throw new Error(`Access denied: Path '${filePath}' is not within configured accessible directories`);
  }

  const stats = await fs.stat(filePath);
  return {
    name: path.basename(filePath),
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime
  };
}
