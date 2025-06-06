# Orion Memory API (Next.js)

## POST `/api/orion/memory/index-text`

Indexes a text string into Qdrant memory using OpenAI embeddings.

### Request Body
```json
{
  "text": "My journal entry...",
  "type": "journal",
  "tags": ["reflection", "cbt"],
  "sourceId": "optional-custom-id",
  "additionalFields": { "mood": "happy" }
}
```
- `text` (string, required): The text to index.
- `type` (string, required): The type/category of memory (e.g., journal, cv, note).
- `tags` (string[], optional): Tags for filtering/searching.
- `sourceId` (string, optional): Custom ID (default: uuid).
- `additionalFields` (object, optional): Any extra metadata.

### Response
```json
{ "success": true, "memoryId": "..." }
```

### Errors
- 400: Text/type required
- 500: Embedding or Qdrant error

---

## POST `/api/orion/memory/search`

Searches Qdrant memory for relevant content using semantic similarity.

### Request Body
```json
{
  "query": "What did I write about resilience?",
  "limit": 5,
  "filter": { "must": [{ "key": "type", "match": { "value": "journal" } }] },
  "minScore": 0.7
}
```
- `query` (string, required): The search query.
- `limit` (number, optional): Max results (default: 5).
- `filter` (object, optional): Qdrant filter (see types/orion.d.ts).
- `minScore` (number, optional): Minimum similarity score (default: 0.7).

### Response
```json
{
  "success": true,
  "results": [
    { "score": 0.92, "payload": { "text": "...", "type": "journal", ... } }
  ],
  "query": "..."
}
```

### Errors
- 400: Query required
- 500: Embedding or Qdrant error

---

## Notes
- Embedding is performed using OpenAI's `text-embedding-ada-002` model.
- Qdrant is accessed directly from Next.js using `@qdrant/js-client-rest`.
- All endpoints return clear error messages and log input/output for debugging.

---

## Example Usage (Jest)
```ts
test('should index text memory', async () => {
  const res = await fetch('/api/orion/memory/index-text', {
    method: 'POST',
    body: JSON.stringify({
      text: 'Test about CV tailoring',
      type: 'CV',
      tags: ['cv', 'prompt']
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  expect(json.success).toBe(true);
});
```
