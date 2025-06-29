/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview React client component for company and stakeholder outreach management within an opportunity.
 * @description This component provides a user interface to search for companies, identify key stakeholders,
 *   and draft personalized email or LinkedIn messages. It is designed to be integrated into the
 *   Opportunity Detail Page (`app/(orion_admin)/admin/opportunity-pipeline/[id]/page.tsx`)
 *   to facilitate direct outreach activities, streamlining the sales and networking processes.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - **Company Search**: Allow users to input a company name or URL and retrieve relevant company information.
 *   - **Stakeholder Identification**: Display search results, including potential stakeholders (individuals) within the company and their contact information (email, LinkedIn).
 *   - **Stakeholder Selection**: Enable selection of specific stakeholders for targeted communication campaigns.
 *   - **Message Drafting**: Provide a user-friendly interface for drafting personalized email and LinkedIn messages, leveraging AI for content generation.
 *   - **Backend API Integration**: Seamlessly integrate with various backend APIs for company search, email generation, and message sending to automate outreach.
 *   - **Contextual Awareness**: Utilize the current opportunity's details to enrich the generated messages, ensuring high relevance and personalization.
 *
 * FILEPATH: `app/components/orion/opportunities/CompanyStakeholderOutreach.tsx`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[id]/page.tsx`: This component is embedded within the Opportunity Detail Page, receiving `opportunity` data as a prop.
 *   - `app/api/orion/research/company-search/route.ts` (Future/Conceptual): Backend API for performing company searches and initial stakeholder identification. This would involve external data sources or scraping.
 *   - `app/api/orion/outreach/find-emails/route.ts` (Future/Conceptual): Backend API responsible for generating or finding email addresses for identified stakeholders.
 *   - `app/api/orion/email/draft/route.ts`: Utilized for generating personalized email messages using LLMs.
 *   - `app/api/orion/communication/draft-linkedin-message/route.ts` (Future/Conceptual): Backend API for drafting personalized LinkedIn messages.
 *   - `app/lib/apiClient.ts`: The core utility for making all frontend-to-backend API calls.
 *   - `@/lib/logger.ts`: Centralized logging utility for tracing user interactions, API calls, and debugging within this component.
 *   - `@/components/ui/`: Integrates various Shadcn UI components (e.g., Button, Input, Textarea, Label, Card, Tabs, Select) for a consistent and accessible user interface.
 *   - `lucide-react`: Provides a set of open-source icons (`Search`, `Mail`, `Linkedin`, `Loader2`, `Sparkles`) to enhance the UI's visual communication.
 *   - `@/lib/types.ts`: Imports `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` for type safety and consistency of the opportunity data.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that backend APIs for company search, email finding, and message drafting (both email and LinkedIn) will be fully implemented and accessible.
 *   - The component manages its own local state for search queries, search results, selected stakeholders, and the content of drafted messages.
 *   - It is assumed that the `opportunity` prop will always contain valid and relevant data for the current opportunity.
 *   - User authentication and authorization are handled at a higher level (e.g., Next.js middleware or API routes), and this component operates with the assumption of authorized access.
 *   - Placeholder `[USER_PROFILE_CONTEXT_PLACEHOLDER]` in the prompt indicates a future integration point where actual user profile data will be dynamically injected for more personalized LLM responses.
 *
 * NOTES:
 *   - **User Experience**: The component prioritizes a smooth user experience with loading states (`isSearching`, `isDrafting`) and toast notifications for user feedback on operations.
 *   - **Frontend-Backend Contract**: The interfaces `CompanySearchResult` and `Stakeholder` define the expected data structure from backend API responses, ensuring type consistency.
 *   - **Future Expansion**: The `TODO` comments highlight areas where more robust backend integrations or LinkedIn drafting logic will be implemented.
 *   - **Consistency**: By using `@/components/ui/tabs` (Shadcn UI), the component maintains visual and functional consistency with other parts of the Orion application, avoiding `ReferenceError: require is not defined` issues previously encountered with direct `@radix-ui/react-tabs` imports.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   This component is a cornerstone for automating and personalizing your outreach efforts within Orion, offering significant potential for enhancement.
 *
 *   **1. Robust Company Search & Data Enrichment:**
 *     - **Goal:** Provide highly accurate and comprehensive company data, including industry, size, recent news, and key personnel, beyond just name and domain.
 *     - **How to Implement:** Integrate with more sophisticated, commercial company data APIs (e.g., Clearbit, Apollo.io, Crunchbase) or significantly enhance the web scraping capabilities within the `orion_python_backend` to pull rich company profiles. This would involve expanding the data schema for `CompanySearchResult`.
 *     - **Relevant Files:** `app/api/orion/research/company-search/route.ts` (new or enhanced API route), `orion_python_backend/` (for advanced scraping/data processing logic).
 *
 *   **2. Advanced Stakeholder Identification & Filtering:**
 *     - **Goal:** Precisely identify target stakeholders (e.g., decision-makers, specific roles) within a company and enable sophisticated filtering and selection.
 *     - **How to Implement:**
 *       - **Role-Based Search:** Allow users to search for stakeholders by specific job titles or departments (e.g., "Head of Sales", "VP of Engineering").
 *       - **AI-Driven Persona Matching:** Integrate AI (via `app/lib/orion_llm.ts`) to suggest relevant stakeholders based on the opportunity type and your predefined personas (`app/api/orion/personas/`). This could involve semantic search over stakeholder profiles.
 *       - **LinkedIn Profile Integration:** Directly link to or embed real-time LinkedIn profile snippets for selected stakeholders, potentially showing their recent activity or posts to inform message drafting.
 *       - **Filtering & Sorting**: Add UI controls to filter stakeholders by department, seniority, or other criteria, and sort them by relevance or alphabetical order.
 *     - **Relevant Files:** `app/api/orion/outreach/find-stakeholders/route.ts` (new API for advanced stakeholder search), `app/lib/orion_llm.ts` (for AI matching logic), `prisma/schema.prisma` (if a new `Stakeholder` model with richer attributes is introduced).
 *
 *   **3. Dynamic & Context-Aware Message Generation (LLM Integration):**
 *     - **Goal:** Generate highly personalized, effective, and varied outreach messages that adapt to the stakeholder, company, and specific opportunity context, leading to higher engagement.
 *     - **How to Implement:**
 *       - **Template Customization:** Provide pre-defined, user-customizable templates for various outreach scenarios (e.g., cold outreach, follow-up, networking event follow-up) that the LLM can populate dynamically.
 *       - **Deep Context Injection:** Automatically inject comprehensive details from the `Opportunity` object (job description, company type, etc.) and discovered company/stakeholder data (industry, recent news, shared connections) into the LLM prompt for message generation. This will require careful prompt engineering.
 *       - **Tone & Style Control:** Allow users to specify the desired tone (e.g., formal, friendly, direct, concise) and style for the generated messages.
 *       - **A/B Testing & Performance Tracking:** Implement features to track the open rates, reply rates, and conversion rates of different message variations to optimize future outreach strategies. This requires logging communication events.
 *       - **Iterative Drafting**: Allow users to request multiple drafts or revisions of a message based on feedback.
 *     - **Relevant Files:** `app/api/orion/email/draft/route.ts`, `app/api/orion/communication/draft-linkedin-message/route.ts` (new endpoint), `app/lib/orion_llm.ts` (for enhanced prompting logic and tool use), `app/lib/types/outreach.ts` (for new message options).
 *
 *   **4. Seamless CRM/Opportunity Pipeline Integration & Activity Logging:**
 *     - **Goal:** Ensure all outreach activities (searches, drafts, sends) are automatically logged and visible directly within the associated opportunity in the pipeline, providing a holistic view of engagement.
 *     - **How to Implement:** Automatically create structured "Communication Log" entries (`prisma/schema.prisma`) linked to the `Opportunity` and `Stakeholder` (if a new `Stakeholder` model is created). These logs should capture message content, send status, and recipient details.
 *     - **Relevant Files:** `app/api/orion/opportunities/update/route.ts` (for logging communication events), `prisma/schema.prisma` (for new `CommunicationLog` and `Stakeholder` models), `app/lib/types.ts` (for new log entry types).
 *
 *   **5. Email Sending & LinkedIn Automation:**
 *     - **Goal:** Provide direct functionality within the component to send drafted emails and LinkedIn messages.
 *     - **How to Implement:** Integrate with a transactional email service (e.g., SendGrid, Mailgun) via a backend API (`app/api/orion/email/send/route.ts`). For LinkedIn, explore LinkedIn API integrations for direct message sending, if permissible and practical.
 *     - **Relevant Files:** `app/api/orion/email/send/route.ts`, `app/api/orion/communication/send-linkedin-message/route.ts` (new).
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Mail, Linkedin, Loader2, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';
import { Opportunity } from '@prisma/client';
import { useCompanyStakeholderOutreachStore } from '@/lib/stores/companyStakeholderOutreachStore';

/**
 * Represents the structure of a company search result from external data sources
 * @interface
 * @property {string} id - Unique identifier from the data source
 * @property {string} name - Official company name
 * @property {string} [domain] - Primary website domain
 * @property {string} [logo] - URL to company logo image
 * @property {Stakeholder[]} stakeholders - Array of identified key stakeholders
 *
 * @why
 * - Standardizes the format of company data from various sources
 * - Enables consistent display in UI components
 * - Facilitates integration with Orion's opportunity tracking system
 */
interface CompanySearchResult {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  stakeholders: Stakeholder[];
}

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
}

interface CompanyStakeholderOutreachProps {
  opportunity: Opportunity;
}

export const CompanyStakeholderOutreach: React.FC<CompanyStakeholderOutreachProps> = ({ opportunity }) => {
  const [requestId] = React.useState(uuidv4()); // Unique ID for tracking all operations in this component instance
  const {
    companySearchQuery,
    setCompanySearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    selectedStakeholder,
    setSelectedStakeholder,
    emailDraft,
    setEmailDraft,
    linkedinDraft,
    setLinkedinDraft,
    isDrafting,
    setIsDrafting,
    activeTab,
    setActiveTab,
    reset,
  } = useCompanyStakeholderOutreachStore();

  /**
   * Handles the company search operation.
   * Fetches company information based on the `companySearchQuery` from the backend.
   * Updates `searchResults` state and displays toast notifications for user feedback.
   *
   * @returns {Promise<void>}
   */
  const handleCompanySearch = async () => {
    if (!companySearchQuery.trim()) {
      toast.error('Please enter a company name or URL to search.');
      logger.warn('[CompanyStakeholderOutreach][handleCompanySearch][NO_QUERY]', {
        query: companySearchQuery,
      });
      return;
    }

    logger.info('[CompanyStakeholderOutreach][handleCompanySearch][START]', { query: companySearchQuery });
    setIsSearching(true);
    setSearchResults([]);
    setSelectedStakeholder(null);
    setEmailDraft('');
    setLinkedinDraft('');
    toast.loading('Searching for companies...');

    try {
      const response = await apiClient.post<{ success: boolean; results: CompanySearchResult[]; error?: string }>(
        '/api/orion/research/company',
        { query: companySearchQuery }
      );

      if (response.data.success) {
        setSearchResults(response.data.results);
        toast.success(`Company search complete! Found ${response.data.results.length} results.`);
        logger.success('[CompanyStakeholderOutreach][handleCompanySearch][SUCCESS]', {
          query: companySearchQuery,
          count: response.data.results.length,
          firstResultName: response.data.results[0]?.name,
        });
      } else {
        const errorMessage = response.data.error || 'Failed to search companies.';
        toast.error(`Company search failed: ${errorMessage}`);
        logger.error('[CompanyStakeholderOutreach][handleCompanySearch][API_ERROR]', {
          query: companySearchQuery,
          error: errorMessage,
          response: response.data, // Include full response data for debugging
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred during company search.';
      toast.error(`Unexpected search error: ${errorMessage}`);
      logger.error('[CompanyStakeholderOutreach][handleCompanySearch][CATCH_ERROR]', {
        query: companySearchQuery,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setIsSearching(false);
      toast.dismiss();
      logger.info('[CompanyStakeholderOutreach][handleCompanySearch][END]', { query: companySearchQuery });
    }
  };

  /**
   * Handles the selection of a stakeholder from the search results.
   * Sets the `selectedStakeholder` state and switches the active tab to 'draft'.
   *
   * @param {Stakeholder} stakeholder The stakeholder object that was selected.
   * @returns {void}
   */
  const handleSelectStakeholder = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setActiveTab('draft'); // Switch to draft tab upon selection
    logger.info('[CompanyStakeholderOutreach][handleSelectStakeholder]', {
      stakeholderId: stakeholder.id,
      stakeholderName: stakeholder.name,
      company: opportunity.company,
    });
  };

  /**
   * Handles the drafting of a personalized email or LinkedIn message using AI.
   * Constructs a prompt based on selected stakeholder and opportunity details,
   * then calls the backend API to generate the message.
   *
   * @param {'email' | 'linkedin'} messageType The type of message to draft (email or linkedin).
   * @returns {Promise<void>}
   */
  const handleDraftMessage = async (messageType: 'email' | 'linkedin') => {
    if (!selectedStakeholder) {
      toast.error('Please select a stakeholder first to draft a message.');
      logger.warn('[CompanyStakeholderOutreach][handleDraftMessage][NO_STAKEHOLDER]', {
        messageType,
      });
      return;
    }

    logger.info(`[CompanyStakeholderOutreach][handleDraftMessage][START]`, {
      messageType,
      stakeholderId: selectedStakeholder.id,
      stakeholderName: selectedStakeholder.name,
      id: opportunity.id,
    });
    setIsDrafting(true);
    toast.loading(`Drafting personalized ${messageType} message...`);

    const prompt = `Draft a personalized ${messageType} message for ${selectedStakeholder.name} (${selectedStakeholder.title} at ${opportunity.company}).
    The outreach goal for opportunity "${opportunity.title}" is: ${opportunity.notes || 'N/A'}.
    My user profile context is [USER_PROFILE_CONTEXT_PLACEHOLDER].
    Company context: ${searchResults[0]?.name || ''} (${searchResults[0]?.domain || ''}).
    Stakeholder email: ${selectedStakeholder.email || 'N/A'}.
    Stakeholder LinkedIn: ${selectedStakeholder.linkedin || 'N/A'}.
    Keep the tone professional yet engaging.`;

    try {
      let response;
      if (messageType === 'email') {
        response = await apiClient.post<{ success: boolean; draft: string; error?: string }>('/api/orion/email/draft', {
          prompt,
          outreachGoal: opportunity.notes || 'N/A', // Using opportunity notes as outreach goal for now
          recipientName: selectedStakeholder.name,
          recipientEmail: selectedStakeholder.email, // Pass email for context
          opportunityTitle: opportunity.title,
          opportunityCompany: opportunity.company,
        });
        logger.debug('[CompanyStakeholderOutreach][handleDraftMessage][EMAIL_API_CALL]', {
          prompt: prompt.substring(0, 100) + '...',
        });
      } else {
        // TODO: Replace with actual LinkedIn message drafting API call
        response = await apiClient.post<{ success: boolean; draft: string; error?: string }>(
          '/api/orion/communication/draft-linkedin-message',
          {
            prompt,
            outreachGoal: opportunity.title,
            recipientName: selectedStakeholder.name,
            recipientLinkedIn: selectedStakeholder.linkedin,
            opportunityTitle: opportunity.title,
            opportunityCompany: opportunity.company,
          }
        );
        logger.debug('[CompanyStakeholderOutreach][handleDraftMessage][LINKEDIN_API_CALL]', {
          prompt: prompt.substring(0, 100) + '...',
        });
      }

      if (response.data.success) {
        if (messageType === 'email') {
          setEmailDraft(response.data.draft);
        } else {
          setLinkedinDraft(response.data.draft);
        }
        toast.success(`Personalized ${messageType} drafted successfully!`);
        logger.success(`[CompanyStakeholderOutreach][handleDraftMessage][${messageType.toUpperCase()}_SUCCESS]`, {
          stakeholderId: selectedStakeholder.id,
          messageType,
          draftLength: response.data.draft.length,
        });
      } else {
        const errorMessage = response.data.error || `Failed to draft ${messageType} message.`;
        toast.error(`${messageType} drafting failed: ${errorMessage}`);
        logger.error(`[CompanyStakeholderOutreach][handleDraftMessage][${messageType.toUpperCase()}_API_ERROR]`, {
          messageType,
          stakeholderId: selectedStakeholder.id,
          error: errorMessage,
          response: response.data, // Include full response data for debugging
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : `An unexpected error occurred during ${messageType} drafting.`;
      toast.error(`Unexpected ${messageType} drafting error: ${errorMessage}`);
      logger.error(`[CompanyStakeholderOutreach][handleDraftMessage][${messageType.toUpperCase()}_CATCH_ERROR]`, {
        messageType,
        stakeholderId: selectedStakeholder.id,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setIsDrafting(false);
      toast.dismiss();
      logger.info(`[CompanyStakeholderOutreach][handleDraftMessage][END]`, {
        messageType,
        stakeholderId: selectedStakeholder?.id,
      });
    }
  };

  return (
    <Card className="p-6 space-y-6 shadow-lg bg-gray-900 text-gray-100 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Search className="mr-2 h-6 w-6" /> Company & Stakeholder Outreach
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 p-1 bg-gray-800 rounded-md">
            <TabsTrigger
              value="search"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              Search Company
            </TabsTrigger>
            <TabsTrigger
              value="stakeholders"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              disabled={searchResults.length === 0}
            >
              Select Stakeholder
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              disabled={!selectedStakeholder}
            >
              Draft Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                type="text"
                placeholder="Enter company name or website (e.g., Google, example.com)"
                value={companySearchQuery}
                onChange={(e) => setCompanySearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCompanySearch();
                  }
                }}
                className="flex-1 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                disabled={isSearching}
              />
              <Button
                onClick={handleCompanySearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-lg font-semibold text-gray-200">Company Search Results:</h4>
                {searchResults.map((company) => (
                  <Card key={company.id} className="bg-gray-800 border-gray-600 p-4">
                    <CardTitle className="text-xl text-blue-400 mb-2">{company.name}</CardTitle>
                    {company.domain && <p className="text-gray-400 text-sm mb-1">Domain: {company.domain}</p>}
                    {company.logo && (
                      <img src={company.logo} alt={`${company.name} logo`} className="h-8 w-8 object-contain my-2" />
                    )}
                    {company.stakeholders.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-md font-semibold text-gray-300">Key Stakeholders:</h5>
                        <ul className="list-disc list-inside text-gray-400 text-sm">
                          {company.stakeholders.map((stakeholder) => (
                            <li key={stakeholder.id} className="flex justify-between items-center">
                              <span>
                                {stakeholder.name} - {stakeholder.title}
                              </span>
                              <Button
                                onClick={() => handleSelectStakeholder(stakeholder)}
                                variant="outline"
                                size="sm"
                                className="ml-2 bg-purple-700 hover:bg-purple-800 text-white"
                              >
                                Select
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-4">
            {searchResults.length === 0 ? (
              <p className="text-gray-400 text-center">Please perform a company search first.</p>
            ) : (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-200">Select Stakeholder:</h4>
                {searchResults.map((company) =>
                  company.stakeholders.length > 0 ? (
                    <Card key={company.id} className="bg-gray-800 border-gray-600 p-4">
                      <CardTitle className="text-xl text-blue-400 mb-2">{company.name}</CardTitle>
                      <ul className="list-disc list-inside text-gray-400 text-sm">
                        {company.stakeholders.map((stakeholder) => (
                          <li key={stakeholder.id} className="flex justify-between items-center">
                            <span>
                              {stakeholder.name} - {stakeholder.title}
                              {stakeholder.email && <span className="ml-2 text-xs italic">({stakeholder.email})</span>}
                            </span>
                            <Button
                              onClick={() => handleSelectStakeholder(stakeholder)}
                              variant="outline"
                              size="sm"
                              className="ml-2 bg-purple-700 hover:bg-purple-800 text-white"
                            >
                              {selectedStakeholder?.id === stakeholder.id ? 'Selected' : 'Select'}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ) : (
                    <p key={company.id} className="text-gray-400">
                      No stakeholders found for {company.name}.
                    </p>
                  )
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {!selectedStakeholder ? (
              <p className="text-gray-400 text-center">
                Please select a stakeholder from the &apos;Select Stakeholder&apos; tab to draft messages.
              </p>
            ) : (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-200">Draft Message for {selectedStakeholder.name}:</h4>

                <Tabs defaultValue="email-draft" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 gap-2 p-1 bg-gray-800 rounded-md">
                    <TabsTrigger
                      value="email-draft"
                      className="data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                    >
                      <Mail className="mr-2 h-4 w-4" /> Email Draft
                    </TabsTrigger>
                    <TabsTrigger
                      value="linkedin-draft"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                    >
                      <Linkedin className="mr-2 h-4 w-4" /> LinkedIn Draft
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email-draft" className="mt-4 space-y-3">
                    <Label htmlFor="email-draft-content" className="text-gray-300">
                      Email Content:
                    </Label>
                    <Textarea
                      id="email-draft-content"
                      value={emailDraft}
                      onChange={(e) => setEmailDraft(e.target.value)}
                      rows={10}
                      className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your personalized email draft will appear here..."
                      disabled={isDrafting}
                    />
                    <Button
                      onClick={() => handleDraftMessage('email')}
                      disabled={isDrafting}
                      className="bg-green-600 hover:bg-green-700 text-white w-full"
                    >
                      {isDrafting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isDrafting ? 'Drafting Email...' : 'Draft Email with AI'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="linkedin-draft" className="mt-4 space-y-3">
                    <Label htmlFor="linkedin-draft-content" className="text-gray-300">
                      LinkedIn Message Content:
                    </Label>
                    <Textarea
                      id="linkedin-draft-content"
                      value={linkedinDraft}
                      onChange={(e) => setLinkedinDraft(e.target.value)}
                      rows={10}
                      className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Your personalized LinkedIn message draft will appear here..."
                      disabled={isDrafting}
                    />
                    <Button
                      onClick={() => handleDraftMessage('linkedin')}
                      disabled={isDrafting}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    >
                      {isDrafting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isDrafting ? 'Drafting LinkedIn Message...' : 'Draft LinkedIn Message with AI'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
