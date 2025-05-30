"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { initializeSessionState, PageNames, SessionStateKeys, initializeSession } from "@/app_state";
import { useSessionState } from "@/hooks/useSessionState";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

import {
  LayoutDashboard,
  MessageSquareText,
  BookOpenText,
  Network,
  BriefcaseBusiness,
  Rocket,
  DatabaseZap,
  BrainCircuit,
  Repeat,
  Users,
  Cog,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  sessionKey?: SessionStateKeys;
}

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/draft-communication", label: PageNames["Draft Communication"], icon: MessageSquareText },
  { href: "/admin/journal", label: PageNames.Journal, icon: BookOpenText },
  { href: "/admin/networking", label: PageNames.Networking, icon: Network },
  { href: "/admin/opportunity-pipeline", label: PageNames["Opportunity Pipeline"], icon: BriefcaseBusiness },
  { href: "/admin/habitica", label: PageNames["Habitica Integration"], icon: Rocket },
  { href: "/admin/memory-manager", label: PageNames["Memory Manager"], icon: DatabaseZap },
  { href: "/admin/agentic-workflow", label: PageNames["Agentic Workflow"], icon: BrainCircuit },
  { href: "/admin/routines", label: PageNames.Routines, icon: Repeat },
  { href: "/admin/whatsapp-helper", label: PageNames["WhatsApp Helper"], icon: Users },
  { href: "/admin/system-settings", label: PageNames["System Settings"], icon: Cog },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-800 p-4 transition-transform">
      <div className="mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-white">
          <LayoutDashboard className="h-7 w-7 text-blue-400" />
          <span>Orion Dashboard</span>
        </Link>
      </div>
      <nav className="space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white",
              pathname === item.href && "bg-blue-600 text-white"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5",
                pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-gray-300"
              )}
            />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default function OrionAdminLayout({ children }: { children: React.ReactNode }) {
  const [userName] = useSessionState<string | undefined>(SessionStateKeys.USER_NAME, "Architect");
  const [memoryInitialized, setMemoryInitialized] = useSessionState<boolean>(
    SessionStateKeys.MEMORY_INITIALIZED,
    false
  );

  useEffect(() => {
    initializeSessionState();
    console.log("Orion Admin Layout Initialized Session State");
  }, []);

  useEffect(() => {
    initializeSession();

    const initMemory = async () => {
      if (!memoryInitialized) {
        try {
          const response = await apiClient.post("/orion/memory/initialize");
          if (response.data.success) {
            setMemoryInitialized(true);
            console.log("Orion Memory Backend Initialized/Verified via API.");
          } else {
            console.error("Failed to initialize memory backend via API:", response.data.error);
          }
        } catch (error) {
          console.error("Error calling memory initialize API:", error);
        }
      }
    };
    initMemory();
  }, [memoryInitialized, setMemoryInitialized]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-8 md:p-8 lg:pt-8 ml-64">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl text-gray-400">
            Welcome back, <span className="font-semibold text-blue-400">{userName}</span>!
          </h1>
        </div>
        {children}
      </main>
    </div>
  );
}
