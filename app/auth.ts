/**
 * @fileoverview Authentication Removal Note
 * @description This file is part of the ongoing effort to gradually remove all authentication from the Orion application.
 *   As authentication is phased out, this file's purpose as a development-only authentication bypass
 *   will become obsolete. The dummy `auth` and `handlers` will eventually be removed entirely
 *   as the application transitions to an unauthenticated, local-first model.
 *   For detailed strategy, refer to `docs/authentication_removal_strategy.md`.
 *
 *   Original File Purpose:
 *   - To completely disable authentication for easier development and testing.
 *   - To provide a dummy `auth` and `handlers` export that always grants access.
 *
 * FILEPATH: `app/auth.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - This file is imported by various API routes and server components (`auth.ts` is commonly imported for session checks).
 *     By providing dummy exports, it effectively bypasses security checks everywhere it's used.
 *   - `app/api/auth/[...nextauth]/route.ts`: This file will no longer be functional as the `handlers` are effectively nullified.
 *   - Components using `useSession` or `getSession`: These will now always return an unauthenticated session.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the user is fully aware of the security implications of disabling authentication.
 *   - This is a temporary development-only change.
 *
 * NOTES:
 *   - To re-enable authentication, revert this file to its original NextAuth.js configuration.
 *   - Consider using environment variables to conditionally enable/disable authentication for different environments if a full disable is not desired.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement a more robust mocking strategy for authentication if granular control is needed during testing without compromising the core security setup.
 */
/**
 * @fileoverview Disables all authentication for development purposes.
 * @description This file overrides the default NextAuth.js configuration to allow unauthenticated access to all routes.
 *              **WARNING: Do NOT use this configuration in production environments.**
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To completely disable authentication for easier development and testing.
 *   - To provide a dummy `auth` and `handlers` export that always grants access.
 *
 * FILEPATH: `app/auth.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - This file is imported by various API routes and server components (`auth.ts` is commonly imported for session checks).
 *     By providing dummy exports, it effectively bypasses security checks everywhere it's used.
 *   - `app/api/auth/[...nextauth]/route.ts`: This file will no longer be functional as the `handlers` are effectively nullified.
 *   - Components using `useSession` or `getSession`: These will now always return an unauthenticated session.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the user is fully aware of the security implications of disabling authentication.
 *   - This is a temporary development-only change.
 *
 * NOTES:
 *   - To re-enable authentication, revert this file to its original NextAuth.js configuration.
 *   - Consider using environment variables to conditionally enable/disable authentication for different environments if a full disable is not desired.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement a more robust mocking strategy for authentication if granular control is needed during testing without compromising the core security setup.
 */

import { type Session, type User } from 'next-auth';
import { type JWT } from 'next-auth/jwt';

// Dummy auth function that always returns a session for an unauthenticated user
export const auth = async (): Promise<Session | null> => {
  return {
    user: {
      id: 'unauthenticated_user',
      name: 'Guest User',
      email: 'guest@example.com',
    },
    expires: '2099-12-31T23:59:59.000Z',
  };
};

// Dummy handlers that do nothing
export const handlers = {
  GET: () => {
    console.warn('Authentication is disabled. GET handler called.');
    return new Response('Authentication disabled', { status: 200 });
  },
  POST: () => {
    console.warn('Authentication is disabled. POST handler called.');
    return new Response('Authentication disabled', { status: 200 });
  },
};
