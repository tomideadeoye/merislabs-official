import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      email: string | null;
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
