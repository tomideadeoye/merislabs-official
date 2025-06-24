/**
 * @fileoverview Server Component to fetch data for a single opportunity and render the client view.
 * @description This page acts as the data-loading entry point for the Opportunity Command Center.
 * It fetches the opportunity details and all CV components from the database.
 * It then presents these details within a unified tabbed interface, integrating Job Description, AI Evaluation,
 * CV Tailoring, Stakeholders, and Email & LinkedIn Drafts into a single view.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the central hub for managing a specific `OrionOpportunity`.
 *   - To fetch and provide `OrionOpportunity` data and `CVComponent` data to child components.
 *   - To present a tabbed interface for seamless navigation between various opportunity-related functionalities.
 *   - To integrate `OpportunityDetailView` for job description, `AIEvaluationContent` for AI evaluation,
 *     `CVTailoringStudio` for CV customization, `CompanyStakeholderOutreach` for stakeholder management, and
 *     `EmailLinkedinDraftContent` for communication drafting.
 *
 * FILEPATH: `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/page.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/opportunity_db_service.ts`: Utilized `getOpportunityByIdFromDb` to fetch opportunity data.
 *   - `app/lib/cv_components_db_service.ts`: Utilized `fetchAllCvComponents` to retrieve all CV components.
 *   - `@/components/ui/orion/opportunities/OpportunityDetailView.tsx`: Displays the job description content.
 *   - `@/components/orion/opportunities/AIEvaluationContent.tsx`: Handles AI-driven opportunity evaluation.
 *   - `@/components/orion/CVTailoringStudio.tsx`: Allows users to tailor their CV for the opportunity.
 *   - `@/components/orion/opportunities/CompanyStakeholderOutreach.tsx`: Manages company stakeholder information.
 *   - `@/components/orion/opportunities/EmailLinkedinDraftContent.tsx`: Provides tools for drafting emails and LinkedIn messages.
 *   - `next/navigation`: Uses `notFound` for handling missing opportunities.
 *   - `@/components/ui/page-header`: For consistent page title and description.
 *   - `@/components/ui/tabs`: Shadcn UI components for the tabbed interface.
 *   - `lucide-react`: Provides icons (`Briefcase`) for visual elements.
 *   - `@/lib/types`: Imports `OrionOpportunity` and `CVComponent` for type consistency.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `params.opportunityId` is a valid ID for an existing opportunity.
 *   - Assumes `getOpportunityByIdFromDb` and `fetchAllCvComponents` services are operational.
 *   - This component is a server component, handling initial data fetching before rendering the client-side UI.
 *   - All tab content components are now client-side and receive necessary data as props.
 *
 * NOTES:
 *   - This page is designed to be the single entry point for all actions related to a specific opportunity, enhancing user experience by centralizing workflows.
 *   - Error handling for data fetching is robust, directing to a 404 page if the opportunity is not found.
 * - i dont want strict authentication for the app. it is not that important right now
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Tab Content Loading**: For very large or complex tabs, consider implementing lazy loading for tab content to improve initial page load performance.
 *   - **Unified Error Display**: While errors are handled, a more consistent and user-friendly error display mechanism (e.g., a global alert component) could be implemented.
 *   - **Refactor `CompanyStakeholderOutreach`**: Currently, `CompanyStakeholderOutreach` is rendered directly. If it has significant internal state or API calls, it could be wrapped in its own client component to better align with the pattern of `AIEvaluationContent` and `EmailLinkedinDraftContent`.
 */
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { OpportunityDetailView } from '@/components/ui/orion/opportunities/OpportunityDetailView';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Briefcase } from 'lucide-react';
import { CompanyStakeholderOutreach } from '@/components/orion/opportunities/CompanyStakeholderOutreach';
import { OrionOpportunity } from '@/lib/types';
import { CVComponent } from '@/lib/types/cv';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CVTailoringStudio } from '@/components/orion/CVTailoringStudio';
import { AIEvaluationContent } from '@/components/orion/opportunities/AIEvaluationContent';
import { EmailLinkedinDraftContent } from '@/components/orion/opportunities/EmailLinkedinDraftContent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

interface Props {
  params: { opportunityId: string };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { opportunityId } = await params;
  let pageError: string | null = null;

  // NOTE: Strict authentication is not a high priority at this stage. Features should generally be accessible.
  // Forcing isAuthenticated to true to bypass client-side checks for the authentication removal strategy.
  // Removed unused variable `isAuthenticated` as it's not currently used in any logic.
  // const isAuthenticated = true;

