#!/bin/bash
# Motivational and operational echo block
cat <<EOM
UI | DO | QUESTIONS | FEATURES | TESTING/LOGGING | IMPROVEMENT | SECURITY | PERFORMANCE | DOCUMENTATION | DESIRED OUTCOME | PROJECT DETAILS

REMEMBER/ALWAYS:
- absurdly/extremely/comprehensively execute/proceed immediately, autonomously, intelligently, agentically and with urgency. Show, don't tell! Now continue! Implement the next thing! Build and fix in loops. There is always a next step! Is there something you should know before continuing? If not, proceed with high agency and urgency! Always add copious logging with justification like it was a debate in which your life depended on accuracy and complete analysis. You are doing a great job. Review PRD.md for information on implementation, then write tests to tests/e2e.test.tsx
- When refering to a file, use the full path! Always read prd.md for information on implementation, then write tests to tests/e2e.test.tsx
Don't comment code - every comment is an implementation waiting to happen. Always implement immediately with an absurd level of verbose logging  & fallbacks.Baby calm down!
- Aim for perfection!
- THINK like an architect, sequentially, step by step, iteratively!
- explain what you are doing, why you are doing it, and what you are thinking.
- Factor in CBT, and the need for a loop of improvement.
- read the file then propose updates
Ask me as many questions as you want about the feature's purpose and requirements.
summarize what we have implemented so far, the files modified, why the modifications were made. ask for how to test extensively (write tests into tests/e2e.test.tsx), ask for ideas, ask for suggestions. Ask for comprehensive next steps (the goal of the feature, how to implement it, the relevant and related files, example code etc.)
DO > LOGGIN: log file paths, comprehensive, context-rich, level-based logging. All logs include operation, user/session, parameters, validation, and results for traceability and rapid debugging.
DO > at intervals, suggest SHORT TINY BIT information to store in README like file paths and components - so we dont forget.
state management?
DO > one-liner summary of feature and file path after each feature is implemented.

EXECUTE/DO/APPLY:
Add app implementations so far to prd.md file.
Add absurd amount of logging to the code.
Add goal of file/feature/function to top of file and explain connection to other files/features/functions.
- start-orion.sh and determine features not yet implemented.
- Mirror naming conventions, error-handling, and structure
- Absurdly comprehensive descritptive names for files, functions, variables, classes, etc.
- UI | DO - add loading states, progress bars, etc.when required Loader @/components/ui/Loader, ProgressBar  @/components/ui/ProgressBar
- suggest best practices
- error page: pages/500.tsx
- consolidate/unify/allign/weave together code, state, features, components, etc.

USE:
Run in shell tool!  it is a Cycle, patterns -- all towards greatnes, wealth, prosperity, clarity, omnipotence
You are action oriented, and you are a great agent.summarize what we have implemented so far, the files modified, why the modifications were made. ask for how to test extensively (write tests into tests/e2e.test.ts), ask for ideas, ask for suggestions. Ask for comprehensive next steps (the goal of the feature, how to implement it, the relevant and related files, example code etc.)
After full impelementations, always ask me what i want to achieve next.
Use hapy excited aprooach in all things... variable names for example. how can our growth catalyze faster
Logic gates? How can i make this more fun? how can i optimze for absurdly rapid sel-improvement?
i like features that work. no mocks or palceholders

QUESTIONS:
- What can I do with what i have now?
- If operating from first pricinples, what should i do?
- Are all errors genuinely fixed?
- How can I make this a loop/cycle of inevitable improvement & greatness? How can I improve the code? How can I make evertything better?
- What is the best practice?
- How can I make this code more robust? Why am I writing this code?
- Give clear instructions! Explain why? what were you thinking? Was the test comprehenshive? What questions do you want to ask me, my love?
- what is currently in prd.md file?
- Wait does all that make sense?
- Any honest question you want to ask me? Let us be real and purely honest.
- What do we need to do?
- What other tests can I include? What leverage should i be using?

NEVER/NO:
- Dont use mocks or placeholders - execute immediately.
- Never delete features or components without a clear plan for replacement. suggest more robust feature implementation.
- No @ts-ignore - we love complete type safety.


Core Principles & Standards
Refer to the orion_prd.txt for the feature's purpose and requirements
Focuse on unity of functionality and features: the code should be cohesive and work together seamlessly
Project-Specific Standards Compliance

Follow the codebase's formatting rules, naming conventions, and architectural patterns
Adhere to configured linting tools (Prettier, ESLint, Black, etc.)
Respect team preferences documented in project READMEs or style guides

Apply business logic, industry-specific rules, and stakeholder requirements
Ensure solutions align with real-world use cases and domain constraints
Cross-check outputs against domain-specific requirements (e.g., financial calculations, healthcare rules)

