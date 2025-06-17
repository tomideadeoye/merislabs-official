import React from 'react';

interface IdeaDetailViewProps {
  ideaId: string;
}

const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ ideaId }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Idea Details for ID: {ideaId}</h2>
      <p className="text-gray-600 mt-2">
        This is a placeholder for the Idea Detail View. More content will be added here.
      </p>
    </div>
  );
};

export default IdeaDetailView;
