'use client';

/**
 * @fileoverview Client-side providers wrapper that handles all client-side logic and providers.
 * @description This component contains all the client-side providers, error handling, and session management
 * that needs to run on the client side, while keeping the layout as a server component.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide all client-side context providers
 *   - Handle session state hydration
 *   - Set up global error listeners
 *   - Wrap the application with error boundaries
 *
 * FILEPATH: app/client-providers.tsx
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `./providers.tsx`: Base providers (ThemeProvider, Toaster, QueryClient)
 *   - `@/components/orion/MemoryProvider.tsx`: Memory context provider
 *   - `@/state/sessionState.ts`: Session state management
 *   - `@/components/ErrorBoundary.tsx`: Error boundary component
 *   - `@/lib/logger.ts`: Logging utility
 *   - `@/lib/utils/clientErrorHandler.ts`: Error handling utilities
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This is a client component that wraps server-rendered content
 *   - All client-side logic is centralized here
 *   - Error boundaries and providers are properly nested
 */

import React, { useEffect } from 'react';
import { Providers } from './providers';
import { MemoryProvider } from '@/components/orion/MemoryProvider';
import { useSessionStateStore } from '@/state/sessionState';
import ErrorBoundary from '@/components/ErrorBoundary';
import logger from '@/lib/logger';
import { handleClientError } from '@/lib/utils/clientErrorHandler';
import { toast } from 'react-hot-toast';

function SessionHydrator() {
  const hydrate = useSessionStateStore((state) => state.hydrateFromLocalStorage);
  const initialized = useSessionStateStore((state) => state.sessionStateInitialized);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized) {
      hydrate();
    }
  }, [hydrate, initialized]);

  return null;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error listener for uncaught JavaScript errors
    const handleError = (event: ErrorEvent) => {
      const handledError = handleClientError(event.error, {
        context: 'Global Window Error (onerror)',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      logger.error(`[GLOBAL_ERROR] Uncaught error: ${handledError.message}`, { error: handledError });
      toast.error(`Global Error: ${handledError.message}`);
    };

    // Global listener for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const handledError = handleClientError(event.reason, {
        context: 'Global Unhandled Promise Rejection (onunhandledrejection)',
      });
      logger.error(`[GLOBAL_REJECTION] Unhandled promise rejection: ${handledError.message}`, { error: handledError });
      toast.error(`Promise Error: ${handledError.message}`);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <Providers>
      <SessionHydrator />
      <MemoryProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </MemoryProvider>
    </Providers>
  );
}
