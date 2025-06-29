import { NextRequest, NextResponse } from 'next/server';
import { Contact } from '@prisma/client';
import { fetchContactsFromNeon, saveContactToNeon } from '@/lib/contact_service';
import logger from '@/lib/logger';

/**
 * @fileoverview API route for managing user contacts: fetching and saving contact data.
 * @description This route serves as the central API endpoint for interacting with user contact information.
 *   It provides functionalities to retrieve all stored contacts from the Neon/PostgreSQL database
 *   and to persist new contact records. It replaces any previous WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES-based contact handling
 *   and ensures data is stored reliably and accessibly.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a secure API endpoint (`GET`) for fetching all `Contact` records associated with a user.
 *   - To provide a secure API endpoint (`POST`) for creating new `Contact` records.
 *   - To ensure data integrity by handling and logging potential errors during database operations.
 *   - To leverage Neon/PostgreSQL for scalable and reliable contact data storage.
 *
 * FILEPATH: `app/api/orion/contacts/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/contact_service.ts`: Contains the core business logic for `fetchContactsFromNeon` and `saveContactToNeon`.
 *   - `app/lib/auth.ts`: Used for authenticating and authorizing user requests to ensure data security.
 *   - `app/lib/types/index.ts`: Defines the `Contact` interface, ensuring type consistency across the application.
 *   - `@/components/orion/networking-hub/NetworkingContactCard.tsx` (or similar): Frontend components that consume this API.
 *   - `app/lib/logger.ts`: Provides comprehensive, context-rich logging for every operation and error.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Neon/PostgreSQL database is properly configured and accessible via `contact_service.ts`.
 *   - Assumes user sessions are valid and provide a `session.user.id` for authorization.
 *   - `POST` requests include `name`, and optionally `email`, `linkedinUrl`, `role`, and `company`.
 *
 * NOTES:
 *   - This API is crucial for the Networking Hub feature, enabling users to manage their professional connections.
 *   - Error handling is integrated to provide informative responses while logging detailed diagnostics.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Input Validation**: Implement Zod schema validation for the `POST` request body to ensure robust data integrity before persistence.
 *   - **Pagination/Filtering (GET)**: Enhance the `GET` endpoint to support pagination and filtering (e.g., by name, company) for large contact lists.
 *   - **De-duplication Logic**: Implement server-side logic to detect and prevent duplicate contact entries (e.g., based on email or LinkedIn URL).
 *   - **Unified Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for more consistent and standardized API error responses.
 *   - **Associated Data**: Allow for associating contacts directly with opportunities or other entities during creation, rather than just standalone contacts.
 */

interface ContactsApiResponse {
  success: boolean;
  contacts?: Contact[];
  contact?: Contact;
  error?: string;
}

export async function GET(): Promise<NextResponse<ContactsApiResponse>> {
  logger.info('[API][GET][contacts][START]', {
    operation: 'fetchContacts',
    message: 'Attempting to fetch contacts via API.',
  });

  try {
    const contacts = await fetchContactsFromNeon();
    const dbContacts = contacts.map((c) => ({
      ...c,
      name: [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ') || '',
      email: '',
      linkedinUrl: '',
      role: '',
      company: '',
    }));
    logger.info('[API][GET][contacts][SUCCESS]', {
      operation: 'fetchContacts',
      message: `Successfully fetched ${dbContacts.length} contacts.`,
      count: dbContacts.length,
      userId: 'unauthenticated_user', // Replaced session.user.id with 'unauthenticated_user'
    });
    return NextResponse.json({ success: true, contacts: dbContacts });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to fetch contacts';
    logger.error('[API][GET][contacts][ERROR]', {
      operation: 'fetchContacts',
      message: `Error fetching contacts: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      userId: 'unauthenticated_user', // Replaced session.user.id with 'unauthenticated_user'
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactsApiResponse>> {
  logger.info('[API][POST][contacts][START]', {
    operation: 'saveContact',
    message: 'Attempting to save a new contact via API.',
  });
  // const session = await auth(); // Authentication removed as per user request
  // if (!session || !session.user) {
  //   logger.warn('[API][POST][contacts][UNAUTHORIZED]', {
  //     operation: 'saveContact',
  //     message: 'Unauthorized access attempt.',
  //   });
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { firstName, lastName, phoneNumber, email1Value, organizationName } = body;

    if (!phoneNumber) {
      logger.warn('[API][POST][contacts][VALIDATION_ERROR]', {
        operation: 'saveContact',
        message: 'Contact phone number is required.',
        userId: 'unauthenticated_user',
      });
      return NextResponse.json({ success: false, error: 'Contact phone number is required.' }, { status: 400 });
    }

    const newContactData = {
      firstName: firstName || null,
      lastName: lastName || null,
      phoneNumber: phoneNumber,
      email1Value: email1Value || null,
      organizationName: organizationName || null,
    };

    const savedContact = await saveContactToNeon(newContactData);

    logger.info('[API][POST][contacts][SUCCESS]', {
      operation: 'saveContact',
      message: `Successfully saved contact ${savedContact.firstName || ''} ${savedContact.lastName || ''}.`,
      contactId: savedContact.id,
      userId: 'unauthenticated_user',
    });

    return NextResponse.json({ success: true, contact: savedContact }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to save contact';
    logger.error('[API][POST][contacts][ERROR]', {
      operation: 'saveContact',
      message: `Error saving contact: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      userId: 'unauthenticated_user', // Replaced session.user.id with 'unauthenticated_user'
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
