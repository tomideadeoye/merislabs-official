import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MemoryProvider } from '@/components/orion/MemoryProvider';
import Header from '@/components/ui/header';
import { ThemeProvider } from '@/components/ui/theme-provider';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <MemoryProvider>
            {children}
          </MemoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
