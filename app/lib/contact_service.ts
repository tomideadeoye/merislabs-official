/**
 * GOAL: Provide a service to interact with the Neon/PostgreSQL database for contact management.
 * This file centralizes all database operations related to contacts, ensuring consistency
 * and separation of concerns from API routes.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - `lib/database.ts`: Provides the `query` function for database interaction.
 * - `lib/types/index.ts`: Defines the `Contact` interface for type safety.
 * - `app/api/orion/contacts/route.ts` (future): Will consume these functions to serve contact data.
 */

import { query } from '@/lib/database';
import { Contact } from '@/lib/types';
import consolidatedLogger from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

interface ContactRow {
  id: string;
  name: string;
  email: string | null;
  linkedin_url: string | null;
  role: string | null;
  company: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all contacts from the Neon/PostgreSQL database.
 * @returns A promise that resolves to an array of Contact objects.
 */
export async function fetchContactsFromNeon(): Promise<Contact[]> {
  consolidatedLogger.info('[CONTACT_SERVICE][fetchContactsFromNeon][START]', {
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
    const result = await query(SELECT_CONTACTS_QUERY);

    const contacts: Contact[] = result.rows.map((row: ContactRow) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      linkedinUrl: row.linkedin_url,
      role: row.role,
      company: row.company,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    consolidatedLogger.info('[CONTACT_SERVICE][fetchContactsFromNeon][SUCCESS]', {
      operation: 'fetchContactsFromNeon',
      message: `Successfully fetched ${contacts.length} contacts from Neon database.`,
      count: contacts.length,
    });
    return contacts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    consolidatedLogger.error('[CONTACT_SERVICE][fetchContactsFromNeon][ERROR]', {
      operation: 'fetchContactsFromNeon',
      message: `Failed to fetch contacts from Neon database: ${errorMessage}`,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to fetch contacts: ${errorMessage}`);
  }
}

/**
 * Saves a new contact to the Neon/PostgreSQL database.
 * @param contact The contact object to save (excluding id, createdAt, updatedAt).
 * @returns A promise that resolves to the newly created Contact object, including its ID and timestamps.
 */
export async function saveContactToNeon(newContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
  consolidatedLogger.info('[CONTACT_SERVICE][saveContactToNeon][START]', {
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

    const result = await query(INSERT_CONTACT_QUERY, values);
    const savedContact: Contact = result.rows[0]; // Assuming RETURNING * gives the full row

    consolidatedLogger.info('[CONTACT_SERVICE][saveContactToNeon][SUCCESS]', {
      operation: 'saveContactToNeon',
      message: `Successfully saved contact ${savedContact.name} to Neon database.`,
      contactId: savedContact.id,
    });
    return savedContact;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    consolidatedLogger.error('[CONTACT_SERVICE][saveContactToNeon][ERROR]', {
      operation: 'saveContactToNeon',
      message: `Failed to save contact to Neon database: ${errorMessage}`,
      contactName: newContact.name,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to save contact: ${errorMessage}`);
  }
}
