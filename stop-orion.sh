#!/bin/bash
# Stop all Orion background services
# This script stops Docker containers, Python API, and Next.js processes

# =====================
# Configuration
# =====================
PID_DIR="${PID_DIR:-/tmp/orion_pids}"
LOG_FILE="${LOG_FILE:-/tmp/orion.log}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# =====================
# Stop Services Function
# =====================
stop_services() {
    log_info "Stopping Orion services..."

    # Stop Next.js dev server
    if [ -f "$PID_DIR/nextjs.pid" ]; then
        NEXTJS_PID=$(cat "$PID_DIR/nextjs.pid")
        if kill -0 "$NEXTJS_PID" 2>/dev/null; then
            log_info "Stopping Next.js dev server (PID: $NEXTJS_PID)"
            kill "$NEXTJS_PID"
            if [ $? -eq 0 ]; then
                log_success "Next.js dev server stopped"
            else
                log_error "Failed to stop Next.js dev server"
            fi
        else
            log_warning "Next.js process not running (PID: $NEXTJS_PID)"
        fi
        rm -f "$PID_DIR/nextjs.pid"
    else
        log_warning "No Next.js PID file found"
    fi

    # Stop Python API server
    if [ -f "$PID_DIR/python_api.pid" ]; then
        PYTHON_PID=$(cat "$PID_DIR/python_api.pid")
        if kill -0 "$PYTHON_PID" 2>/dev/null; then
            log_info "Stopping Python API server (PID: $PYTHON_PID)"
            kill "$PYTHON_PID"
            if [ $? -eq 0 ]; then
                log_success "Python API server stopped"
            else
                log_error "Failed to stop Python API server"
            fi
        else
            log_warning "Python API process not running (PID: $PYTHON_PID)"
        fi
        rm -f "$PID_DIR/python_api.pid"
    else
        log_warning "No Python API PID file found"
    fi

    # Stop Qdrant Docker container
    log_info "Stopping Qdrant Docker container..."
    if docker ps | grep -q qdrant_db; then
        docker stop qdrant_db
        if [ $? -eq 0 ]; then
            log_success "Qdrant container stopped"
            # Optionally remove the container
            read -p "Remove Qdrant container? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker rm qdrant_db
                log_success "Qdrant container removed"
            fi
        else
            log_error "Failed to stop Qdrant container"
        fi
    else
        log_warning "Qdrant container not running"
    fi

    # Kill any remaining processes that might be hanging
    log_info "Cleaning up any remaining processes..."

    # Kill any remaining Next.js processes
    pkill -f "next dev" 2>/dev/null && log_info "Killed remaining Next.js processes"

    # Kill any remaining Python API processes
    pkill -f "notion_api_server.py" 2>/dev/null && log_info "Killed remaining Python API processes"

    # Clean up PID directory
    if [ -d "$PID_DIR" ]; then
        rm -rf "$PID_DIR"
        log_success "Cleaned up PID directory"
    fi
}

# =====================
# Force stop function
# =====================
force_stop() {
    log_warning "Force stopping all Orion services..."

    # Force kill Next.js
    pkill -9 -f "next dev" 2>/dev/null

    # Force kill Python API
    pkill -9 -f "notion_api_server.py" 2>/dev/null

    # Force stop and remove Docker container
    docker stop qdrant_db 2>/dev/null
    docker rm qdrant_db 2>/dev/null

    # Clean up
    rm -rf "$PID_DIR" 2>/dev/null

    log_success "Force stop completed"
}

# =====================
# Main execution
# =====================
case "${1:-normal}" in
    "force"|"-f"|"--force")
        force_stop
        ;;
    "normal"|"")
        stop_services
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [normal|force|help]"
        echo "  normal (default): Gracefully stop all services"
        echo "  force: Force kill all processes and containers"
        echo "  help: Show this help message"
        exit 0
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

log_success "All Orion services stopped"
echo -e "\n${GREEN}✓ Orion system shutdown complete${NC}"
