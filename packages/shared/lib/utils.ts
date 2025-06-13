import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
