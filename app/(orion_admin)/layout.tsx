'use client';

import React, { useEffect, Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionStateKeys } from '@/lib/constants';
import { useSessionState } from '@/hooks/useSessionState';
import { cn } from '@/components/ui';
import { apiClient } from '@/lib/apiClient';
import { Loader } from '@/components/ui'; // Correct import from the UI package
import { ROUTES } from '@/lib/routes'; // Import ROUTES
import { NavItem } from '@/types/nav'; // Import NavItem
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider

import {
  LayoutDashboard,
  MessageSquare,
  BookOpenText,
  Network,
  Briefcase,
  Rocket,
  DatabaseZap,
  BrainCircuit,
  Repeat,
  Cog,
  Lightbulb,
  HeartPulse,
  FolderOpen,
  Layers,
  Mail,
  Brain, // Added Brain icon
  HelpCircle, // Added BrainCircle icon
} from 'lucide-react';

const adminNavItems: NavItem[] = [
  { href: ROUTES.ADMIN_DASHBOARD.href, title: ROUTES.ADMIN_DASHBOARD.title, icon: <LayoutDashboard /> },
  { href: ROUTES.JOURNAL.href, title: ROUTES.JOURNAL.title, icon: <BookOpenText /> },
  { href: ROUTES.MEMORY_MANAGER.href, title: ROUTES.MEMORY_MANAGER.title, icon: <DatabaseZap /> },
  { href: ROUTES.OPPORTUNITY_PIPELINE.href, title: ROUTES.OPPORTUNITY_PIPELINE.title, icon: <Briefcase /> },
  { href: ROUTES.NETWORKING_HUB.href, title: ROUTES.NETWORKING_HUB.title, icon: <Network /> },
  { href: '/admin/ask-question', title: 'Ask Orion', icon: <HelpCircle /> },
  { href: '/admin/blocks', title: 'Blocks', icon: <Layers /> },
  { href: '/admin/narrative-clarity-studio', title: 'Narrative Clarity Studio', icon: <Brain /> },
  { href: '/admin/draft-communication', title: 'Draft Communication', icon: <Mail /> },
  { href: '/admin/habitica', title: 'Habitica', icon: <Rocket /> },
  { href: '/admin/agentic-workflow', title: 'Agentic Workflow', icon: <BrainCircuit /> },
  { href: '/admin/routines', title: 'Routines', icon: <Repeat /> },
  { href: '/admin/emotional', title: 'Emotional', icon: <HeartPulse /> },
  { href: '/admin/local-files', title: 'Local Files', icon: <FolderOpen /> },
  { href: '/admin/idea-incubator', title: 'Idea Incubator', icon: <Lightbulb /> },
  { href: '/admin/system-settings', title: 'System Settings', icon: <Cog /> },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-800 p-4 transition-transform overflow-y-auto">
      <div className="mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-white">
          <BrainCircuit className="h-7 w-7 text-blue-400" />
          <span>Orion Dashboard</span>
        </Link>
      </div>
      <nav className="space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white',
              pathname === item.href && 'bg-blue-600 text-white'
            )}
          >
            {item.icon
              ? React.cloneElement(item.icon as React.ReactElement, {
                  className: cn(
                    'mr-3 h-5 w-5 flex items-center justify-center',
                    pathname === item.href ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  ),
                })
              : null}
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const queryClient = new QueryClient(); // Create a client

export default function OrionAdminLayout({ children }: { children: React.ReactNode }) {
  const sessionStore = useSessionState();
  const memoryInitialized = sessionStore.selectSessionValue<boolean>(SessionStateKeys.MEMORY_INITIALIZED);
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initMemory = async () => {
      // Only attempt if memory is false AND we haven't attempted in this component lifecycle yet
      if (memoryInitialized === false && !initializationAttempted) {
        setInitializationAttempted(true); // Mark that an attempt is being made
        try {
          const response = await apiClient.post('/api/orion/memory/initialize');
          if (!isMounted) return;
          if (response.data.success) {
            sessionStore.setSessionValue(SessionStateKeys.MEMORY_INITIALIZED, true);
            console.info('[OrionAdminLayout] Orion Memory Backend Initialized/Verified via API.', {
              operation: 'memory/initialize',
              result: 'success',
            });
          } else {
            sessionStore.setSessionValue(SessionStateKeys.MEMORY_INITIALIZED, false);
            console.error('[OrionAdminLayout] Failed to initialize memory backend via API:', response.data.error, {
              operation: 'memory/initialize',
              result: 'fail',
            });
          }
        } catch (error) {
          if (!isMounted) return;
          sessionStore.setSessionValue(SessionStateKeys.MEMORY_INITIALIZED, false);
          console.error('[OrionAdminLayout] Error calling memory initialize API:', error, {
            operation: 'memory/initialize',
            result: 'error',
          });
        }
      } else {
        console.info(`[OrionAdminLayout] Memory status: ${memoryInitialized}. Initialization attempt flag: ${initializationAttempted}.`, {
          operation: 'memory/initialize',
          result: memoryInitialized ? 'already-initialized-true' : 'already-initialized-false-or-attempted',
        });
      }
    };

    if (typeof window !== 'undefined') {
      initMemory();
    }

    return () => {
      isMounted = false;
    };
    // Add initializationAttempted to dependencies.
    // If memoryInitialized becomes true, we might want to reset initializationAttempted if needed for future scenarios.
  }, [memoryInitialized, sessionStore, initializationAttempted]);

  return (
    <QueryClientProvider client={queryClient}>
      {' '}
      {/* Wrap with QueryClientProvider */}
      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 pt-8 md:p-8 lg:pt-8 ml-64">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl text-gray-400">
              Welcome back, <span className="font-semibold text-blue-400">Architect</span>!
            </h1>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-full">
                <Loader size="lg" />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </QueryClientProvider>
  );
}
