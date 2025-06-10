import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './css/style.css';
import { Header } from '@repo/ui';
import { ROUTES } from '@shared/lib/routes';
import { Providers } from './providers';
import type { NavItem } from '@shared/types/nav';

const inter = localFont({
  src: './fonts/Inter.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Meris Labs',
  description: 'Meris Labs Official',
};

const navItems: NavItem[] = Object.entries(ROUTES).map(([key, value]) => ({
  id: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  link: value,
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter vsc-initialized`}>
        <Providers>
          <Header navItems={navItems} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
