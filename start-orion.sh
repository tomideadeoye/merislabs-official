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

# Start Python API server
echo "Starting Python API server..."
cd orion_python_backend
python notion_api_server.py &
PYTHON_PID=$!
cd ..

echo "Orion system started successfully!"
echo "- Qdrant is running on port 6333"
echo "- Python API is running on port 5002"
echo ""
echo "To stop the system, press Ctrl+C"

# Handle shutdown
function cleanup {
  echo "Shutting down Orion system..."
  kill $PYTHON_PID
  echo "Python API server stopped."
  echo "Orion system shutdown complete."
}

trap cleanup EXIT

# Keep the script running
wait $PYTHON_PID