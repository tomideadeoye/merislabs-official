import NextAuth from 'next-auth';
import { authConfig } from '@repo/shared/auth';

const { handlers } = NextAuth(authConfig);

export const { GET, POST } = handlers;
