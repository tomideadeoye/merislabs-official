import React from 'react';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a form for creating a new task (Todo or Daily) in Habitica. Currently a placeholder component.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/HabiticaTaskForm.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by a page component (likely related to task management - implied).
//   - Includes a placeholder `onTaskCreated` prop to signal completion.
interface HabiticaTaskFormProps {
  onTaskCreated: () => void;
}

export const HabiticaTaskForm: React.FC<HabiticaTaskFormProps> = ({ onTaskCreated }) => {
  // Placeholder component for Habitica Task Form
  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">Create New Habitica Task</h3>
      <p className="text-gray-400 mb-4">Form to add a new task (todo or daily) to Habitica.</p>
      <button onClick={onTaskCreated} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Simulate Task Creation
      </button>
    </div>
  );
};

export default HabiticaTaskForm;
