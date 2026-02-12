/**
 * ============================================================================
 * NAVIGATION BAR COMPONENT
 * ============================================================================
 *
 * PURPOSE:
 * Provides the main navigation header for the Ecobank Litigation Dashboard.
 * Displays firm logos, navigation links, and logout functionality.
 *
 * CRITICAL CHANGE (Dec 2025) - PRINT PAGE DOM REMOVAL:
 * ============================================================================
 *
 * PROBLEM STATEMENT:
 * When generating PDFs via browser print or Puppeteer, the NavigationBar was
 * causing a "blank first page" issue. Even with CSS `display: none` or
 * `print:hidden`, the element's presence in the DOM triggered layout
 * calculations that offset the CoverPage content.
 *
 * WHY CSS HIDING IS INSUFFICIENT:
 * 1. Fixed/absolute positioned elements can still affect document flow
 *    calculations in print engines (Chrome, Safari, Puppeteer).
 * 2. Even invisible elements consume "virtual space" during page layout,
 *    which can push content onto subsequent pages.
 * 3. Browser print engines sometimes pre-render hidden elements before
 *    applying print stylesheets, causing phantom spacing.
 *
 * SOLUTION - DOM REMOVAL VIA CONDITIONAL RETURN:
 * By returning `null` when the route starts with `/print-`, we completely
 * eliminate this component from the Virtual DOM and the real DOM. This
 * guarantees that:
 * - The CoverPage is the absolute first element in the document
 * - No layout offsets are introduced by navigation elements
 * - The print engine starts rendering from pixel (0,0) of the viewport
 *
 * CONSTRAINT:
 * This approach requires that any route intended for PDF output must start
 * with `/print-`. Examples: `/print-all-cases`, `/print-executive-summary`.
 *
 * MAINTENANCE NOTE:
 * If you add new print routes, ensure they follow the `/print-*` naming
 * convention, or update the conditional check below.
 *
 * ============================================================================
 */
'use client'

import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@merislabs/ui'
import { useRouter, usePathname } from 'next/navigation'

import { logout } from '@/app/login/actions'

const NAV_ITEMS = [
  { label: 'Litigation Audit Report', href: '/audit' },
  { label: 'External Counsel', href: '/external-counsel' },
]

export function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()

  /**
   * PRINT PAGE EXCLUSION LOGIC
   * ==========================
   *
   * REASONING:
   * On print-specific routes, we need the CoverPage to be the first DOM element.
   * Any preceding elements (even hidden ones) can trigger blank page offsets.
   *
   * RATIONALE:
   * Returning `null` ensures zero DOM footprint on print pages, eliminating
   * any possibility of layout interference.
   *
   * CONSTRAINT:
   * All PDF-generating routes MUST start with `/print-` for this to work.
   *
   * TESTED WITH:
   * - Chrome Print Preview (Cmd+P)
   * - Puppeteer headless PDF generation
   * - Safari Print (macOS)
   */
  if (pathname?.startsWith('/print-')) {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="relative border-b bg-white print:hidden print:!absolute print:!h-0 print:!w-0 print:!overflow-hidden print:!m-0 print:!p-0">
      <div className="container flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            {/* Jackson Etti & Edu logo - 40% smaller */}
            <img
              src="/law-firm-logo/jackson etti and edu logo.png"
              alt="Jackson Etti & Edu Logo"
              className="h-5 w-auto object-contain"
            />

            <span className="mx-2 text-gray-400">|</span>

            {/* Ecobank logo - 40% smaller */}
            <img
              src="/client-logo/Ecobank_Logo.svg.png"
              alt="Ecobank Logo"
              className="h-5 w-auto object-contain"
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-gray-900 ${pathname === item.href ? 'text-gray-900 font-bold' : 'text-gray-500'
                      }`}
                    onClick={() => console.log(`[NAVBAR] Navigating to: ${item.label} (${item.href})`)}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
