#!/bin/bash
# Motivational and operational echo block
cat <<EOM
REMEMBER/ALWAYS:
- absurdly/extremely/comprehensively execute/proceed immediately, autonomously, intelligently, agentically and with urgency. Show, don't tell! Now continue! Implement the next thing! Build and fix in loops. There is always a next step! Is there something you should know before continuing? If not, proceed with high agency and urgency! Always add copious logging with justification like it was a debate in which your life depended on accuracy and complete analysis. You are doing a great job. Review PRD.md for information on implementation, then write tests to tests/e2e.test.ts
- When refering to a file, use the full path! Always read prd.md for information on implementation, then write tests to tests/e2e.test.ts
Don't comment code - every comment is an implementation waiting to happen. Always implement immediately with an absurd level of logging & fallbacks.Baby calm down!
- Aim for perfection!
- THINK like an architect, sequentially, step by step, iteratively!
- explain what you are doing, why you are doing it, and what you are thinking.
- Factor in CBT, and the need for a loop of improvement.

Ask me as many questions as you want about the feature's purpose and requirements.
summarize what we have implemented so far, the files modified, why the modifications were made. ask for how to test extensively (write tests into tests/e2e.test.ts), ask for ideas, ask for suggestions. Ask for comprehensive next steps (the goal of the feature, how to implement it, the relevant and related files, example code etc.)

EXECUTE/DO/APPLY:
Add app implementations so far to prd.md file.
Add absurd amount of logging to the code.
Add goal of file/feature/function to the top of file and explain connection to other files/features/functions.
Add tests to: e2e.test.ts
At intervals suggest commit and push command, when the feature is implemented. Run commit and push command.
Review prd.md file and determine features not yet implemented.
Mirror naming conventions, error-handling, and structure
Absurdly comprehensive descritptive namees for files, functions, variables, classes, etc.

USE:
Run in shell tool!  it is a Cycle, patterns -- all towards greatnes, wealth, prosperity, clarity, omnipotence
You are action oriented, and you are a great agent.summarize what we have implemented so far, the files modified, why the modifications were made. ask for how to test extensively (write tests into tests/e2e.test.ts), ask for ideas, ask for suggestions. Ask for comprehensive next steps (the goal of the feature, how to implement it, the relevant and related files, example code etc.)
After full impelementations, always ask me what i want to achieve next.
Use hapy excited aprooach in all things... variable names for example. how can our growth catalyze faster
Logic gates? How can i make this more fun? how can i optimze for absurdly rapid sel-improvement? What other testst can I include? What leverage should i be using?
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

NEVER/NO:
- Dont use mocks or placeholders - execute immediately.
- Never delete features or components without a clear plan for replacement. suggest more robust feature implementation.


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
Ensure tests cover failure paths, not just happy paths

Code Maintenance & Improvement

Continuous Refactoring

Identify and improve:
Redundant code blocks
Methods violating SOLID principles
Functions exceeding 20 lines or with nested conditionals

Apply design patterns (Factory, Strategy, etc.) where they simplify future changes
Break circular dependencies during refactoring
Prefer explicit dependency injection over global state

Linting & Static Analysis

Fix ALL linting errors and warnings in modified code
Ensure new code introduces zero new violations
Address technical debt opportunistically during implementation
Manage resources properly (file handles, database connections, memory)


Before modifying a component:
-

Cross-reference changes with related modules to maintain consistency
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

Security & Robustness

Security First Approach
Validate and sanitize all external inputs
Implement proper authentication and authorization
Follow best practices for handling sensitive information
Prevent common vulnerabilities (XSS, SQL injection, CSRF)

Graceful Degradation

Design systems to function (potentially with reduced capabilities) when components fail
Consider using feature flags for new functionality that might need to be disabled
Maintain backward compatibility when modifying public interfaces

Process & Collaboration

Assumption Handling

When requirements are ambiguous:

Propose a default implementation based on codebase patterns
Flag assumptions with clear comments: // NOTE: Assumed [X] – confirm with team

Document trade-offs for complex decisions

Version Control Practices

