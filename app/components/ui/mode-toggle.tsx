'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      <div className="relative h-5 w-5 flex items-center justify-center">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all absolute inset-0.5 dark:-rotate-90 dark:scale-0" />
        <Moon className="h-4 w-4 rotate-90 scale-0 transition-all absolute inset-0.5 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}