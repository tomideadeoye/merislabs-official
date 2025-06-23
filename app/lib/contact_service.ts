/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * GOAL: Provide a service to interact with the Neon/PostgreSQL database for contact management.
 * This file centralizes all database operations related to contacts, ensuring consistency
 * and separation of concerns from API routes.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `lib/database.ts`: Provides the `query` function for database interaction.
 * - `lib/types/index.ts`: Defines the `Contact` interface for type safety.
 * - `app/api/orion/contacts/route.ts` (future): Will consume these functions to serve contact data.
 * - prisma ORM, neon, postgres
 */

import { sql } from '@/lib/database';
import { Contact } from '@/lib/types';
import logger from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert database row (array of unknown values) to Contact type
const rowToContact = (row: unknown[]): Contact => ({
  id: row[0] as string,
  name: row[1] as string,
  email: row[2] as string | null,
  linkedinUrl: row[3] as string | null,
  role: row[4] as string | null,
  company: row[5] as string | null,
  createdAt: row[6] as string,
  updatedAt: row[7] as string,
});

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
    const SELECT_CONTACTS_QUERY = `
      SELECT
        id,
        name,
        email,
        linkedin_url AS "linkedinUrl",
        role,
        company,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM contacts
      ORDER BY name ASC;
    `;
    const result = (await sql(SELECT_CONTACTS_QUERY)) as unknown[][];

    const contacts: Contact[] = result.map((row) => rowToContact(row));

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
export async function saveContactToNeon(newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
  logger.info('[CONTACT_SERVICE][saveContactToNeon][START]', {
    operation: 'saveContactToNeon',
    message: 'Attempting to save a new contact to Neon database.',
    contactName: newContact.name,
  });

  try {
    const id = uuidv4();
    const now = new Date().toISOString();

    const INSERT_CONTACT_QUERY = `
      INSERT INTO contacts (
        id,
        name,
        email,
        linkedin_url,
        role,
        company,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      id,
      newContact.name,
      newContact.email || null, // Allow null for optional fields
      newContact.linkedinUrl || null,
      newContact.role || null,
      newContact.company || null,
      now,
      now,
    ];

    const result = (await sql(INSERT_CONTACT_QUERY, values)) as unknown[][];
    const savedContact: Contact = rowToContact(result[0]);

    logger.info('[CONTACT_SERVICE][saveContactToNeon][SUCCESS]', {
      operation: 'saveContactToNeon',
      message: `Successfully saved contact ${savedContact.name} to Neon database.`,
      contactId: savedContact.id,
    });
    return savedContact;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[CONTACT_SERVICE][saveContactToNeon][ERROR]', {
      operation: 'saveContactToNeon',
      message: `Failed to save contact to Neon database: ${errorMessage}`,
      contactName: newContact.name,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to save contact: ${errorMessage}`);
  }
}
