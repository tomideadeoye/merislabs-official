import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Opportunity } from '@prisma/client';

// GOAL:
// This component provides a button that initiates the drafting of an application,
// likely for a job or program, based on a given REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA.

// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: Could be used within the opportunity details or actions.
// - `app/api/orion/draft-application/route.ts` (conceptual): Backend API to generate the application draft.
// - `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` (from `@/lib/types`): Defines the structure of the opportunity data.

// next steps if any:
// - Implement the click handler to call the backend API for application drafting.
// - Add a loading state to the button during the drafting process.
// - Provide success/error feedback to the user.
// - Consider integrating with a dialog or modal to display the drafted application or provide further options.

// components to merge with if any:
// - Could be a reusable button for various drafting-related actions within Orion.

interface DraftApplicationButtonProps {
  opportunity: Opportunity; // The opportunity for which to draft an application
}

export const DraftApplicationButton: React.FC<DraftApplicationButtonProps> = ({ opportunity }) => {
  const handleClick = () => {
    // Placeholder for API call to draft application. IMPLEMENT THIS ASAP
    console.log(`Drafting application for opportunity: ${opportunity.title}`);
  };

  return (
    <Button onClick={handleClick} variant="outline" className="flex items-center space-x-2">
      <FileText className="h-4 w-4" />
      <span>Draft Application</span>
    </Button>
  );
};

export default DraftApplicationButton;
