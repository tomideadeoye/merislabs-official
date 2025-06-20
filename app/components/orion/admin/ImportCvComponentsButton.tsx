// app/components/orion/admin/ImportCvComponentsButton.tsx
/**
 * GOAL: Provide a UI button for administrators to trigger the bulk import of CV components
 * from the `cv-data.json` file into the database.
 *
 * RELATION TO OTHER FILES, FUNCTIONS, COMPONENTS, AND FEATURES:
 * - API Route: `/api/orion/cv-components/import` (POST request to trigger the import).
 * - `@/components/ui/button`: Shadcn UI component for the button.
 * - `lucide-react`: For icons.
 * - `react-hot-toast`: For displaying success/error notifications.
 * - `@/lib/apiClient`: Assumed utility for making API requests.
 * - Used within the admin dashboard page (`app/(orion_admin)/admin/page.tsx`).
 *
 * FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/admin/ImportCvComponentsButton.tsx
 * NOTES:
 * - Includes loading state and user feedback via toasts.
 * - Error handling for API request failures.
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Corrected path assuming standard shadcn structure
import { UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/apiClient'; // Assuming this client is set up

export function ImportCvComponentsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleImportCvDataJourney = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Importing CV components from JSON...');

    try {
      const response = await apiClient.post('/orion/cv-components/import'); // Ensure this path matches your API route
      if (response.data.success) {
        toast.success(
          response.data.message ||
            `Successfully imported ${response.data.successCount} components. Failures: ${response.data.failureCount}.`,
          { id: toastId }
        );
      } else {
        throw new Error(response.data.error || 'Import failed with no specific error message.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Import Failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
      // toast.dismiss(toastId); // toast.success or toast.error will replace the loading toast
    }
  };

  return (
    <Button
      onClick={handleImportCvDataJourney}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
      Import CV Components from JSON
    </Button>
  );
}
