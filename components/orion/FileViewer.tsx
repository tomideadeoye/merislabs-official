"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, File, Copy, Database, CheckCircle } from 'lucide-react';
import path from 'path';

interface FileViewerProps {
  filePath: string;
  onIndexFile?: (filePath: string) => void;
  className?: string;
}

interface FileMetadata {
  name: string;
  size: number;
  modified: string;
  created: string;
}

export const FileViewer: React.FC<FileViewerProps> = ({ 
  filePath,
  onIndexFile,
  className
}) => {
  const [content, setContent] = useState<string>('');
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (filePath) {
      fetchFileContent(filePath);
    } else {
      setContent('');
      setMetadata(null);
    }
  }, [filePath]);

  const fetchFileContent = async (path: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/orion/local-fs/read-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath: path })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContent(data.content || '');
        setMetadata(data.metadata || null);
      } else {
        throw new Error(data.error || 'Failed to fetch file content');
      }
    } catch (err: any) {
      console.error(`Error fetching content of ${path}:`, err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIndexFile = () => {
    if (onIndexFile) {
      onIndexFile(filePath);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getFileExtension = (filename: string): string => {
    return path.extname(filename).slice(1).toLowerCase();
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <File className="mr-2 h-5 w-5 text-blue-400" />
            {metadata?.name || path.basename(filePath) || 'File Viewer'}
          </div>
          <div className="flex space-x-2">
            {content && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyContent}
                className="bg-gray-700 hover:bg-gray-600"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
            {onIndexFile && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleIndexFile}
                className="bg-gray-700 hover:bg-gray-600"
              >
                <Database className="mr-1 h-4 w-4" />
                Index File
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Loading file content...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : !filePath ? (
          <div className="text-center py-8 text-gray-400">
            <p>Select a file to view its content.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {metadata && (
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-2">
                <div>Size: {formatBytes(metadata.size)}</div>
                <div>Type: {getFileExtension(metadata.name) || 'Unknown'}</div>
                <div>Modified: {formatDate(metadata.modified)}</div>
                <div>Created: {formatDate(metadata.created)}</div>
              </div>
            )}
            <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-gray-700/50 p-4 rounded-md border border-gray-600 max-h-[600px] overflow-y-auto">
              {content}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};