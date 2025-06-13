// Re-export for @repo/shared/utils using the real implementation

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "../../lib/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrionSourceUrl(sourceModule?: string, referenceId?: string): string {
  if (!sourceModule || !referenceId) return '#';
  switch (sourceModule) {
    case 'Journal Reflection':
      return `/admin/journal?highlight=${referenceId}`;
    case 'Idea Incubator':
      return `/admin/idea-incubator/${referenceId}`;
    case 'Pattern Tracker':
      return `/admin/insights?highlight=${referenceId}`;
    case 'OrionOpportunity Evaluator':
      return `/admin/OrionOpportunity?highlight=${referenceId}`;
    default:
      return '/admin';
  }
}