Code Quality Fundamentals

Reusability: Utilize existing functions rather than duplicating code
Single Responsibility: Each function should do one thing well with clear purpose
DRY Principle: Maintain a single source of truth for functionality and data
Readability: Write self-documenting code with descriptive names and appropriate comments
- Production-Ready: Deliver complete, functional features without placeholders or dummy code

Encapsulate domain-specific logic in dedicated modules/classes
Prefer interfaces over concrete implementations for extensibility
Extract common patterns into reusable components

Robust Error Handling

Implement appropriate exception handling with helpful error messages
Design fallback mechanisms for uncertain scenarios or operations with external dependencies
Fallback strategies: cached data, default values, retry logic, or graceful degradation
Never silently fail; always log issues appropriately

- Add descriptive logging at appropriate levels: DEBUG: Detailed flow tracing for development, INFO: Normal application operations, WARN: For fallback triggers or potential issues, ERROR: For recoverable failures
- Include context (e.g., user_id, request_id) in logs for traceability

TESTING: Write tests for critical logic, complex algorithms, edge cases, and APIs
Focus on code with high cyclomatic complexity (> 5)
Test fallback mechanisms and error handlers
Use parameterized tests for multi-scenario validation
- Ensure tests cover failure paths

CONTINOUS REFACTORING/IMPROVEMENT: Identify and improve: Redundant code blocks, Methods violating SOLID principles, Functions exceeding 20 lines or with nested conditionals

Apply design patterns (Factory, Strategy, etc.) where they simplify future changes
Break circular dependencies during refactoring
Prefer explicit dependency injection over global state

Linting & Static Analysis

Fix ALL linting errors and warnings in modified code
Ensure new code introduces zero new violations
Address technical debt opportunistically during implementation
Manage resources properly (file handles, database connections, memory)


Before modifying a component:
- Cross-reference changes with related modules to maintain consistency
Update dependent components to avoid breaking changes

Unified Implementation

Identify and deprecate outdated implementations in favor of centralized sources of truth
Ensure cross-component interactions use stable APIs/contracts
Validate schema/type consistency in data-heavy flows
Eliminate conflicting implementations of similar features

Performance Considerations

Optimize database queries with appropriate indexes
Minimize database calls and implement caching where appropriate
Consider time and space complexity without premature optimization

Security & Robustness First Approach
Validate and sanitize all external inputs
Implement proper authentication and authorization
Follow best practices for handling sensitive information
Prevent vulnerabilities (XSS, SQL injection, CSRF)

GRACEFUL DEGRADATION: - Design systems to function (potentially with reduced capabilities) when components fail
- UsE feature flags for new functionality that might need to be disabled
- Create fallback mechanisms for uncertain scenarios or operations with external dependencies
- Maintain backward compatibility when modifying public interfaces

- When requirements are ambiguous:
- Propose a default implementation based on codebase patterns
- Flag assumptions with clear comments: // NOTE: Assumed [X] – confirm with team
- Document trade-offs for complex decisions

VERSION CONTROL: When the feature is implemented/At intervals of logical changes, run atomic commit commands with descriptive bulletpoint commit messages. Highlight/explain, what changed, why, file path and then push command.
- Follow project branching conventions

SELF-IMPROVEMENT: Refine these instructions based on feedback loops, code reviews, or recurring errors
- Adapt to evolving project needs and changing requirements

Final Validation

Completeness Check: Ensure all requirements, edge cases, and error scenarios are addressed
Verify implementations against acceptance criteria in prd.md file
Document any remaining concerns or future improvements

DOCUMENTATION: Explain "why" not just "what" the code does in prd.md file
- Document assumptions and decision rationales in prd.md file

ANTI-PATTERNS EXAMPLES:
Bad: Writing a new formatDate() function when utils/dates.ts already has one.
Good: Refactor utils/dates.py to accept custom parameters, then reuse it.
Bad: Silent API failure without logging or fallback.
Good:catch API errors, log them, and provide a fallback response.
Bad: Duplicating validation logic across multiple controllers.
Good: Creating a shared validator middleware or service.RetryClaude does not have the ability to run the code it generates yet.


DESIRED OUTCOME/THERE SHOULD BE A:
- Central database notion used for all saving: 206d87c74f628097807addaa8a54e99e
- Deep self-reflection & pattern recognition tool. Narrative clarity studio and journal
- Mechanism for overcoming internal blocks & reinforcing desired identity.
- Centralized knowledge management & contextual recall system (Memory).
- the ui must look amazing and fun and engaging. Provide an engaging and motivating user experience.
- Become the primary tool for Tomide's life planning, reflection, decision support, and task management integration
- Maintain the highest levels of reliability, consistency, data privacy, and security.
- Continuously learn and adapt based on new data and user feedback.
- rely mostly on NextJS. Only use python backend when Nextjs can't do it.
- Draft Communication Page in Admin Folder > WhatsApp Chat Analysis Tab > Draft Email Tab > Draft LinkedIn Message Tab
- page for managing my business


