import React from 'react';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

// GOAL:
// This component provides a button that, when clicked, will initiate the creation of a Habitica task.
// It will serve as a quick action for users to convert an opportunity-related action into a Habitica task.

// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// - `app/(orion_admin)/admin/opportunity-pipeline/page.tsx`: This button might be used within the opportunity pipeline view.
// - `app/api/orion/habitica/tasks/create/route.ts`: This backend API route will be called to create the task.
// - `HabiticaTaskForm.tsx` (conceptual): Might be a dialog opened by this button, or the button directly calls the API.
// - `useHabiticaData` hook (conceptual): A custom hook to interact with Habitica API.

// next steps if any:
// - Implement the click handler to call the Habitica task creation API.
// - Add a loading state to the button during API calls.
// - Provide success/error feedback to the user.
// - Consider integrating with a dialog or form for detailed task input before creation.

// components to merge with if any:
// - Can be a reusable button component for various Habitica-related actions.

interface CreateHabiticaTaskButtonProps {
  opportunityId: string; // The ID of the opportunity related to this task
  taskTitle: string; // A suggested title for the Habitica task
  onTaskCreated?: () => void; // Callback after task is successfully created
}

export const CreateHabiticaTaskButton: React.FC<CreateHabiticaTaskButtonProps> = ({
  opportunityId,
  taskTitle,
  onTaskCreated,
}) => {
  const handleClick = () => {
    // Placeholder for API call to create Habitica task
    console.log(`Creating Habitica task for opportunity ${opportunityId} with title: ${taskTitle}`);
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <Button onClick={handleClick} variant="outline" className="flex items-center space-x-2">
      <Rocket className="h-4 w-4" />
      <span>Create Habitica Task</span>
    </Button>
  );
};

export default CreateHabiticaTaskButton;
