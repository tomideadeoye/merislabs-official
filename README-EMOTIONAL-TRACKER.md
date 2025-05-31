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