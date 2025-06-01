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