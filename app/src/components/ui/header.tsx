'use client';

import { Button } from '@/components/ui';
import { Sun, Moon } from 'lucide-react';
import consolidatedLogger from '@/lib/logger';
import { useTheme } from 'next-themes';
// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar } from '.';
import { NavItem } from '../../types';
import MobileMenu from './mobile-menu';

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  const currentPage = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Comprehensive logging to debug header visibility
  consolidatedLogger.info('[Header Component] Initializing. Current path:', {
    currentPage,
    theme,
  });
  consolidatedLogger.debug('[Header Component] Received navItems:', {
    navItems,
    itemCount: navItems?.length,
  });

  // Log the Meris Labs logo rendering here, outside JSX
  consolidatedLogger.debug('[Header Component] Rendering Meris Labs logo.', {
    src: '/images/merislabswhite.png',
  });

  useEffect(() => {
    setMounted(true);
    consolidatedLogger.info('[Header Component] Mounted successfully.');
    consolidatedLogger.debug('[Header Component] Final theme state after mount:', {
      theme,
    });
  }, [theme]);

  const isActive = (link: string): boolean => currentPage === link;

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    consolidatedLogger.info(`[Header Component] Theme changed to ${newTheme}`);
  };

  return (
    <header className="fixed w-full z-30 bg-black shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="shrink-0 mr-4">
            <Link href="/" className="block" aria-label="Meris Labs">
              <Avatar src="/images/merislabswhite.png" alt="Workflow" className="w-8 h-8" />
            </Link>
          </div>
          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href || '/'}
                    className={`inline-block cursor-pointer px-4 py-2 font-medium transition duration-300 ease-in-out ${
                      isActive(item.href || '')
                        ? 'border-b-2 border-yellow-500 text-yellow-700 dark:text-yellow-300'
                        : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-yellow-200'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <li className="ml-4 flex items-center">
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle theme"
                    className="relative w-14 h-8 p-0 flex items-center bg-gradient-to-br from-yellow-100/80 to-pink-100/80 dark:from-gray-800 dark:to-gray-900 border border-yellow-200 dark:border-gray-700 shadow-md rounded-full transition-colors duration-300"
                    onClick={handleThemeToggle}
                  >
                    <span className="absolute left-2 top-1/2 -translate-y-1/2">
                      <Sun
                        className={`h-5 w-5 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-yellow-500'}`}
                      />
                    </span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Moon
                        className={`h-5 w-5 transition-colors ${theme === 'dark' ? 'text-pink-400' : 'text-gray-500'}`}
                      />
                    </span>
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 rounded-full bg-white dark:bg-gray-700 shadow-md w-6 h-6 z-10 ${
                        theme === 'dark' ? 'right-1' : 'left-1'
                      }`}
                      style={{
                        boxShadow: '0 2px 8px 0 rgba(255, 200, 100, 0.15)',
                      }}
                    />
                  </Button>
                )}
              </li>
            </ul>
          </nav>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

// TODO: Consolidate files
// this is a simple nextjs app... not a monorepo
// Always use linting
