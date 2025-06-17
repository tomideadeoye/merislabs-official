// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './css/style.css';
import { Header } from '@/components/ui/header';
import { navItems } from './lib/routes';
import { Providers } from './providers';
import { MemoryProvider } from '@/components/orion/MemoryProvider';

const inter = localFont({
  src: './fonts/Inter.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Meris Labs',
  description: 'Meris Labs Official',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter vsc-initialized`}>
        <Providers>
          <MemoryProvider>
            <Header navItems={navItems} />
            {children}
          </MemoryProvider>
        </Providers>
      </body>
    </html>
  );
}
