'use client';

import React, { useState, useCallback } from 'react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, Label } from '@repo/ui';
import { Loader2, SaveAll, ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';

export interface SaveResult {
  success: boolean;
  serviceName: string;
  message?: string;
  error?: string;
  data?: any;
}

interface SaveOptionsButtonProps {
  data: any; // The data to be saved/processed (e.g., { title: string, content: string, mood?: string, tags?: string[] })

  // Callbacks for each save action
  onSaveToNotion?: (data: any) => Promise<Omit<SaveResult, 'serviceName'>>;
  onSaveToQdrant?: (data: any) => Promise<Omit<SaveResult, 'serviceName'>>; // For vector memory
  onSaveToSQLite?: (data: any) => Promise<Omit<SaveResult, 'serviceName'>>; // For structured journal/log
  onCopyToClipboard?: (data: any) => Promise<Omit<SaveResult, 'serviceName'>>;

  onProcessingStart?: () => void; // Optional: To disable parent form elements
  /**
   * Callback for when all processing is complete.
   * NOTE: This prop must only be passed from a client component, not from a server component or page.
   * If you see a serialization error, ensure the parent is a 'use client' component.
   */
  onProcessingComplete?: (results: SaveResult[]) => void; // Aggregated results, optional for Next.js compatibility

  buttonText?: string;
  disabled?: boolean; // External disabled state
  availableOptions?: { // To dynamically show/hide options
    notion?: boolean;
    qdrant?: boolean;
    sqlite?: boolean;
    clipboard?: boolean;
  };
}

export const SaveOptionsButton: React.FC<SaveOptionsButtonProps> = ({
  data,
  onSaveToNotion,
  onSaveToQdrant,
  onSaveToSQLite,
  onCopyToClipboard,
  onProcessingStart,
  onProcessingComplete,
  buttonText = "Save / Process",
  disabled = false,
  availableOptions = { notion: true, qdrant: true, sqlite: true, clipboard: true }
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saveToNotion, setSaveToNotion] = useState(!!availableOptions.notion);
  const [saveToQdrant, setSaveToQdrant] = useState(!!availableOptions.qdrant);
  const [saveToSQLite, setSaveToSQLite] = useState(!!availableOptions.sqlite);
  const [copyToClipboard, setCopyToClipboard] = useState(false); // Default to false for clipboard

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getSelectedOptionsCount = useCallback(() => {
    let count = 0;
    if (saveToNotion && availableOptions.notion) count++;
    if (saveToQdrant && availableOptions.qdrant) count++;
    if (saveToSQLite && availableOptions.sqlite) count++;
    if (copyToClipboard && availableOptions.clipboard) count++;
    return count;
  }, [saveToNotion, saveToQdrant, saveToSQLite, copyToClipboard, availableOptions]);

  const handleProcessSelections = useCallback(async () => {
    if (getSelectedOptionsCount() === 0) {
      setError("Please select at least one save/action option.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);
    if (onProcessingStart) onProcessingStart();

    const results: SaveResult[] = [];

    if (saveToNotion && availableOptions.notion && onSaveToNotion) {
      try {
        const result = await onSaveToNotion(data);
        results.push({ ...result, serviceName: 'Notion' });
      } catch (err: any) {
         results.push({ success: false, serviceName: 'Notion', error: err.message || 'Unknown error' });
      }
    }
    if (saveToQdrant && availableOptions.qdrant && onSaveToQdrant) {
      try {
        const result = await onSaveToQdrant(data);
        results.push({ ...result, serviceName: 'Qdrant (Memory)' });
      } catch (err: any) {
         results.push({ success: false, serviceName: 'Qdrant (Memory)', error: err.message || 'Unknown error' });
      }
    }
    if (saveToSQLite && availableOptions.sqlite && onSaveToSQLite) {
      try {
        const result = await onSaveToSQLite(data);
        results.push({ ...result, serviceName: 'SQLite (Log)' });
      } catch (err: any) {
         results.push({ success: false, serviceName: 'SQLite (Log)', error: err.message || 'Unknown error' });
      }
    }
    if (copyToClipboard && availableOptions.clipboard && onCopyToClipboard) {
       try {
        const result = await onCopyToClipboard(data);
        results.push({ ...result, serviceName: 'Clipboard' });
       } catch (err: any) {
         results.push({ success: false, serviceName: 'Clipboard', error: err.message || 'Unknown error' });
       }
    }

    setIsProcessing(false);
    if (typeof onProcessingComplete === 'function') {
      onProcessingComplete(results);
    } else {
      // Optionally, handle results internally or log a warning
      if (typeof window !== 'undefined') {
        // Only warn in browser/client
        console.warn(
          "[SaveOptionsButton] onProcessingComplete callback not provided. " +
          "To handle results, pass a function from a client component. " +
          "See documentation in SaveOptionsButtonProps."
        );
      }
    }

    const allSucceeded = results.every(r => r.success);
    const anySucceeded = results.some(r => r.success);

    if (results.length > 0) {
        if (allSucceeded) {
            setSuccessMessage("All selected actions completed successfully!");
        } else if (anySucceeded) {
            const failedServices = results.filter(r => !r.success).map(r => r.serviceName).join(', ');
            setSuccessMessage(`Some actions completed. Failed: ${failedServices}. Check console for details.`);
        } else {
            setError("All selected actions failed. Check details in console or parent component.");
        }
    }

    setIsDropdownOpen(false);

  }, [
    data, saveToNotion, saveToQdrant, saveToSQLite, copyToClipboard,
    onSaveToNotion, onSaveToQdrant, onSaveToSQLite, onCopyToClipboard,
    onProcessingStart, onProcessingComplete, availableOptions, getSelectedOptionsCount
  ]);

  const selectedCount = getSelectedOptionsCount();

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-2 w-full">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-none text-gray-300 border-gray-600 hover:bg-gray-700">
              Options {selectedCount > 0 ? `(${selectedCount})` : ''} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
            <DropdownMenuLabel className="text-gray-400">Save / Export To:</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700"/>
            {availableOptions.notion && onSaveToNotion && (
              <DropdownMenuCheckboxItem
                checked={saveToNotion}
                onCheckedChange={setSaveToNotion}
                className="focus:bg-sky-700/50"
                disabled={isProcessing}
              >
                Notion
              </DropdownMenuCheckboxItem>
            )}
            {availableOptions.qdrant && onSaveToQdrant && (
              <DropdownMenuCheckboxItem
                checked={saveToQdrant}
                onCheckedChange={setSaveToQdrant}
                className="focus:bg-sky-700/50"
                disabled={isProcessing}
              >
                Qdrant (Vector Memory)
              </DropdownMenuCheckboxItem>
            )}
            {availableOptions.sqlite && onSaveToSQLite && (
              <DropdownMenuCheckboxItem
                checked={saveToSQLite}
                onCheckedChange={setSaveToSQLite}
                className="focus:bg-sky-700/50"
                disabled={isProcessing}
              >
                SQLite (Structured Log)
              </DropdownMenuCheckboxItem>
            )}
             <DropdownMenuSeparator className="bg-gray-700"/>
            {availableOptions.clipboard && onCopyToClipboard && (
              <DropdownMenuCheckboxItem
                checked={copyToClipboard}
                onCheckedChange={setCopyToClipboard}
                className="focus:bg-sky-700/50"
                disabled={isProcessing}
              >
                Copy to Clipboard
              </DropdownMenuCheckboxItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
            onClick={handleProcessSelections}
            disabled={disabled || isProcessing || selectedCount === 0}
            className="flex-grow bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SaveAll className="mr-2 h-4 w-4" />
          )}
          {isProcessing ? "Processing..." : `${buttonText}`}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/>{error}</p>
      )}
      {successMessage && (
        <p className="text-xs text-green-400 flex items-center"><CheckCircle className="h-3 w-3 mr-1"/>{successMessage}</p>
      )}
    </div>
  );
}
