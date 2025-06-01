import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Ensure we have a secret for NextAuth
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'a_very_long_secret_value_at_least_32_chars';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: secret,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple hardcoded credentials for development
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password';
        
        if (credentials?.username === adminUsername && 
            credentials?.password === adminPassword) {
          return {
            id: 'user-1',
            name: 'Test User',
            email: 'test@example.com'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || 'user-1';
      }
      return session;
    }
  }
});