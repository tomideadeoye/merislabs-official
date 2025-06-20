/**
 * Local file system service
 * Provides secure access to local files within configured directories
 */

import { ORION_ACCESSIBLE_LOCAL_DIRECTORIES } from './orion_config';

interface MinimalFsPromises {
  readdir: typeof import('fs/promises').readdir;
  readFile: typeof import('fs/promises').readFile;
  stat: typeof import('fs/promises').stat;
}

interface MinimalPath {
  normalize: typeof import('path').normalize;
  extname: typeof import('path').extname;
  basename: typeof import('path').basename;
  join: typeof import('path').join;
}

let fsImpl: MinimalFsPromises | null = null;
let pathImpl: MinimalPath | null = null;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
  (async () => {
    try {
      const fsPromises = await import('fs/promises');
      const path = await import('path');
      fsImpl = {
        readdir: fsPromises.readdir,
        readFile: fsPromises.readFile,
        stat: fsPromises.stat,
      };
      pathImpl = {
        normalize: path.normalize,
        extname: path.extname,
        basename: path.basename,
        join: path.join,
      };
    } catch (e) {
      console.error('Failed to load Node.js modules for local file service:', e);
      // Fallback to stubs if loading fails in a Node.js environment (e.g., during testing in a mocked env)
      fsImpl = {
        readdir: async () => {
          throw new Error('fs.readdir is not available in this environment.');
        },
        readFile: async () => {
          throw new Error('fs.readFile is not available in this environment.');
        },
        stat: async () => {
          throw new Error('fs.stat is not available in this environment.');
        },
      } as MinimalFsPromises; // Cast to MinimalFsPromises
      pathImpl = {
        normalize: (p: string) => p,
        extname: () => '',
        basename: () => '',
        join: (...args: string[]) => args.join('/'),
      } as MinimalPath; // Cast to MinimalPath
    }
  })();
} else {
  // Stubs for non-Node environments
  fsImpl = {
    readdir: async () => {
      throw new Error('fs.readdir is not available in this environment.');
    },
    readFile: async () => {
      throw new Error('fs.readFile is not available in this environment.');
    },
    stat: async () => {
      throw new Error('fs.stat is not available in this environment.');
    },
  } as MinimalFsPromises; // Explicit cast to match expected type using MinimalFsPromises
  pathImpl = {
    normalize: (p: string) => p,
    extname: () => '',
    basename: () => '',
    join: (...args: string[]) => args.join('/'),
  } as MinimalPath; // Explicit cast to match expected type using MinimalPath
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

function getFsImpl(): MinimalFsPromises {
  if (!fsImpl) throw new Error('fsImpl is not available or not yet loaded.');
  return fsImpl; // No cast needed, type matches
}
function getPathImpl(): MinimalPath {
  if (!pathImpl) throw new Error('pathImpl is not available or not yet loaded.');
  return pathImpl; // No cast needed, type matches
}

export function isPathWithinConfiguredDirectories(filePath: string): boolean {
  const pathImpl = getPathImpl();
  const normalizedFilePath = pathImpl.normalize(filePath);
  return ORION_ACCESSIBLE_LOCAL_DIRECTORIES.some((allowedDir) => {
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
  return items.map((item) => ({
    name: item.name,
    type: item.isDirectory() ? 'directory' : 'file',
    path: pathImpl.join(directoryPath, item.name),
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
    created: stats.birthtime,
  };
}
