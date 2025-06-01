# Opportunity Evaluator

The Opportunity Evaluator is a powerful feature within Orion designed to help you make confident, data-driven decisions about career and educational opportunities. This feature directly addresses PRD 5.5.1 and is specifically designed to enhance career & external opportunity growth by providing a structured framework for evaluating opportunities against your profile, goals, and values.

## Features

1. **Comprehensive Opportunity Analysis**: Evaluate job descriptions, academic programs, or project briefs against your profile and goals.
   - Get a quantitative fit score to understand alignment
   - Identify key points of strong alignment
   - Uncover potential gaps or areas of concern
   - Analyze risks and rewards

2. **Strategic Recommendations**: Receive clear guidance on how to proceed with opportunities.
   - Get a clear recommendation (Pursue, Delay & Prepare, Reject, Consider Further)
   - Understand the reasoning behind the recommendation
   - Receive suggested next steps for action

3. **Memory Integration**: The system leverages your past experiences and reflections from memory.
   - Incorporates relevant past experiences in the evaluation
   - Considers your documented goals and values
   - Creates a personalized analysis based on your unique profile

## How It Works

### Data Flow

1. User inputs opportunity details (title, description, type, optional URL)
2. System retrieves user profile data and relevant past experiences from memory
3. LLM analyzes the opportunity against the user's profile and experiences
4. System presents a structured evaluation with fit score, alignment highlights, gap analysis, and recommendations

### Technical Implementation

- **Backend Processing**:
  - `/api/orion/opportunity/evaluate`: API route for opportunity evaluation
  - Uses memory search to retrieve relevant past experiences
  - Leverages LLM for sophisticated opportunity analysis

- **Frontend Components**:
  - `OpportunityEvaluator.tsx`: UI for inputting opportunity details and displaying evaluation results
  - Structured display of fit score, alignment highlights, gap analysis, and recommendations

## Usage

1. Navigate to the "Opportunity Evaluator" page
2. Enter the opportunity details:
   - Title of the opportunity
   - Type (job, education, project, other)
   - Optional URL for reference
   - Full description or details of the opportunity
3. Click "Evaluate Opportunity" to start the analysis
4. Review the comprehensive evaluation results:
   - Overall fit score (percentage)
   - Recommendation and reasoning
   - Alignment highlights and gap analysis
   - Risk/reward analysis
   - Suggested next steps

## Contribution to Career & External Opportunity Growth

The Opportunity Evaluator directly enhances career & external opportunity growth by:

1. Providing a structured, analytical framework for evaluating opportunities
2. Ensuring decisions are aligned with your goals, values, and profile
3. Identifying potential gaps that could be addressed through preparation
4. Offering clear, actionable next steps for pursuing opportunities
5. Building confidence in career and educational decisions through data-driven analysis

This feature transforms the often overwhelming process of evaluating opportunities into a systematic, objective analysis that helps you make confident decisions aligned with your long-term goals and values.

# Narrative Clarity Studio

The Narrative Clarity Studio is a powerful feature within Orion designed to help you articulate your unique value, vision, and career trajectory in a compelling and coherent narrative. This feature directly addresses PRD 5.14 and is specifically designed to build confidence by helping you craft a clear personal narrative.

## Features

1. **Value Proposition Builder**: Define your core strengths, unique skills, passions, vision, and target audience.
   - Crystallize your unique value proposition in a concise statement
   - Identify what sets you apart and how you provide value

2. **Career Arc Mapping**: Document and organize your professional journey.
   - Record key milestones, achievements, and skills
   - Highlight the impact of your work
   - Organize milestones in a meaningful sequence

3. **Narrative Generation**: Create compelling narrative content for various purposes.
   - Generate personal bios, LinkedIn summaries, vision statements, elevator pitches, and more
   - Customize tone, length, and specific requirements
   - Incorporate your value proposition and career milestones

4. **Memory Integration**: The system automatically retrieves relevant achievements and experiences from your memory to incorporate into the narrative.

## How It Works

### Data Flow

