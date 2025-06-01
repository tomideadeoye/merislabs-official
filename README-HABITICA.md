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
