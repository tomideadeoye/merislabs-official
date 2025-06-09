#!/bin/bash


#!/bin/bash
# Motivational and operational echo block
cat <<EOM
graph TD
    subgraph "Phase 1: Vision & Strategy (You & Orion using Cline/GPT-4.1)"
        A[You: Define High-Level Goal in VS Code] --> B[Orion: Consults Context in NotebookLM];
        B --> C[Orion: Provides Strategic Breakdown & Asks Preference Questions];
        C --> D[You: Confirm Scope & Preferences];
    end

    subgraph "Phase 2: Brainstorming & Design (You & Orion using Gemini)"
        D --> E[You: Request Creative Input or Design Options];
        E --> F[Orion (as 'Orion Gem'): Generates Diverse Ideas & Approaches];
        F --> G[You: Select & Refine the Chosen Approach];
    end

    subgraph "Phase 3: Implementation (You with Cursor, guided by Orion)"
        G --> H[Orion (as PM/Architect): Provides Explicit, Comprehensive Instructions];
        H --> I[You: Feed Instructions to Cursor];
        I --> J[Cursor: Writes Code & Asks You Tactical Questions];
        J --> H;
    end

    subgraph "Phase 4: Validation & Iteration (You & Orion)"
        J --> K[Orion: Instructs You to Test the Implemented Feature];
        K --> L[You: Run Automated Tests (Jest) & Manual E2E Tests];
        L --> M[You & Orion: Debug & Refine Code/Prompts Collaboratively];
        M --> N[Orion: Instructs You to Update PRD & Documentation];
    end

    N --> A;


UI | DO | QUESTIONS | FEATURES | TESTING/LOGGING | IMPROVEMENT | SECURITY | PERFORMANCE | DOCUMENTATION | DESIRED OUTCOME | PROJECT DETAILS

REMEMBER/ALWAYS/EXECUTE/DO/APPLY/NOW:
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
- Document app implementations in prd.md file.
Add absurd amount of logging to the code.
Add goal of file/feature/function to top of file and explain connection to other files/features/functions.
- start-orion.sh and determine features not yet implemented.
- Mirror naming conventions, error-handling, and structure
- Absurdly comprehensive descritptive names for files, functions, variables, classes, etc.
- UI | DO - add loading states, progress bars, etc.when required Loader @/components/ui/Loader, ProgressBar  @/components/ui/ProgressBar
- suggest best practices
- error page: pages/500.tsx
- use centralized color-coded, icon logger @/lib/logger
- consolidate/unify/allign/weave together code, state, features, components, etc.
- modularize code, state, features, components, etc. Encapsulate domain-specific logic in dedicated modules/classes

UI - toast errors as fallbacks

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

Prefer interfaces over concrete implementations for extensibility
Extract common patterns into reusable components

Robust Error Handling
- Implement appropriate exception handling with helpful error messages
- Design fallback mechanisms for uncertain scenarios or operations with external dependencies
- Fallback strategies: cached data, default values, retry logic, or graceful degradation
- Never silently fail; always log issues appropriately

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
- Optimize database queries with appropriate indexes
- Minimize database calls and implement caching where appropriate
- Consider time and space complexity without premature optimization

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

No quick HACKS: solve the actual problem, not just the symptom.

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
- Monorepo
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
- Opportunity  Pipeline (dashboard loads opportunites with filter "Opportunity" from notion - not "CV Components") > Opportunity Details -> Analyze Fit/evaluation -> Opportunity CV Tailoring loads my CVs notion components using "CV Components"-> Auto generate cv to match opportunity details/content -> find key stakeholders -> generate email addresses -> button to draft personalised email for each stakeholder -> draft a linkedin message based on search results we will carry out on them via scraping links that are found in the search results -> button to draft personalised linkedin message for each stakeholder (drafts will generally use my profile context, opportunity details, web search and scrape data) -> i can edit the email draft and send it with the app including generated cv or attached cv (my choice) -> option to schedule send -> in opportunity details view, mcp server to automate all process - perhaps browser automation if the aplication/opportunity only requires sending email and cv -> if the application requires a resume, the mcp server will generate a cv based on the opportunity details and send it with the email -> if the application requires a cover letter, the mcp server will generate a cover letter based on the opportunity details and send it with the email -> CV is generated using notion fetch of filter "CV Component" which is automatically generated from the opportunity details -> generate application/opportuntiy materials tab should have questions that i can paste from application page and generate a response based on the questions using checkbox of quadrant, online profile page (from notion) in .env cached to minimze api calls (USER_PROFILE_NOTION_URL) -> response to questions can be edited after generation and components/orion/SaveOptionsButton.tsx
- State management (zustand)- Zustand state will be unified in a single, composable, slice-based central store for maintainability and clarity.
- read general profile data from notion page (USER_PROFILE_NOTION_URL) - it is text
EOM

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
