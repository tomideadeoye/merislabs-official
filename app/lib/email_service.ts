/**
 * @fileoverview Email service for sending emails using Nodemailer.
 * @description This service abstracts the email sending logic, using environment variables for configuration.
 * It is designed to be used by API routes and other server-side functions.
 */

import nodemailer from 'nodemailer';
import { SendEmailParams, SendEmailResponse, EmailAttachment } from '@/lib/types';

// Ensure environment variables are loaded and available
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// Configure the Nodemailer transporter
// We will only initialize it if the necessary environment variables are present
const createTransporter = () => {
  if (!EMAIL_SENDER || !EMAIL_APP_PASSWORD) {
    console.error(
      '[EmailService] Missing EMAIL_SENDER or EMAIL_APP_PASSWORD environment variables. Email sending will not work.'
    );
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_SENDER,
      pass: EMAIL_APP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

/**
 * Sends an email using the configured Nodemailer transporter.
 * @param params The parameters for sending the email (to, subject, body, etc.).
 * @returns A promise that resolves to a SendEmailResponse indicating success or failure.
 */
export async function sendEmailService(params: SendEmailParams): Promise<SendEmailResponse> {
  if (!transporter) {
    return {
      success: false,
      message: 'Email service not configured. Missing environment variables.',
      error: 'Configuration Error',
    };
  }

  const { to, subject, textBody, htmlBody, attachments, cc, bcc } = params;

  try {
    const mailOptions = {
      from: EMAIL_SENDER,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      text: textBody,
      html: htmlBody,
      cc: Array.isArray(cc) ? cc.join(', ') : cc,
      bcc: Array.isArray(bcc) ? bcc.join(', ') : bcc,
      attachments: attachments?.map((att: EmailAttachment) => ({
        filename: att.filename,
        content: att.content, // Nodemailer handles Buffer or base64 if encoding is specified
        contentType: att.contentType,
        encoding: att.encoding, // e.g., 'base64'
      })),
    };

    const info = await transporter.sendMail(mailOptions);

    console.info('[EmailService] Email sent successfully', {
      messageId: info.messageId,
      envelope: info.envelope,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return {
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[EmailService] Error sending email:', errorMessage, error);
    return {
      success: false,
      message: 'Failed to send email.',
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
    };
  }
}