1. User defines their value proposition through the UI
2. User documents career milestones and achievements
3. When generating narrative content:
   - User selects the type of narrative and preferences
   - System retrieves value proposition, career milestones, and relevant memories
   - LLM generates personalized narrative content
   - User can copy and use the generated content

### Technical Implementation

- **Frontend Components**:
  - `ValuePropositionForm.tsx`: Define your unique value proposition
  - `CareerMilestoneForm.tsx`: Add and edit career milestones
  - `CareerMilestoneList.tsx`: Display and manage career milestones
  - `NarrativeGenerationForm.tsx`: Generate narrative content

- **API Routes**:
  - `/api/orion/narrative/value-proposition`: Manage value proposition
  - `/api/orion/narrative/milestones`: CRUD operations for career milestones
  - `/api/orion/narrative/generate`: Generate narrative content

- **Services**:
  - `narrative_service.ts`: Manage narrative data
  - `orion_memory.ts`: Retrieve relevant memories
  - `orion_llm.ts`: Generate content using LLM

- **Types**:
  - `ValueProposition`: Structure for value proposition data
  - `CareerMilestone`: Structure for career milestone data
  - `NarrativeDocument`: Structure for generated narrative content

## Usage

1. Navigate to the "Narrative Clarity Studio" page
2. Define your value proposition in the "Value Proposition" tab
3. Add your career milestones in the "Career Milestones" tab
4. Generate narrative content in the "Generate Narrative" tab
   - Select the type of narrative you want to create
   - Choose tone and length preferences
   - Add any additional context or specific requirements
   - Generate and copy the narrative content

## Future Enhancements

- Templates for different narrative scenarios
- AI-assisted value proposition development
- Visual career timeline
- Integration with LinkedIn and other platforms
- Feedback and improvement suggestions for narratives

## Contribution to Confidence Building

The Narrative Clarity Studio directly builds confidence by:

1. Helping you articulate your unique value and strengths
2. Providing a clear view of your professional journey and achievements
3. Generating compelling narratives that showcase your value
4. Creating consistency in how you present yourself across different contexts
5. Giving you the language to speak confidently about your experience and vision

This feature transforms the often challenging task of self-presentation into a systematic, data-driven process that highlights your unique value proposition and professional journey.

# Memory Integration for Orion

This integration allows the NextJS app to interact with the Qdrant memory database through a Python API.

## Setup

1. Install the required Python dependencies:

```bash
cd orion_python_backend
pip install -r requirements.txt
```

2. Start the Python API server:

```bash
cd orion_python_backend
python notion_api_server.py
```

3. Set the environment variable in your NextJS app:

```
PYTHON_API_URL=http://localhost:5002
```

## Architecture

The memory integration consists of:

1. **Python API Server**: Handles communication with Qdrant
   - `/api/memory/search` - Search for memory points
   - `/api/memory/upsert` - Add or update memory points
   - `/api/memory/generate-embeddings` - Generate embeddings for text

2. **NextJS API Routes**: Proxy requests to the Python API
   - `/api/orion/memory/search-proxy`
   - `/api/orion/memory/upsert-proxy`
   - `/api/orion/memory/generate-embeddings-proxy`
   - `/api/orion/memory/index-text` - Convenience endpoint for indexing text

3. **React Components**:
   - `MemoryProvider` - Context provider for memory operations
   - `MemorySearch` - Search component
   - `MemoryInput` - Input component for adding memories
   - `JournalEntryWithMemory` - Journal entry component that uses memory

4. **React Hooks**:
   - `useMemory` - Hook for memory operations
   - `useMemoryContext` - Hook for accessing the memory context

## Usage

### In React Components

```jsx
import { useMemoryContext } from '@/components/orion/MemoryProvider';

export function MyComponent() {
  const { search, add, results, isLoading } = useMemoryContext();

  const handleSearch = async () => {
    await search('query text');
    // results will be updated automatically
  };

  const handleAdd = async () => {
    await add('Memory text', 'source-id', 'memory-type', ['tag1', 'tag2']);
  };

  return (
    <div>
      {results.map(result => (
        <div key={result.payload.source_id}>
          {result.payload.text}
        </div>
      ))}
    </div>
  );
}
```

