import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { logger } from './lib/logger';

export const authConfig = {
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
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
        email: { label: 'Email', type: 'email', placeholder: 'tomide@example.com' },
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

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authConfig);
