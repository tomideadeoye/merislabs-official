import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { promises as fs } from 'fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a given path is a directory.
 * This function is designed to work only in Node.js environments.
 * @param {string} pathString The path to check.
 * @returns {Promise<boolean>} True if the path is a directory, false otherwise.
 */
export async function isDirectory(pathString: string): Promise<boolean> {
  try {
    const stats = await fs.stat(pathString);
    return stats.isDirectory();
  } catch {
    // If path does not exist or is inaccessible, it's not a directory
    return false;
  }
}

/**
 * @function getOrionSourceUrl
 * @description Generates a URL to the source of a task within the Orion system.
 * @param sourceModule The module or feature where the task originated (e.g., "Journal Reflection").
 * @param referenceId A unique identifier for the specific task or item within the source module.
 */
/**
 * Generate a URL to the source of a task in Orion
 */
export function getOrionSourceUrl(sourceModule?: string, referenceId?: string): string {
  if (!sourceModule || !referenceId) return '#'; // Default if no origin

  switch (sourceModule) {
    case 'Journal Reflection':
      // Link to the journal page, maybe with a query param to highlight/scroll to it
      return `/admin/journal?highlight=${referenceId}`;

    case 'Idea Incubator':
      return `/admin/idea-incubator/${referenceId}`;

    case 'Pattern Tracker':
      // Link to pattern tracker, maybe with query to highlight the insight
      return `/admin/insights?highlight=${referenceId}`;

    case 'OrionOpportunity Evaluator':
      // Link to OrionOpportunity evaluator, maybe with query to highlight the OrionOpportunity
      return `/admin/OrionOpportunity?highlight=${referenceId}`;

    default:
      return '/admin'; // Fallback
  }
}
