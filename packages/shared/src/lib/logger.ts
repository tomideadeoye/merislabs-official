// Client-side logger stub for @repo/shared/logger
// This file is safe to import in any client/shared code.

export const logger = {
  debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
  info: (...args: any[]) => console.info('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  success: (...args: any[]) => console.log('[SUCCESS]', ...args),
};
