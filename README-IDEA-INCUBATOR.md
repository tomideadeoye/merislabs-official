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