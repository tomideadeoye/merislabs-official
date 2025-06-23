# Orion Project Product Requirements Document (PRD)

## 1. Introduction

This document outlines the product requirements for the Orion Project, an advanced AI-powered personal operating system designed to enhance productivity, emotional intelligence, and strategic decision-making for Tomide Adeoye. Orion aims to be a centralized hub for managing various aspects of professional and personal life through intelligent automation and insightful analytics.

## 2. Core Vision & Goals

- **Vision:** To make Orion's core intelligence and utilities consistently accessible programmatically, becoming the primary tool for life planning, reflection, decision support, and task management integration for Tomide Adeoye.
- **Automation Support:** Provide robust automation for networking, applications, and task management.
- **Gamification & Engagement:** Offer an engaging and motivating user experience, particularly within the admin dashboard.
- **Reliability & Security:** Maintain the highest levels of reliability, consistency, data privacy, and security.
- **Continuous Learning & Adaptability:** Continuously learn and adapt based on new data and user feedback.

## 3. Architecture & Technology Stack

Orion is built as a monorepo, primarily leveraging Next.js for the frontend and API routes, with a Python backend service for specialized features requiring specific libraries or processing. Key technologies include:

- **Frontend:** Next.js, React, TypeScript, Shadcn UI, Tailwind CSS, Framer Motion, D3.js (for visualizations), React Hook Form, TanStack Query, TipTap, Zustand, Date-fns, Electron.
- **Backend (Node.js):** Next.js API Routes, Zod (Schema validation), Prisma (ORM), Axios, tRPC.
- **Backend (Python):** Python service for specific AI/data processing tasks (e.g., web scraping, advanced NLP).
- **Database:** PostgreSQL (Neon DB for cloud, Qdrant for vector embeddings).
- **Package Manager:** pnpm.
- **Testing:** Jest (for unit and integration tests), Playwright (for E2E tests).
- **Monorepo Tool:** Turborepo.

## 4. Implemented Features

### 4.1. Agentic Workflow (NEWLY IMPLEMENTED)

- **Goal:** To automate complex workflows and agentic tasks by allowing users to submit natural language queries that are processed by an AI agent capable of using various tools.
- **Description:** This feature provides an interactive interface where users can type a task or question. The system then leverages an LLM-powered agent to interpret the request, plan steps, and execute available internal tools (e.g., searching memory, creating Habitica tasks) to fulfill the request. The agent's progress and final response are displayed to the user.
- **Implementation Details:**
  - **Frontend Component:** `app/components/orion/admin/AgenticWorkflowComponent.tsx`
    - Provides a text input for user queries.
    - Displays loading states, potential intermediate messages, and the final response from the agent.
    - Handles error display and client-side logging.
  - **Backend API:** `app/api/orion/agent/execute/route.ts`
    - Receives `userQuery` from the frontend.
    - Orchestrates an LLM-powered agent loop that can call various internal tools.
    - Tools currently include `search_orion_memory` and `create_habitica_todo`.
    - Uses `generateLLMResponse` from `@/lib/orion_llm` for LLM interaction.
    - Employs robust error handling and comprehensive server-side logging.
  - **Integrated Tools:** The Agentic Workflow leverages the following specialized tools:
    - **`searchOrionMemoryTool`**:
      - **Description:** Searches Tomide's personal Orion memory (Qdrant vector store) for relevant information based on a natural language query.
      - **Capabilities:** Recalls past journal entries, notes, ideas, or other stored knowledge. Supports filtering by `memorySourceTypes` (e.g., `journal_entry`, `opportunity_evaluation`) and `memorySourceTags` (e.g., `career`, `fintech`).
      - **API/File:** Integrates with `/api/orion/memory/search`.
    - **`createHabiticaTodoTool`**:
      - **Description:** Creates a new To-Do task in Tomide's Habitica account when an actionable item is identified by the agent.
      - **Capabilities:** Allows specifying task text, notes, priority (0.1 Trivial, 1 Easy, 1.5 Medium, 2 Hard), and the originating Orion module and reference ID for traceability.
      - **API/File:** Integrates with `/api/orion/habitica/todo`.
    - **`callSequentialThinking`**:
      - **Description:** A utility for guiding the agent's thought process, potentially enabling it to break down problems or generate a sequence of structured thoughts.
      - **Capabilities:** Facilitates a structured thinking process for the agent, with fallback to a server-side API (`/api/sequential-thinking`) if a client-side MCP client isn't available.
      - **API/File:** Defined in `app/lib/orion_tools.ts` and interacts with `/api/sequential-thinking`.
