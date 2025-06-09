import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'tomide@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials && credentials.email === 'tomide@example.com' && credentials.password === 'password') {
          console.log('[AUTH] Successful login for:', credentials.email);
          return { id: '1', name: 'Tomide A.', email: 'tomide@example.com' };
        }
        console.log('[AUTH] Failed login attempt:', credentials?.email);
        return null;
      },
    })
  ] as any[],
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        console.log('[AUTH] JWT callback: user present, token updated:', token);
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
        console.log('[AUTH] Session callback: session updated:', session);
      }
      return session;
    },
  },
} as const;

const handler = NextAuth(authConfig);

console.info('[AUTH] Exporting GET and POST handlers for NextAuth App Router.');
export const GET = handler;
export const POST = handler;

/**
 * TODO: Temporary stub for legacy 'auth' import. Migrate all usages to getServerSession(authConfig).
 */
export async function auth() {
  console.warn('[AUTH] The named export "auth" is deprecated. Use getServerSession(authConfig) instead.');
  // Return a mock session object with a user property to match expected type
  return { user: { id: 'stub', name: 'Stub User', email: 'stub@example.com' } };
}