### Direct API Calls

```javascript
// Search memory
const response = await fetch('/api/orion/memory/search-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    queryText: 'search query',
    filter: {
      must: [{ key: 'type', match: { value: 'journal_entry' } }]
    }
  })
});

// Add memory
const response = await fetch('/api/orion/memory/index-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Memory text',
    type: 'journal_entry',
    tags: ['journal', 'important']
  })
});
```

## Memory Structure

Each memory point has the following structure:

```typescript
interface MemoryPoint {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at?: string;
  type: string;
  tags?: string[];
  mood?: string;
  [key: string]: any; // Additional fields
}

interface ScoredMemoryPoint {
  score: number;
  payload: MemoryPoint;
  vector?: number[];
}
```

## Pages

- `/journal` - Journal page for writing and viewing journal entries
- `/memory-explorer` - Memory explorer for searching and adding memories


# Local File System Interaction

The Local File System Interaction feature enables Orion to securely access, read, and index files from designated directories on your local system. This feature directly addresses PRD 5.11 and is specifically designed to expand Orion's knowledge domain by incorporating your existing documents and files.

## Features

1. **Secure File Access**: Browse and read files from configured directories.
   - View directory contents
   - Read text-based file content
   - Ensure security through strict path validation

2. **File Indexing**: Add file content to Orion's memory for search and analysis.
   - Index individual files
   - Index entire directories
   - Track indexing status and results

3. **Memory Integration**: Indexed files become part of Orion's knowledge base.
   - Files are chunked and embedded for semantic search
   - File metadata is preserved for context
   - Content is accessible through Orion's memory system

## How It Works

### Data Flow

1. User configures accessible directories in environment variables
2. User browses directories and files through the UI
3. When indexing is requested, file content is:
   - Read and validated
   - Chunked into manageable segments
   - Embedded using the vector embedding system
   - Stored in Orion's memory with metadata
4. Indexed content becomes available for search and RAG operations

### Technical Implementation

- **Backend Services**:
  - `local_file_service.ts`: Core service for secure file operations
  - API routes for listing directories, reading files, and indexing content

- **API Routes**:
  - `/api/orion/local-fs/list-configured-dirs`: List accessible directories
  - `/api/orion/local-fs/list-files`: List contents of a directory
  - `/api/orion/local-fs/read-file`: Read content of a file
  - `/api/orion/local-fs/index-path`: Index a file or directory into memory

- **Frontend Components**:
  - `FileExplorer.tsx`: Browse directories and files
  - `FileViewer.tsx`: View file content
  - Local Files page for integrated browsing, viewing, and indexing

## Security Measures

1. **Path Validation**: All file operations verify that the requested path is within configured directories
2. **Read-Only Access**: The system only reads files, never modifies them
3. **File Type Restrictions**: Only supported text-based file types can be read
4. **Size Limits**: Large files are rejected to prevent system overload

## Usage

1. Configure accessible directories in your environment:
   - Set the `LOCAL_DOC_PATHS` environment variable with comma-separated paths
   - Example: `LOCAL_DOC_PATHS=/Users/username/Documents,/Users/username/Projects`

2. Navigate to the "Local Files" page:
   - Browse directories in the file explorer
   - Click on files to view their content
   - Use the "Index File" or "Index Directory" buttons to add content to Orion's memory

3. Access indexed content:
   - Use the "Ask Question" feature with RAG to query indexed files
   - Files will appear in memory searches
   - Content will inform other Orion features like the Opportunity Evaluator

## Contribution to Orion's Knowledge Domain

The Local File System Interaction feature significantly enhances Orion's capabilities by:

1. Expanding its knowledge base beyond manually entered information
2. Providing access to your existing documents, notes, and research
3. Creating a more comprehensive context for RAG operations
4. Enabling deeper analysis by incorporating more of your personal knowledge

This feature transforms Orion from a system limited to what you explicitly tell it into one that can leverage your existing knowledge base, making it a more powerful and contextually aware partner in your growth journey.

