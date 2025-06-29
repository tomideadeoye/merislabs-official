/**
 * @fileoverview Client-side component for drafting emails and LinkedIn messages related to an opportunity.
 * @description This component provides the UI for generating and managing email and LinkedIn message drafts, leveraging the `EmailDraftingStudio` for the core functionality. It receives the opportunity details as a prop from its parent, making it reusable within different contexts.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To render the `EmailDraftingStudio` component for a specific `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA`.
 *   - To serve as a dedicated client-side container for email and LinkedIn message drafting within the Opportunity Super-Flow.
 *
 * FILEPATH: `app/components/orion/opportunities/EmailLinkedinDraftContent.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/types`: Imports `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` for type consistency.
 *   - `@/components/orion/opportunities/EmailDraftingStudio.tsx`: The primary client component that provides the drafting UI and logic.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/page.tsx`: This is the parent page that will render this component, passing the `opportunity` prop.
 *   - `@/lib/logger`: For comprehensive logging of component actions and states.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the `opportunity` prop is provided and contains valid `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` data.
 *   - This component is designed to be purely client-side and receives all necessary data via props.
 *
 * NOTES:
 *   - This component centralizes the email/LinkedIn drafting feature, making it modular and integrating cleanly into the tabbed interface.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Assembled CV Persistence**: If `EmailDraftingStudio` needs the assembled CV, ensure it's either passed as a prop, fetched from local storage within this component, or ideally, persisted server-side for robustness.
 *   - **LinkedIn Message Generation**: Extend `EmailDraftingStudio` or integrate a new component specifically for LinkedIn message generation based on the opportunity and tailored CV.
 */
'use client';

import { Opportunity } from '@prisma/client';
import { EmailDraftingStudio } from '@/components/orion/opportunities/EmailDraftingStudio';
import logger from '@/lib/logger';

interface EmailLinkedinDraftContentProps {
  opportunity: Opportunity;
}

export function EmailLinkedinDraftContent({ opportunity }: EmailLinkedinDraftContentProps) {
  logger.info('[EmailLinkedinDraftContent][RENDER]', { id: opportunity.id });

  return (
    <div className="space-y-6 p-4 rounded-lg bg-gray-800 text-gray-300 shadow-glow">
      <h3 className="text-xl font-semibold mb-4 text-orange-300">Email & LinkedIn Drafts</h3>
      <EmailDraftingStudio opportunity={opportunity} />
    </div>
  );
}
