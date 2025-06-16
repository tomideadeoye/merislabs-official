'use client';

import { SessionProvider } from 'next-auth/react';

import { Toaster } from 'react-hot-toast';
import logger from './lib/logger';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  logger.info('[Providers] Initializing global providers: SessionProvider, ThemeProvider, MemoryProvider, Toaster');
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

// TODO: MIGRATE TO FULL NEXTJS - move away from simple nextjs project