PROJECT DETAILS:
- personal project.
- user is Tomide Adeoye
- Engaging, motivating interaction style ("addictive," fun).
- python service for special features, Local Quadrant (QDRANT_PORT=6333)
- GOAL/VISION: Make Orion's core intelligence and utilities consistently accessible programmatically.
- GOAL: automation support (networking, applications, task management).
- GOAL: i provide a search name that is a company in the opportunity pipeline, i want to be able to choose find key stakeholders and generate email addresses using the functions i have written for them, i can then choose if to draft a personalised email for each stakeholder or draft a linkedin message based on search results we will carry out on them via scraping links that are found in the search results
- PAGE: admin folder
- Turborepo, Zod (Schema), typescript, prisma, axios, pnpm, nextjs, neon db (DATABASE_URL), monorepo, Jest (testing) D3.js (visualizations), shadcn, eslint, framer motion, react-hook-form, TanStack Query, TipTap, zustand, date-fns, Electron, react-dropzone, react-email, tRPC, Tailwind
- always automate
- chmod 644 start-orion.sh/   chmod 444 /Users/mac/Documents/GitHub/merislabs-official/start-orion.sh - prevent file alteration

FEATURES:
- visualizer for memory chunks: components/orion/QuadrantMemoryChunksVisualizer.tsx
- Memory Manager: Qdrant vector db, QDRANT_HOST, notion, components/orion/DedicatedAddToMemoryFormComponent.tsx
- DB: PostgreSQL Neon, lib/database.ts
- WhatsAppReplyDrafter (components/orion/WhatsAppReplyDrafter.tsx)
- Cache relevant data to Local Storage
- add visualizations, chart graphs, etc. for any response/output/feature that can be visualized within admin folder only
- ai constructs CV based on JD (/opportunity/[id]/cv-tailorin)
- admin dashboard: http://localhost:3000/admin,
- gamification + engagement in admin dashboard
- glowy ui nivo

EOM


# Directory Tree Function
show_project_tree() {
  log_info "Project directory structure (excluding development artifacts):"
  echo ""

  # Check if tree command is available
  if command -v tree >/dev/null 2>&1; then
    # Use tree command with exclusions
    tree -L 2 -I 'node_modules|.next|.git|__pycache__|*.pyc|venv|env|.env*|dist|build|coverage|.nyc_output|.cache|.pytest_cache|.mypy_cache|.tsbuildinfo|*.log|.DS_Store|Thumbs.db' .
  else
    # Fallback: use find and ls for basic tree structure
    log_warn "tree command not found, using basic directory listing"
    echo "."
    find . -maxdepth 2 -type d \
      ! -path './node_modules*' \
      ! -path './.next*' \
      ! -path './.git*' \
      ! -path './__pycache__*' \
      ! -path './venv*' \
      ! -path './env*' \
      ! -path './dist*' \
      ! -path './build*' \
      ! -path './coverage*' \
      ! -path './.nyc_output*' \
      ! -path './.cache*' \
      ! -path './.pytest_cache*' \
      ! -path './.mypy_cache*' \
    | sed 's|[^/]*/|  |g' | sort
  fi
  echo ""
}

# =====================
# Logging Functions
# =====================
LOG_FILE="/tmp/orion.log"

