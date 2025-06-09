"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageNames, SessionStateKeys, PageNameValue, initializeClientSession } from "@shared/app_state";
import { useSessionState } from "@shared/hooks/useSessionState";
import { cn } from "@/lib/utils";
import { apiClient } from "@shared/lib/apiClient";
import { Brain } from "lucide-react";
import { Loader } from "@/components/ui/Loader";

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
  Users,
  Cog,
  Lightbulb,
  FileText,
  BarChart2,
  HeartPulse,
  FolderOpen,
  Layers,
  Mail,
} from "lucide-react";

interface NavItem {
  href: string;
  label: PageNameValue;
  icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
  { href: "/admin", label: PageNames.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { href: "/admin/journal", label: PageNames.JOURNAL, icon: BookOpenText },
  { href: "/admin/memory-manager", label: PageNames.MEMORY_MANAGER, icon: Brain },
  { href: "/admin/opportunity-pipeline", label: PageNames.PIPELINE, icon: Briefcase },
  { href: "/admin/blocks", label: "Blocks" as PageNameValue, icon: Layers },
  { href: "/admin/narrative-clarity-studio", label: "Narrative Clarity Studio" as PageNameValue, icon: Brain },
  { href: "/admin/draft-communication", label: "Draft Communication" as PageNameValue, icon: Mail },
  { href: "/admin/networking", label: PageNames.NETWORKING, icon: Network },
  { href: "/admin/habitica", label: PageNames.HABITICA, icon: Rocket },
  { href: "/admin/ask-question", label: PageNames.ASK, icon: BrainCircuit },
  { href: "/admin/routines", label: PageNames.ROUTINES, icon: Repeat },
  { href: "/admin/insights", label: PageNames.INSIGHTS, icon: BarChart2 },
  { href: "/admin/emotional", label: PageNames.EMOTIONAL, icon: HeartPulse },
  { href: "/admin/local-files", label: PageNames.LOCAL_FILES, icon: FolderOpen },
  { href: "/admin/idea-incubator", label: PageNames.IDEA_INCUBATOR, icon: Lightbulb },
  { href: "/admin/system-settings", label: PageNames.SYSTEM, icon: Cog },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-800 p-4 transition-transform overflow-y-auto">
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
  const [memoryInitialized, setMemoryInitialized] = useSessionState(SessionStateKeys.MEMORY_INITIALIZED);

  useEffect(() => {
    initializeClientSession();
    console.info("[OrionAdminLayout] Client session initialization ensured.");
  }, []);

  useEffect(() => {
    const initMemory = async () => {
      if (memoryInitialized === false) {
        try {
          const response = await apiClient.post("/api/orion/memory/initialize");
          if (response.data.success) {
            setMemoryInitialized(true);
            console.info("[OrionAdminLayout] Orion Memory Backend Initialized/Verified via API.", {
              operation: "memory/initialize",
              result: "success"
            });
          } else {
            console.error("[OrionAdminLayout] Failed to initialize memory backend via API:", response.data.error, {
              operation: "memory/initialize",
              result: "fail"
            });
          }
        } catch (error) {
          console.error("[OrionAdminLayout] Error calling memory initialize API:", error, {
            operation: "memory/initialize",
            result: "error"
          });
        }
      } else {
        console.info("[OrionAdminLayout] Memory already initialized.", {
          operation: "memory/initialize",
          result: "already-initialized"
        });
      }
    };
    if (typeof window !== "undefined") {
      initMemory();
    }
  }, [memoryInitialized, setMemoryInitialized]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-8 md:p-8 lg:pt-8 ml-64">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl text-gray-400">
            Welcome back, <span className="font-semibold text-blue-400">Architect</span>!
          </h1>
        </div>
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader message="Loading amazing new things..." /></div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
