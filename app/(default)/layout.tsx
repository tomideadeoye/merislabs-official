/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - This layout component serves as the default global layout for parts of the Orion application.
 *   - It initializes global client-side libraries like AOS for animations.
 *   - Crucially, it now provides the `MemoryProvider` to ensure that all child components (like JournalPage) have access to the lib memory context, resolving "useMemoryContext must be used within a MemoryProvider" errors.
 *
 * FILEPATH: `app/(default)/layout.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app.ts` (root layout): This layout is nested within the main application layout.
 *   - `AOS` (library): Used for scroll animations.
 *   - `Footer` (`@/components/ui`): Renders the global footer.
 *   - `PageIllustration` (`@/components/ui/page-illustration`): Renders background visual elements.
 *   - `MemoryProvider` (`@/components/orion/MemoryProvider`): Provides the global memory context to its children.
 *   - `app/journal/page.tsx`: This page, and potentially others within the `(default)` route group, now correctly receive memory context.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that any pages rendered within this layout require the `MemoryProvider` context.
 *   - NOTE: The `use client` directive indicates this is a client-side component, necessary for hooks and client-side libraries like AOS and React Context.
 *
 * NOTES:
 *   - OPPORTUNITIES FOR IMPROVEMENT: Consider if all pages under `(default)` truly need `MemoryProvider`. If not, a more granular provider placement might be beneficial for performance.
 *   - OPPORTUNITIES TO CONSOLIDATE: This layout consolidates common UI elements and global providers for a consistent user experience.
 */
'use client';

import { useEffect } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '@/components/ui/footer';
import PageIllustration from '@/components/ui/page-illustration'; // MemoryProvider is already in the root layout

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: 'ease-out-sine',
    });
  }, []); // Correctly empty dependency array to run only once

  return (
    <>
      <main className="grow">
        <PageIllustration />
        {children} {/* MemoryProvider removed from here, it's in app/layout.tsx */}
      </main>

      <Footer />
    </>
  );
}
