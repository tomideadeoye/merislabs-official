// Goal: Re-export the real orion_config implementation for @repo/shared/orion_config consumers.
// This file connects all code using the sharedlib alias to the actual implementation in packages/shared/lib/orion_config.ts.
// Related files: packages/shared/lib/orion_config.ts, all files importing @repo/shared/orion_config.

export * from "../../lib/orion_config";
