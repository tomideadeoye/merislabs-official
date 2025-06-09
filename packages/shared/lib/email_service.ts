// lib/email_service.ts
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { ORION_EMAIL_SENDER, ORION_EMAIL_APP_PASSWORD } from './orion_config';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string; // Buffer for binary files, string for text (can be base64 encoded string)
  contentType?: string;    // e.g., 'application/pdf', 'text/plain', 'image/png'
  encoding?: 'base64';     // If content is a base64 string
  cid?: string;            // For embedded images (content ID)
}

export interface SendEmailParams {
  to: string | string[];       // Recipient(s)
  subject: string;
  textBody?: string;            // Plain text version of the email
  htmlBody?: string;            // HTML version of the email
  attachments?: EmailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
}

let transporter: Transporter | null = null;

if (ORION_EMAIL_SENDER && ORION_EMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ORION_EMAIL_SENDER,
      pass: ORION_EMAIL_APP_PASSWORD,
    },
    // logger: true, // Enable console logging from Nodemailer for debugging
    // debug: true,  // Enable debugging output, might include sensitive info
  });

  // Verify connection configuration during server startup (optional, good for early feedback)
  // transporter.verify((error, success) => {
  //   if (error) {
  //     console.error('Nodemailer transporter verification error:', error);
  //   } else {
  //     console.log('Nodemailer transporter is configured correctly and ready to send emails via Gmail.');
  //   }
  // });
} else {
  console.warn(
    'Orion Email Service: EMAIL_SENDER or EMAIL_APP_PASSWORD not configured in environment variables. Email sending will be disabled.'
  );
}

export async function sendEmailService({
  to,
  subject,
  textBody,
  htmlBody,
  attachments,
  cc,
  bcc,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string; details?: any }> {
  if (!transporter) {
    const errorMessage = "Email service is not configured due to missing credentials.";
    console.error(`[EmailService] ${errorMessage}`);
    return { success: false, error: errorMessage };
  }

  const mailOptions: SendMailOptions = {
    from: `"Tomide Adeoye (via Orion)" <${ORION_EMAIL_SENDER}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject: subject,
    text: textBody,
    html: htmlBody,
    cc: cc,
    bcc: bcc,
    attachments: attachments?.map(att => ({
      filename: att.filename,
      content: (att.encoding === 'base64' && typeof att.content === 'string')
                 ? Buffer.from(att.content, 'base64')
                 : att.content,
      contentType: att.contentType,
      cid: att.cid,
    })),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully to ${mailOptions.to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[EmailService] Error sending email:', error);
    return { success: false, error: 'Failed to send email.', details: error.message };
  }
}
