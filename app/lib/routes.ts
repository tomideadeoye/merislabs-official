/**
 * @repo/shared/lib/routes.ts
 * Goal: Centralized route definitions and navigation items for the Orion application.
 * This file aims to provide a single source of truth for all application routes,
 * making navigation consistent and easy to manage across the monorepo.
 *
 * Relation to other files, functions and features:
 * - Imported by `apps/nextjs/app/layout.tsx` for main navigation.
 * - Ensures consistent routing for internal links and programmatic navigation.
 */

export interface NavItem {
  title: string;
  href: string;
  icon?: string; // Optional icon name or path
  disabled?: boolean;
}

export const ROUTES = {
  HOME: {
    href: '/',
    title: 'Home',
  },
  ADMIN_DASHBOARD: {
    href: '/admin',
    title: 'Admin Dashboard',
  },
  JOURNAL: {
    href: '/journal',
    title: 'Journal',
  },
  MEMORY_MANAGER: {
    href: '/admin/memory-manager',
    title: 'Memory Manager',
  },
  OPPORTUNITY_PIPELINE: {
    href: '/admin/opportunity-pipeline',
    title: 'Opportunity Pipeline',
  },
  NETWORKING_HUB: {
    href: '/admin/networking-hub',
    title: 'Networking Hub',
  },
  ASK_QUESTION: {
    href: '/admin/ask-question',
    title: 'Ask Orion',
  },
  BLOCKS: {
    href: '/admin/blocks',
    title: 'Blocks',
  },
  NARRATIVE_CLARITY_STUDIO: {
    href: '/admin/narrative-clarity-studio',
    title: 'Narrative Clarity Studio',
  },
  DRAFT_COMMUNICATION: {
    href: '/admin/draft-communication',
    title: 'Draft Communication',
  },
  HABITICA: {
    href: '/admin/habitica',
    title: 'Habitica',
  },
  AGENTIC_WORKFLOW: {
    href: '/admin/agentic-workflow',
    title: 'Agentic Workflow',
  },
  ROUTINES: {
    href: '/admin/routines',
    title: 'Routines',
  },
  WHATSAPP_ANALYSIS: {
    href: '/admin/whatsapp-analysis',
    title: 'WhatsApp Analysis',
  },
  EMOTIONAL: {
    href: '/admin/emotional',
    title: 'Emotional',
  },
  LOCAL_FILES: {
    href: '/admin/local-files',
    title: 'Local Files',
  },
  IDEA_INCUBATOR: {
    href: '/admin/idea-incubator',
    title: 'Idea Incubator',
  },
  SYSTEM_SETTINGS: {
    href: '/admin/system-settings',
    title: 'System Settings',
  },
  NARRATIVE: {
    href: '/admin/narrative',
    title: 'Narrative Studio',
  },
  // Add other routes as needed
  DECKS: {
    href: '/decks',
    title: 'Decks',
  },
};

// Example navigation items for a common layout or sidebar
export const navItems: NavItem[] = [
  {
    title: ROUTES.HOME.title,
    href: ROUTES.HOME.href,
  },
  {
    title: ROUTES.ADMIN_DASHBOARD.title,
    href: ROUTES.ADMIN_DASHBOARD.href,
  },
  {
    title: ROUTES.JOURNAL.title,
    href: ROUTES.JOURNAL.href,
  },
  {
    title: ROUTES.MEMORY_MANAGER.title,
    href: ROUTES.MEMORY_MANAGER.href,
  },
  {
    title: ROUTES.OPPORTUNITY_PIPELINE.title,
    href: ROUTES.OPPORTUNITY_PIPELINE.href,
  },
  {
    title: ROUTES.DRAFT_COMMUNICATION.title,
    href: ROUTES.DRAFT_COMMUNICATION.href,
  },
  {
    title: ROUTES.NARRATIVE_CLARITY_STUDIO.title,
    href: ROUTES.NARRATIVE_CLARITY_STUDIO.href,
  },
  {
    title: ROUTES.DECKS.title,
    href: ROUTES.DECKS.href,
  },
  {
    title: ROUTES.HABITICA.title,
    href: ROUTES.HABITICA.href,
  },
  {
    title: ROUTES.ROUTINES.title,
    href: ROUTES.ROUTINES.href,
  },
  {
    title: ROUTES.SYSTEM_SETTINGS.title,
    href: ROUTES.SYSTEM_SETTINGS.href,
  },
];

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
