"use client";

import Link from "next/link";
import { Avatar, Button } from "@repo/ui";
import MobileMenu from "./mobile-menu";
import { usePathname } from "next/navigation";
import type { NavItem } from "@shared/types/nav";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { logger } from "@shared/lib/logger";

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  logger.info("[Header] Component rendering.", { itemCount: navItems?.length || 0 });
  const currentPage = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isActive = (link: string): boolean => currentPage === link;

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    logger.info(`[Header] Theme changed to ${newTheme}`);
  };

  return (
    <header className="fixed w-full z-30 bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="shrink-0 mr-4">
            <Link href="/" className="block" aria-label="Meris Labs">
              <Avatar
                src="/images/merislabswhite.png"
                alt="Workflow"
                className="w-8 h-8"
              />
            </Link>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className={`inline-block cursor-pointer px-4 py-2 font-medium transition duration-300 ease-in-out ${isActive(item.link)
                      ? "border-b-2 border-yellow-500 text-yellow-700 dark:text-yellow-300"
                      : "text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-yellow-200"
                      }`}
                  >
                    {item.id}
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
                      <Sun className={`h-5 w-5 transition-colors ${theme === "dark" ? "text-gray-400" : "text-yellow-500"}`} />
                    </span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Moon className={`h-5 w-5 transition-colors ${theme === "dark" ? "text-pink-400" : "text-gray-500"}`} />
                    </span>
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 rounded-full bg-white dark:bg-gray-700 shadow-md w-6 h-6 z-10 ${theme === "dark" ? "right-1" : "left-1"
                        }`}
                      style={{ boxShadow: '0 2px 8px 0 rgba(255, 200, 100, 0.15)' }}
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
