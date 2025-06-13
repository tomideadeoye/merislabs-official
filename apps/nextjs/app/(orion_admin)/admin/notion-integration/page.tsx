"use client";

import React, { useState } from 'react';
import { PageHeader } from "@repo/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@repo/ui';
import { NotionCVComponentsList } from "@/components/orion/notion/NotionCVComponentsList";
import { NotionOpportunityForm } from "@/components/orion/notion/NotionOpportunityForm";
import { Database, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { checkNotionApiHealth } from '@repo/shared';

export default function NotionIntegrationPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  React.useEffect(() => {
    const checkApiStatus = async () => {
      setApiStatus('checking');
      const isOnline = await checkNotionApiHealth();
      setApiStatus(isOnline ? 'online' : 'offline');
    };

    checkApiStatus();
  }, []);

  const handleCheckApiStatus = () => {
    setApiStatus('checking');
    checkNotionApiHealth().then(isOnline => {
      setApiStatus(isOnline ? 'online' : 'offline');
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notion Integration"
        icon={<Database className="h-7 w-7" />}
        description="Manage your CV components and opportunities in Notion"
        showMemoryStatus={true}
      />

      <div className="flex items-center space-x-2 mb-4">
        <div className="text-sm text-gray-400">Python Notion API Status:</div>
        {apiStatus === 'checking' ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-1" />
            <span className="text-blue-400">Checking...</span>
          </div>
        ) : apiStatus === 'online' ? (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">Online</span>
          </div>
        ) : (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-1" />
            <span className="text-red-400">Offline</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-gray-700 hover:bg-gray-600 text-xs"
              onClick={handleCheckApiStatus}
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      {apiStatus === 'offline' && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Python Notion API Server is Offline
          </h3>
          <p className="mt-2">
            The Python Notion API server is not running. Please start it by running the following command in your terminal:
          </p>
          <pre className="bg-gray-900 p-3 rounded mt-2 text-sm overflow-x-auto">
            cd /Users/mac/Documents/GitHub/merislabs-official/orion_python_backend<br />
            source notion_api_venv/bin/activate<br />
            python notion_api_server.py
          </pre>
        </div>
      )}

      <Tabs defaultValue="cv-components" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="cv-components" className="data-[state=active]:bg-gray-700">
            <FileText className="h-4 w-4 mr-2" />
            CV Components
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-gray-700">
            <Database className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cv-components" className="mt-4">
          <NotionCVComponentsList />
        </TabsContent>

        <TabsContent value="opportunities" className="mt-4">
          <NotionOpportunityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
