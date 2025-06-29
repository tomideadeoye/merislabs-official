/**
 * @fileoverview Provides a centralized service for all database operations related to the Contact model.
 * @description This file encapsulates Prisma client interactions for creating, retrieving, and managing contact records.
 *   It ensures clean, reusable, and testable database logic for contact data.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide CRUD (Create, Retrieve, Update, Delete) operations for the 'Contact' model.
 *   - Ensure consistent data handling and error management for contact-related database operations.
 *   - Facilitate efficient querying of contacts, potentially by phone number (as it's a unique identifier).
 *
 * FILEPATH: `app/lib/contact_db_service.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `generated/prisma/schema.prisma`: Defines the 'Contact' model used by this service.
 *   - `app/lib/prisma.ts`: Imports the Prisma client instance for database access.
 *   - `app/api/orion/contacts/.../route.ts`: (To be created) API routes will consume these functions to interact with the contact database.
 *   - `app/lib/types/index.ts`: (To be updated) Defines the TypeScript interface for the Contact model.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Prisma client (`@/lib/prisma`) is correctly initialized and connected to the database.
 *   - Assumes the 'Contact' model exists in the Prisma schema and has been migrated to the database.
 *   - The 'phoneNumber' field is assumed to be a unique identifier for contacts.
 *
 * NOTES:
 *   - This service is designed to be the single source of truth for all contact database operations, promoting the DRY principle.
 *   - [COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE]: Adheres to the pattern of other `_db_service.ts` files (e.g., `task_db_service.ts`).
 *   - [PERFORMANCE OPTIMIZATIONS]: Consider adding indexing to frequently queried fields in `prisma/schema.prisma` if performance issues arise with a large number of contacts.
 *   - [ERROR HANDLING ROBUSTNESS]: Basic error handling is present, but could be enhanced with more specific error types or retry logic for production use.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement pagination or advanced filtering for `listContacts` for better performance with many contacts.
 *   - Add soft delete functionality for contacts instead of hard deletion.
 *   - Introduce more granular logging within each function for detailed operation tracing.
 *   - Implement robust validation for contact data before creation/update.
 */
import { prisma } from '@/lib/prisma';
import { Contact } from '@prisma/client';
import logger from './logger';

export type ContactCreateData = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
export type ContactUpdateData = Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>;

export const contactDbService = {
  /**
   * Creates a new contact in the database.
   * @param data The data for the new contact.
   * @returns The created Contact object.
   */
  createContact: async (data: ContactCreateData): Promise<Contact> => {
    logger.info('Attempting to create a new contact.', { operation: 'createContact', parameters: data });
    try {
      const newContact = await prisma.contact.create({ data });
      logger.info('Successfully created a new contact.', {
        operation: 'createContact',
        results: newContact,
        contactId: newContact.id,
      });
      return newContact;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to create contact.', {
        operation: 'createContact',
        parameters: { data },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to create contact: ${errorMessage}`);
    }
  },

  /**
   * Retrieves a contact by its ID.
   * @param contactId The ID of the contact.
   * @returns The Contact object, or null if not found.
   */
  getContactById: async (contactId: string): Promise<Contact | null> => {
    logger.info('Attempting to retrieve contact by ID.', { operation: 'getContactById', parameters: { contactId } });
    try {
      const contact = await prisma.contact.findUnique({ where: { id: contactId } });
      if (contact) {
        logger.info('Contact retrieved successfully by ID.', {
          operation: 'getContactById',
          results: contact,
          contactId: contact.id,
        });
      } else {
        logger.warn('Contact not found by ID.', {
          operation: 'getContactById',
          parameters: { contactId },
          validation: 'No record found.',
        });
      }
      return contact;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to retrieve contact by ID.', {
        operation: 'getContactById',
        parameters: { contactId },
        error: errorMessage,
        validation: 'Database read error.',
      });
      throw new Error(`Failed to retrieve contact by ID: ${errorMessage}`);
    }
  },

  /**
   * Retrieves a contact by its phone number.
   * @param phoneNumber The unique phone number of the contact.
   * @returns The Contact object, or null if not found.
   */
  getContactByPhoneNumber: async (phoneNumber: string): Promise<Contact | null> => {
    logger.info('Attempting to retrieve contact by phone number.', {
      operation: 'getContactByPhoneNumber',
      parameters: { phoneNumber },
    });
    try {
      const contact = await prisma.contact.findUnique({ where: { phoneNumber: phoneNumber } });
      if (contact) {
        logger.info('Contact retrieved successfully by phone number.', {
          operation: 'getContactByPhoneNumber',
          results: contact,
          contactId: contact.id,
        });
      } else {
        logger.warn('Contact not found by phone number.', {
          operation: 'getContactByPhoneNumber',
          parameters: { phoneNumber },
          validation: 'No record found.',
        });
      }
      return contact;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to retrieve contact by phone number.', {
        operation: 'getContactByPhoneNumber',
        parameters: { phoneNumber },
        error: errorMessage,
        validation: 'Database read error.',
      });
      throw new Error(`Failed to retrieve contact by phone number: ${errorMessage}`);
    }
  },

  /**
   * Retrieves all contacts in the database.
   * @returns An array of Contact objects.
   */
  getAllContacts: async (): Promise<Contact[]> => {
    logger.info('Attempting to retrieve all contacts.', { operation: 'getAllContacts' });
    try {
      const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
      logger.info('All contacts retrieved successfully.', {
        operation: 'getAllContacts',
        resultsCount: contacts.length,
      });
      return contacts;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to retrieve all contacts.', {
        operation: 'getAllContacts',
        error: errorMessage,
        validation: 'Database read error.',
      });
      throw new Error(`Failed to retrieve all contacts: ${errorMessage}`);
    }
  },

  /**
   * Updates an existing contact.
   * @param contactId The ID of the contact to update.
   * @param data The data to update the contact with.
   * @returns The updated Contact object.
   */
  updateContact: async (contactId: string, data: ContactUpdateData): Promise<Contact> => {
    logger.info('Attempting to update contact.', { operation: 'updateContact', parameters: { contactId, ...data } });
    try {
      const updatedContact = await prisma.contact.update({ where: { id: contactId }, data });
      logger.info('Contact updated successfully.', {
        operation: 'updateContact',
        results: updatedContact,
        contactId: updatedContact.id,
      });
      return updatedContact;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to update contact.', {
        operation: 'updateContact',
        parameters: { contactId, data },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to update contact: ${errorMessage}`);
    }
  },

  /**
   * Deletes a contact by its ID.
   * @param contactId The ID of the contact to delete.
   * @returns The deleted Contact object.
   */
  deleteContact: async (contactId: string): Promise<Contact> => {
    logger.info('Attempting to delete contact.', { operation: 'deleteContact', parameters: { contactId } });
    try {
      const deletedContact = await prisma.contact.delete({ where: { id: contactId } });
      logger.info('Contact deleted successfully.', {
        operation: 'deleteContact',
        results: deletedContact,
        contactId: deletedContact.id,
      });
      return deletedContact;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
      logger.error('Failed to delete contact.', {
        operation: 'deleteContact',
        parameters: { contactId },
        error: errorMessage,
        validation: 'Database write error.',
      });
      throw new Error(`Failed to delete contact: ${errorMessage}`);
    }
  },
};
