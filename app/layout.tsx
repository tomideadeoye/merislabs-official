'use client';
// Mark this as a Client Component
// GOAL OF FILE|FEATURES|FUNCTIONS: Root layout, sets up global providers and HTML structure.
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter vsc-initialized`}>
        <Providers>
          <SessionHydrator /> {/* Add SessionHydrator here */}
          <MemoryProvider>
            <Header navItems={navItems} />
            {children}
          </MemoryProvider>
        </Providers>
      </body>
    </html>
  );
}
