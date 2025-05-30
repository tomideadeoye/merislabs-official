import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a simple credentials provider for local development
// In production, you would use a more secure authentication method
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would validate the credentials
        // For now, we'll use a simple check for a hardcoded username/password
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Administrator",
            email: "admin@example.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to the token if it exists in the user
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to the session from the token
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});

export const GET = handler;
export const POST = handler;