# Habitica Integration

The Habitica Integration is a powerful feature within Orion designed to help you translate insights and plans into actionable tasks. This feature directly addresses PRD 5.4 and is specifically designed to build systemic self-mastery by connecting reflection with action.

## Features

1. **Habitica Credentials Management**: Securely store and manage your Habitica API credentials.
   - Connect Orion to your Habitica account
   - Validate credentials before saving

2. **Habitica Dashboard**: View your Habitica stats and tasks in one place.
   - See your health, mana, experience, and gold
   - View your active to-dos
   - View your completed to-dos

3. **Task Management**: Create and complete tasks directly from Orion.
   - Add new to-dos with optional notes
   - Mark tasks as complete
   - View task completion status

4. **Journal Integration**: Extract actionable tasks from journal reflections.
   - Use AI to identify potential tasks in your reflections
   - Add these tasks directly to Habitica with a single click
   - Bridge the gap between insight and action

## How It Works

### Data Flow

1. User connects Orion to Habitica by providing API credentials
2. Orion fetches user stats and tasks from Habitica
3. User can create new tasks or complete existing ones
4. When journaling, the AI can extract potential tasks from reflections
5. These tasks can be added directly to Habitica

### Technical Implementation

- **Backend Client**:
  - `habitica_client.ts`: A TypeScript client for interacting with the Habitica API

- **API Routes**:
  - `/api/orion/habitica/user`: Manage Habitica credentials and fetch user stats
  - `/api/orion/habitica/tasks`: Fetch tasks and create new to-dos
  - `/api/orion/habitica/tasks/score`: Complete tasks

- **Frontend Components**:
  - `HabiticaCredentialsForm.tsx`: Form for entering Habitica credentials
  - `HabiticaStats.tsx`: Display user stats (health, mana, experience, gold)
  - `HabiticaTaskList.tsx`: Display and interact with tasks
  - `HabiticaAddTodo.tsx`: Form for adding new to-dos
  - `AddTaskFromReflection.tsx`: Extract and add tasks from journal reflections

## Usage

1. Navigate to the "Habitica Integration" page
2. Enter your Habitica User ID and API Token (found in Settings > API on the Habitica website)
3. View your Habitica dashboard with stats and tasks
4. Add new to-dos or complete existing ones
5. When journaling, use the "Extract Task" feature to identify actionable items
6. Add these tasks directly to Habitica with a single click

## Integration with Journal

The Habitica Integration works seamlessly with the Journal feature:

1. Write a journal entry and receive an AI-powered reflection
2. The "Extract Task from Reflection" component analyzes the reflection
3. It identifies potential actionable items
4. You can review and edit the extracted task
5. Add the task directly to Habitica with a single click

This creates a powerful workflow:
- **Reflect** on your experiences and insights in the journal
- **Identify** actionable steps from these reflections
- **Act** by adding these steps to your Habitica task list
- **Track** your progress and build habits

## Contribution to Systemic Self-Mastery

The Habitica Integration directly builds systemic self-mastery by:

1. Closing the loop between reflection and action
2. Providing a structured system for task management
3. Encouraging the habit of turning insights into concrete steps
4. Creating accountability through task tracking
5. Gamifying productivity through Habitica's RPG mechanics

This feature transforms Orion from a purely reflective tool into an action-oriented system that helps you implement the insights you gain from reflection.



# Habitica Integration

The Habitica Integration feature connects Orion to your Habitica account, creating a powerful bridge between insights and action. This feature directly addresses PRD 5.4 and is specifically designed to enhance systemic self-mastery by translating insights into structured tasks and habits.

## Features

1. **Secure Credential Management**: Connect Orion to your Habitica account.
   - Store and verify Habitica User ID and API Token
   - Secure credential handling
   - Easy connection management

2. **Task Management**: View and manage your Habitica tasks.
   - Display to-dos and dailies
   - Mark tasks as complete/incomplete
   - Create new tasks with customizable properties

