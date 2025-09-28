/**
 * @fileoverview Admin Journal Page for Orion
 * @description Provides journaling, mood/emotion tracking, and analytics for the admin dashboard, using the admin layout with sidebar.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Unified journaling, mood/emotion logging, and analytics for Orion admin users.
 *   - Uses the admin layout/sidebar for navigation and context.
 *   - Supports CRUD for journal entries, mood/emotion tagging, and reflection.
 *   - Visualizes analytics and trends (future: charts, insights).
 *
 * FILEPATH: app/(orion_admin)/admin/journal/page.tsx
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Uses MemoryProvider for memory CRUD.
 *   - Uses admin layout (app/(orion_admin)/layout.tsx) for sidebar and context.
 *   - Shares logic with public journal page (app/journal/page.tsx).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes MemoryProvider is available in admin context.
 *   - Assumes admin layout wraps this page for sidebar.
 *
 * NOTES:
 *   - This file is a copy of the public journal page, adapted for admin context.
 *   - Future: consolidate shared logic into a component or hook.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Extract shared journaling logic to a reusable component/hook.
 *   - Add more analytics, charts, and AI insights.
 */

'use client';

import UnifiedJournalingPage from '@/components/orion/journal/UnifiedJournalingPage';

export default function AdminJournalPage() {
    return <UnifiedJournalingPage />;
}
