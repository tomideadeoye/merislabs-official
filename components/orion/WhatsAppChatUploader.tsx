"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, Upload, CheckCircle } from 'lucide-react';

interface WhatsAppChatUploaderProps {
  onAnalysisComplete: (analysisData: any) => void;
  className?: string;
}

export const WhatsAppChatUploader: React.FC<WhatsAppChatUploaderProps> = ({ 
  onAnalysisComplete,
  className
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [contactName, setContactName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a chat export file');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('chatFile', file);
      
      if (contactName) {
        formData.append('contactName', contactName);
      }
      
      const response = await fetch('/api/orion/whatsapp/analyze', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        onAnalysisComplete(data);
      } else {
        throw new Error(data.error || 'Failed to analyze chat');
      }
    } catch (err: any) {
      console.error('Error analyzing WhatsApp chat:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setContactName('');
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Upload className="mr-2 h-5 w-5 text-blue-400" />
          Upload WhatsApp Chat
        </CardTitle>
        <CardDescription className="text-gray-400">
          Export a WhatsApp chat and upload it for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contactName" className="text-gray-300">Contact or Group Name (Optional)</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g., John Doe, Family Group"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isUploading || success}
            />
          </div>
          
          <div>
            <Label htmlFor="chatFile" className="text-gray-300">WhatsApp Chat Export (.txt)</Label>
            <Input
              id="chatFile"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isUploading || success}
            />
            <p className="text-xs text-gray-400 mt-1">
              Export your chat from WhatsApp: Chat Options → More → Export Chat
            </p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 p-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Chat analyzed successfully!
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isUploading || !file || success} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Chat
                </>
              )}
            </Button>
            
            {success && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                className="border-blue-600 text-blue-400 hover:bg-blue-900/30"
              >
                Analyze Another Chat
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};