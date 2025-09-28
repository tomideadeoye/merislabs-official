/**
 * @repo/lib/lib/routes.ts
 * Goal: Centralized route definitions and navigation items for the Orion application.
 * This file aims to provide a single source of truth for all application routes,
 * making navigation consistent and easy to manage across the simple nextjs project.
 *
 * Relation to other files, functions and features:
 * - Imported by `apps/nextjs/app/layout.tsx` for main navigation.
 * - Ensures consistent routing for internal links and programmatic navigation.
 */

import { NavItem } from '@/lib/types';

// Defines canonical routes for the Next.js application.
// This ensures consistent navigation and URL management across the app.

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
    href: '/admin/journal',
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
  NARRATIVE_CLARITY_STUDIO: {
    href: '/admin/narrative-clarity-studio',
    title: 'Narrative Clarity Studio',
  },
  DRAFT_COMMUNICATION: {
    href: '/admin/draft-communication',
    title: 'Draft Communication',
  },
  AGENTIC_WORKFLOW: {
    href: '/admin/agentic-workflow',
    title: 'Agentic Workflow',
  },
  ROUTINES: {
    href: '/admin/routines',
    title: 'Routines',
  },
  // WHATSAPP_ANALYSIS: {
  //   href: '/admin/whatsapp-analysis',
  //   title: 'WhatsApp Analysis',
  // },
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
  BUSINESS_MANAGEMENT: {
    href: '/admin/business-management',
    title: 'Business Management',
  },
  EMAIL_DRAFTING_STUDIO: {
    href: '/admin/opportunity-pipeline/[id]/draft-email',
    title: 'Email Drafting Studio',
  },
  DECKS: {
    href: '/decks',
    title: 'Decks',
  },
  BRIDGING_ESG_FINANCE_GAP: {
    href: '/decks/bridging-the-esg-finance-gap',
    title: 'ESG Finance Gap',
  },
  // Add other routes as needed
};

// Example navigation items for a common layout or sidebar
export const navItems: NavItem[] = [
  {
    title: ROUTES.HOME.title,
    href: ROUTES.HOME.href,
  },
  {
    title: ROUTES.DECKS.title,
    href: ROUTES.DECKS.href,
  },
];

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
