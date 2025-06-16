/**
 * api/orion/memory/add-memory/route.ts
 * GOAL: This API route will handle the addition of new memory entries to Orion's memory system (Qdrant).
 * It will receive text content, generate embeddings, and store them along with metadata.
 *
 * RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:
 * - This route will primarily interact with `lib/orion_memory.ts` to process and store memory.
 * - It might be called by various frontend components or n8n workflows that trigger memory indexing (e.g., from journal entries, chat analysis).
 */
