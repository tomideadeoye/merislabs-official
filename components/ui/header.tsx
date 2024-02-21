import Link from "next/link";

import MobileMenu from "./mobile-menu";

interface NavItem {
  id: string;
  link: string;
  subnav: any[]; // You can replace `any[]` with a more specific type if needed
}

const navItems: NavItem[] = [
  { id: "Blog", link: "https://medium.com/@tomideadeoye", subnav: [] },
  { id: "Links", link: "https://linktr.ee/tomideadeoye", subnav: [] },
];

export default function Header() {
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

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className="font-medium text-purple-600 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    {item.id}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* <MobileMenu /> */}
        </div>
      </div>
    </header>
  );
}
