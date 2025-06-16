// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, next steps if any

export interface Persona {
  id: string;
  name: string;
  company?: string;
  role?: string;
  industry?: string;
  values?: string[];
  challenges?: string[];
  interests?: string[];
  valueProposition?: string;
  notes?: string;
  tags?: string[];
}


export interface PatternAnalysisRequest {
  userId: string;
  patterns: string[];
  tags?: string[];
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  customQuery?: string;
  types?: string[];
}

export interface IdentifiedPattern {
  id: string;
  name: string;
  description: string;
  theme?: string;
  sentiment?: string;
  supportingMemoryIds?: string[];
  actionableInsight?: string;
}
