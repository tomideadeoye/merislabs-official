"use client";

import React, { useState, useEffect } from 'react';
import { useSessionState } from '@repo/sharedhooks/useSessionState';
import { SessionStateKeys } from '@repo/sharedhooks/useSessionState';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { Loader2, AlertTriangle, CheckCircle, Key, ShieldAlert } from 'lucide-react';

interface HabiticaCredentialsFormProps {
  onCredentialsSet?: () => void;
  className?: string;
}

export const HabiticaCredentialsForm: React.FC<HabiticaCredentialsFormProps> = ({
  onCredentialsSet,
  className
}) => {
  const [habiticaUserId, setHabiticaUserId] = useSessionState(SessionStateKeys.HABITICA_USER_ID, "");
  const [habiticaApiToken, setHabiticaApiToken] = useSessionState(SessionStateKeys.HABITICA_API_TOKEN, "");

  const [userId, setUserId] = useState<string>("");
  const [apiToken, setApiToken] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize form with stored values
  useEffect(() => {
    if (habiticaUserId) setUserId(habiticaUserId);
    if (habiticaApiToken) setApiToken(habiticaApiToken);
  }, [habiticaUserId, habiticaApiToken]);

  const handleSaveCredentials = async () => {
    if (!userId.trim() || !apiToken.trim()) {
      setError("Both User ID and API Token are required");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setSuccess(false);

    try {
      // Verify credentials by making a test API call
      const response = await fetch('/api/orion/habitica/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, apiToken })
      });

      const data = await response.json();

      if (data.success) {
        // Save credentials to session state
        setHabiticaUserId(userId);
        setHabiticaApiToken(apiToken);
        setSuccess(true);

        if (onCredentialsSet) {
          onCredentialsSet();
        }
      } else {
        throw new Error(data.error || 'Failed to verify Habitica credentials');
      }
    } catch (err: any) {
      console.error('Error verifying Habitica credentials:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearCredentials = () => {
    setHabiticaUserId("");
    setHabiticaApiToken("");
    setUserId("");
    setApiToken("");
    setSuccess(false);
    setError(null);
  };

  const credentialsAreSet = Boolean(habiticaUserId && habiticaApiToken);

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Key className="mr-2 h-5 w-5 text-amber-400" />
          Habitica Credentials
        </CardTitle>
        <CardDescription className="text-gray-400">
          Connect Orion to your Habitica account by providing your API credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId" className="text-gray-300">Habitica User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isVerifying}
              />
            </div>

            <div>
              <Label htmlFor="apiToken" className="text-gray-300">Habitica API Token</Label>
              <Input
                id="apiToken"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="bg-gray-700 border-gray-600 text-gray-200"
                disabled={isVerifying}
              />
            </div>
          </div>

          <div className="text-xs text-gray-400">
            <p>
              <ShieldAlert className="inline h-3 w-3 mr-1" />
              Find these in Habitica under Settings &gt; API
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSaveCredentials}
              disabled={isVerifying || !userId.trim() || !apiToken.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Save & Verify Credentials'
              )}
            </Button>

            {credentialsAreSet && (
              <Button
                variant="outline"
                onClick={handleClearCredentials}
                disabled={isVerifying}
                className="border-red-600 text-red-400 hover:bg-red-900/30"
              >
                Clear Credentials
              </Button>
            )}
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
              Habitica credentials verified and saved successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
