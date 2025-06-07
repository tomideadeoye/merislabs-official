import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './css/style.css';
import { MemoryProvider } from '@/components/orion/MemoryProvider';
import Header from '@/components/ui/header';
import { ThemeProvider } from '@/components/ui/theme-provider';

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
      <body className={`${inter.variable} font-inter`}>
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
