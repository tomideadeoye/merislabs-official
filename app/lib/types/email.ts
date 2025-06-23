export interface SendEmailParams {
  to: string | string[];
  subject: string;
  textBody?: string;
  htmlBody: string;
  attachments?: EmailAttachment[];
  markdownAttachment?: {
    filename: string;
    markdown: string;
  };
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: 'base64';
}
