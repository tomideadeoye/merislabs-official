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
- Opportunity evaluation

## Documentation

For more detailed information about the memory integration, see [README-memory-integration.md](README-memory-integration.md).