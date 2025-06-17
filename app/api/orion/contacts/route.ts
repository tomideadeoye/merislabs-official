import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Contact } from '@/lib/types';
import { fetchContactsFromNeon, saveContactToNeon } from '@/lib/contact_service';
import consolidatedLogger from '@/lib/logger';

/**
 * GOAL: Provide a public API endpoint to fetch and save contact data from the Neon/PostgreSQL database.
 * This route replaces the previous Notion-based contact fetching and adds functionality to persist new contacts.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `lib/contact_service.ts`: Contains the core logic for fetching and saving contacts from Neon.
 * - `lib/auth.ts`: Used for user authentication and authorization.
 * - `lib/types/index.ts`: Defines the `Contact` interface for response typing.
 * - `@/components/FindStakeholdersButton.tsx` (or similar components): Will consume this API endpoint.
 * - `lib/logger.ts`: For comprehensive logging of API requests and responses.
 */

interface ContactsApiResponse {
  success: boolean;
  contacts?: Contact[];
  contact?: Contact;
  error?: string;
}

export async function GET(): Promise<NextResponse<ContactsApiResponse>> {
  consolidatedLogger.info('[API][GET][contacts][START]', {
    operation: 'fetchContacts',
    message: 'Attempting to fetch contacts via API.',
  });
  const session = await auth();
  if (!session || !session.user) {
    consolidatedLogger.warn('[API][GET][contacts][UNAUTHORIZED]', {
      operation: 'fetchContacts',
      message: 'Unauthorized access attempt.',
    });
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contacts = await fetchContactsFromNeon();
    consolidatedLogger.info('[API][GET][contacts][SUCCESS]', {
      operation: 'fetchContacts',
      message: `Successfully fetched ${contacts.length} contacts.`,
      count: contacts.length,
      userId: session.user.id,
    });
    return NextResponse.json({ success: true, contacts: contacts });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to fetch contacts';
    consolidatedLogger.error('[API][GET][contacts][ERROR]', {
      operation: 'fetchContacts',
      message: `Error fetching contacts: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      userId: session.user.id,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactsApiResponse>> {
  consolidatedLogger.info('[API][POST][contacts][START]', {
    operation: 'saveContact',
    message: 'Attempting to save a new contact via API.',
  });
  const session = await auth();
  if (!session || !session.user) {
    consolidatedLogger.warn('[API][POST][contacts][UNAUTHORIZED]', {
      operation: 'saveContact',
      message: 'Unauthorized access attempt.',
    });
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, linkedinUrl, role, company } = body;

    if (!name) {
      consolidatedLogger.warn('[API][POST][contacts][VALIDATION_ERROR]', {
        operation: 'saveContact',
        message: 'Contact name is required.',
        userId: session.user.id,
      });
      return NextResponse.json({ success: false, error: 'Contact name is required.' }, { status: 400 });
    }

    const newContactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      email: email || null,
      linkedinUrl: linkedinUrl || null,
      role: role || null,
      company: company || null,
    };

    const savedContact = await saveContactToNeon(newContactData);

    consolidatedLogger.info('[API][POST][contacts][SUCCESS]', {
      operation: 'saveContact',
      message: `Successfully saved contact ${savedContact.name}.`,
      contactId: savedContact.id,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, contact: savedContact }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to save contact';
    consolidatedLogger.error('[API][POST][contacts][ERROR]', {
      operation: 'saveContact',
      message: `Error saving contact: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      userId: session.user.id,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