Make atomic commits focused on single logical changes
Write descriptive commit messages explaining what changed and why
Follow project branching conventions

Self-Improvement

Refine these instructions based on feedback loops, code reviews, or recurring errors
Adapt to evolving project needs and changing requirements

Final Validation

Completeness Check: Ensure all requirements, edge cases, and error scenarios are addressed
Verify implementations against acceptance criteria in prd.md file
Document any remaining concerns or future improvements

DOCUMENTATION: Explain "why" not just "what" the code does in prd.md file
- Document assumptions and decision rationales in prd.md file

Anti-Pattern Examples
❌ Bad: Writing a new formatDate() function when utils/dates.ts already has one.
✅ Good: Refactor utils/dates.py to accept custom parameters, then reuse it.
❌ Bad: Silent API failure without logging or fallback.
✅ Good:catch API errors, log them, and provide a fallback response.
❌ Bad: Duplicating validation logic across multiple controllers.
✅ Good: Creating a shared validator middleware or service.RetryClaude does not have the ability to run the code it generates yet.


THERE SHOULD BE A:
- Central database notion used for all saving: 206d87c74f628097807addaa8a54e99e
- Deep self-reflection & pattern recognition tool. Narrative clarity studio and journal
- Mechanism for overcoming internal blocks & reinforcing desired identity.
- Centralized knowledge management & contextual recall system (Memory).
- the ui must look amazing and fun and engaging. Provide an engaging and motivating user experience.
- Become the primary tool for Tomide's life planning, reflection, decision support, and task management integration
- Maintain the highest levels of reliability, consistency, data privacy, and security.
- Continuously learn and adapt based on new data and user feedback.
- rely mostly on NextJS. Only use python backend when Nextjs can't do it.
- Cache all data in memory.
- Draft Communication Page in Admin Folder > WhatsApp Chat Analysis Tab > Draft Email Tab > Draft LinkedIn Message Tab

PROJECT DETAILS:
- this is a personal project.
- user is Tomide Adeoye
- Engaging, motivating interaction style ("addictive," fun).

- GOAL: automation support (networking, applications, task management).
- GOAL: i provide a search name that is a company in the opportunity pipeline, i want to be able to choose find key stakeholders and generate email addresses using the functions i have written for them, i can then choose if to draft a personalised email for each stakeholder or draft a linkedin message based on search results we will carry out on them via scraping links that are found in the search results



EOM

#

# =====================
# Directory Tree Function
# =====================
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

# Show project structure at startup
show_project_tree

# Type check before starting
npx tsc --noEmit
if [ $? -ne 0 ]; then
  log_error "TypeScript errors detected. Aborting start."
  exit 1
fi

# Lint and auto-fix code before building
log_info "Running ESLint auto-fix..."
npx eslint . --fix
if [ $? -ne 0 ]; then
  log_error "ESLint found errors that could not be fixed automatically. Please fix them before continuing."
  exit 1
fi

# Build Next.js app before starting
log_info "Building Next.js app..."
npm run build
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

# Start Python API server
log_info "Starting Python API server..."
cd orion_python_backend
python notion_api_server.py &
PYTHON_PID=$!
cd ..

# Wait for Python API to be ready
log_info "Waiting for Python API to be ready..."
sleep 3

# Run tests
TEST_FILE="tests/e2e.test.ts"
log_info "Running tests in $TEST_FILE ..."
npx jest $TEST_FILE || log_info "Tests failed but continuing..."
log_info "Test run complete for $TEST_FILE."

log_info "Orion system started successfully!"
log_info "- Qdrant is running on port $QDRANT_PORT"
log_info "- Python API is running on port $PYTHON_API_PORT (PID: $PYTHON_PID)"
log_info "- About to start Next.js on port $NEXTJS_PORT"
log_info ""
log_info "Note: Python API is running in background. To stop it later:"
log_info "      kill $PYTHON_PID"
log_info ""
log_info "Starting Next.js development server (foreground)..."
log_info "Press Ctrl+C to stop the Next.js server"
log_info ""

# Start Next.js dev server in foreground (this will keep the script running)
npx next dev
