/**
 * @fileoverview Defines the various CV templates available within the Orion system.
 * @description This module centralizes the Markdown templates used for assembling tailored CVs based on selected components.
 * It allows for consistent structuring of the final CV document according to professional standards (FR-5.2).
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide predefined Markdown templates for CV assembly (FR-5.2).
 *   - To ensure a consistent and professional layout for all generated CVs.
 *   - To make it easy to add new CV templates in the future (Non-Functional Requirement: Extensibility).
 *
 * FILEPATH: `app/lib/cv_templates.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/api/orion/cv/assemble/route.ts`: This API route will import and use `HYBRID_CV_TEMPLATE` to structure the assembled CV Markdown (FR-5.2).
 *   - `app/components/orion/CVTailoringStudio.tsx`: While not directly imported, the UI is designed around the concept of these templates for preview and assembly.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that component content will be appropriately formatted to fit within the placeholders of these templates.
 *   - The templates are Markdown-based, expecting Markdown-compatible content from CV components.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Extensibility: New templates can be easily added and selected.
 *   - Maintainability: Centralized templates simplify updates and consistency.
 *
 * NOTES:
 *   - The `HYBRID_CV_TEMPLATE` is designed for a common professional resume structure, combining summary, experience, and other sections.
 *   - Placeholders like `{SUMMARY_CONTENT}` and `{EXPERIENCE_CONTENT}` will be replaced dynamically by the assembly API.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Placeholders**: Implement a more sophisticated placeholder system to allow for fine-grained control over where different types of component content are inserted (e.g., specific skills, education details).
 *   - **Template Versioning**: If templates change frequently, consider a versioning system to ensure older assembled CVs can still be rendered correctly.
 *   - **User-Defined Templates**: Allow advanced users to create and save their own custom Markdown CV templates.
 *   - **Rich Text Integration**: If CV components support rich text, the templating engine would need to handle HTML or a similar format for assembly.
 */

export const HYBRID_CV_TEMPLATE = `
# {CANDIDATE_NAME}

[Your Contact Information - e.g., Phone | Email | LinkedIn Profile | Portfolio URL]

## Professional Summary
{SUMMARY_CONTENT}

## Experience
{EXPERIENCE_CONTENT}

## Education
{EDUCATION_CONTENT}

## Skills
{SKILLS_CONTENT}

## Projects
{PROJECTS_CONTENT}

## Certifications / Awards
{CERTIFICATIONS_CONTENT}
`;

// Add more templates as needed in the future
