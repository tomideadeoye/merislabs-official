/**
 * @fileoverview Client-side component for the Email Drafting & Sending Studio.
 * @description This component provides the interactive UI for drafting personalized application emails, integrating LLM suggestions, allowing for user edits, and handling the final sending process with CV attachment.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a user-friendly interface for generating, reviewing, and editing application email drafts.
 *   - To integrate with the `/api/orion/email/draft` endpoint to get AI-powered subject and body suggestions.
 *   - To allow users to manually edit the drafted email content.
 *   - To enable sending the email with the assembled CV attached as a PDF, leveraging `email_service`.
 *   - To manage loading states, errors, and user feedback throughout the drafting and sending process.
 *
 * FILEPATH: `app/components/orion/opportunities/EmailDraftingStudio.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/opportunity-pipeline/[opportunityId]/draft-email/page.tsx`: The server component that renders this client component and passes initial `opportunity` and `assembledCvMarkdown` data.
 *   - `@/lib/types`: Imports `OrionOpportunity` for type consistency.
 *   - `@/lib/apiClient`: Used to make HTTP requests to `/api/orion/email/draft` (for AI suggestions) and `/api/orion/email/send` (for sending).
 *   - `@/lib/logger`: For comprehensive logging of client-side interactions and API calls.
 *   - `react-hot-toast`: Used for displaying user feedback (loading, success, error messages).
 *   - `@/components/ui`: Imports Shadcn UI components (Button, Card, Textarea, Input, Label, Select) for consistent styling and functionality.
 *   - `lucide-react`: Provides icons (`Loader2`, `Sparkles`, `Send`, `Copy`, `FileText`).
 *   - `@/lib/utils/clientErrorHandler`: Centralized utility for consistent API error handling.
 *   - `@/lib/email_service`: The service responsible for sending the actual email and converting Markdown to PDF.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `opportunity` and `assembledCvMarkdown` props are provided.
 *   - Assumes backend APIs (`/api/orion/email/draft`, `/api/orion/email/send`) are operational.
 *   - User authentication and authorization are handled at the API route level; this component focuses on UI interaction.
 *   - `assembledCvMarkdown` is initially read from local storage here but can be passed as a prop from the server in a more robust future implementation.
 *   - The component manages its own loading and error states.
 *
 * NOTES:
 *   - This component brings together the CV tailoring and email sending features, creating a cohesive application workflow.
 *   - Logging is crucial for debugging the intricate client-server interactions.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic Email Templates**: Allow users to select from various email templates or define their own.
 *   - **Recipient Management**: Implement a more robust recipient management system (To, CC, BCC fields with contact suggestions).
 *   - **Pre-fill Email Fields**: Automatically pre-fill 'To' and 'Subject' fields based on opportunity data or stakeholder information.
 *   - **Attachment Preview**: Provide a visual preview of the generated PDF attachment before sending.
 *   - **Sending Progress**: Display more detailed progress during email sending, especially for large attachments.
 *   - **Save Drafts**: Implement functionality to save email drafts to the database for later access.
 *   - **Integration with Outreach Tools**: Further integrate with CRM or outreach platforms.
 */

'use client';

import { useState, useEffect } from 'react';
import { OrionOpportunity } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';
import { handleClientError } from '@/lib/utils/clientErrorHandler';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Label,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import { Loader2, Wand2, Send, FileCheck2 } from 'lucide-react';

interface Draft {
  subject: string;
  body: string;
  strategicAngle: string;
}

interface Props {
  opportunity: OrionOpportunity;
}

