// app/api/orion/email/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmailService } from '@shared/lib/email_service';
import type { SendEmailParams } from '@shared/lib/email_service';

// This is a test endpoint that doesn't require authentication
// It's useful for testing the email service during development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation for required SendEmailParams fields
    if (!body.to || !body.subject || (!body.textBody && !body.htmlBody)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields for sending email: "to", "subject", and either "textBody" or "htmlBody".' 
      }, { status: 400 });
    }

    // Assuming SendEmailParams is the structure of your body after JSON parsing
    const emailParams: SendEmailParams = body;

    console.log(`[API /email/test] Received request to send test email to: ${emailParams.to}`);
    const result = await sendEmailService(emailParams);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully!', 
        messageId: result.messageId 
      });
    } else {
      // Error already logged by sendEmailService
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Internal server error during email dispatch.', 
        details: result.details 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[API /email/test] Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process email request.', 
      details: error.message 
    }, { status: 500 });
  }
}