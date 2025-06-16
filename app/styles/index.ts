// GOAL: To provide a central point for style-related exports.
// Currently used to export the logger, which might be better placed in lib.

// Re-exporting logger from its actual location
export { default as logger } from '../lib/logger';

// Exporting types from their actual location
export * from '../types';
