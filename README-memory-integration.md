# Memory Integration for Orion

This integration allows the NextJS app to interact with the Qdrant memory database through a Python API.

## Setup

1. Install the required Python dependencies:

```bash
cd orion_python_backend
pip install -r requirements.txt
```

2. Start the Python API server:

```bash
cd orion_python_backend
python notion_api_server.py
```

3. Set the environment variable in your NextJS app:

```
PYTHON_API_URL=http://localhost:5002
```

## Usage in NextJS

Import the memory client in your NextJS components:

```javascript
import { searchMemory, upsertMemory, generateEmbeddings } from '@/orion_python_backend/memory_api_client';
```

### Search Memory

```javascript
const results = await searchMemory("search query", {
  must: [
    { key: "type", match: { value: "journal_entry" } }
  ]
}, 10);

if (results.success) {
  // Process results.results array
}
```

### Add Memory

```javascript
// First generate embeddings
const embedResponse = await generateEmbeddings(["Memory text content"]);

if (embedResponse.success) {
  // Then store the memory with the embedding
  const upsertResponse = await upsertMemory([{
    id: "unique-id", // Optional, will be generated if not provided
    vector: embedResponse.embeddings[0],
    payload: {
      text: "Memory text content",
      source_id: "source-id",
      timestamp: new Date().toISOString(),
      indexed_at: new Date().toISOString(),
      type: "memory_type",
      tags: ["tag1", "tag2"]
    }
  }]);
}
```

## API Endpoints

The NextJS app communicates with the Python API through these proxy endpoints:

- `/api/orion/memory/search-proxy` - Search for memory points
- `/api/orion/memory/upsert-proxy` - Add or update memory points
- `/api/orion/memory/generate-embeddings-proxy` - Generate embeddings for text

These proxy endpoints forward requests to the Python API running at `PYTHON_API_URL`.

## Memory Structure

Each memory point has the following structure:

```typescript
interface MemoryPoint {
  id: string;
  vector: number[]; // Embedding vector
  payload: {
    text: string;
    source_id: string;
    timestamp: string;
    indexed_at: string;
    type: string;
    tags?: string[];
    mood?: string;
    // Additional fields can be added as needed
  }
}
```