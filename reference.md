# Orion Project Reference

## Current Fixes/Refactors in Progress

### Import Path and Type Canonicalization (2024-06-12)
- [x] packages/shared/src/opportunityCentralStore.ts: Fixed import path for OrionOpportunity/OpportunityDetails to use '../types/OrionOpportunity'. Why: Unifies type usage, resolves TS2307 errors, enables correct type-checking across monorepo.
- [ ] Global: Begin replacing all @repo/sharedlib imports with @repo/shared in all app, api, and component files. Why: Canonicalizes shared code usage, resolves module not found errors, and aligns with monorepo best practices.

## Centralized Logging System
**File:** [`lib/logger.ts`](lib/logger.ts)
**Features:**
- Winston-based production logging
- Color-coded console output for development
- Context-aware logging (API, components, state)
- Multiple transport layers (console, file)
- Type-safe log levels (debug, info, warn, error, success)

**Dependencies Added:**
- winston
- @types/uuid
- node-fetch
- @types/node-fetch

**Key Components:**
- Singleton Logger class
- Log context formatting
- Production error handling
- Specialized logging methods (API, component, state)

## Canonical UI Component Source
- All UI components (Button, Badge, Input, etc.) must be imported from the canonical shadcn/ui-compatible implementations in:
  - `packages/ui/src/components/ui/`

## Import Pattern
- Use barrel exports from `@repo/ui` for all UI components:
  ```ts
  import { Button, Badge, Input, Loader, Progress, Checkbox, Avatar, Label, Tabs, Command, ScrollArea } from '@repo/ui';
  ```
- The `cn` utility must be imported from `@repo/ui` or `../../lib/utils` if not barrel-exported.

## Deleted Legacy Locations
- All legacy UI components in the following locations have been deleted to prevent conflicts:
  - `components/ui/`
  - `packages/shared/hooks/components/ui/`

## Why?
- This unifies the UI layer, eliminates prop/type errors, and ensures shadcn/ui compatibility across the monorepo.
- Only the canonical implementations in `packages/ui/src/components/ui/` are supported.

## One-liner Summary
> All UI components must be imported from `@repo/ui` (shadcn/ui-compatible, canonical). Legacy UI files are deleted. This ensures a single source of truth and eliminates all prop/type errors.

---

## Open Questions & Next Steps for Contributors

Please help guide the next phase of development by answering or updating the following:

1. **What is the intended functionality for each stubbed module?**
   (If you have requirements, please specify for each.)

2. **Are there any priority modules that should be implemented first?**

3. **What are the most critical edge cases or failure scenarios to test for each module?**

4. **Should we add integration tests for modules that interact with external services (e.g., email, LLM providers)?**

5. **Are there any architectural or design patterns you want enforced across all shared modules?**

---

**What would you like to focus on next?**
- Implementing a specific module?
- Improving documentation?
- Reviewing reference.md for missing features?
- Something else?

Your input will help determine the most valuable next step for the project.

## [2024-06-12] Barrel Export Fixes
- [x] Exported logger, email_service, and cv from packages/shared/src/index.ts. Why: Enables all app and UI code to import these modules via '@repo/shared/logger', '@repo/shared/email_service', and '@repo/shared/cv', resolving module not found errors and ensuring monorepo-wide type safety.
- [x] Added 'exports' field to packages/shared/package.json, mapping all key submodules (logger, email_service, cv, orion_config, profile_service, memory, apiClient) for monorepo-wide import resolution. Why: Ensures all submodules are resolvable via '@repo/shared/...', fixing module not found errors in app and UI code.
- [x] Expanded 'exports' field to include all referenced submodules and types (utils, notion_next_service, notion_service, narrative_service, database, pdf-generator, cbt_constants, persona_service, opportunityCentralStore, and all types). Why: Ensures all imports like '@repo/shared/utils' resolve correctly across the monorepo, further reducing module not found errors.

## [2024-06-12] Type Canonicalization
- [x] Unified and canonically exported PersonaMap, CVComponent, and NavItem types in packages/shared/src/index.ts. Why: Ensures all app and UI code can import these types from a single, canonical source, eliminating ambiguity and type errors.
- [x] Redefined PersonaMap as a single Persona object (not an array) in both .d.ts and .ts files. All array usages in app code should use Persona[].
- [x] Deleted the minimal NavItem definition in packages/shared/types/nav.d.ts. All code now uses the richer NavItem from src/types/nav.ts.
- [x] Unified CVComponent to match the canonical version in lib/cv.ts and removed the redundant/conflicting definition in orion.d.ts. All code now uses the canonical CVComponent interface.

## [2024-06-12] Observations & File Path Map

