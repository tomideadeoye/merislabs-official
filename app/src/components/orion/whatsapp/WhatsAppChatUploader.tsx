'use client';

import React, { useState } from 'react';
import { useWhatsAppChatUploaderStore } from './whatsAppChatUploaderStore';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WhatsAppChatUploaderProps {
  className?: string;
  onTranscriptUploaded?: (analysisData: any) => void;
}

export const WhatsAppChatUploader: React.FC<WhatsAppChatUploaderProps> = ({ className, onTranscriptUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [contactName, setContactName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAnalysisData } = useWhatsAppChatUploaderStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !contactName) {
      toast.error('Please select a file and enter the contact name.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contact_name', contactName);

    try {
      const response = await fetch('/api/orion/whatsapp/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze chat.');
      }

      setAnalysisData(data.analysis, true);
      toast.success('Chat analysis complete!');
      if (onTranscriptUploaded) {
        onTranscriptUploaded(data.analysis);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle>Upload WhatsApp Chat</CardTitle>
        <CardDescription>Upload a .txt file exported from WhatsApp to start the analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contactName" className="text-gray-300">
              Contact Name
            </Label>
            <Input
              id="contactName"
              type="text"
              value={contactName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactName(e.target.value)}
              placeholder="Enter the name of the person you chatted with"
              className="bg-gray-700 border-gray-600 text-gray-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="file" className="text-gray-300">
              Chat File (.txt)
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".txt"
              className="bg-gray-700 border-gray-600"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
            {isLoading ? 'Analyzing...' : 'Analyze Chat'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
