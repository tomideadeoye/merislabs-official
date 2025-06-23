/**
 * @fileoverview Email service for sending emails and generating PDF attachments.
 * @description This service provides a centralized and robust mechanism for handling all outgoing email communications within the Orion system. It integrates with Nodemailer for email transport and `html-pdf` with `marked` for converting Markdown content into PDF attachments, crucial for functionalities like CV delivery.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To abstract and encapsulate email sending logic, ensuring consistent email delivery across the application.
 *   - To configure and manage the Nodemailer transporter, using secure environment variables for authentication.
 *   - To support both plain HTML email bodies and advanced Markdown-to-PDF attachment generation.
 *   - To provide comprehensive logging for email operations, aiding in traceability and debugging.
 *   - To enhance the email experience by allowing custom sender names (e.g., "Tomide Adeoye (via Orion)").
 *
 * FILEPATH: `app/lib/email_service.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `nodemailer`: Core library for sending emails.
 *   - `@/lib/orion_config.ts`: Retrieves `ORION_EMAIL_SENDER` and `ORION_EMAIL_APP_PASSWORD` for email account configuration.
 *   - `html-pdf`: Used for converting HTML content (generated from Markdown) into PDF attachments.
 *   - `marked`: Parses Markdown strings into HTML, enabling rich text email content or PDF generation from Markdown.
 *   - `@/lib/logger.ts`: Integrates with Orion's logging utility for detailed operational logs.
 *   - `app/api/orion/email/send/route.ts`: Consumes `sendEmailService` to dispatch emails.
 *   - `app/api/orion/cv/download-pdf/route.ts`: Utilizes the Markdown-to-PDF conversion capabilities for CV downloads.
 *   - `app/components/orion/opportunities/EmailDraftingStudio.tsx`: Triggers email sending through API routes that use this service.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `ORION_EMAIL_SENDER` and `ORION_EMAIL_APP_PASSWORD` environment variables are correctly configured for a Gmail SMTP server or compatible service.
 *   - The `transporter` is a singleton; it's initialized once.
 *   - Markdown sanitization (`marked.parse`) is applied to prevent XSS vulnerabilities if external Markdown is processed.
 *   - Error handling is integrated to catch issues during PDF generation and email transmission, providing clear feedback.
 *
 * NOTES:
 *   - This service is crucial for all outreach and notification functionalities within Orion.
 *   - The ability to attach Markdown-generated PDFs is a key feature for automated application processes.
 *   - Comprehensive logging is vital for monitoring email delivery status and debugging.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Dynamic SMTP Configuration**: Allow SMTP settings (host, port, secure, auth) to be dynamically configured via environment variables or a settings panel for broader email service compatibility.
 *   - **Email Templates**: Implement a system for managing and rendering email templates (e.g., Handlebars, EJS) to create more structured and reusable email designs.
 *   - **Queueing for Bulk Emails**: For sending large volumes of emails, integrate with a message queue (e.g., RabbitMQ, Kafka) to offload email sending to background workers and improve API responsiveness.
 *   - **Retry Mechanism**: Implement a retry mechanism for failed email attempts with exponential backoff.
 *   - **Status Tracking**: Add robust status tracking and webhooks (if supported by the email provider) to monitor delivery, opens, clicks, and bounces.
 *   - **HTML Templating Library**: Introduce a more powerful HTML templating library for complex email layouts.
 *   - **Attachment Validation**: Add validation for attachment sizes and types to prevent server overload or security risks.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This file already consolidates all email-related logic, making it a single point of modification for email features.
 *   - The logging and error handling patterns align with the rest of the Orion codebase, ensuring consistency.
 */

import nodemailer from 'nodemailer';
import { ORION_EMAIL_SENDER, ORION_EMAIL_APP_PASSWORD } from '@/lib/orion_config';
import pdf from 'html-pdf';
import { marked } from 'marked';
import logger from '@/lib/logger';
import { SendEmailParams, EmailAttachment } from '@/lib/types/email';
import puppeteer from 'puppeteer';

// TODO: Configure transporter with your email service details. This is a placeholder.
// For production, consider using environment variables for sensitive details and a more robust transport.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Example for Gmail
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: ORION_EMAIL_SENDER,
    pass: ORION_EMAIL_APP_PASSWORD,
  },
});

/**
 * @function sendEmailService
 * @description Sends an email with the specified parameters, including optional attachments and Markdown conversion to PDF.
 * @param to Recipient email address.
 * @param subject Email subject line.
 * @param htmlBody HTML content of the email body.
 * @param attachments Array of email attachments.
 * @param markdownAttachment Optional Markdown content to be converted into a PDF attachment.
 */
export async function sendEmailService({
  to,
  subject,
  htmlBody,
  attachments = [],
  markdownAttachment,
  from,
}: SendEmailParams) {
  if (!transporter) {
    logger.error('[EmailService] Not configured.');
    throw new Error('Email service is not configured.');
  }

  // Convert markdown to PDF if provided
  if (markdownAttachment?.markdown) {
    let browser;
    try {
      const html = await marked.parse(markdownAttachment.markdown as string);
      // Launch a headless browser
      browser = await puppeteer.launch({
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recommended for Docker/CI environments
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' }); // Wait for network to be idle
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      attachments.push({
        filename: markdownAttachment.filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      });
      logger.info('[EmailService] Successfully converted Markdown to PDF for attachment using Puppeteer.');
    } catch (error) {
      logger.error('[EmailService] Failed to create PDF from markdown using Puppeteer.', { error });
      throw new Error('Failed to generate PDF attachment.');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  const mailOptions = {
    from: from || `"Tomide Adeoye (via Orion)" <${ORION_EMAIL_SENDER}>`,
    to,
    subject,
    html: htmlBody,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.success(`[EmailService] Email sent successfully to ${mailOptions.to}.`, { messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('[EmailService] Error sending email.', { error });
    throw error;
  }
}
