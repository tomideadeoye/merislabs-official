import React from 'react';

interface FileViewerProps {
  filePath: string | null;
  onIndexFile: (filePath: string) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ filePath, onIndexFile }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-md h-96">
      <h2 className="text-xl font-semibold mb-4">File Viewer</h2>
      {filePath ? (
        <div>
          <p className="text-muted-foreground">Viewing: {filePath}</p>
          {/* Further implementation for displaying file content will go here */}
          <button onClick={() => onIndexFile(filePath)} className="mt-4 px-4 py-2 bg-purple-600 rounded text-white">
            Index This File (Placeholder)
          </button>
        </div>
      ) : (
        <p className="text-muted-foreground">Select a file from the explorer to view its content.</p>
      )}
    </div>
  );
};
