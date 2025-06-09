#!/bin/bash

# =====================
# Orion Monorepo Start Script
# =====================
# Always run from monorepo root
cd "$(dirname "$0")"

# --- Color Codes ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  local level=$1; shift
  local color=$2; shift
  echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*${NC}"
}
log_info() { log INFO "$GREEN" "$@"; }
log_warn() { log WARN "$YELLOW" "$@"; }
log_error() { log ERROR "$RED" "$@"; }

# --- Validate Dependencies ---
REQUIRED_TOOLS=(pnpm docker python3 node)
for tool in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v $tool >/dev/null 2>&1; then
    log_error "$tool is required but not installed. Aborting."
    exit 1
  fi
done

# --- Show Project Tree ---
log_info "Project directory structure (top 2 levels):"
if command -v tree >/dev/null 2>&1; then
  tree -L 2 -I 'node_modules|.next|.git|venv|env|dist|build|coverage|.cache|.pytest_cache|.mypy_cache|*.log|.DS_Store|Thumbs.db' .
else
  find . -maxdepth 2 -type d | sed 's|[^/]*/|  |g' | sort
fi

# --- Generate .env-sample ---
log_info "Generating .env-sample from .env and .env.local..."
rm -f .env-sample
touch .env-sample
for envfile in .env .env.local; do
  if [ -f "$envfile" ]; then
    awk -F= '!/^#/ && NF && !seen[$1]++ {print $1"="}' "$envfile" >> .env-sample
  fi
done
awk -F= '!seen[$1]++' .env-sample > .env-sample.tmp && mv .env-sample.tmp .env-sample
log_info ".env-sample generated."

# --- TypeScript Check, Lint, Build ---
log_info "Running TypeScript check in apps/nextjs..."
cd apps/nextjs || { log_error "Could not cd into apps/nextjs"; exit 1; }
pnpm exec tsc --noEmit --skipLibCheck || { log_error "TypeScript errors detected. Aborting."; exit 1; }
log_info "TypeScript check passed."
log_info "Running ESLint..."
npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0 --format=stylish || { log_error "ESLint errors detected. Aborting."; exit 1; }
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
log_info "ESLint passed."
log_info "Building Next.js app..."
pnpm run build --debug || { log_error "Next.js build failed. Aborting."; exit 1; }
cd ../.. # Back to monorepo root

# --- Start Qdrant (Docker) ---
QDRANT_PORT="${QDRANT_PORT:-6333}"
QDRANT_STORAGE_PATH="${QDRANT_STORAGE_PATH:-$(pwd)/qdrant_storage}"
log_info "Starting Qdrant (Docker, port $QDRANT_PORT)..."
if ! docker ps | grep -q qdrant_db; then
  docker run -d --name qdrant_db -p $QDRANT_PORT:$QDRANT_PORT -p 6334:6334 -v $QDRANT_STORAGE_PATH:/qdrant/storage qdrant/qdrant
  log_info "Qdrant started."
else
  log_warn "Qdrant already running."
fi
# Health check for Qdrant
for i in {1..10}; do
  if curl -s "http://localhost:$QDRANT_PORT/collections" >/dev/null; then
    log_info "Qdrant is healthy."
    break
  fi
  log_info "Waiting for Qdrant... ($i/10)"
  sleep 2
done

# --- Start Python API ---
PYTHON_API_PORT="${PYTHON_API_PORT:-5002}"
log_info "Starting Python API (port $PYTHON_API_PORT)..."
if lsof -i:$PYTHON_API_PORT >/dev/null 2>&1; then
  log_warn "Port $PYTHON_API_PORT in use. Killing process."
  lsof -ti:$PYTHON_API_PORT | xargs kill -9
  sleep 1
fi
(
  cd backend/orion_python_backend || { log_error "Could not cd into backend/orion_python_backend"; exit 1; }
  if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
  fi
  uvicorn orion_api:app --host 0.0.0.0 --port $PYTHON_API_PORT &
  echo $! > /tmp/orion_python_api.pid
)
# Health check for Python API
for i in {1..10}; do
  if curl -s "http://localhost:$PYTHON_API_PORT/api/docs" | grep -q "Swagger"; then
    log_info "Python API is healthy."
    break
  fi
  log_info "Waiting for Python API... ($i/10)"
  sleep 2
done


# --- Start Next.js Dev Server ---
log_info "Starting Next.js dev server (apps/nextjs)..."
cd apps/nextjs || { log_error "Could not cd into apps/nextjs for dev server"; exit 1; }
pnpm run dev
