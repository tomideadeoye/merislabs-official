"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@repo/ui";
import { MemoryProvider } from "../components/orion/MemoryProvider";
import { Toaster } from "react-hot-toast";
import { logger } from '@repo/shared';

export function Providers({ children }: { children: React.ReactNode }) {
  logger.info("[Providers] Initializing global providers: SessionProvider, ThemeProvider, MemoryProvider, Toaster");
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MemoryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </MemoryProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
