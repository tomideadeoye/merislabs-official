# Routines Module

The Routines Module is a powerful feature within Orion designed to transform it from a reactive tool into a proactive daily partner. This feature directly addresses PRD 5.8 and is specifically designed to enhance systemic self-mastery by orchestrating your daily engagement with Orion.

## Features

1. **Morning Kickstart**: Start your day with intention and clarity.
   - Log your morning mood
   - Receive a thought-provoking prompt for the day
   - Review key tasks from Habitica
   - Link to journal for morning intentions

2. **Evening Wind-Down**: Reflect on your day and prepare for restful peace.
   - Review completed tasks
   - Receive a reflection prompt
   - Log your evening mood
   - Link to journal for evening reflection

3. **Routine Status Tracking**: Monitor your daily routine completion.
   - Visual indicators of completed routines
   - Time-aware suggestions for which routine to focus on
   - Dashboard integration for quick access

4. **Integration with Existing Features**: Seamlessly connects with other Orion modules.
   - Emotional Tracker for mood logging
   - Habitica for task management
   - Journal for deeper reflection
   - LLM for personalized prompts and thoughts

## How It Works

### Data Flow

1. User accesses the Routines page or dashboard
2. System determines the appropriate routine based on time of day
3. User completes routine steps (mood logging, task review, etc.)
4. System tracks completion status in session state
5. Dashboard updates to reflect routine progress

### Technical Implementation

- **Backend Integration**:
  - LLM API for generating daily thoughts and reflection prompts
  - Habitica API for fetching tasks and completed items
  - Emotional Tracker API for mood logging

- **Frontend Components**:
  - `MorningRoutine.tsx`: Guide for morning check-in
  - `EveningRoutine.tsx`: Guide for evening reflection
  - `RoutineStatus.tsx`: Track routine completion
  - `DashboardRoutineStatus.tsx`: Dashboard integration

## Usage

1. Start your day with the Morning Kickstart:
   - Log how you're feeling
   - Reflect on the thought for the day
   - Review and check off key tasks
   - Optionally journal your intentions

2. End your day with the Evening Wind-Down:
   - Review what you accomplished
   - Consider the reflection prompt
   - Log your evening mood
   - Optionally journal your reflections

3. Track your progress on the dashboard:
   - See which routines are completed
   - Get suggestions for what to do next
   - Access quick links to key features

## Contribution to Systemic Self-Mastery

The Routines Module directly enhances systemic self-mastery by:

1. Establishing consistent daily practices for growth and reflection
2. Creating a structured framework for engaging with Orion's features
3. Building habits that support emotional awareness and intentional action
4. Providing a clear daily touchpoint with Orion
5. Integrating various aspects of your growth framework into a cohesive daily flow

This feature transforms Orion from a collection of powerful but separate tools into an orchestrated system that guides you through a productive and mindful daily rhythm.