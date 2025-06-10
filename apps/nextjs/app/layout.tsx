import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './css/style.css';
import { Header } from '@repo/ui';
import { ROUTES } from '@shared/lib/routes';
import { ThemeProvider } from '@repo/ui';
import { SessionProvider } from 'next-auth/react';
import { Providers } from './providers';

const inter = localFont({
  src: './fonts/Inter.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Meris Labs',
  description: 'Meris Labs Official',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter vsc-initialized`}>
        <Providers>
          <Header navItems={ROUTES} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
