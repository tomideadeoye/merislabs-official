import NextAuth, { type Session, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { type JWT } from 'next-auth/jwt';
import logger from './lib/logger';

export const authConfig = {
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        // These properties should be available if module augmentation is set up for NextAuth
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
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
        } catch (error: unknown) {
          logger.error('Authentication error', { error: error instanceof Error ? error.message : String(error) });
          return null;
        }
      },
    }),
  ],
};

// Export the NextAuth handler directly instead of destructuring GET and POST
// This allows the `auth` function to be used independently without issues.
export const { auth, handlers } = NextAuth(authConfig);
