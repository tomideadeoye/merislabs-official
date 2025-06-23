import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
// No longer need to import Session, User, JWT directly here as they are augmented in next-auth.d.ts

// NOTE: Strict authentication is not a high priority for the application at this stage. Features should generally be accessible.
export const authConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'username' | 'password', string> | undefined) {
        // This is a mock authorization.
        // In a real application, you would validate credentials against a database.
        if (credentials?.username === 'orion' && credentials?.password === 'orion') {
          return { id: '1', name: 'Orion Admin', email: 'admin@orion.system' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === 'string') {
          session.user.id = token.id;
        }
        if (token.email) {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
} satisfies NextAuthOptions;

// NOTE: The GET and POST handlers, and the `auth` function, will be exported directly from app/api/auth/[...nextauth]/route.ts
