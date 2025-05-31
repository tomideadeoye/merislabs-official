/**
 * Types for the Pattern Tracker / Insight Linker feature
 */

export interface IdentifiedPattern {
  theme: string;
  description: string;
  supportingMemoryIds: string[];
  sentiment?: string;
  actionableInsight?: string;
}

export interface PatternAnalysisRequest {
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  types?: string[];
  customQuery?: string;
}