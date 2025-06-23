'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { FileText, Loader2, UploadCloud, Wand2, XCircle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import logger from '@/lib/logger';

interface ChatAnalysisResult {
  summary: string;
  sentimentTrend: string;
  communicationPatterns: string[];
  keyThemes: string[];
}

export function WhatsAppChatUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ChatAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    logger.info('[WhatsAppChatUploader] File dropped.', { fileName: acceptedFiles[0]?.name });
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setError(null);
        setAnalysisResult(null); // Clear previous analysis when a new file is dropped
        toast.success(`File selected: ${selectedFile.name}`);
      } else {
        setError('Only .txt files are supported for chat analysis.');
        setFile(null);
        setAnalysisResult(null);
        toast.error('Only .txt files are supported.');
        logger.warn('[WhatsAppChatUploader] Invalid file type dropped.', { fileType: selectedFile.type });
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAnalyzeChat = async () => {
    if (!file) {
      setError('Please upload a .txt chat file first.');
      toast.error('No file selected for analysis.');
      logger.warn('[WhatsAppChatUploader] Analysis attempted without file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    toast.loading('Analyzing chat transcript...');
    logger.info('[WhatsAppChatUploader] Initiating chat analysis.', { fileName: file.name });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const chatTranscript = e.target?.result as string;
        logger.debug('[WhatsAppChatUploader] Chat transcript read from file.', { fileSize: chatTranscript.length });

        const response = await apiClient.post<{ success: boolean; analysis: ChatAnalysisResult; error?: string }>(
          '/api/orion/whatsapp/analyze',
          { chatTranscript }
        );

        if (response.data.success) {
          setAnalysisResult(response.data.analysis as ChatAnalysisResult);
          toast.success('Chat analysis complete!');
          logger.success('[WhatsAppChatUploader] Chat analysis successful.', {
            analysis: response.data.analysis as ChatAnalysisResult,
          });
        } else {
          setError(response.data.error || 'Failed to analyze chat.');
          toast.error(response.data.error || 'Failed to analyze chat.');
          logger.error('[WhatsAppChatUploader] Chat analysis failed.', { error: response.data.error });
        }
      };
      reader.onerror = (e) => {
        setError('Failed to read file.');
        toast.error('Failed to read file.');
        logger.error('[WhatsAppChatUploader] File read error.', { error: e });
        setIsLoading(false);
        toast.dismiss();
      };
      reader.readAsText(file);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during analysis.';
      setError(errorMessage);
      toast.error(errorMessage);
      logger.error('[WhatsAppChatUploader] Unexpected error during analysis.', { error: err });
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'}
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`} />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {isDragActive
            ? 'Drop the .txt chat file here...'
            : 'Drag & drop WhatsApp .txt chat export here, or click to select file'}
        </p>
        <em className="text-xs text-gray-500">(Only .txt files are supported)</em>
      </div>

      {file && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5" /> Selected File: {file.name}
            </CardTitle>
            <CardDescription>{(file.size / 1024).toFixed(2)} KB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button onClick={handleAnalyzeChat} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}{' '}
                Analyze Chat
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setAnalysisResult(null);
                  setError(null);
                  toast('File cleared.', { icon: '💡', duration: 2000 });
                  logger.info('[WhatsAppChatUploader] File cleared by user.');
                }}
                className="ml-2"
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {analysisResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Chat Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-primary">Summary:</h3>
              <p className="text-gray-700 dark:text-gray-300">{(analysisResult as ChatAnalysisResult).summary}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-primary">Sentiment Trend:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {(analysisResult as ChatAnalysisResult).sentimentTrend}
              </p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-primary">Communication Patterns:</h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {(analysisResult as ChatAnalysisResult).communicationPatterns.map((pattern: string, index: number) => (
                  <li key={index}>{pattern}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-primary">Key Themes:</h3>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                {(analysisResult as ChatAnalysisResult).keyThemes.map((theme: string, index: number) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
