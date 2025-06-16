import NextAuth, { type Session, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { logger } from './lib/logger';

// Define the shape of the object returned by NextAuth for this specific usage
interface NextAuthExports {
  handlers: {
    GET: (...args: any[]) => any; // Using any for simplicity for handlers
    POST: (...args: any[]) => any;
  };
  auth: () => Promise<Session | null>; // Assuming auth returns a Promise<Session | null>
}

export const authConfig = {
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: User | null }) {
      if (user) {
        // These properties should be available if module augmentation is set up for NextAuth
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token && session.user) {
        // These properties should be available if module augmentation is set up for NextAuth
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'tomide@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.warn('Missing credentials');
            return null;
          }

          // TODO: Replace with actual authentication logic
          if (credentials.email === 'tomide@example.com' && credentials.password === 'password') {
            logger.info('Successful login', { email: credentials.email });
            return {
              id: '1',
              name: 'Tomide A.',
              email: credentials.email,
            };
          }

          logger.warn('Invalid credentials', { email: credentials.email });
          return null;
        } catch (error) {
          logger.error('Authentication error', { error });
          return null;
        }
      },
    }),
  ],
};

// NOTE: The GET and POST handlers, and the `auth` function, will be exported directly from app/api/auth/[...nextauth]/route.ts
