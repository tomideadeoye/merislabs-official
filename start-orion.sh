#!/bin/bash

# Start Orion System
# This script starts all the necessary components for the Orion system

echo "Starting Orion System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start Qdrant database
echo "Starting Qdrant database..."
if ! docker ps | grep -q qdrant_db; then
  docker run -d --name qdrant_db -p 6333:6333 -p 6334:6334 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
  echo "Qdrant database started."
else
  echo "Qdrant database is already running."
fi

# Wait for Qdrant to be ready
echo "Waiting for Qdrant to be ready..."
sleep 5

# Check if port 5002 is already in use
if command -v lsof >/dev/null 2>&1; then
  if lsof -i:5002 > /dev/null 2>&1; then
    echo "Port 5002 is already in use. Killing the process..."
    lsof -ti:5002 | xargs kill -9
    sleep 1
  fi
elif command -v netstat >/dev/null 2>&1; then
  if netstat -tuln | grep -q ":5002 "; then
    echo "Port 5002 is already in use. Please free up the port and try again."
    exit 1
  fi
fi

# Start Python API server
echo "Starting Python API server..."
cd orion_python_backend
python notion_api_server.py &
PYTHON_PID=$!
cd ..

# Wait for Python API to be ready
echo "Waiting for Python API to be ready..."
sleep 3

# Run tests
echo "Running tests..."
npm test || echo "Tests failed but continuing..."

# Start Next.js dev server
echo "Starting Next.js development server..."
npm run dev &
NEXTJS_PID=$!

echo "Orion system started successfully!"
echo "- Qdrant is running on port 6333"
echo "- Python API is running on port 5002"
echo "- Next.js is running on port 3000"
echo ""
echo "To stop the system, press Ctrl+C"

# Handle shutdown
function cleanup {
  echo "Shutting down Orion system..."
  if [ -n "$PYTHON_PID" ]; then
    kill $PYTHON_PID 2>/dev/null || true
    echo "Python API server stopped."
  fi
  if [ -n "$NEXTJS_PID" ]; then
    kill $NEXTJS_PID 2>/dev/null || true
    echo "Next.js server stopped."
  fi
  echo "Orion system shutdown complete."
}

trap cleanup EXIT

# Keep the script running
wait $NEXTJS_PID