3. **Stats Display**: Monitor your Habitica character's progress.
   - View level, class, and gold
   - Track health, experience, and mana
   - Stay connected to your gamified productivity system

4. **Cross-Module Integration**: Turn insights from other Orion modules into action.
   - Convert journal entries into tasks
   - Transform pattern insights into actionable items
   - Create tasks from anywhere in Orion

## How It Works

### Data Flow

1. User connects Orion to Habitica by providing API credentials
2. Orion securely stores these credentials in session state
3. Orion communicates with the Habitica API to fetch and update data
4. User can view stats, manage tasks, and create new to-dos
5. Other Orion modules can suggest tasks based on their insights

### Technical Implementation

- **Backend Components**:
  - `habitica_client.ts`: Core client for Habitica API communication
  - API routes for stats, tasks, task creation, and task scoring
  - Secure credential handling and verification

- **Frontend Components**:
  - `HabiticaCredentialsForm.tsx`: Connect to Habitica account
  - `HabiticaStatsDisplay.tsx`: View character stats
  - `HabiticaTaskList.tsx`: Manage tasks
  - `HabiticaTaskForm.tsx`: Create new tasks
  - `TaskCreationButton.tsx`: Create tasks from anywhere
  - Integration components for journals and patterns

## Usage

1. **Connect to Habitica**:
   - Navigate to the Habitica page
   - Enter your Habitica User ID and API Token
   - Click "Save & Verify Credentials"

2. **Manage Tasks**:
   - View your to-dos and dailies
   - Check off completed tasks
   - Create new tasks with the task form

3. **Create Tasks from Insights**:
   - Journal entries with task-like content will suggest task creation
   - Pattern insights with actionable suggestions can be converted to tasks
   - Use the task creation button from anywhere in Orion

## Integration Points

1. **Journal Integration**:
   - Detects potential tasks in journal entries
   - Offers one-click task creation for detected items
   - Supports markdown task syntax, TODO prefixes, and action phrases

2. **Pattern Tracker Integration**:
   - Extracts actionable insights from pattern analysis
   - Converts insights into task suggestions
   - Provides context for why the task is important

3. **Future Integration Possibilities**:
   - Opportunity Evaluator: Create tasks for next steps
   - Emotional Tracker: Create tasks for emotional well-being
   - Narrative Studio: Create tasks for personal narrative development

## Contribution to Systemic Self-Mastery

The Habitica Integration directly enhances systemic self-mastery by:

1. Completing the "Insight -> Plan -> Action -> Reflection" loop
2. Transforming Orion from primarily analytical to truly actionable
3. Providing a structured system for task management and habit building
4. Creating a bridge between understanding and doing
5. Leveraging gamification to increase motivation and engagement

This feature makes Orion a more complete life-architecture system by ensuring that insights and plans can be seamlessly translated into concrete actions and tracked habits.


# Enhanced RAG for Ask Question

The Enhanced RAG (Retrieval-Augmented Generation) feature improves Orion's question-answering capabilities by allowing you to filter which types of memories are used as context. This refinement directly addresses the goal of making Orion's existing intelligence more interconnected and insightful.

## Features

1. **Memory Type Filtering**: Specify which types of memories to prioritize in searches.
   - Journal entries
   - Journal reflections
   - WhatsApp analysis
   - Local documents (text, markdown, JSON)
   - Other memory types as they become available

2. **Memory Tag Filtering**: Target memories with specific tags.
   - Filter by project names
   - Filter by topics
   - Filter by relationship names
   - Any other tags used in your memory system

3. **Improved Context Relevance**: Get more precise answers by focusing on the most relevant data.
   - Reduce noise from unrelated memory types
   - Increase signal from highly relevant sources
   - Improve answer quality for domain-specific questions

4. **Transparent Filtering**: Clear indication when filters are applied.
   - Visual indicators for active filters
   - Mention of filtered context in answers
   - Easy filter management

## How It Works

### Data Flow

1. User enters a question and optionally selects memory filters
2. System constructs a query filter based on selected memory types and tags
3. Memory search API applies these filters when retrieving relevant context
4. LLM receives the filtered context along with the question
5. Answer is generated with a focus on the specified memory domains

