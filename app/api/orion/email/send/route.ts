// app/api/orion/email/send/route.ts
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { SendEmailParams, SendEmailResponse } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmailService } from '@/lib/email_service';

export async function POST(request: NextRequest): Promise<NextResponse<SendEmailResponse>> {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
  }

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

    // Handle attachments if they are sent as base64 strings from the client
    // The service function already has logic for this if 'encoding: "base64"' is set on attachment
    // No further processing needed here if client prepares `attachments` array correctly.

    console.log(`[API /email/send] Received request to send email to: ${emailParams.to}`);
    const result = await sendEmailService(emailParams);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully!',
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
    console.error('[API /email/send] Unexpected error:', error);
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