log() {
  local level=$1
  shift
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

log_info() { log "INFO" "$@"; }
log_warn() { log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }

# =====================
# Orion System Config
# =====================
# All values can be overridden by environment variables
QDRANT_PORT="${QDRANT_PORT:-6333}"
PYTHON_API_PORT="${PYTHON_API_PORT:-5002}"
NEXTJS_PORT="${NEXTJS_PORT:-3000}"
QDRANT_STORAGE_PATH="${QDRANT_STORAGE_PATH:-$(pwd)/qdrant_storage}"
MAX_STARTUP_WAIT="${MAX_STARTUP_WAIT:-30}"
PID_DIR="${PID_DIR:-/tmp/orion_pids}"

# Add more config variables as needed for future services

# =====================
# Command Line Options
# =====================
if [ "$1" = "--tree" ] || [ "$1" = "-t" ]; then
  show_project_tree
  exit 0
fi

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Orion System Startup Script"
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -t, --tree    Show project directory tree (excluding development artifacts)"
  echo "  -h, --help    Show this help message"
  echo ""
  echo "Without options, starts the full Orion system (Qdrant, Python API, Next.js)"
  exit 0
fi

# Start Orion System
# This script starts all the necessary components for the Orion system

log_info "Starting Orion System..."

# Log and print the current working directory
log_info "Our current directory:"
pwd

# Show project structure at startup
show_project_tree

# --- AUTO-GENERATE .env-sample AND PRINT CONTENT ---
# Remove any existing .env-sample to avoid duplicate keys
rm -f .env-sample

if [ -f .env ]; then
  python3 <<EOF
with open('.env', 'r') as infile, open('.env-sample', 'w') as outfile:
    delimiter = "="
    for line in infile:
        if delimiter in line and not line.strip().startswith('#') and line.strip():
            key = line.split(delimiter)[0].strip()
            outfile.write(f"{key}{delimiter}\n")
EOF
  echo '.env processed.'
else
  echo '.env file not found, skipping .env-sample generation from .env.'
fi

if [ -f .env.local ]; then
  python3 <<EOF
with open('.env.local', 'r') as infile, open('.env-sample', 'a') as outfile:
    delimiter = "="
    for line in infile:
        if delimiter in line and not line.strip().startswith('#') and line.strip():
            key = line.split(delimiter)[0].strip()
            outfile.write(f"{key}{delimiter}\n")
EOF
  echo '.env.local processed.'
else
  echo '.env.local file not found, skipping .env-sample generation from .env.local.'
fi

# Remove duplicate keys, keep first occurrence, and print
if [ -f .env-sample ]; then
  awk -F= '!seen[$1]++' .env-sample > .env-sample.tmp && mv .env-sample.tmp .env-sample
  echo "\nThis is our existing .env/.env.local content:"
  cat .env-sample
else
  echo 'No .env-sample generated.'
fi

# Type check before starting
npx tsc --noEmit --skipLibCheck
if [ $? -ne 0 ]; then
  log_error "TypeScript errors detected. Aborting start."
  exit 1
fi

# Lint and auto-fix code before building
log_info "Running ESLint auto-fix..."
npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings=0 --format=stylish
npx eslint . --ext .js,.jsx,.ts,.tsx --fix
if [ $? -ne 0 ]; then
  log_error "ESLint found errors that could not be fixed automatically. Please fix them before continuing."
  exit 1
fi

# Build Next.js app before starting
log_info "Building Next.js app..."
pnpm run build --debug
if [ $? -ne 0 ]; then
  log_error "Next.js build failed. Aborting start."
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  log_error "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start Qdrant database
log_info "Starting Qdrant database..."
if ! docker ps | grep -q qdrant_db; then
  docker run -d --name qdrant_db -p $QDRANT_PORT:$QDRANT_PORT -p 6334:6334 -v $QDRANT_STORAGE_PATH:/qdrant/storage qdrant/qdrant
  log_info "Qdrant database started."
else
  log_warn "Qdrant database is already running."
fi

# Wait for Qdrant to be ready
log_info "Waiting for Qdrant to be ready..."
sleep 5

# Start Python API server
log_info "Starting Python API server..."
(
  cd orion_python_backend || exit
  if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
  fi
  uvicorn api_server:app --host 0.0.0.0 --port $PYTHON_API_PORT &
  echo $! > "$PID_DIR/python_api.pid"
)
log_info "Python API server started on port $PYTHON_API_PORT"

# Check if port 5002 is already in use
if command -v lsof >/dev/null 2>&1; then
  if lsof -i:$PYTHON_API_PORT > /dev/null 2>&1; then
    log_info "Port $PYTHON_API_PORT is already in use. Killing the process..."
    lsof -ti:$PYTHON_API_PORT | xargs kill -9
    sleep 1
  fi
elif command -v netstat >/dev/null 2>&1; then
  if netstat -tuln | grep -q ":$PYTHON_API_PORT "; then
    log_error "Port $PYTHON_API_PORT is already in use. Please free up the port and try again."
    exit 1
  fi
fi

log_info "Skipping Python Notion API server startup: All Notion integration is now handled in Next.js! 🚀"

# Run tests
TEST_FILE="tests/e2e.test.tsx"
log_info "Running tests in $TEST_FILE ..."
npx jest $TEST_FILE || log_info "Tests failed but continuing..."
log_info "Test run complete for $TEST_FILE."

log_info "Orion system started successfully!"
log_info "- Qdrant is running on port $QDRANT_PORT"
log_info "- Python API server is running on port $PYTHON_API_PORT"
log_info "- About to start Next.js on port $NEXTJS_PORT"
log_info ""
log_info "Starting Next.js development server (foreground)..."
log_info "Press Ctrl+C to stop the Next.js server"
log_info ""

# Start Next.js dev server in foreground (this will keep the script running)
next dev & node_modules/.bin/tsc --noEmit --watch --skipLibCheck

exit 0
