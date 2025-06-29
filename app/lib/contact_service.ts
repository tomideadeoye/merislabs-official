/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * GOAL: Provide a service to interact with the Neon/PostgreSQL database for contact management.
 * This file centralizes all database operations related to contacts, ensuring consistency
 * and separation of concerns from API routes.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `@/lib/prisma`: Provides the Prisma client instance for database interaction.
 * - `app/api/orion/contacts/route.ts`: Will consume these functions to serve contact data.
 * - `generated/prisma/index.ts`: The Prisma generated client and types for the Contact model.
 * - prisma ORM, neon, postgres
 */

import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';
import { Contact, Prisma } from '@prisma/client';

/**
 * @function fetchContactsFromNeon
 * @description Fetches all contacts from the Neon/PostgreSQL database.
 * @returns A promise that resolves to an array of Contact objects.
 */
/**
 * Fetches all contacts from the Neon/PostgreSQL database.
 * @returns A promise that resolves to an array of Contact objects.
 */
export async function fetchContactsFromNeon(): Promise<Contact[]> {
  logger.info('[CONTACT_SERVICE][fetchContactsFromNeon][START]', {
    operation: 'fetchContactsFromNeon',
    message: 'Attempting to fetch all contacts from Neon database.',
  });
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    logger.info('[CONTACT_SERVICE][fetchContactsFromNeon][SUCCESS]', {
      operation: 'fetchContactsFromNeon',
      message: `Successfully fetched ${contacts.length} contacts from Neon database.`,
      count: contacts.length,
    });
    return contacts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CONTACT_SERVICE][fetchContactsFromNeon][ERROR]', {
      operation: 'fetchContactsFromNeon',
      message: `Failed to fetch contacts from Neon database: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to fetch contacts: ${errorMessage}`);
  }
}

/**
 * @function saveContactToNeon
 * @description Saves a new contact to the Neon/PostgreSQL database.
 * @param newContact The contact object to save (excluding id, createdAt, updatedAt).
 * @returns A promise that resolves to the newly created Contact object, including its ID and timestamps.
 */
/**
 * Saves a new contact to the Neon/PostgreSQL database.
 * @param newContact The contact object to save (excluding id, createdAt, updatedAt).
 * @returns A promise that resolves to the newly created Contact object, including its ID and timestamps.
 */
export async function saveContactToNeon(newContact: Prisma.ContactCreateInput): Promise<Contact> {
  logger.info('[CONTACT_SERVICE][saveContactToNeon][START]', {
    operation: 'saveContactToNeon',
    message: 'Attempting to save a new contact to Neon database.',
    contactPhoneNumber: newContact.phoneNumber,
  });
  try {
    const savedContact = await prisma.contact.create({ data: newContact });
    logger.info('[CONTACT_SERVICE][saveContactToNeon][SUCCESS]', {
      operation: 'saveContactToNeon',
      message: `Successfully saved contact ${savedContact.firstName || ''} ${savedContact.lastName || ''} to Neon database.`,
      contactId: savedContact.id,
    });
    return savedContact;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CONTACT_SERVICE][saveContactToNeon][ERROR]', {
      operation: 'saveContactToNeon',
      message: `Failed to save contact to Neon database: ${errorMessage}`,
      contactPhoneNumber: newContact.phoneNumber,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to save contact: ${errorMessage}`);
  }
}