### Technical Implementation

- **Backend Enhancements**:
  - Updated LLM API route to accept and process memory filters
  - Modified memory search query construction to include type and tag filters
  - Enhanced prompt construction to reference filtered context

- **Frontend Components**:
  - Added collapsible filter section to the Ask Question form
  - Implemented memory type checkboxes for common memory sources
  - Added tag input for fine-grained filtering
  - Included filter status indicators

## Usage

1. Navigate to the "Ask Question" page
2. Enter your question as usual
3. Click on "Memory Filters" to expand the filter options
4. Select specific memory types to prioritize (e.g., Journal Entries, WhatsApp Analysis)
5. Optionally enter tags to further refine the search (e.g., "career,project-x")
6. Submit your question
7. Receive an answer that focuses on the specified memory domains

## Benefits

1. **More Precise Answers**: Get responses that draw from the most relevant parts of your memory.
2. **Domain-Specific Queries**: Ask questions about particular areas of your life or specific projects.
3. **Reduced Noise**: Filter out irrelevant information that might dilute the quality of answers.
4. **Cross-Domain Insights**: Deliberately combine different memory types to discover connections.
5. **Improved Control**: Take greater control over how Orion leverages your personal knowledge base.

This enhancement transforms the Ask Question feature from a general-purpose query tool into a precision instrument that can target specific domains of your knowledge and experience, making Orion's insights even more valuable and relevant to your needs.


# Emotional Tracker

The Emotional Tracker is a powerful feature within Orion designed to help you log, track, and understand your emotional patterns and triggers. This feature directly addresses the "Emotional & Relational Growth" dimension of your growth framework and is specifically designed to enhance self-awareness, identify patterns, and support emotional well-being.

## Features

1. **Comprehensive Emotion Logging**: Record detailed information about your emotional experiences.
   - Log primary and secondary emotions
   - Track emotion intensity
   - Document triggers and physical sensations
   - Record thoughts and coping mechanisms

2. **Emotional History Tracking**: Review and analyze your emotional logs over time.
   - Filter by date range and specific emotions
   - View detailed logs with context
   - Track patterns and trends

3. **Journal Integration**: Seamlessly log emotions from journal entries.
   - Automatically extract potential emotions from journal text
   - Link emotional logs to specific journal entries
   - Build a more complete picture of your emotional landscape

4. **Trend Analysis**: Gain insights into your emotional patterns.
   - Identify most frequent emotions and triggers
   - Track emotion intensity over time
   - Receive AI-powered insights and suggestions

## How It Works

### Data Flow

1. User logs emotions through the dedicated form or from journal entries
2. Emotional data is stored in a structured SQLite database
3. User can view and filter their emotional history
4. System analyzes emotional data to identify patterns and trends

### Technical Implementation

- **Backend Storage**:
  - `database.ts`: SQLite database utility for structured data storage
  - `emotional_logs` table for storing detailed emotional data

- **API Routes**:
  - `/api/orion/emotions/log`: Log new emotional experiences
  - `/api/orion/emotions/history`: Retrieve emotional logs with filtering
  - `/api/orion/emotions/trends`: Analyze emotional patterns and trends

- **Frontend Components**:
  - `EmotionalLogForm.tsx`: Form for logging emotions
  - `EmotionalLogHistory.tsx`: Display and filter emotional logs
  - `JournalEmotionIntegration.tsx`: Integration with journal entries

## Usage

1. Navigate to the "Emotional Tracker" page
2. Use the "Log Emotion" tab to record your current emotional state
   - Select primary emotion and intensity
   - Add optional details like secondary emotions, triggers, and thoughts
3. Use the "History" tab to review past emotional logs
   - Filter by date range or specific emotions
   - Analyze patterns and trends over time
4. When journaling, use the emotion logging integration to capture emotions directly from journal entries

## Integration with Journal

The Emotional Tracker works seamlessly with the Journal feature:

