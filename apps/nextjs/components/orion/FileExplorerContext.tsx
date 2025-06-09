"use client";
/**
 * FileExplorerContext
 * GOAL: Provide context-based handler for file selection in the file explorer.
 * Enables robust, serializable state management and event handling for all file explorer UI flows.
 * Connects to: FileExplorer, file viewers, admin dashboards, and future engagement features.
 * All actions are logged with full context for traceability, debugging, and future gamification.
 */

import React, { createContext, useContext, useCallback, useState } from "react";

interface FileExplorerContextType {
  selectedFile: string | null;
  setSelectedFile: (filePath: string) => void;
}

const FileExplorerContext = createContext<FileExplorerContextType | undefined>(undefined);

export const useFileExplorer = () => {
  const ctx = useContext(FileExplorerContext);
  if (!ctx) throw new Error("useFileExplorer must be used within FileExplorerProvider");
  return ctx;
};

export const FileExplorerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFileState] = useState<string | null>(null);

  const setSelectedFile = useCallback((filePath: string) => {
    setSelectedFileState(filePath);
    console.info("[FILE_EXPLORER][SELECT][CONTEXT]", { filePath, user: "Tomide" });
  }, []);

  return (
    <FileExplorerContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
};
