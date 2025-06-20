import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

interface StatusDisplayProps {
  isLoading?: boolean;
  error?: string | null;
  loadingMessage?: string;
  errorMessage?: string;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  isLoading = false,
  error = null,
  loadingMessage = 'Loading...',
  errorMessage = 'An unknown error occurred.',
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-800 rounded-lg p-6 shadow-glow">
        <Loader2 className="animate-spin text-purple-400 h-16 w-16 mb-4" />
        <p className="text-purple-300 text-lg font-semibold">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg flex items-center shadow-lg">
        <AlertTriangle className="h-6 w-6 mr-3" />
        <div>
          <h3 className="font-bold mb-1">Error</h3>
          <div>{errorMessage}</div>
          <p className="text-sm text-red-400 mt-1">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
