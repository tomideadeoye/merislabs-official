/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview The interactive client-side view for a single opportunity, serving as the central "Command Center" for managing and progressing through the Opportunity Super-Flow.
 * @description This component displays detailed information about a specific `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` and provides interactive buttons to trigger key actions within the opportunity lifecycle, such as AI evaluation and transitioning to CV tailoring. It now features a tabbed interface to manage various aspects of an opportunity, including job description, AI evaluation, and future communication tools.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To display comprehensive details of a selected `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` within a tabbed interface.
 *   - To initiate and manage the AI-driven evaluation process for the opportunity by calling the relevant backend API.
 *   - To store the AI evaluation results in local storage for persistence and quick access.
 *   - To provide clear visual feedback to the user on loading states, evaluation progress, and any errors.
 *   - To serve as the navigation hub for the subsequent stages of the Opportunity Super-Flow, which are accessible independently and non-sequentially, through distinct tabs.
 *
 * FULL OPPORTUNITY SUPER-FLOW WORKFLOW (Non-Sequential & Tab-Based Access):
 *   Orion's Opportunity Super-Flow is designed for flexibility. While a natural progression exists, each major step can be initiated independently or revisited as needed. Data dependencies are handled gracefully (e.g., if evaluation isn't complete, LLMs will prioritize available profile and web data).
 *   These steps are envisioned as distinct 'tabs' or action points from the Opportunity Detail 'Command Center':
 *   1. View Details (this component - now within "Job Description" tab)
 *   2. Generate AI Evaluation (triggered from within "AI Evaluation" tab, not a prerequisite for other steps)
 *   3. Enter CV Tailoring Studio (navigated from this component, can be accessed without prior evaluation)
 *   4. Get AI Component Suggestions (within CV Tailoring Studio)
 *   5. Assemble Tailored CV (within CV Tailoring Studio)
 *   6. Draft Personalized Email (future functionality, within a dedicated tab in this component)
 *   7. Send Email with CV Attached (future functionality, triggered from this component)
 *   8. Engage Stakeholders (merge outreach folder, python api 8000 /api/find_stakeholders, within a dedicated tab in this component)
 *
 * the opportunity type could be a propsal
 *
 * FILEPATH: `app/components/ui/orion/opportunities/OpportunityDetailView.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/navigation`: Uses `useRouter` for programmatic navigation between pages.
 *   - `@/hooks/useLocalStorage`: Persists evaluation results locally to improve user experience.
 *   - `@/lib/types`: Imports `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` and `EvaluationOutput` for strict type-checking of data models.
 *   - `@/lib/apiClient`: Used to make HTTP requests to backend API routes (e.g., `/api/orion/profile`, `/api/orion/opportunity/[id]/evaluation`).
 *   - `@/lib/logger`: Provides comprehensive logging for actions and states within the component.
 *   - `react-hot-toast`: Used for displaying user-friendly success, loading, and error notifications.
 *   - `@/components/ui/button`, `@/components/ui/card`, `@/components/ui/tabs`: Imports Shadcn UI components for consistent styling and interaction, including the new tab system.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `FileText`, `Send`, `BarChart2`, `AlertTriangle`) for visual feedback.
 *   - `@/lib/utils/clientErrorHandler`: Centralized utility for consistent API error handling and message extraction.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/page.tsx`: This is the parent page that renders this `OpportunityDetailView` component, passing the `opportunity` prop.
 *   - `app/api/orion/profile/route.ts`: API endpoint for fetching user profile data.
 *   - `app/api/orion/opportunity/[id]/evaluation/route.ts`: API endpoint for generating AI evaluation of an opportunity.
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/cv-tailoring/page.tsx`: The target page for navigating to the CV tailoring studio.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the `opportunity` prop is provided and contains valid `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` data.
 *   - Assumes backend API endpoints (`/api/orion/profile`, `/api/orion/opportunity/[id]/evaluation`) are operational and return data in the expected format.
 *   - Evaluation results are stored in the browser's local storage; this means they are client-specific and not persisted across devices or browsers.
 *   - The component actively manages its own loading and error states for user feedback.
 *   - Crucially, the workflow allows for non-linear progression: actions like 'Draft Personalized Email' or 'Engage Stakeholders' can proceed using available profile, opportunity, and web data, even if a formal AI evaluation hasn't been explicitly triggered or completed.
 *   - The new tabs enhance the modularity and user experience, allowing quick access to different opportunity-related functionalities.
 *
 * NOTES:
 *   - This component centralizes the user interaction flow for individual opportunities, streamlining the process of evaluation, application preparation, and communication management.
 *   - Comprehensive logging helps in debugging the client-side flow and API interactions.
 *   - The use of `react-hot-toast` provides a delightful and consistent user feedback experience.
 *   - The tabbed interface improves the organization of features related to an opportunity.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Server-Side Evaluation Persistence**: Instead of relying solely on local storage, persist the `evaluationOutput` directly to the `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` record in the Neon database via the `opportunity_db_service` or a dedicated API endpoint after a successful evaluation.
 *   - **Progress Indicators**: For longer evaluation times, consider a more granular progress indicator (e.g., a progress bar or step-by-step messages).
 *   - **Debounce Evaluation Trigger**: If `handleGenerateEvaluation` can be called rapidly, consider debouncing the function to prevent multiple concurrent API calls.
 *   - **Refine Error Display**: While `toast.error` is present, consider displaying more specific error details in the UI for advanced debugging by the user, perhaps in an expandable alert.
 *   - **Offline Mode/Optimistic UI**: For a truly seamless experience, explore optimistic UI updates or basic offline capabilities if `useLocalStorage` is extended for more features.
 *   - **Test Coverage**: Implement comprehensive unit and integration tests for this component, focusing on user interaction flows, state changes, API call handling, and error display.
 *   - **Dynamic Tab Content Loading**: For performance, consider lazily loading tab content only when a tab is activated, especially for complex or data-intensive tabs.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The `handleGenerateEvaluation` logic, especially the profile fetching and API calling, could potentially be extracted into a custom hook (`useOpportunityEvaluation`) to reduce component-level boilerplate and promote reusability if similar evaluation triggers appear elsewhere.
 *   - Error handling and toast notifications could be further centralized or wrapped in a custom hook for even greater consistency across the application's client-side.
 */
'use client';

import { Opportunity } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logger from '@/lib/logger';

interface Props {
  opportunity: Opportunity;
}

export function OpportunityDetailView({ opportunity }: Props) {
  logger.info('[OpportunityDetailView][RENDER]', { id: opportunity.id, function: 'OpportunityDetailView' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{opportunity.content || 'No description available.'}</p>
      </CardContent>
    </Card>
  );
}
