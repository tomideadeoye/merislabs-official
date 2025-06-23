/**
 * @fileoverview Server-side page component for the 'My Prompts' Management Hub.
 * @description This page serves as the entry point for the user's prompt management interface. It handles user authentication and fetches the initial list of prompts from the backend API, then passes this data to the client-side `MyPromptsStudio` component for interactive display and management.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To render the server-side context for the 'My Prompts' studio.
 *   - To fetch the list of user-defined prompts based on the authenticated user.
 *   - To ensure only authenticated users can access their prompt library.
 *   - To pass the fetched prompt data to the client-side `MyPromptsStudio` component.
 *
 * FILEPATH: `app/(orion_admin)/admin/my-prompts/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/navigation`: Used for `redirect` to enforce authentication.
 *   - `@/lib/prompt_db_service`: Although directly called by API, conceptual connection as it provides prompt data.
 *   - `@/lib/logger`: For comprehensive logging of server-side operations.
 *   - `app/api/orion/prompts/list/route.ts`: The API endpoint this page conceptually relies on for fetching prompt data (though direct service call might be used here for initial load).
 *   - `@/components/orion/MyPromptsStudio.tsx`: The client-side component that this page renders, passing it the fetched data.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `getServerSession` correctly identifies the authenticated user.
 *   - Assumes `getAllPromptsByUserId` (or equivalent API call) successfully retrieves prompt data.
 *   - Robust error handling is implemented for authentication and data fetching failures.
 *   - The `MyPromptsStudio` client component will handle all interactive aspects of prompt management.
 *
 * NOTES:
 *   - This page acts as a bridge between server-side data fetching and client-side interactivity for the prompt management process.
 *   - It's critical for security to ensure only authenticated users can access this page and its underlying data.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Server-Side Rendering Optimization**: For very large prompt lists, consider server-side rendering (SSR) or incremental static regeneration (ISR) with revalidation for optimal performance.
 *   - **Initial Loading State**: While data is fetched on the server, the client might still show a brief blank state. A loading skeleton could be useful in the `MyPromptsStudio`.
 *   - **Error Page/Fallback UI**: Provide a more user-friendly error page or fallback UI if data fetching fails due to unexpected reasons.
 */

import logger from '@/lib/logger';
// import { PageNames } from '@/lib/constants'; // Removed unused import
import { PageHeader } from '@/components/ui';
import { Sparkles } from 'lucide-react';
import { MyPromptsStudio } from '@/components/orion/MyPromptsStudio';
import { auth } from '@/auth';
import { getAllPromptsByUserId } from '@/lib/prompt_db_service';
import { Prompt } from '@/lib/types';

export default async function MyPromptsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    logger.warn('[MyPromptsPage] User not authenticated, cannot fetch prompts.');
    // Depending on desired behavior, could redirect or show an empty state
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Prompts Studio"
          icon={<Sparkles className="h-7 w-7" />}
          description="Manage and refine your personalized AI prompts."
        />
        <p className="text-red-400">Please log in to manage your prompts.</p>
      </div>
    );
  }

  let initialPrompts: Prompt[] = [];
  try {
    initialPrompts = await getAllPromptsByUserId(userId);
    logger.success('[MyPromptsPage] Successfully fetched initial prompts.', { count: initialPrompts.length });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching prompts.';
    logger.error('[MyPromptsPage] Error fetching initial prompts.', { error: errorMessage });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Prompts Studio"
        icon={<Sparkles className="h-7 w-7" />}
        description="Manage and refine your personalized AI prompts."
      />
      <MyPromptsStudio initialPrompts={initialPrompts} />
    </div>
  );
}
