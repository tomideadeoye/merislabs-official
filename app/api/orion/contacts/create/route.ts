/**
 * @fileoverview API route for creating a new contact.
 * @description This route handles POST requests to create a new contact record in the database
 *   by utilizing the `contactDbService`. It includes comprehensive logging for traceability.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide an API endpoint (`POST /api/orion/contacts/create`) to add new contacts.
 *   - Validate incoming request data for contact creation.
 *   - Integrate with `contactDbService.createContact` to persist contact data.
 *   - Return appropriate success or error responses with detailed logging.
 *
 * FILEPATH: `app/api/orion/contacts/create/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/contact_db_service.ts`: Consumes the `createContact` function from this service
 *     to perform database operations.
 *   - `@/lib/logger.ts`: Used for comprehensive logging of API request, processing, and responses.
 *   - `@/lib/types/index.ts`: Defines the `Contact` and related types for type safety (though we are skipping manual updates for now).
 *   - Client-side components (e.g., in `app/(orion_admin)/admin/networking-hub/` or similar) will call this API.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that the request body will contain valid contact data for `Prisma.ContactCreateInput`.
 *   - Assumes `contactDbService` is correctly initialized and functional.
 *   - Assumes `logger` is available for structured logging.
 *
 * NOTES:
 *   - Robust error handling is implemented, including capturing and logging potential issues during request parsing or database interaction.
 *   - [COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE]: Follows the pattern of other API creation routes.
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider adding input validation library (e.g., Zod) for more robust schema validation.
 *   - [ERROR HANDLING ROBUSTNESS]: Error messages are designed to be informative for debugging.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement Zod schema validation for the request body to ensure data integrity.
 *   - Add rate limiting to prevent abuse of the endpoint.
 *   - Introduce authentication and authorization checks to restrict access.
 */

import { NextResponse } from 'next/server';
import { contactDbService } from '@/lib/contact_db_service';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  const logContext = { apiRoute: 'contacts/create', method: 'POST' };

  try {
    const body = await request.json();
    logger.info('[API][CONTACTS][CREATE] Received request to create contact.', { ...logContext, body });

    // Basic validation (more robust validation with Zod can be added later)
    if (!body.phoneNumber) {
      logger.warn('[API][CONTACTS][CREATE] Validation failed: phoneNumber is required.', logContext);
      return NextResponse.json({ success: false, error: 'Phone number is required.' }, { status: 400 });
    }

    const contactData = {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      phoneticFirstName: body.phoneticFirstName,
      phoneticMiddleName: body.phoneticMiddleName,
      phoneticLastName: body.phoneticLastName,
      namePrefix: body.namePrefix,
      nameSuffix: body.nameSuffix,
      nickname: body.nickname,
      fileAs: body.fileAs,
      organizationName: body.organizationName,
      organizationTitle: body.organizationTitle,
      organizationDepartment: body.organizationDepartment,
      birthday: body.birthday ? new Date(body.birthday) : null, // Convert to Date object
      notes: body.notes,
      photo: body.photo,
      labels: body.labels || [],
      email1Label: body.email1Label,
      email1Value: body.email1Value,
      email2Label: body.email2Label,
      email2Value: body.email2Value,
      email3Label: body.email3Label,
      email3Value: body.email3Value,
      email4Label: body.email4Label,
      email4Value: body.email4Value,
      phone1Label: body.phone1Label,
      phoneNumber: body.phoneNumber,
      phone2Label: body.phone2Label,
      phone2Value: body.phone2Value,
      phone3Label: body.phone3Label,
      phone3Value: body.phone3Value,
      phone4Label: body.phone4Label,
      phone4Value: body.phone4Value,
      address1Label: body.address1Label,
      address1Formatted: body.address1Formatted,
      address1Street: body.address1Street,
      address1City: body.address1City,
      address1PoBox: body.address1PoBox,
      address1Region: body.address1Region,
      address1PostalCode: body.address1PostalCode,
      address1Country: body.address1Country,
      address1ExtendedAddress: body.address1ExtendedAddress,
      address2Label: body.address2Label,
      address2Formatted: body.address2Formatted,
      address2Street: body.address2Street,
      address2City: body.address2City,
      address2PoBox: body.address2PoBox,
      address2Region: body.address2Region,
      address2PostalCode: body.address2PostalCode,
      address2Country: body.address2Country,
      address2ExtendedAddress: body.address2ExtendedAddress,
      website1Label: body.website1Label,
      website1Value: body.website1Value,
      customField1Label: body.customField1Label,
      customField1Value: body.customField1Value,
      // createdAt and updatedAt are automatically handled by Prisma @default(now()) and @updatedAt
    };

    const newContact = await contactDbService.createContact(contactData);
    logger.info('[API][CONTACTS][CREATE] Contact created successfully.', { ...logContext, contactId: newContact.id });

    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred.';
    logger.error('[API][CONTACTS][CREATE] Failed to create contact.', { ...logContext, error: errorMessage });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
