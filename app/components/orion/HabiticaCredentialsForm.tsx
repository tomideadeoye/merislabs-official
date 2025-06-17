import React from 'react';

// GOAL OF FILE|FEATURES|FUNCTIONS: Provides a form for users to input their Habitica API credentials (User ID and API Token). Currently a placeholder component.
// FILEPATH: /Users/mac/Documents/GitHub/merislabs-official/app/components/orion/HabiticaCredentialsForm.tsx
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Consumed by a page component (likely related to integrations or settings - implied).
//   - Includes a placeholder `onCredentialsSet` prop to signal completion.
interface HabiticaCredentialsFormProps {
  onCredentialsSet: () => void;
}

export const HabiticaCredentialsForm: React.FC<HabiticaCredentialsFormProps> = ({ onCredentialsSet }) => {
  // Placeholder component for Habitica Credentials Form
  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-white mb-4">Habitica Credentials</h3>
      <p className="text-gray-400 mb-4">Form to enter Habitica User ID and API Token.</p>
      <button
        onClick={onCredentialsSet}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Simulate Set Credentials
      </button>
    </div>
  );
};

export default HabiticaCredentialsForm;
