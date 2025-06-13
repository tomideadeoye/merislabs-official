# Meris Labs Monorepo

## Monorepo Structure (Best Practice)

```
merislabs-official/
  apps/
    nextjs/                  # Next.js app
    orion_chrome_extension/  # Chrome extension (future)
    orion_mobile_app/        # Mobile app (future)
  packages/
    orion_python_backend/    # Python backend
    orion_mcps/              # Microservices/plugins (future)
    shared/                  # Shared code (future)
  package.json               # Root (monorepo-wide tools/scripts)
  pnpm-workspace.yaml        # Monorepo workspace config
  README.md
  .gitignore
```

- **apps/**: User-facing apps (web, mobile, extension)
- **packages/**: Backends, microservices, shared code

## Adding a New Project
- Add a new folder to `apps/` (for apps) or `packages/` (for backends, shared, or microservices).
- Update `pnpm-workspace.yaml` if needed (should already include all `apps/*` and `packages/*`).
- Each project manages its own dependencies and config.

## Running Projects
- Next.js app: `cd apps/nextjs && pnpm dev`
- Python backend: `cd packages/orion_python_backend && python orion_api.py`

## Best Practices
- Keep each project self-contained.
- Use `packages/shared/` for shared code.
- Update this README and workspace config when adding new projects.

# Meris Labs Official

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/merislabs-official.git
cd merislabs-official
```

2. Install JavaScript dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
cd orion_python_backend
pip install -r requirements.txt
cd ..
```

### Starting the System

#### Option 1: Using the start script

For Unix/Linux/macOS:
```bash
npm run start-orion
```

For Windows:
```bash
npm run start-orion-win
```

This will:
- Start the Qdrant database in Docker
- Start the Python API server
- Provide instructions for accessing the system

#### Option 2: Manual startup

1. Start Qdrant database:
```bash
docker run -d --name qdrant_db -p 6333:6333 -p 6334:6334 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
```

2. Start Python API server:
```bash
cd orion_python_backend
python notion_api_server.py
```

3. Start Next.js development server:
```bash
npm run dev
```

### Accessing the System

- Web interface: http://localhost:3000
- Journal: http://localhost:3000/journal
- Memory Explorer: http://localhost:3000/memory-explorer

## Features

- Journal entries with memory integration
- Memory search and exploration
- OrionOpportunity evaluation

## Documentation

For more detailed information about the memory integration, see [README-memory-integration.md](README-memory-integration.md).

## Logging & Observability

Orion implements full-stack, structured logging for all components:

- **Python API**: Logs to `orion_python_backend/api_server.log` in JSON format, with PII redaction and correlation IDs.
- **Next.js API**: Logs to `api_server.log` in the project root, using Pino for structured logs and redaction.
- **Frontend**: Logs user actions, errors, and component lifecycle events. In production, logs are sent to `/api/log` and appended to `api_server.log`.

### Log File Location
- All logs are stored in `api_server.log` (project root or `orion_python_backend/`).

### Log Format
- JSON lines (one log entry per line), including timestamp, level, message, context, and correlation/session IDs.

### Viewing Logs
- Use `cat`, `less`, or any log viewer to inspect `api_server.log`.
- For advanced analysis, import the log file into Grafana, Kibana, or similar tools.


We are upgrading the "Application" tab to show real, multi-draft cards with context and modal editing—no mocks, only live data.
Draft application API now returns all context (profile, memories, web) for full transparency in the UI.
The Application tab now shows real, editable, context-transparent draft cards—no mocks, only live data, and all linter errors are fixed.

## Testing

- As of now, there is no global E2E test file found in the repo. It is recommended to create `tests/e2e.test.tsx` at the project root for all end-to-end tests, as per project standards. This will help future contributors know where to add E2E tests for features like the CognitiveDistortionAnalysisForm.

## Shared Types & Exports

- Canonical types such as `OrionOpportunity`, `OpportunityStatus`, `EvaluationOutput`, etc. are defined and exported from `packages/shared/types/orion.ts`.
- There is **no `OrionOpportunity.ts` file** in the codebase. All references to `@repo/shared/types/OrionOpportunity` should be updated to `@repo/shared/types/orion`.
- Many TypeScript errors are caused by incorrect imports or references to non-existent files. Always import shared types from `@repo/shared/types/orion`.
- If you encounter module resolution errors, check your import paths and update them to use the correct file.

This documentation will help future contributors avoid confusion and resolve TypeScript errors more efficiently.
