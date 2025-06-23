/**
 * @fileoverview Authentication Removal Note
 * @description This file is part of the ongoing effort to gradually remove all authentication from the Orion application.
 *   As the main barrel export for the `@/lib` package, it will simplify its exports to purely functional
 *   or type-related elements, as authentication-gated access will no longer be a concern.
 *   For detailed strategy, refer to `docs/authentication_removal_strategy.md`.
 *
 *   Original File Purpose:
 *   @fileoverview This file serves as the primary barrel export for the `@/lib` package.
 *   @description It consolidates and re-exports commonly used functions, types, constants, and components from various utility and shared library files within the `app/lib` directory and select components from `app/components`.
 *   Its main purpose is to simplify imports across the application, allowing developers to import multiple functionalities from a single, centralized `@/lib` path rather than needing direct, verbose relative paths to individual files.
 *
 *   GOAL OF FILE|FEATURES|FUNCTIONS:
 *     - To provide a single, unified import point for key shared utilities and types.
 *     - To reduce import path verbosity and complexity within the application.
 *     - To enhance code readability and maintainability by centralizing exports.
 *     - To facilitate easier refactoring by decoupling consuming files from the exact physical location of utilities and types.
 *
 *   FILEPATH: `app/lib/index.ts`
 *
 *   CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *     - `app/lib/utils/`: Re-exports core utility functions (e.g., `cn`, `getOrionSourceUrl`).
 *     - `app/lib/orion_config.ts`: Re-exports configuration constants.
 *     - `app/lib/types/index.ts`: Re-exports all core application-wide TypeScript interfaces and types.
 *     - `app/lib/logger.ts`: Re-exports the centralized logging utility.
 *     - `app/lib/apiClient.ts`: Re-exports the API client instance.
 *     - `app/hooks/useSessionState.ts`: Re-exports specific hooks for global access.
 *     - `app/opportunityCentralStore.ts`: Re-exports the main Zustand store.
 *     - `app/components/orion/opportunity-pipeline/*`: Re-exports key components related to opportunity management.
 *     - `app/components/ui/orion/*`: Re-exports select shared UI components for broader use.
 *
 *   ASSUMPTIONS & CLEAR COMMENTS:
 *     - Assumes that all re-exported files and their contents are stable and intended for broad consumption across the application.
 *     - Assumes that the exported items do not create circular dependencies.
 *     - This file should be carefully managed to prevent it from becoming overly large or ambiguous; it should only re-export truly shared and foundational elements.
 *
 *   NOTES:
 *     - This `index.ts` helps in adhering to the DRY principle by providing a single source of truth for module exports.
 *     - It is part of the strategy to simplify the monorepo import structure, especially regarding `@/lib` and shared UI components.
 *
 *   OPPORTUNITIES FOR IMPROVEMENT:
 *     - **Granular Control**: As the project grows, consider more granular barrel files within subdirectories (e.g., `app/lib/utils/index.ts`) to avoid a single, massive `index.ts` file.
 *     - **Automated Generation**: For very large projects, consider tools that can automatically generate or update barrel files based on directory contents to reduce manual maintenance.
 *     - **Type-Only Exports**: Clearly differentiate between value exports (`export * from ...`) and type-only exports (`export type { ... }`) where appropriate for better tree-shaking and bundle size optimization.
 *     - **Alias Consistency**: Ensure consistent use of `@/lib` alias throughout the application, minimizing reliance on relative paths to files within the `lib` directory.
 *
 *   OPPORTUNITIES TO CONSOLIDATE:
 *     - This file itself is a consolidation point. Continue to ensure that components and utilities that naturally belong together are grouped logically before being re-exported here.
 */

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
export * from '../components/ui/orion/opportunities/OpportunityCard';
export * from '../components/ui/orion/opportunities/OpportunityEvaluator';

// Re-export from hooks
export * from '../hooks/useSessionState';

// Re-export from stores
export * from '../opportunityCentralStore';

// Re-export other core utilities and clients
export * from './apiClient';
export * from './pythonApiService';

// Explicitly re-export types from the central type definition files
export type {
  OrionOpportunity,
  ScoredMemoryPoint,
  QdrantFilter,
  QdrantFilterCondition,
  UserProfileData,
  SortableOpportunityKeys,
} from './types';

// Add new export for CVComponent from its dedicated file
export type { CVComponent } from './types/cv';

// Utility functions
export { cn, getOrionSourceUrl } from './utils';
export { default as logger } from './logger';

// App State & Constants
// export { PageNames, SessionStateKeys } from './app_constants'; // Removed due to 'export * from' above

// Emotions
