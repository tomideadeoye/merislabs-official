'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@merislabs/ui';
import * as Icons from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  children?: NavItem[];
}

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/MERISLABS-LOGO.png" alt="MerisLabs" className="h-20 w-auto" />
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-muted/50 text-muted-foreground data-[active]:text-foreground data-[state=open]:text-foreground">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-xl">
                          {item.children.map((child) => {
                            const IconComponent = child.icon ? (Icons as any)[child.icon] : null;
                            return (
                              <li key={child.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-muted hover:text-accent-foreground group",
                                      pathname === child.href ? "bg-muted/50 border border-primary/10" : "border border-transparent"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      {IconComponent && (
                                        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                          <IconComponent className="w-4 h-4" />
                                        </div>
                                      )}
                                      <div className="text-sm font-medium leading-none">{child.name}</div>
                                    </div>
                                    {child.description && (
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-2 pl-11">
                                        {child.description}
                                      </p>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent hover:bg-muted/50 transition-colors",
                          pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
