import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MemoryProvider } from '@/components/orion/MemoryProvider';

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
        <MemoryProvider>
          {children}
        </MemoryProvider>
      </body>
    </html>
  );
}