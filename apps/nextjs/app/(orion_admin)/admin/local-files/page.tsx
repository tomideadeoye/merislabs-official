"use client";

import React, { useState } from 'react';
import { useFileSelectionStore } from '@/components/orion/fileSelectionStore';
import { PageHeader } from "@repo/ui";
import { PageNames } from "@repo/sharedapp_state";
import { FileExplorer } from '@/components/orion/FileExplorer';
import { FileViewer } from '@/components/orion/FileViewer';
import { Button } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle, Database, FolderOpen } from 'lucide-react';

export default function LocalFilesPage() {
  const selectedFile = useFileSelectionStore((state) => state.selectedFile);
  const clearSelectedFile = useFileSelectionStore((state) => state.clearSelectedFile);
  const [indexingStatus, setIndexingStatus] = useState<{
    isLoading: boolean;
    error: string | null;
    success: string | null;
    details: any[] | null;
  }>({
    isLoading: false,
    error: null,
    success: null,
    details: null
  });

  // No longer needed: file selection is handled by Zustand store

  const handleIndexFile = async (filePath: string) => {
    setIndexingStatus({
      isLoading: true,
      error: null,
      success: null,
      details: null
    });

    try {
      const response = await fetch('/api/orion/local-fs/index-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pathToIndex: filePath })
      });

      const data = await response.json();

      if (data.success) {
        setIndexingStatus({
          isLoading: false,
          error: null,
          success: data.message,
          details: data.details
        });
      } else {
        throw new Error(data.error || 'Failed to index file');
      }
    } catch (err: any) {
      console.error('Error indexing file:', err);
      setIndexingStatus({
        isLoading: false,
        error: err.message || 'An unexpected error occurred',
        success: null,
        details: null
      });
    }
  };

  const handleIndexDirectory = async (dirPath: string) => {
    setIndexingStatus({
      isLoading: true,
      error: null,
      success: null,
      details: null
    });

    try {
      const response = await fetch('/api/orion/local-fs/index-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pathToIndex: dirPath })
      });

      const data = await response.json();

      if (data.success) {
        setIndexingStatus({
          isLoading: false,
          error: null,
          success: data.message,
          details: data.details
        });
      } else {
        throw new Error(data.error || 'Failed to index directory');
      }
    } catch (err: any) {
      console.error('Error indexing directory:', err);
      setIndexingStatus({
        isLoading: false,
        error: err.message || 'An unexpected error occurred',
        success: null,
        details: null
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Local Files"
        icon={<FolderOpen className="h-7 w-7" />}
        description="Browse, view, and index local files for Orion's memory."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FileExplorer />

          {selectedFile && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Database className="mr-2 h-5 w-5 text-blue-400" />
                  Index to Memory
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Add selected file or directory to Orion&apos;s memory for search and analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => selectedFile && handleIndexFile(selectedFile)}
                    disabled={indexingStatus.isLoading || !selectedFile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    Index Selected File
                  </Button>

                  <Button
                    onClick={() => selectedFile && handleIndexDirectory(selectedFile)}
                    disabled={indexingStatus.isLoading || !selectedFile}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Index Directory
                  </Button>
                </div>

                {indexingStatus.isLoading && (
                  <div className="flex items-center text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Indexing in progress...
                  </div>
                )}

                {indexingStatus.error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {indexingStatus.error}
                  </div>
                )}

                {indexingStatus.success && (
                  <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {indexingStatus.success}
                  </div>
                )}

                {indexingStatus.details && indexingStatus.details.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Indexing Details:</p>
                    <div className="max-h-[200px] overflow-y-auto bg-gray-700/50 p-2 rounded-md">
                      {indexingStatus.details.map((detail: any, index: number) => (
                        <div key={index} className="text-xs text-gray-300 mb-1">
                          <span className={detail.success ? 'text-green-400' : 'text-red-400'}>
                            {detail.success ? '✓' : '✗'}
                          </span>{' '}
                          {detail.file}: {detail.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <FileViewer
          filePath={selectedFile || ""}
          onIndexFile={handleIndexFile}
        />
      </div>
    </div>
  );
}
