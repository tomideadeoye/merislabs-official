"use client";

import React from 'react';
import { PageHeader, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { Cog, Mail, Database, Cloud, Key } from 'lucide-react';
import { EmailTestButton } from '@repo/ui';

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        icon={<Cog className="h-7 w-7" />}
        description="Configure and test Orion system settings and integrations."
      />

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Services</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Mail className="mr-2 h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                Email is configured using Gmail SMTP. Make sure you have set the following environment variables:
              </p>
              <ul className="list-disc list-inside text-gray-400 ml-4">
                <li>EMAIL_SENDER - Your Gmail address</li>
                <li>EMAIL_APP_PASSWORD - Your Gmail app password</li>
              </ul>

              <div className="pt-4">
                <EmailTestButton />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Database className="mr-2 h-5 w-5" />
                Database Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Database settings will be configured here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Key className="mr-2 h-5 w-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                API key management will be configured here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Cloud className="mr-2 h-5 w-5" />
                Cloud Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Cloud service settings will be configured here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
