"use client";

import Link from "next/link";

import MobileMenu from "./mobile-menu";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  link: string;
}

const navItems: NavItem[] = [
  { id: "Blog", link: "https://medium.com/@tomideadeoye" },
  { id: "Links", link: "https://linktr.ee/tomideadeoye" },
];

export default function Header() {
  const currentPage = usePathname();

  // Function to determine if the current link is active
  const isActive = (link: string): boolean => {
    return currentPage === link;
  };

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Cruip">
              <img
                className="h-12 w-auto"
                src="/images/merislabswhite.png"
                alt="Workflow"
              />
            </Link>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className={`inline-block cursor-pointer px-4 py-3 transition duration-300 ease-in-out ${
                      isActive(item.link)
                        ? "border-b-2 border-b-yellow-500 text-white"
                        : "hover:border-b-2 hover:text-white"
                    }`}
                  >
                    {item.id}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
