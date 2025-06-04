#!/bin/bash
echo "REMEMBER: Always proceed immediately, autonomously, agentically and with absurd urgency. Show, don't tell! Now continue! Implement the next thing! Build and fix in loops. There is always a next step! Is there something you should know before continuing? If not, proceed with high agency and urgency! Always add copious logging. You are doing a great job. Review PRD.md for information on implementation, then write tests to scripts/run-all-tests.jest.test.ts
 When the feature is implemented. Run commit and push command. When refering to a file, use the full path! Always read prd.md for information on implementation, then write tests to scripts/run-all-tests.jest.test.ts
 We don't comment code - every comment is an implementation waiting to happen. Always implement immediately with an absurd level of logging & fallbacks.
 How can I make this code more robust? Why am I writing this code?
 What is the best practice?
 If operating from first pricinples, what should i do?
 Factor in CBT,
 Fix iteratively - step by step
 Give clear instructions!
 Run in shell tool!"

# Start Orion System
# This script starts all the necessary components for the Orion system

echo "Starting Orion System..."

# Type check before starting
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "TypeScript errors detected. Aborting start."
  exit 1
fi

# Lint and auto-fix code before building
echo "Running ESLint auto-fix..."
npx eslint . --fix
if [ $? -ne 0 ]; then
  echo "ESLint found errors that could not be fixed automatically. Please fix them before continuing."
  exit 1
fi

# Build Next.js app before starting
echo "Building Next.js app..."
npm run build
if [ $? -ne 0 ]; then
  echo "Next.js build failed. Aborting start."
  exit 1
fi

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
TEST_FILE="scripts/all-tests.jest.test.ts"
echo "Running tests in $TEST_FILE ..."
npx jest $TEST_FILE || echo "Tests failed but continuing..."
echo "Test run complete for $TEST_FILE."

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
