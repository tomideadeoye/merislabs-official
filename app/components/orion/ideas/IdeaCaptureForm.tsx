import React from 'react';

interface IdeaCaptureFormProps {
  onIdeaCaptured: () => void;
}

export const IdeaCaptureForm: React.FC<IdeaCaptureFormProps> = ({ onIdeaCaptured }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Capture Your Idea</h2>
      <p>This is a placeholder for the Idea Capture Form.</p>
      <button onClick={onIdeaCaptured} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Capture Idea (Placeholder)
      </button>
    </div>
  );
};
