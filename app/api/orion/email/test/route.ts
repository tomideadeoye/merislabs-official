// app/api/orion/email/test/route.ts
import { SendEmailParams, SendEmailResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmailService } from '@/lib/email_service';

// This is a test endpoint that doesn't require authentication
// It's useful for testing the email service during development
export async function POST(request: NextRequest): Promise<NextResponse<SendEmailResponse>> {
  try {
    const body = await request.json();

    // Basic validation for required SendEmailParams fields
    if (!body.to || !body.subject || (!body.textBody && !body.htmlBody)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields for sending email.',
          error: 'Missing required fields for sending email: "to", "subject", and either "textBody" or "htmlBody".',
        },
        { status: 400 }
      );
    }

    // Assuming SendEmailParams is the structure of your body after JSON parsing
    const emailParams: SendEmailParams = body;

    console.log(`[API /email/test] Received request to send test email to: ${emailParams.to}`);
    const result = await sendEmailService(emailParams);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
      });
    } else {
      // Error already logged by sendEmailService
      return NextResponse.json(
        {
          success: false,
          message: result.message || 'Internal server error during email dispatch.',
          error: result.error || 'Internal server error during email dispatch.',
          details: result.details,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API /email/test] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process email request.',
        error: 'Failed to process email request.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
