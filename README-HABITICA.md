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