import NextAuth, { type Session, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { type JWT } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import logger from './lib/logger';

// Define the shape of the object returned by NextAuth for this specific usage
interface NextAuthExports {
  handlers: {
    GET: (req: NextRequest, res: NextResponse) => Promise<void>;
    POST: (req: NextRequest, res: NextResponse) => Promise<void>;
  };
  auth: () => Promise<Session | null>; // Assuming auth returns a Promise<Session | null>
}

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

export const {
  handlers: { GET, POST },
  auth,
}: NextAuthExports = NextAuth(authConfig);
