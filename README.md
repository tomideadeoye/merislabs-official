## Canonical Enum and Type Usage (Prisma as Source of Truth)

- **All enums and types (e.g., `Opportunity`, `$Enums`, `OpportunityType`, `OpportunityPriority`, etc.) must be imported from `@/lib/types`.**
- `@/lib/types` re-exports these from Prisma, ensuring DRY, robust, and monorepo-safe imports.
- **Never import directly from `@/generated` or `@/generated/prisma` in app code.**
- **Prisma is the single source of truth for all types and enums.**
- Example:
  ```ts
  import { Opportunity, $Enums } from '@/lib/types';
  // Use $Enums.OpportunityType, $Enums.OpportunityPriority, etc.
  ```
- This ensures all code is strictly type-safe, DRY, and robust, and prevents module resolution issues in monorepo setups.
