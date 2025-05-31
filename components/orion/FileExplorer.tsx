"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Folder, File, ChevronRight, ChevronDown, Database } from 'lucide-react';
import path from 'path';

interface FileExplorerProps {
  onFileSelect: (filePath: string) => void;
  className?: string;
}

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  onFileSelect,
  className
}) => {
  const [configuredDirs, setConfiguredDirs] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [contents, setContents] = useState<FileItem[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch configured directories on mount
  useEffect(() => {
    fetchConfiguredDirs();
  }, []);

  // Fetch contents when current path changes
  useEffect(() => {
    if (currentPath) {
      fetchDirectoryContents(currentPath);
    }
  }, [currentPath]);

  const fetchConfiguredDirs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/local-fs/list-configured-dirs');
      const data = await response.json();
      
      if (data.success) {
        setConfiguredDirs(data.directories || []);
        
        // Set first directory as current path if available
        if (data.directories && data.directories.length > 0) {
          setCurrentPath(data.directories[0]);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch configured directories');
      }
    } catch (err: any) {
      console.error('Error fetching configured directories:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDirectoryContents = async (dirPath: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/local-fs/list-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ directoryPath: dirPath })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContents(data.contents || []);
      } else {
        throw new Error(data.error || 'Failed to fetch directory contents');
      }
    } catch (err: any) {
      console.error(`Error fetching contents of ${dirPath}:`, err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectoryClick = (dirPath: string) => {
    if (expandedDirs.has(dirPath)) {
      // Collapse directory
      const newExpandedDirs = new Set(expandedDirs);
      newExpandedDirs.delete(dirPath);
      setExpandedDirs(newExpandedDirs);
    } else {
      // Expand directory
      setExpandedDirs(new Set(expandedDirs).add(dirPath));
      setCurrentPath(dirPath);
    }
  };

  const handleFileClick = (filePath: string) => {
    onFileSelect(filePath);
  };

  const renderFileTree = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-400">Loading files...</span>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      );
    }
    
    if (configuredDirs.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>No configured directories found. Please add directories in your environment configuration.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {configuredDirs.map((dir) => (
          <div key={dir} className="space-y-1">
            <div 
              className="flex items-center p-2 rounded-md hover:bg-gray-700 cursor-pointer"
              onClick={() => handleDirectoryClick(dir)}
            >
              {expandedDirs.has(dir) ? (
                <ChevronDown className="h-4 w-4 mr-1 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
              )}
              <Folder className="h-5 w-5 mr-2 text-blue-400" />
              <span className="text-gray-200">{path.basename(dir)}</span>
              <span className="text-xs text-gray-500 ml-2">{dir}</span>
            </div>
            
            {expandedDirs.has(dir) && (
              <div className="pl-6 space-y-1">
                {contents.map((item) => (
                  <div 
                    key={item.path}
                    className={`flex items-center p-2 rounded-md ${
                      item.type === 'directory' ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-700/50 cursor-pointer'
                    }`}
                    onClick={() => item.type === 'directory' ? handleDirectoryClick(item.path) : handleFileClick(item.path)}
                  >
                    {item.type === 'directory' ? (
                      <>
                        {expandedDirs.has(item.path) ? (
                          <ChevronDown className="h-4 w-4 mr-1 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                        )}
                        <Folder className="h-5 w-5 mr-2 text-blue-400" />
                      </>
                    ) : (
                      <File className="h-5 w-5 mr-2 text-gray-400" />
                    )}
                    <span className="text-gray-200">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Folder className="mr-2 h-5 w-5 text-blue-400" />
          File Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderFileTree()}
      </CardContent>
    </Card>
  );
};