### Observations
- The codebase is now converging on canonical type and component imports, with all major types (e.g., OrionOpportunity, Persona, CVComponent) and UI elements imported from a single source of truth.
- All UI components must be imported from `@repo/ui` (shadcn/ui-compatible, canonical). Legacy UI files are deleted. This ensures a single source of truth and eliminates all prop/type errors.
- Shared logic, state, and types are centralized in `packages/shared/src/` and `packages/shared/src/types/`.
- Admin dashboard features are modularized under `apps/nextjs/app/(orion_admin)/admin/`, with each feature in its own folder.
- OrionOpportunity pipeline, memory management, and communication features are distributed across both `apps/nextjs/components/orion/` and `packages/ui/src/components/orion/opportunities/`.
- All state management is moving toward a unified, composable, slice-based central store in `packages/shared/src/opportunityCentralStore.ts`.

### File Path Map (Key Features & Components)

#### Admin Dashboard (Next.js App)
- `apps/nextjs/app/(orion_admin)/admin/` — All admin dashboard features (OrionOpportunity pipeline, memory manager, routines, communication, etc.)
  - `OrionOpportunity-pipeline/` — OrionOpportunity pipeline dashboard and kanban
  - `memory-manager/` — Memory management UI
  - `draft-communication/` — Drafting emails, WhatsApp, LinkedIn messages
  - `habitica/`, `routines/`, `system-settings/`, etc. — Modular admin features

#### Orion Core Components (App)
- `apps/nextjs/components/orion/` — Core Orion features (journal, memory, ideas, persona, WhatsApp, etc.)
  - `opportunities/` — OrionOpportunity-related forms, dialogs, and views
  - `tasks/`, `cbt/`, `notion/`, `persona/`, `routines/`, `pipeline/` — Modular feature folders
  - `QuadrantMemoryChunksVisualizer.tsx` — Visualizer for memory chunks
  - `DedicatedAddToMemoryFormComponent.tsx` — Add-to-memory UI
  - `WhatsAppReplyDrafter.tsx` — WhatsApp reply drafting

#### UI Components (Canonical, Shadcn-Compatible)
- `packages/ui/src/components/ui/` — All canonical UI components (Button, Badge, Input, Loader, ProgressBar, etc.)
- `packages/ui/src/components/orion/opportunities/` — OrionOpportunity pipeline UI (Kanban, DetailView, Filters, etc.)

#### Shared Logic, State, and Types
- `packages/shared/src/` — Shared logic, state, and utility functions
  - `opportunityCentralStore.ts` — Centralized Zustand store for opportunities
  - `lib/` — Shared services (logger, email, database, LLM, etc.)
  - `types/` — Canonical type definitions (OrionOpportunity, persona, nav, etc.)

#### Key Shared Services
- `packages/shared/src/lib/logger.ts` — Centralized logger utility
- `packages/shared/src/lib/email_service.ts` — Email sending service
- `packages/shared/src/lib/orion_llm.ts` — LLM integration logic
- `packages/shared/src/lib/orion_memory.ts` — Memory management logic

#### State Management
- All state is moving toward a unified, composable, slice-based central store in `packages/shared/src/opportunityCentralStore.ts`.

#### Memory/Knowledge Management
- `QuadrantMemoryChunksVisualizer.tsx` (apps/nextjs/components/orion/) — Visualizes memory chunks
- `DedicatedAddToMemoryFormComponent.tsx` (apps/nextjs/components/orion/) — Add-to-memory UI
- `memory-manager/` (apps/nextjs/app/(orion_admin)/admin/) — Admin memory management UI

#### Communication/Drafting
- `draft-communication/` (apps/nextjs/app/(orion_admin)/admin/) — Drafting emails, WhatsApp, LinkedIn
- `WhatsAppReplyDrafter.tsx` (apps/nextjs/components/orion/) — WhatsApp reply drafting

#### OrionOpportunity Pipeline
- `OrionOpportunity-pipeline/` (apps/nextjs/app/(orion_admin)/admin/) — Admin OrionOpportunity pipeline dashboard
- `OpportunityKanbanView.tsx`, `OpportunityDetailView.tsx`, `OpportunityFilters.tsx` (packages/ui/src/components/orion/opportunities/) — UI for OrionOpportunity pipeline

#### Persona/CBT/Journal
- `PersonaForm.tsx`, `persona/` (apps/nextjs/components/orion/) — Persona management
- `cbt/` (apps/nextjs/components/orion/) — CBT tools
- `JournalEntryForm.tsx`, `JournalList.tsx` (apps/nextjs/components/orion/) — Journaling

---

> This map is a living document. Update as new features, refactors, or architectural changes are made. Add new feature/component paths as they are implemented.

---

