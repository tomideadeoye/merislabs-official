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