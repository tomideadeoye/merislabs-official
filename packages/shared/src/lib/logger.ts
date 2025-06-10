// Simple logger utility for consistent logging across the application
const logger = {
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${message}`, data || '');
  },
  success: (message: string, data?: any) => {
    console.info(`[SUCCESS] ${message}`, data || '');
  }
};

export { logger };