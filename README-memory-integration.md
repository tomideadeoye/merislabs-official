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

## Architecture

The memory integration consists of:

1. **Python API Server**: Handles communication with Qdrant
   - `/api/memory/search` - Search for memory points
   - `/api/memory/upsert` - Add or update memory points
   - `/api/memory/generate-embeddings` - Generate embeddings for text

2. **NextJS API Routes**: Proxy requests to the Python API
   - `/api/orion/memory/search-proxy`
   - `/api/orion/memory/upsert-proxy`
   - `/api/orion/memory/generate-embeddings-proxy`
   - `/api/orion/memory/index-text` - Convenience endpoint for indexing text

3. **React Components**:
   - `MemoryProvider` - Context provider for memory operations
   - `MemorySearch` - Search component
   - `MemoryInput` - Input component for adding memories
   - `JournalEntryWithMemory` - Journal entry component that uses memory

4. **React Hooks**:
   - `useMemory` - Hook for memory operations
   - `useMemoryContext` - Hook for accessing the memory context

## Usage

### In React Components

```jsx
import { useMemoryContext } from '@/components/orion/MemoryProvider';

export function MyComponent() {
  const { search, add, results, isLoading } = useMemoryContext();

  const handleSearch = async () => {
    await search('query text');
    // results will be updated automatically
  };

  const handleAdd = async () => {
    await add('Memory text', 'source-id', 'memory-type', ['tag1', 'tag2']);
  };

  return (
    <div>
      {results.map(result => (
        <div key={result.payload.source_id}>
          {result.payload.text}
        </div>
      ))}
    </div>
  );
}
```

### Direct API Calls

```javascript
// Search memory
const response = await fetch('/api/orion/memory/search-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    queryText: 'search query',
    filter: {
      must: [{ key: 'type', match: { value: 'journal_entry' } }]
    }
  })
});

// Add memory
const response = await fetch('/api/orion/memory/index-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Memory text',
    type: 'journal_entry',
    tags: ['journal', 'important']
  })
});
```

## Memory Structure

Each memory point has the following structure:

```typescript
interface MemoryPoint {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at?: string;
  type: string;
  tags?: string[];
  mood?: string;
  [key: string]: any; // Additional fields
}

interface ScoredMemoryPoint {
  score: number;
  payload: MemoryPoint;
  vector?: number[];
}
```

## Pages

- `/journal` - Journal page for writing and viewing journal entries
- `/memory-explorer` - Memory explorer for searching and adding memories