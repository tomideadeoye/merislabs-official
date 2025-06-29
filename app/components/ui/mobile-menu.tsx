'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './button';

export default function MobileMenu() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (!mobileNavOpen || mobileNav.current.contains(target as Node) || trigger.current.contains(target as Node))
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [mobileNavOpen]);

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent): void => {
      if (!mobileNavOpen || event.key !== 'Escape') return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [mobileNavOpen]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <Button
        ref={trigger}
        className={`hamburger ${mobileNavOpen ? 'active' : ''}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-300 hover:text-gray-200 transition duration-150 ease-in-out"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" />
          <rect y="11" width="24" height="2" rx="1" />
          <rect y="18" width="24" height="2" rx="1" />
        </svg>
      </Button>

      {/*Mobile navigation */}
      <nav
        id="mobile-nav"
        ref={mobileNav}
        className={`absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out
          ${mobileNavOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-80'}`}
      >
        <ul className="bg-gray-800 px-4 py-2">{/* Removed Sign in and Sign up links */}</ul>
      </nav>
    </div>
  );
}
