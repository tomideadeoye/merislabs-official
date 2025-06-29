/**
 * @fileoverview Defines the main application header, providing navigation, theme toggling, and mobile menu integration.
 * @description This file implements the top-level navigation bar for the Orion application, ensuring a consistent
 *   and responsive user experience across different pages. It integrates client-side functionalities like
 *   theme switching and highlights the active navigation link.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Display core navigation links (Home, Admin, Decks).
 *   - Implement a theme toggle (light/dark mode) for user preference.
 *   - Provide a mobile-responsive menu.
 *   - Ensure visual consistency and an "exquisite" user interface leveraging shadcn/ui.
 *
 * FILEPATH: `app/components/ui/header.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/layout.tsx`: This header component is rendered within the root layout, making it globally available.
 *   - `@components/ui/Button`: Utilizes the shared UI Button component for interactive elements.
 *   - `@components/ui/Avatar`: Used for displaying the application logo.
 *   - `@components/ui/lib/utils`: Imports the `cn` utility for conditional class name merging.
 *   - `lucide-react`: Provides icons for the theme toggle.
 *   - `next-themes`: Manages and provides the current theme state.
 *   - `next/link` & `next/navigation`: Used for client-side routing and determining the active page.
 *   - `@/lib/logger`: For structured logging of component lifecycle and user interactions.
 *   - `@/lib/types/NavItem`: Defines the structure for navigation items passed as props.
 *   - `./mobile-menu.tsx`: Integrates the mobile-specific navigation functionality.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `@components/ui` package is correctly set up in the monorepo and exports `Button`, `Avatar`, and `cn`.
 *   - The `MobileMenu` component handles its own rendering and functionality for smaller screens.
 *   - `next-themes` is correctly configured in `app/providers.tsx` for theme management.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: This header centralizes top-level navigation, reducing redundancy. The Avatar component might be further generalized if other similar image displays are needed across the app.
 *   - **PERFORMANCE OPTIMIZATIONS**: Ensure minimal re-renders by optimizing `useEffect` dependencies.
 *   - **ERROR HANDLING ROBUSTNESS**: Logging covers component initialization and theme changes.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Accessibility**: Enhance ARIA attributes and keyboard navigation for improved accessibility.
 *   - **Animation**: Explore subtle Framer Motion animations for navigation links on hover or click for a more dynamic feel.
 *   - **Responsiveness**: Further refine responsive design for various tablet and mobile breakpoints.
 *   - **User Experience**: Consider adding a loading indicator for initial theme mount if there's a noticeable flicker.
 */
'use client';

import { Button } from '@/components/ui';
import { Sun, Moon } from 'lucide-react';
import logger from '@/lib/logger';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Avatar } from '.';
import { cn } from '@/lib/utils';

import MobileMenu from './mobile-menu';
import { NavItem } from '@/lib/types';

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  const currentPage = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Filter navigation items based on the current page
  const displayedNavItems =
    currentPage === '/'
      ? navItems.filter((item) => item.href === '/' || item.href === '/admin' || item.href === '/decks')
      : navItems;

  // Comprehensive logging to debug header visibility and theme changes
  logger.info('[Header Component][INIT] Initializing. Current path:', {
    currentPage,
    theme,
    operation: 'Header_Initialization',
    context: 'UI_Render',
  });

  useEffect(() => {
    setMounted(true);
    logger.info('[Header Component][MOUNT] Mounted successfully.', {
      theme,
      operation: 'Component_Mount',
    });
    logger.debug('[Header Component][THEME_STATE] Final theme state after mount:', {
      theme,
      operation: 'Theme_State_Check',
    });
  }, [theme]); // Depend on theme to log its final state after it's potentially hydrated by next-themes

  const isActive = (link: string): boolean => currentPage === link;

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    logger.info(`[Header Component][THEME_TOGGLE] Theme changed to ${newTheme}`, {
      oldTheme: theme,
      newTheme,
      operation: 'Theme_Toggle',
      userId: 'tomide_adeoye', // Placeholder, replace with actual user ID
    });
  };

  return (
    <header
      className={cn(
        'fixed w-full z-30 transition-all duration-300',
        'bg-background/90 backdrop-blur-sm shadow-md border-b border-border/80' // Exquisite header styling
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {' '}
        {/* Increased height for better spacing */}
        <div className="shrink-0 mr-4">
          <Link href="/" className="block" aria-label="Meris Labs">
            {/* Using shadcn/ui Avatar component - assuming it's part of @components/ui */}
            <Avatar
              src="/images/merislabswhite.png"
              alt="Meris Labs Logo"
              className="h-10 w-10 transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
        <nav className="hidden md:flex md:grow">
          <ul className="flex grow justify-end items-center space-x-2">
            {' '}
            {/* Added space-x-2 for spacing */}
            {displayedNavItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant="link" // Using link variant for navigation
                  asChild // Render as child to pass href to Link
                  className={cn(
                    'font-medium transition-colors duration-200',
                    isActive(item.href || '')
                      ? 'text-primary border-b-2 border-primary' // Active state with border
                      : 'text-foreground hover:text-primary-foreground' // Default and hover state
                  )}
                >
                  <Link href={item.href || '/'}>{item.title}</Link>
                </Button>
              </li>
            ))}
            <li className="ml-4 flex items-center">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle theme"
                  className={cn(
                    'relative w-14 h-8 p-0 flex items-center rounded-full transition-colors duration-300',
                    'bg-linear-to-br from-yellow-100/80 to-pink-100/80 dark:from-gray-800 dark:to-gray-900',
                    'border border-yellow-200 dark:border-gray-700 shadow-sm' // Refined shadow
                  )}
                  onClick={handleThemeToggle}
                >
                  <span
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 transition-all duration-300 rounded-full bg-background dark:bg-gray-700 shadow-md w-6 h-6 z-10',
                      theme === 'dark' ? 'right-1' : 'left-1'
                    )}
                  >
                    {/* Inner circle for toggle */}
                  </span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Sun
                      className={cn(
                        'h-5 w-5 transition-colors',
                        theme === 'dark' ? 'text-gray-400' : 'text-yellow-500'
                      )}
                    />
                  </span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Moon
                      className={cn('h-5 w-5 transition-colors', theme === 'dark' ? 'text-pink-400' : 'text-gray-500')}
                    />
                  </span>
                </Button>
              )}
            </li>
          </ul>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}

// TODO: Consolidate files
