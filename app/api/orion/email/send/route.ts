/**
 * @fileoverview API route for sending emails from Orion.
 * @description This endpoint facilitates the sending of emails, acting as a secure gateway to the underlying email service (`sendEmailService`).
 * It handles authentication, input validation (using Zod), and robust error management,
 * supporting both plain text and HTML email bodies, with optional attachments.
 * This is a critical component for the Application Drafting & Sending Hub.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To securely receive email parameters (recipient, subject, body, attachments) from the client.
 *   - To validate incoming email data using Zod for data integrity.
 *   - To authenticate requests, ensuring only authorized users can send emails.
 *   - To invoke the `sendEmailService` to dispatch the email.
 *   - To provide clear success or error responses to the client.
 *
 * FILEPATH: `app/api/orion/email/send/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/types/index.ts`: Defines `SendEmailParams` and `SendEmailResponse` for type safety.
 *   - `@/lib/email_service.ts`: The core service responsible for the actual email dispatch logic (e.g., using Nodemailer).
 *   - `@/lib/logger.ts`: Used for comprehensive, context-rich logging of API requests, successes, and failures.
 *   - `zod`: Employed for robust input validation of the request body.
 *   - `@/lib/utils/errorHandler.ts`: Centralized utility for consistent API error handling and message extraction.
 *   - `app/components/orion/opportunities/EmailDraftingStudio.tsx`: The client-side component that calls this API to send drafted emails.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `sendEmailService` is operational and handles the low-level email sending logic correctly.
 *   - Assumes email attachments are provided in a format (`Buffer`, `base64`, etc.) compatible with `sendEmailService`.
 *   - Robust logging is in place to track the email sending flow and diagnose issues.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Reliability: Comprehensive error handling ensures graceful failure and informative feedback.
 *   - Performance: Efficient handling of requests to minimize latency in email dispatch.
 *
 * NOTES:
 *   - This endpoint acts as a crucial bridge between the frontend drafting capabilities and the backend email sending infrastructure.
 *   - The use of `sendEmailService` abstracts away the complexities of email transport, keeping this route focused on request handling.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Asynchronous Email Sending**: For high-volume scenarios, consider offloading email sending to a background queue or separate worker process to avoid blocking the API response.
 *   - **Rate Limiting**: Implement rate limiting to prevent abuse or spamming of the email sending functionality.
 *   - **Email Templates**: Integrate with a robust email templating system for dynamic, personalized email content beyond plain text/HTML strings.
 *   - **Audit Logging**: Enhance logging to include email metadata (e.g., recipient, subject line snippet) for auditing purposes, while being mindful of privacy.
 *   - **Retry Mechanism**: Implement a retry mechanism for `sendEmailService` calls in case of transient failures (e.g., network issues).
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { sendEmailService } from '@/lib/email_service';
import { z } from 'zod';

interface LogContextType {
  route: string;
  timestamp: string;
  userId?: string;
  operation?: string;
  [key: string]: unknown;
}

// Zod schema for validating the email send request body
const EmailSendSchema = z.object({
  to: z.string().email('Invalid recipient email address.'),
  subject: z.string().min(1, 'Email subject cannot be empty.'),
  htmlBody: z.string().min(1, 'Email content cannot be empty.'),
  from: z.string().email('Invalid sender email address.').optional(), // Make from optional
  // Add any other fields that are part of the EmailSendPayload type
});

export async function POST(request: NextRequest) {
  const logContext: LogContextType = {
    route: '/api/orion/email/send',
    timestamp: new Date().toISOString(),
    operation: 'POST',
  };
  logger.info('[EMAIL_SEND_API][POST][START] Received request to send email.', logContext);

  // Use a placeholder userId since authentication is removed
  const userId = 'unauthenticated_user';
  logContext.userId = userId;

  try {
    const body = await request.json();
    logger.debug('[EMAIL_SEND_API][POST][REQUEST_BODY]', { ...logContext, body });

    // Validate the request body
    const validationResult = EmailSendSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      logger.warn('[EMAIL_SEND_API][POST][VALIDATION_FAIL]', { ...logContext, errors });
      return NextResponse.json({ success: false, error: `Validation Error: ${errors}` }, { status: 400 });
    }

    const { to, subject, htmlBody, from } = validationResult.data;

    // Send the email using the centralized email service
    const sendResult = await sendEmailService({
      to,
      subject,
      htmlBody,
      from,
    });

    if (sendResult.success) {
      logger.success('[EMAIL_SEND_API][POST][SUCCESS] Email sent successfully.', {
        ...logContext,
        to,
        subject,
        messageId: sendResult.messageId,
      });
      return NextResponse.json({ success: true, message: 'Email sent successfully.', messageId: sendResult.messageId });
    }
  } catch (error: unknown) {
    // This catch block will now handle errors thrown directly by sendEmailService
    logger.error('[EMAIL_SEND_API][POST][ERROR] Failed to send email.', {
      ...logContext,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
    return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