1. After writing a journal entry, use the "Log Emotion from Journal" card
2. The system will attempt to extract potential emotions from your journal text
3. Add any additional details about your emotional state
4. The emotional log will be linked to the journal entry for context

## Contribution to Emotional & Relational Growth

The Emotional Tracker directly enhances emotional and relational growth by:

1. Building self-awareness through regular emotion logging
2. Identifying patterns and triggers that affect emotional well-being
3. Tracking emotional trends over time to measure progress
4. Providing insights and suggestions for emotional regulation
5. Creating a more complete picture of your emotional landscape

This feature transforms Orion into a powerful tool for emotional intelligence and self-awareness, helping you understand and navigate your emotional experiences more effectively.


# CV Tailoring System for Orion

This document describes the CV Tailoring System implementation for the Orion platform, which allows users to automatically select, tailor, and assemble CV components based on job descriptions.

## Architecture

The CV Tailoring System consists of the following components:

1. **Python API Server** (`notion_api_server.py`):
   - Handles communication with Notion to fetch CV components
   - Provides endpoints for CV component operations
   - Integrates with LLMs for component selection, rephrasing, and assembly

2. **Next.js API Routes**:
   - `/api/orion/cv/suggest-components`: Suggests CV components based on JD analysis
   - `/api/orion/cv/rephrase-component`: Rephrases a CV component based on JD analysis
   - `/api/orion/cv/tailor-summary`: Tailors a CV summary based on JD analysis
   - `/api/orion/cv/assemble`: Assembles a CV from selected components

3. **React Components**:
   - `CVTailoringStudio`: Main UI component for CV tailoring
   - `OpportunityDetailView`: Opportunity view with CV tailoring integration

4. **React Hooks**:
   - `useCVTailoring`: Hook for CV tailoring functionality

5. **Client Library**:
   - `lib/cv.ts`: Client library for CV component management and tailoring

## Data Flow

1. User selects an opportunity to tailor their CV for
2. System fetches CV components from Notion via the Python API
3. LLM suggests relevant components based on JD analysis
4. User selects components to include in their CV
5. LLM rephrases each component to match the job requirements
6. System assembles the tailored CV
7. User can save the tailored CV to the opportunity

## API Endpoints

### Python API Server

#### `GET /api/notion/cv-components`
Fetches all CV components from Notion.

#### `POST /api/llm/cv/suggest-components`
Suggests CV components based on JD analysis.

**Request:**
```json
{
  "jd_analysis": "Job description analysis text",
  "job_title": "Software Engineer",
  "company_name": "Example Corp"
}
```

**Response:**
```json
{
  "success": true,
  "suggested_component_ids": ["id1", "id2", "id3"]
}
```

#### `POST /api/llm/cv/rephrase-component`
Rephrases a CV component based on JD analysis.

**Request:**
```json
{
  "component_id": "id1",
  "jd_analysis": "Job description analysis text",
  "web_research_context": "Optional web research context"
}
```

**Response:**
```json
{
  "success": true,
  "component_id": "id1",
  "original_content": "Original content",
  "rephrased_content": "Rephrased content"
}
```

#### `POST /api/llm/cv/tailor-summary`
Tailors a CV summary based on JD analysis.

**Request:**
```json
{
  "component_id": "id1",
  "jd_analysis": "Job description analysis text",
  "web_research_context": "Optional web research context"
}
```

**Response:**
```json
{
  "success": true,
  "component_id": "id1",
  "original_content": "Original content",
  "tailored_content": "Tailored content"
}
```

#### `POST /api/llm/cv/assemble`
Assembles a CV from selected components.

**Request:**
```json
{
  "selected_component_ids": ["id1", "id2", "id3"],
  "template_name": "Standard",
  "header_info": "TOMIDE ADEOYE\ntomideadeoye@gmail.com",
  "tailored_content_map": {
    "id1": "Tailored content for id1",
    "id2": "Tailored content for id2"
  }
}
```

**Response:**
```json
{
  "success": true,
  "assembled_cv": "Full assembled CV text"
}
```

### Next.js API Routes

