import React from 'react';

interface IdeaListProps {
  refreshKey: number;
}

export const IdeaList: React.FC<IdeaListProps> = ({ refreshKey }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Ideas ({refreshKey})</h2>
      <p>This is a placeholder for the Idea List. It will display ideas captured.</p>
      <p>Refresh Key: {refreshKey}</p>
    </div>
  );
};
