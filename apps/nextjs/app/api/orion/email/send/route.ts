// app/api/orion/email/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/sharedauth"; // Your NextAuth.js auth helper
import { sendEmailService } from "@repo/shared/email_service"; // Adjust path if needed
import type { SendEmailParams } from "@repo/shared/email_service";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Basic validation for required SendEmailParams fields
    if (!body.to || !body.subject || (!body.textBody && !body.htmlBody)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields for sending email: "to", "subject", and either "textBody" or "htmlBody".',
        },
        { status: 400 }
      );
    }

    // Assuming SendEmailParams is the structure of your body after JSON parsing
    const emailParams: SendEmailParams = body;

    // Handle attachments if they are sent as base64 strings from the client
    // The service function already has logic for this if 'encoding: "base64"' is set on attachment
    // No further processing needed here if client prepares `attachments` array correctly.

    console.log(
      `[API /email/send] Received request to send email to: ${emailParams.to}`
    );
    const result = await sendEmailService(emailParams);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully!",
        messageId: result.messageId,
      });
    } else {
      // Error already logged by sendEmailService
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Internal server error during email dispatch.",
          details: result.details,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("[API /email/send] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process email request.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
