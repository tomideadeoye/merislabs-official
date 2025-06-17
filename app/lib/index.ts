// This file acts as the main public export for the @/lib package.
// It should re-export from more specific lib files.

// For now, let's export from a few key files to resolve errors.
export * from './utils';
export * from './orion_config';
export * from './types';

// Re-export from components
export * from '../components/orion/opportunity-pipeline/OpportunityKanbanView';
export * from '../components/orion/opportunity-pipeline/StatusUpdateButton';
export * from '../components/ui/orion/DraftCommunicationForm';
export * from '../components/orion/opportunity-pipeline/OpportunityCard';
export * from '../components/orion/opportunity-pipeline/OpportunityEvaluator';

// Re-export from hooks
export * from '../hooks/useSessionState';

// Re-export from stores
export * from '../opportunityCentralStore';

// Re-export other core utilities and clients
export * from './apiClient';

// Explicitly re-export types from the central type definition files
export type {
  OrionOpportunity,
  CVComponent,
  ScoredMemoryPoint,
  QdrantFilter,
  QdrantFilterCondition,
  UserProfileData,
  SortableOpportunityKeys,
} from './types';

// Utility functions
export { cn, getOrionSourceUrl } from './utils';
export { default as logger } from './logger';

// App State & Constants
// export { PageNames, SessionStateKeys } from './app_constants'; // Removed due to 'export * from' above

// Emotions