- **Connection to Other Files/Features:**
  - `app/(orion_admin)/admin/agentic-workflow/page.tsx`: Renders the `AgenticWorkflowComponent`.
  - `@/lib/orion_llm.ts`: Core LLM interaction logic.
  - `@/lib/orion_tools.ts`: Defines the available tools that the agent can use.
  - `@/lib/apiClient.ts`: Used by the frontend component for API communication.
  - `@/lib/logger.ts`: Centralized logging for both frontend and backend operations.
  - `@/lib/types/index.ts`: Defines shared types for API responses and agent messages.
  - `/api/orion/memory/search`: An internal API called by the agent for memory search.
  - `/api/orion/habitica/todo`: An internal API called by the agent to create Habitica tasks.
- **Logging:** Comprehensive logging is implemented at various stages of the agent's execution, including query submission, API calls, LLM interactions, tool executions, and error handling.

### 4.2. Opportunity Pipeline Management

- **Goal:** To track and manage job opportunities from identification to application and follow-up.
- **Components:**
  - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: Overview of all opportunities.
  - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`: Detail view for a single opportunity.
  - `app/api/orion/opportunities/route.ts`: API for listing and creating opportunities.
  - `app/api/orion/opportunity/[opportunityId]/route.ts`: API for fetching a single opportunity.
  - `app/lib/opportunity_db_service.ts`: Database service for opportunities.

### 4.3. CV Tailoring Studio

- **Goal:** To dynamically tailor CV content to specific job descriptions using AI.
- **Components:**
  - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/cv-tailoring/page.tsx`: Main CV tailoring UI.
  - `app/components/orion/CVTailoringStudio.tsx`: Client-side interactive component.
  - `app/api/orion/cv/rephrase-component/route.ts`: API for rephrasing CV components.
  - `app/api/orion/cv/suggest-components/route.ts`: API for suggesting CV components.
  - `app/api/orion/cv/ai-suggest/route.ts`: API for general AI suggestions on CV content.
  - `app/api/orion/cv/tailor-summary/route.ts`: API for tailoring CV summaries.

### 4.4. Emotional Tracker

- **Goal:** To log and analyze emotional states, cognitive distortions, and coping mechanisms.
- **Components:**
  - `app/(orion_admin)/admin/emotional-tracker/page.tsx`: Frontend for emotional logging.
  - `app/api/orion/emotions/log/route.ts`: API for saving emotional logs.

### 4.5. LLM Model Settings

- **Goal:** To allow users to configure and manage their preferred LLM models and overrides, ensuring robust validation and correct API interactions.
- **Components:**
  - `app/(orion_admin)/admin/system-settings/components/LlmModelSettings.tsx`: UI for LLM settings.
  - `app/api/orion/llm-settings/route.ts`: API for fetching and updating LLM settings.
  - `app/lib/orion_config.ts`: Defines `AVAILABLE_LLM_MODELS`.
  - `app/lib/orion_llm.ts`: Handles LLM API calls and model selection.
- **Key Updates:**
  - **New Model Added:** `gpt-4.1-turbo` has been added to `app/lib/orion_config.ts` and is now selectable in the UI.
  - **Model Categorization Corrected:** `gpt-4.1-turbo` is now correctly categorized as an `azure` model in `app/lib/orion_config.ts`, reflecting its provisioning source.
  - **Server-Side Validation:** Implemented robust server-side validation in `app/api/orion/llm-settings/route.ts` to ensure that only valid model IDs (from `AVAILABLE_LLM_MODELS`) can be saved, preventing errors from malformed or outdated configurations.
  - **OpenRouter Model ID Fix:** Corrected an issue in `app/lib/orion_llm.ts` where OpenRouter model IDs with suffixes (e.g., `:free`) were not being processed correctly, resolving related API errors.

