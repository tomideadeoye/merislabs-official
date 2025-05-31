"use client";

import React, { useState } from 'react';
import { useSessionState } from '@/hooks/useSessionState';
import { SessionStateKeys } from '@/hooks/useSessionState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle2, Key } from 'lucide-react';

interface HabiticaCredentialsFormProps {
  onCredentialsSaved?: () => void;
}

export const HabiticaCredentialsForm: React.FC<HabiticaCredentialsFormProps> = ({ 
  onCredentialsSaved 
}) => {
  const [userId, setUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [apiToken, setApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !apiToken) {
      setFeedback({ type: 'error', message: "User ID and API Token are required." });
      return;
    }
    
    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/orion/habitica/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          apiToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setFeedback({ type: 'success', message: "Habitica credentials saved successfully!" });
        if (onCredentialsSaved) {
          onCredentialsSaved();
        }
      } else {
        throw new Error(data.error || 'Failed to save Habitica credentials.');
      }
    } catch (err: any) {
      console.error("Error saving Habitica credentials:", err);
      setFeedback({ type: 'error', message: err.message || "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Key className="mr-2 h-5 w-5 text-purple-400" />
          Habitica Credentials
        </CardTitle>
        <CardDescription className="text-gray-400">
          Enter your Habitica User ID and API Token to connect Orion with your Habitica account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userId" className="text-gray-300">User ID</Label>
            <Input
              id="userId"
              value={userId || ""}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Your Habitica User ID"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSaving}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Found in Settings &gt; API on Habitica website
            </p>
          </div>
          
          <div>
            <Label htmlFor="apiToken" className="text-gray-300">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              value={apiToken || ""}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="Your Habitica API Token"
              className="bg-gray-700 border-gray-600 text-gray-200"
              disabled={isSaving}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Found in Settings &gt; API on Habitica website
            </p>
          </div>
          
          {feedback && (
            <div className={`p-3 rounded-md flex items-center ${
              feedback.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' 
                                       : 'bg-red-900/30 border border-red-700 text-red-300'
            }`}>
              {feedback.type === 'success' ? 
                <CheckCircle2 className="h-5 w-5 mr-2" /> : 
                <AlertTriangle className="h-5 w-5 mr-2" />
              }
              {feedback.message}
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isSaving || !userId || !apiToken} 
            className="bg-purple-600 hover:bg-purple-700 w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Save Credentials
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};