  if (!opportunityId || opportunityId.includes('.') || opportunityId.length < 36) {
    console.warn(`[OpportunityDetailPage] Invalid opportunityId format received: ${opportunityId}. Returning 404.`);
    notFound();
  }

  const opportunityResult = await getOpportunityByIdFromDb(opportunityId);

  let opportunity: OrionOpportunity;

  if (opportunityResult === null) {
    notFound(); // Exit if opportunity is not found
  } else if (opportunityResult instanceof HandledApplicationError) {
    pageError = opportunityResult.message;
    console.error(
      '[OpportunityDetailPage] Received HandledApplicationError for opportunity:',
      opportunityResult.message,
      opportunityResult.details
    );
    opportunity = {
      id: opportunityId,
      title: 'Error Loading Opportunity',
      company: 'N/A',
      status: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: null,
      position: null,
      location: null,
      salary: null,
      content: null,
      tags: null,
      url: null,
      dateIdentified: null,
      notes: null,
      contactPerson: null,
      contactEmail: null,
      stage: null,
      attachments: null,
      relatedEvaluationId: null,
      sourceUrl: null,
      nextActionDate: null,
      priority: null,
      tailoredCv: null,
      deadline: null,
      contact: null,
      lastStatusUpdate: null,
      notionPageId: null,
      evaluationOutput: null,
      webResearchContext: null,
      pros: null,
      cons: null,
      missingSkills: null,
      contentType: null,
      lastEditedTime: new Date().toISOString(),
      cvComponentSuggestions: null,
      alignmentScore: null,
      actionableAdvice: null,
      applicationMaterialIds: null,
      companyOrInstitution: null,
    };
  } else {
    opportunity = opportunityResult as OrionOpportunity;
  }

  let cvComponents: CVComponent[];
  const cvComponentsResult = await fetchAllCvComponents();

  if (cvComponentsResult instanceof HandledApplicationError) {
    console.error(
      '[OpportunityDetailPage] Failed to load CV components:',
      cvComponentsResult.message,
      cvComponentsResult.details
    );
    if (!pageError) {
      pageError = cvComponentsResult.message;
    }
    cvComponents = [];
  } else {
    cvComponents = cvComponentsResult;
  }

  return (
    <div className="space-y-6 container mx-auto py-8">
      <PageHeader
        title={opportunity.title}
        icon={<Briefcase className="h-7 w-7" />}
        description={`Command Center for your opportunity at ${opportunity.company}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="job-description">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="job-description">Job Description</TabsTrigger>
              <TabsTrigger value="ai-evaluation">AI Evaluation</TabsTrigger>
              <TabsTrigger value="cv-tailoring">CV Tailoring</TabsTrigger>
              <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
              <TabsTrigger value="email-linkedin-draft">Email & LinkedIn Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="job-description" className="mt-4">
              <OpportunityDetailView opportunity={opportunity} />
            </TabsContent>

            <TabsContent value="ai-evaluation" className="mt-4">
              <AIEvaluationContent opportunity={opportunity} />
            </TabsContent>

            <TabsContent value="cv-tailoring" className="mt-4">
              <CVTailoringStudio opportunity={opportunity} cvComponents={cvComponents} initialError={pageError} />
            </TabsContent>

            <TabsContent value="stakeholders" className="mt-4">
              <CompanyStakeholderOutreach opportunity={opportunity} />
            </TabsContent>

            <TabsContent value="email-linkedin-draft" className="mt-4">
              <EmailLinkedinDraftContent opportunity={opportunity} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="bg-gray-800 border-gray-700 text-gray-200 shadow-glow">
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-1">
                <strong>Company:</strong> {opportunity.company}
              </p>
              <p>
                <strong>Status:</strong> {opportunity.status}
              </p>
              {opportunity.type && (
                <p className="mb-1">
                  <strong>Type:</strong> {opportunity.type}
                </p>
              )}
              {opportunity.sourceUrl && (
                <p className="mb-1">
                  <strong>Source:</strong>{' '}
                  <a
                    href={opportunity.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {opportunity.sourceUrl}
                  </a>
                </p>
              )}
              {opportunity.notes && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-1">Notes:</h4>
                  <p className="whitespace-pre-wrap text-sm italic">{opportunity.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