These routes proxy requests to the Python API server and handle authentication and error handling.

## UI Components

### CVTailoringStudio

The main UI component for CV tailoring, which provides:

1. Component selection interface
2. Component tailoring interface
3. CV assembly and preview

### OpportunityDetailView

Opportunity view with CV tailoring integration, which provides:

1. Overview of the opportunity
2. Links to various opportunity actions, including CV tailoring
3. Preview of the tailored CV

## Usage

1. Navigate to an opportunity detail page
2. Click on "Tailor CV" or go to the CV tab
3. Select CV components to include
4. Use AI to tailor each component
5. Assemble and preview the tailored CV
6. Save the tailored CV to the opportunity

## Future Enhancements

1. **Template Library**: Add more CV templates with different styles and formats
2. **Export Options**: Add options to export the CV as PDF, Word, or other formats
3. **Version History**: Track changes to the CV over time
4. **Component Analytics**: Track which components are most effective for different job types
5. **Collaborative Editing**: Allow multiple users to collaborate on CV tailoring


# Idea Incubator

The Idea Incubator is a dedicated space within Orion for capturing, developing, and nurturing creative ideas. This feature directly addresses the "Creative & Existential Growth" dimension of the Whole-System Growth Framework, providing a structured environment for innovation and vision development.

## Features

1. **Idea Capture**: Quickly record creative sparks before they fade.
   - Simple form for capturing idea title, description, and tags
   - Automatic status tracking from initial capture through development
   - Seamless storage in structured database

2. **Idea Development**: Nurture ideas through various stages of growth.
   - Add notes and thoughts as ideas evolve
   - Track status changes (raw spark → fleshing out → researching → prototyping)
   - Maintain a complete history of idea evolution

3. **AI-Assisted Brainstorming**: Leverage Orion's intelligence to develop ideas further.
   - Generate brainstorming content based on idea context
   - Explore potential challenges, opportunities, and next steps
   - Receive creative suggestions for idea enhancement

4. **Idea Management**: Organize and track your creative portfolio.
   - Filter ideas by status, tags, or search terms
   - View idea history and development timeline
   - Maintain a comprehensive library of your creative thinking

## How It Works

### Data Flow

1. User captures a new idea with title, description, and optional tags
2. Idea is stored in the SQLite database with initial "raw_spark" status
3. User can add notes, change status, or request AI brainstorming
4. All interactions are logged in the idea_logs table for a complete history
5. Brainstorming content is also stored in Orion's memory for future reference

### Technical Implementation

- **Backend Components**:
  - SQLite tables for structured idea and log storage
  - API routes for idea creation, retrieval, updating, and brainstorming
  - Integration with LLM for generating brainstorming content

- **Frontend Components**:
  - `IdeaCaptureForm.tsx`: Interface for capturing new ideas
  - `IdeaList.tsx`: Display and filtering of idea collection
  - `IdeaDetailView.tsx`: Comprehensive view for idea development
  - Tabs for notes, history, and brainstorming

## Usage

1. **Capture Ideas**:
   - Navigate to the Idea Incubator page
   - Fill in the idea title, optional description, and tags
   - Click "Capture Idea" to save

2. **Develop Ideas**:
   - Browse your idea collection and select an idea to develop
   - Add notes to record thoughts and progress
   - Update status as the idea evolves
   - Use AI-assisted brainstorming for inspiration and guidance

3. **Manage Ideas**:
   - Filter ideas by status, tags, or search terms
   - Review idea history to track development
   - Archive completed or abandoned ideas

## Contribution to Creative & Existential Growth

The Idea Incubator directly enhances creative and existential growth by:

1. Providing a dedicated space for capturing fleeting creative sparks
2. Offering a structured approach to idea development and refinement
3. Leveraging AI assistance to expand thinking and explore possibilities
4. Creating a comprehensive record of creative evolution over time
5. Supporting the "Creator/Architect" identity with tools for innovation

This feature transforms Orion into a powerful partner for creative thinking and vision development, helping to bring innovative ideas from initial spark to concrete reality.
