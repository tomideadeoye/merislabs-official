'use client';
// Mark this as a Client Component
// GOAL OF FILE|FEATURES|FUNCTIONS: Root layout, sets up global providers and HTML structure.
// FILEPATH: `app/layout.tsx`
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - `app/components/ErrorBoundary.tsx`: Integrates the React Error Boundary for catching UI rendering errors.
//   - `@/lib/logger.ts`: Utilized for consistent logging of global errors.
//   - `app/lib/utils/clientErrorHandler.ts`: Used to standardize the format of caught errors before logging.
//   - `app/lib/routes.ts`: Provides navigation items for the Header component.
//   - `app/providers.tsx`: Consolidates various context providers for the application.
//   - `@/components/orion/MemoryProvider.tsx`: Provides memory-related context.
//   - `@/state/sessionState.ts`: Manages session state hydration from local storage.
//   - `@/components/ui/header.tsx`: The main application header.
//   - `./fonts.ts`: Imports custom fonts.
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:
import React, { useEffect } from 'react'; // Import useEffect
import './css/style.css';
// import type { Metadata } from 'next'; // Metadata should be in a server component
import { Header } from '@/components/ui/header';
import { navItems } from './lib/routes';
import { Providers } from './providers';
import { MemoryProvider } from '@/components/orion/MemoryProvider';
import { useSessionStateStore } from '@/state/sessionState';
import { inter } from './fonts'; // Import the font from the new fonts file
import ErrorBoundary from '@/components/ErrorBoundary'; // Import the ErrorBoundary
import logger from '@/lib/logger'; // Import the logger
import { handleClientError } from '@/lib/utils/clientErrorHandler'; // Import the client-side error handler

function SessionHydrator() {
  const hydrate = useSessionStateStore((state) => state.hydrateFromLocalStorage);
  const initialized = useSessionStateStore((state) => state.sessionStateInitialized);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized) {
      hydrate();
    }
  }, [hydrate, initialized]);

  return null; // This component does not render anything
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    };

    // Global listener for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const handledError = handleClientError(event.reason, {
        context: 'Global Unhandled Promise Rejection (onunhandledrejection)',
      });
      logger.error(`[GLOBAL_REJECTION] Unhandled promise rejection: ${handledError.message}`, { error: handledError });
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter vsc-initialized`}>
        <Providers>
          <SessionHydrator /> {/* Add SessionHydrator here */}
          <MemoryProvider>
            <Header navItems={navItems} />
            <ErrorBoundary>{children}</ErrorBoundary> {/* Wrap children with ErrorBoundary */}
          </MemoryProvider>
        </Providers>
      </body>
    </html>
  );
}
