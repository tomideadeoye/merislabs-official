// app/api/orion/email/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmailService } from '@/lib/email_service';
import type { SendEmailParams as EmailServiceSendEmailParams } from '@/lib/types/email';
import { z } from 'zod';

// Define a Zod schema for the incoming request body, aligning with SendEmailParams
const testEmailRequestSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())], { message: 'Recipient email(s) must be valid.' }),
  subject: z.string().min(1, 'Subject cannot be empty.'),
  htmlBody: z.string().min(1, 'HTML body cannot be empty.'), // Now required as per SendEmailParams
  attachments: z
    .array(
      z.object({
        filename: z.string().min(1, 'Attachment filename is required.'),
        content: z.union([z.string(), z.instanceof(Buffer)]), // content is required in EmailAttachment
        contentType: z.string().optional(),
        encoding: z.literal('base64').optional(),
      })
    )
    .optional(),
  markdownAttachment: z
    .object({
      filename: z.string().min(1, 'Markdown attachment filename is required.'),
      markdown: z.string().min(1, 'Markdown content is required.'),
    })
    .optional(),
});

// This is a test endpoint that doesn't require authentication
// It's useful for testing the email service during development
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const emailParams: EmailServiceSendEmailParams = testEmailRequestSchema.parse(body);

    console.log(`[API /email/test] Received request to send test email to: ${emailParams.to}`);
    const result = await sendEmailService(emailParams);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.messageId,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API /email/test] Unexpected error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input for sending email.',
          error: errorMessage,
          details: error.errors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process email request.',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