## Next Steps (Immediate)
1. **Resolve All TypeScript Errors:**
   - Continue systematically fixing all remaining TS errors (type import/export, path issues, implicit any, prop mismatches, duplicate/conflicting declarations).
   - Prioritize canonical imports and single sources of truth for all types, state, and UI components.
2. **Unify State Management:**
   - Complete migration to a single, composable, slice-based Zustand store in `packages/shared/src/opportunityCentralStore.ts`.
   - Remove legacy or redundant state stores.
3. **Fix Path Imports:**
   - Update all `@/components/...` and `@/types/...` imports to canonical monorepo paths (`@repo/shared`, `@repo/ui`, etc.).
4. **Document All Features:**
   - Ensure every major feature/component is mapped in this file and described in prd.md.
   - Add one-liner summaries and file paths for new features as they are implemented.
5. **Automate Testing:**
   - Expand end-to-end and integration tests, especially for OrionOpportunity pipeline, memory manager, and communication features.
6. **Continuous Refactoring:**
   - Remove dead code, consolidate duplicate logic, and enforce best practices (see start.sh and prd.md for standards).

## Long-Term Plan (Vision)
- **Feature Completeness:**
  - Implement all features described in start.sh and prd.md, including OrionOpportunity pipeline automation, memory/knowledge management, communication drafting, journaling, and business management.
  - Ensure every feature is production-ready, robust, and fully integrated with the central state and UI.
- **Unified State & Data:**
  - All state managed via a single, composable Zustand store.
  - All data (opportunities, memory, personas, etc.) unified in Neon DB and/or Notion, with robust syncing and caching.
- **Best-in-Class UI/UX:**
  - All UI components are shadcn/ui-compatible, fun, engaging, and visually consistent.
  - Add visualizations, gamification, and progress feedback throughout the admin dashboard.
- **Automation & AI:**
  - Automate OrionOpportunity outreach, CV tailoring, and communication drafting using LLMs and browser automation.
  - Integrate with external services (email, WhatsApp, LinkedIn, Google Calendar, etc.) for seamless workflow.
- **Robust Logging & Observability:**
  - All operations logged with context-rich, level-based logging (see logger utility).
  - Add monitoring and error reporting for all critical flows.
- **Continuous Improvement:**
  - Regularly review and refactor code for maintainability, performance, and security.
  - Update this reference and prd.md as features evolve.
  - Foster a culture of rapid self-improvement, feedback, and architectural clarity.
- **Documentation & Onboarding:**
  - Keep this file, prd.md, and README up to date with all features, file paths, and architectural decisions.
  - Make onboarding new contributors seamless with clear maps, standards, and examples.

> The goal: Orion becomes the primary tool for life planning, reflection, decision support, and business/task management—engaging, reliable, and always improving.

## Error Fixing Roadmap (2024-06-12)

### Top Remaining Error Classes
1. **Type Import/Export Issues:**
   - Duplicate/conflicting exports in `packages/shared/src/index.ts`.
   - Canonical type usage for all domain types (e.g., OrionOpportunity, Persona, CVComponent, etc.).
2. **Path Import Errors:**
   - `@/components/...` and `@/types/...` imports need to be updated to canonical monorepo paths (`@repo/shared`, `@repo/ui`, etc.).
3. **Implicit `any` Types:**
   - Add explicit types to all function parameters currently typed as `any` (especially in React components and stores).
4. **Component/Store Import Errors:**
   - Ensure all referenced components and stores exist and are exported from their respective packages.
5. **Props/Type Mismatches:**
   - Update component props to match their type definitions (especially for shadcn/ui components).
6. **Duplicate/Conflicting Declarations:**
   - Remove or refactor duplicate exports in files like `orion_llm.ts` and `llm_providers.ts`.

### Most Affected Files/Directories
- `packages/shared/src/index.ts` (type exports)
- `apps/nextjs/components/orion/` (core feature components)
- `packages/ui/src/components/orion/opportunities/` (OrionOpportunity pipeline UI)
- `packages/shared/src/lib/` (shared services, LLM, logger, etc.)
- `apps/nextjs/app/(orion_admin)/admin/` (admin dashboard features)

### Prioritized Plan for Error Fixing
1. **Clean up duplicate/conflicting exports in `packages/shared/src/index.ts`.**
2. **Update all path imports to canonical monorepo paths.**
3. **Add explicit types for all function parameters with implicit `any`.**
4. **Fix missing/misnamed component and store imports.**
5. **Align all component props with their type definitions.**
6. **Remove/refactor duplicate declarations in shared logic files.**
7. **Re-run type-check after each batch of fixes and update this roadmap.**

> Track progress here as errors are resolved. Remove completed items and add new error classes as they are discovered.