export function EmailDraftingStudio({ opportunity }: Props) {
  const [tailoredCvMarkdown, setTailoredCvMarkdown] = useState<string>('');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [finalEmailBody, setFinalEmailBody] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const storedCv = localStorage.getItem(`orion_assembled_cv_${opportunity.id}`);
    setTailoredCvMarkdown(storedCv || '');
    if (!storedCv) {
      toast.error(
        'No tailored CV found in local storage. Drafting will proceed without it, but assembling one first is recommended.',
        { duration: 5000 }
      );
    }
    setEmailSubject(`Application for ${opportunity.title} at ${opportunity.company}`);
    setRecipientEmail(opportunity.contactEmail || '');
  }, [opportunity]);

  const handleGenerateDrafts = async () => {
    logger.info('[EmailDraftingStudio][handleGenerateDrafts][START]', { opportunityId: opportunity.id });
    setIsLoading(true);
    toast.loading('Orion is drafting your emails...');
    try {
      const response = await apiClient.post(`/api/orion/opportunity/${opportunity.id}/draft-email`, {
        tailoredCvMarkdown,
      });
      if (response.data.success) {
        setDrafts(response.data.drafts);
        if (response.data.drafts.length > 0) {
          setFinalEmailBody(response.data.drafts[0].body);
          setEmailSubject(response.data.drafts[0].subject);
        }
        toast.success('AI has generated multiple strategic drafts!');
        logger.success('[EmailDraftingStudio][handleGenerateDrafts][SUCCESS]', {
          opportunityId: opportunity.id,
          draftsCount: response.data.drafts.length,
        });
      } else {
        throw new Error(response.data.error || 'Failed to generate drafts. Server did not provide specific error.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { opportunityId: opportunity.id, stage: 'email_draft_api_call' });
      toast.error(`Drafting Failed: ${handledError.message}`);
      logger.error('[EmailDraftingStudio][handleGenerateDrafts][CATCH_ERROR]', {
        opportunityId: opportunity.id,
        error: handledError.message,
      });
    } finally {
      setIsLoading(false);
      toast.dismiss();
      logger.info('[EmailDraftingStudio][handleGenerateDrafts][END]', { opportunityId: opportunity.id });
    }
  };

  const handleSendEmail = async () => {
    logger.info('[EmailDraftingStudio][handleSendEmail][START]', {
      opportunityId: opportunity.id,
      recipientEmail,
      emailSubject,
    });
    setIsSending(true);
    toast.loading('Dispatching your application...');
    try {
      const response = await apiClient.post('/api/orion/email/send', {
        to: recipientEmail,
        subject: emailSubject,
        htmlBody: finalEmailBody.replace(/\n/g, '<br>'),
        markdownAttachment: tailoredCvMarkdown
          ? {
              filename: `CV_Tomide_Adeoye_${opportunity.company}.pdf`,
              markdown: tailoredCvMarkdown,
            }
          : undefined,
      });
      if (response.data.success) {
        toast.success('Application Sent Successfully!');
        logger.success('[EmailDraftingStudio][handleSendEmail][SUCCESS]', { opportunityId: opportunity.id });
        // TODO: Update opportunity status to 'Applied'
      } else {
        throw new Error(response.data.error || 'Failed to send email. Server did not provide specific error.');
      }
    } catch (err: unknown) {
      const handledError = handleClientError(err, { opportunityId: opportunity.id, stage: 'email_send_api_call' });
      toast.error(`Sending Failed: ${handledError.message}`);
      logger.error('[EmailDraftingStudio][handleSendEmail][CATCH_ERROR]', {
        opportunityId: opportunity.id,
        error: handledError.message,
      });
    } finally {
      setIsSending(false);
      toast.dismiss();
      logger.info('[EmailDraftingStudio][handleSendEmail][END]', { opportunityId: opportunity.id });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Generate Email Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          {tailoredCvMarkdown && (
            <div className="text-sm text-green-400 mb-4 flex items-center gap-2">
              <FileCheck2 size={16} /> Tailored CV is ready to be attached.
            </div>
          )}
          <Button onClick={handleGenerateDrafts} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Email Drafts
          </Button>
        </CardContent>
      </Card>

      {drafts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Finalize & Send Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="draft-0">
              <TabsList>
                {drafts.map((draft, index) => (
                  <TabsTrigger
                    key={index}
                    value={`draft-${index}`}
                    onClick={() => {
                      setFinalEmailBody(draft.body);
                      setEmailSubject(draft.subject);
                    }}
                  >
                    Draft {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {drafts.map((draft, index) => (
                <TabsContent key={index} value={`draft-${index}`}>
                  <p className="text-sm text-purple-300 p-2 bg-gray-800 rounded-md">
                    <b>Strategy:</b> {draft.strategicAngle}
                  </p>
                </TabsContent>
              ))}
            </Tabs>
            <div>
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient's email"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email-body">Email Body</Label>
              <Textarea
                id="email-body"
                value={finalEmailBody}
                onChange={(e) => setFinalEmailBody(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !recipientEmail}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send Application with CV Attached
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
