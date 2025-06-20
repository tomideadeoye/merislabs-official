import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the Credentials provider's `authorize` callback.
   */
  interface User extends DefaultUser {
    id: string;
    email: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string | null;
  }
}
