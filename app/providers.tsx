'use client';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides top-level context providers for the Next.js application, including authentication (`SessionProvider`), theming (`ThemeProvider`), and toast notifications (`Toaster`).
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/providers.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Wraps the main application content in `app/layout.tsx`.
//   - Provides `SessionProvider` from `next-auth/react`.
//   - Provides `ThemeProvider` from `next-themes`.
//   - Provides `Toaster` from `react-hot-toast`.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';

import { Toaster } from 'react-hot-toast';
import logger from './lib/logger';
import { ThemeProvider } from 'next-themes';

// Create a client
const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

// TODO: MIGRATE TO FULL NEXTJS - move away from simple nextjs project
