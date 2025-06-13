/**
 * Local file system service
 * Provides secure access to local files within configured directories
 */

import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from './orion_config';

let fsImpl: typeof import('fs/promises') | undefined;
let pathImpl: typeof import('path') | undefined;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  fsImpl = require('fs/promises');
  pathImpl = require('path');
} else {
  // Stubs for non-Node environments
  fsImpl = {
    readdir: async () => { throw new Error('fs.readdir is not available in this environment.'); },
    readFile: async () => { throw new Error('fs.readFile is not available in this environment.'); },
    stat: async () => { throw new Error('fs.stat is not available in this environment.'); }
  } as any;
  pathImpl = { normalize: (p: string) => p, extname: () => '', basename: () => '', join: (...args: string[]) => args.join('/'), } as any;
}

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

function getFsImpl() {
  if (!fsImpl) throw new Error('fsImpl is not available in this environment.');
  return fsImpl;
}
function getPathImpl() {
  if (!pathImpl) throw new Error('pathImpl is not available in this environment.');
  return pathImpl;
}

export function isPathWithinConfiguredDirectories(filePath: string): boolean {
  const pathImpl = getPathImpl();
  const normalizedFilePath = pathImpl.normalize(filePath);
  return ORION_ACCESSIBLE_LOCAL_DIRECTORIES.some(allowedDir => {
    const normalizedAllowedDir = pathImpl.normalize(allowedDir);
    return normalizedFilePath.startsWith(normalizedAllowedDir);
  });
}

export async function listDirectoryContents(directoryPath: string): Promise<FileSystemItem[]> {
  const pathImpl = getPathImpl();
  const fsImpl = getFsImpl();
  if (!isPathWithinConfiguredDirectories(directoryPath)) {
    throw new Error(`Access denied: Path '${directoryPath}' is not within configured accessible directories`);
  }
  const items = await fsImpl.readdir(directoryPath, { withFileTypes: true });
  return items.map(item => ({
    name: item.name,
    type: item.isDirectory() ? 'directory' : 'file',
    path: pathImpl.join(directoryPath, item.name)
  }));
}

export async function readFileContent(filePath: string): Promise<string> {
  const pathImpl = getPathImpl();
  const fsImpl = getFsImpl();
  if (!isPathWithinConfiguredDirectories(filePath)) {
    throw new Error(`Access denied: Path '${filePath}' is not within configured accessible directories`);
  }
  const extension = pathImpl.extname(filePath).toLowerCase();
  const allowedExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.py', '.html', '.css', '.csv'];
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file type for reading content: ${extension}`);
  }
  return fsImpl.readFile(filePath, 'utf-8');
}

export async function getFileMetadata(filePath: string): Promise<FileMetadata> {
  const pathImpl = getPathImpl();
  const fsImpl = getFsImpl();
  if (!isPathWithinConfiguredDirectories(filePath)) {
    throw new Error(`Access denied: Path '${filePath}' is not within configured accessible directories`);
  }
  const stats = await fsImpl.stat(filePath);
  return {
    name: pathImpl.basename(filePath),
    size: stats.size,
    modified: stats.mtime,
    created: stats.birthtime
  };
}