### 4.6. Narrative Clarity Studio

- **Goal:** To generate various narrative contents (e.g., personal statements, professional bios) based on user's value proposition and career milestones.
- **Components:**
  - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: Main studio UI.
  - `app/components/orion/narrative-clarity-studio/CareerMilestoneForm.tsx`: Component for managing career milestones.
  - `app/api/orion/narrative/generate/route.ts`: API for generating narratives.

### 4.7. Idea Incubator

- **Goal:** To facilitate brainstorming, development, and tracking of new ideas with AI assistance.
- **Components:**
  - `app/(orion_admin)/admin/idea-incubator/page.tsx`: UI for managing ideas.
  - `app/api/orion/ideas/create/route.ts`: API for creating new ideas.
  - `app/api/orion/ideas/[ideaId]/brainstorm/route.ts`: API for brainstorming on an idea.

### 4.8. Networking Outreach

- **Goal:** To generate personalized outreach messages for professional networking.
- **Components:**
  - `app/components/orion/opportunities/CompanyStakeholderOutreach.tsx`: Component for stakeholder outreach.
  - `app/api/orion/networking/generate-outreach/route.ts`: API for generating outreach messages.

### 4.9. Application Questions & JD Analysis

- **Goal:** To use AI to answer questions about job opportunities and analyze job descriptions.
- **Components:**
  - `app/api/orion/llm/application-questions/route.ts`: API for answering application questions.
  - `app/api/orion/llm/jd-analysis/route.ts`: API for job description analysis.

### 4.10. WhatsApp Reply Drafter

- **Goal:** To draft replies for WhatsApp conversations.
- **Components:**
  - `app/components/orion/WhatsAppReplyDrafter.tsx`: UI for drafting replies.
  - `app/components/orion/WhatsAppChatUploader.tsx`: UI for uploading chat history.
  - `app/api/orion/communication/draft-whatsapp-reply/route.ts`: API for drafting WhatsApp replies.

### 4.11. API Client and Error Handling

- **Goal:** Provide a standardized way to interact with APIs and handle errors consistently.
- **Components:**
  - `app/lib/apiClient.ts`: Centralized Axios instance with interceptors and retry logic.
  - `app/lib/utils/errorHandler.ts`: Client-side error handling utility (`HandledApplicationError`, `handleApiError`).
  - `app/lib/utils/serverErrorHandler.ts`: Server-side error handling utility (`handleServerError`).

## 5. General Design Principles

- **Authentication**: Strict authentication for the application is not a high priority at this stage. Features should generally be accessible without requiring a logged-in state, though some advanced functionalities may benefit from it later.

## 6. Future Enhancements & Opportunities for Improvement

- **Unified Data Models:** Further consolidate and standardize data models across the application to reduce redundancy and improve consistency.
- **Advanced Analytics & Visualizations:** Expand the use of D3.js and other visualization libraries to provide deeper insights into various data points (e.g., emotional trends, opportunity pipeline metrics).
- **Cross-Feature Integration:** Continuously identify and implement opportunities for features to interact and enrich each other (e.g., linking journal entries to ideas, or emotional logs to task performance).
- **Real-time Updates:** Explore WebSockets or Server-Sent Events (SSE) for more real-time updates in dashboards and interactive components.
- **Enhanced Security:** Implement more granular access control, data encryption at rest and in transit, and regular security audits.
- **Performance Optimization:** Ongoing profiling and optimization of API routes, database queries, and frontend rendering to ensure a highly responsive user experience.
- **User Onboarding & Education:** Develop guided tours, tooltips, and in-app documentation to help new users quickly understand and utilize Orion's features.
- **Personalization Engine:** Develop a more sophisticated personalization engine that uses historical data and user preferences to proactively suggest actions, content, or insights.
- **Mobile Responsiveness:** Ensure all UI components are fully responsive and optimized for various screen sizes.
- **Comprehensive Testing Suite:** Continuously expand the end-to-end (E2E), integration, and unit test coverage to ensure system stability and prevent regressions.
- **Scalability Initiatives:** Design for scalability from the ground up, anticipating future growth in user base and data volume.
