'use client';

/**
 * @fileoverview A UI component for configuring LLM model preferences within the Orion system.
 * @description This component allows the user to set a global default LLM model and override
 *   specific models for different request types (e.g., 'Opportunity Evaluation', 'Journal Reflection').
 *   Preferences are persisted using local storage.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Provide a user-friendly interface for LLM model selection.
 *   - Allow setting a global default model for all requests.
 *   - Enable specific model overrides for individual LLM request types.
 *   - Persist user preferences in local storage for consistency across sessions.
 *   - Display available models and their capabilities for informed selection.
 *
 * FILEPATH: `app/(orion_admin)/admin/system-settings/components/LlmModelSettings.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/orion_config.ts`: Imports `AVAILABLE_LLM_MODELS` and various `REQUEST_TYPE` constants.
 *   - `@/lib/types/index.ts`: Imports `LLMModelConfig` for type safety.
 *   - `@/hooks/useLocalStorage.ts`: Utilized for persisting and retrieving user preferences.
 *   - `@/components/ui/*`: Leverages Shadcn UI components like `Card`, `Label`, `Select`, `Button` for a consistent UI.
 *   - `app/lib/orion_llm.ts`: The preferences saved by this component will be read and applied by the LLM calling logic in `orion_llm.ts`.
 *   - `app/(orion_admin)/admin/system-settings/page.tsx`: This component will be rendered within the system settings page.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `useLocalStorage` hook is correctly implemented and available.
 *   - Assumes `AVAILABLE_LLM_MODELS` in `orion_config.ts` is comprehensive and up-to-date.
 *   - User preferences for models are stored as a JSON string in local storage.
 *   - `REQUEST_TYPE` constants from `orion_config.ts` are used to categorize model preferences.
 *
 * NOTES:
 *   - This component directly affects the behavior of LLM calls across the application by influencing model selection.
 *   - Error handling for local storage operations is managed by `useLocalStorage`.
 *   - The UI includes tooltips or descriptions to explain the purpose of each setting.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Backend Persistence**: Transition from local storage to a database (e.g., Neon via Prisma) for storing user preferences, enabling cross-device consistency and centralized management.
 *   - **Dynamic Model Fetching**: Instead of hardcoding `AVAILABLE_LLM_MODELS`, implement an API endpoint to dynamically fetch available models from a backend service (e.g., LiteLLM proxy), including real-time health/cost data.
 *   - **User-Specific Defaults**: Allow different users to have different default LLM settings if multi-user support is implemented.
 *   - **Validation**: Add client-side validation to ensure selections are valid models.
 *   - **Loading States**: Implement subtle loading states or toasts when preferences are being saved.
 *   - **Model Details Display**: Expand on displaying more details about each model (e.g., context window size, pricing tier) in the UI for more informed choices.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This component is a new, consolidated UI for LLM settings. It pulls data from `orion_config.ts` and saves to local storage, centralizing a critical configuration aspect.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  AVAILABLE_LLM_MODELS,
  ASK_QUESTION_REQUEST_TYPE,
  JOURNAL_REFLECTION_REQUEST_TYPE,
  OPPORTUNITY_EVALUATION_REQUEST_TYPE,
  OUTREACH_GENERATION_REQUEST_TYPE,
  CV_SUMMARY_TAILORING_REQUEST_TYPE,
  JD_ANALYSIS_REQUEST_TYPE,
  NARRATIVE_GENERATION_REQUEST_TYPE,
  CV_COMPONENT_SELECTION_REQUEST_TYPE,
  CV_COMPONENT_REPHRASING_REQUEST_TYPE,
  DRAFT_APPLICATION_REQUEST_TYPE,
  DRAFT_COMMUNICATION_REQUEST_TYPE,
  WHATSAPP_REPLY_HELPER_REQUEST_TYPE,
  DAILY_REFLECTION_REQUEST_TYPE,
  THOUGHT_FOR_THE_DAY_REQUEST_TYPE,
} from '@/lib/orion_config';
import { LLMModelConfig, PreferredModels, LlmSettingsPayload } from '@/lib/types';
import { Settings2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const LLM_MODEL_PREFERENCES_KEY = 'orion_llm_model_preferences';

export default function LlmModelSettings() {
  const [currentSelections, setCurrentSelections] = useState<PreferredModels>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cachedSettings, setCachedSettings] = useLocalStorage<PreferredModels | null>(LLM_MODEL_PREFERENCES_KEY, null);

  useEffect(() => {
    const fetchLlmSettings = async () => {
      logger.info('[LlmModelSettings][fetchLlmSettings][START]', { operation: 'fetchLlmSettings' });
      setIsLoading(true);
      setError(null);

      // 1. Try to load from local storage first
      if (cachedSettings) {
        setCurrentSelections(cachedSettings);
        logger.debug('[LlmModelSettings][fetchLlmSettings][LOCAL_STORAGE_LOAD]', {
          cachedSettings,
        });
        setIsLoading(false); // Optimistically set loading to false
      }

      // 2. Fetch from API to get latest settings
      try {
        const response = await apiClient.get<{
          success: boolean;
          settings?: PreferredModels;
          error?: string;
        }>('/api/orion/llm-settings');

        if (response.data.success && response.data.settings) {
          const fetchedSettings = response.data.settings;
          setCurrentSelections(fetchedSettings);
          setCachedSettings(fetchedSettings); // Update local storage with latest
          logger.success('[LlmModelSettings][fetchLlmSettings][SUCCESS]', { fetchedSettings });
        } else {
          // If no settings from API, and no cached settings, reset to empty
          if (!cachedSettings) {
            setCurrentSelections({});
          }
          logger.info('[LlmModelSettings][fetchLlmSettings][NO_SETTINGS] No settings found for user from API.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
        logger.error('[LlmModelSettings][fetchLlmSettings][API_ERROR]', { error: errorMessage, originalError: err });
        // If API fails and no cached settings were loaded, show error
        if (!cachedSettings) {
          setError('Failed to load LLM settings. Please try again later.');
          toast.error('Failed to load LLM settings.');
        } else {
          logger.warn(
            '[LlmModelSettings][fetchLlmSettings][API_ERROR_WITH_CACHE] API fetch failed, but cached settings are available.',
            {
              error: errorMessage,
            }
          );
          toast.error('Failed to fetch latest LLM settings. Using cached data.');
        }
      } finally {
        setIsLoading(false);
        logger.info('[LlmModelSettings][fetchLlmSettings][END]', { operation: 'fetchLlmSettings' });
      }
    };

    fetchLlmSettings();
  }, [cachedSettings, setCachedSettings]); // Added setCachedSettings to dependencies

  const handleGlobalDefaultChange = (value: string) => {
    setCurrentSelections((prev) => ({
      ...prev,
      globalDefault: value === '__DEFAULT__' ? undefined : value,
    }));
    logger.debug('[LlmModelSettings][handleGlobalDefaultChange]', { newGlobalDefault: value });
  };

  const handleRequestTypeChange = (requestType: string, value: string) => {
    setCurrentSelections((prev) => {
      // Ensure requestTypeOverrides is an object before spreading
      const currentOverrides = prev.requestTypeOverrides || {};
      const newRequestTypeOverrides: Record<string, string | undefined> = {
        ...currentOverrides,
        [requestType]: value === '__DEFAULT__' ? undefined : value,
      };

      // Clean up undefined entries
      Object.keys(newRequestTypeOverrides).forEach((key) => {
        if (newRequestTypeOverrides[key] === undefined) {
          delete newRequestTypeOverrides[key];
        }
      });

      return {
        ...prev,
        requestTypeOverrides: Object.keys(newRequestTypeOverrides).length === 0 ? undefined : newRequestTypeOverrides,
      };
    });
    logger.debug('[LlmModelSettings][handleRequestTypeChange]', { requestType, newValue: value });
  };

  const handleSavePreferences = async () => {
    logger.info('[LlmModelSettings][handleSavePreferences][START]', { currentSelections });
    setIsSaving(true);
    setError(null);
    toast.loading('Saving LLM preferences...');

    try {
      const payload: LlmSettingsPayload = {
        globalDefaultModel: currentSelections.globalDefault,
        requestTypeOverrides: currentSelections.requestTypeOverrides
          ? (Object.fromEntries(Object.entries(currentSelections.requestTypeOverrides || {})) as Record<string, string>)
          : undefined,
      };

      // Filter out undefined requestTypeOverrides to ensure a clean payload
      if (payload.requestTypeOverrides) {
        for (const key in payload.requestTypeOverrides) {
          if (payload.requestTypeOverrides[key] === undefined) {
            delete payload.requestTypeOverrides[key];
          }
        }
        if (Object.keys(payload.requestTypeOverrides).length === 0) {
          payload.requestTypeOverrides = undefined;
        }
      }

      const response = await apiClient.patch<{
        success: boolean;
        message?: string;
        error?: string;
        settings?: PreferredModels; // Add settings to response type
      }>('/api/orion/llm-settings', payload);

      if (response.data.success) {
        toast.success('LLM preferences saved successfully!');
        logger.success('[LlmModelSettings][handleSavePreferences][SUCCESS]');
        // Update local storage with the settings returned from the API
        if (response.data.settings) {
          setCurrentSelections(response.data.settings);
          setCachedSettings(response.data.settings);
          logger.debug('[LlmModelSettings][handleSavePreferences][LOCAL_STORAGE_UPDATE]', {
            updatedSettings: response.data.settings,
          });
        } else {
          // If API doesn't return settings, clear cache or use current client state
          setCachedSettings(null);
          logger.warn(
            '[LlmModelSettings][handleSavePreferences][NO_SETTINGS_FROM_API] API did not return settings, clearing cache.'
          );
        }
      } else {
        logger.error('[LlmModelSettings][handleSavePreferences][API_ERROR]', { error: response.data.error });
        throw new Error(response.data.error || 'Failed to save LLM preferences.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      logger.error('[LlmModelSettings][handleSavePreferences][ERROR]', { error: errorMessage, originalError: err });
      setError('Failed to save LLM preferences. Please try again.');
      toast.error(`Failed to save LLM preferences: ${errorMessage}`);
    } finally {
      setIsSaving(false);
      toast.dismiss();
      logger.info('[LlmModelSettings][handleSavePreferences][END]');
    }
  };

  const handleResetToDefaults = async () => {
    logger.info('[LlmModelSettings][handleResetToDefaults][START]');
    setIsSaving(true);
    setError(null);
    toast.loading('Resetting LLM preferences...');

    try {
      const payload: LlmSettingsPayload = {
        globalDefaultModel: undefined,
        requestTypeOverrides: undefined,
      };

      const response = await apiClient.patch<{
        success: boolean;
        message?: string;
        error?: string;
        settings?: PreferredModels; // Add settings to response type
      }>('/api/orion/llm-settings', payload);

      if (response.data.success) {
        const resetSettings = response.data.settings || {}; // Use response settings or empty
        setCurrentSelections(resetSettings);
        setCachedSettings(resetSettings); // Update local storage
        toast.success('LLM preferences reset to application defaults.');
        logger.success('[LlmModelSettings][handleResetToDefaults][SUCCESS]', { resetSettings });
      } else {
        logger.error('[LlmModelSettings][handleResetToDefaults][API_ERROR]', { error: response.data.error });
        throw new Error(response.data.error || 'Failed to reset LLM preferences.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      logger.error('[LlmModelSettings][handleResetToDefaults][ERROR]', { error: errorMessage, originalError: err });
      setError('Failed to reset LLM preferences. Please try again.');
      toast.error(`Failed to reset LLM preferences: ${errorMessage}`);
    } finally {
      setIsSaving(false);
      toast.dismiss();
      logger.info('[LlmModelSettings][handleResetToDefaults][END]');
    }
  };

  const requestTypes = [
    { id: ASK_QUESTION_REQUEST_TYPE, name: 'Ask Question' },
    { id: JOURNAL_REFLECTION_REQUEST_TYPE, name: 'Journal Reflection' },
    { id: JD_ANALYSIS_REQUEST_TYPE, name: 'Job Description Analysis' },
    { id: OPPORTUNITY_EVALUATION_REQUEST_TYPE, name: 'Opportunity Evaluation' },
    { id: OUTREACH_GENERATION_REQUEST_TYPE, name: 'Outreach Generation' },
    { id: NARRATIVE_GENERATION_REQUEST_TYPE, name: 'Narrative Generation' },
    { id: CV_COMPONENT_SELECTION_REQUEST_TYPE, name: 'CV Component Selection' },
    { id: CV_COMPONENT_REPHRASING_REQUEST_TYPE, name: 'CV Component Rephrasing' },
    { id: CV_SUMMARY_TAILORING_REQUEST_TYPE, name: 'CV Summary Tailoring' },
    { id: DRAFT_APPLICATION_REQUEST_TYPE, name: 'Draft Application' },
    { id: DRAFT_COMMUNICATION_REQUEST_TYPE, name: 'Draft Communication' },
    { id: WHATSAPP_REPLY_HELPER_REQUEST_TYPE, name: 'WhatsApp Reply Helper' },
    { id: DAILY_REFLECTION_REQUEST_TYPE, name: 'Daily Reflection' },
    { id: THOUGHT_FOR_THE_DAY_REQUEST_TYPE, name: 'Thought for the Day' },
  ];

  const getModelDisplayName = (modelId?: string) => {
    if (!modelId) return 'Default';
    const model = AVAILABLE_LLM_MODELS.find((m) => m.id === modelId);
    return model ? model.name : modelId;
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-gray-200">
        <CardContent className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
          <p className="mt-4 text-lg">Loading LLM Settings...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 text-gray-200">
        <CardContent className="flex flex-col items-center justify-center h-48 text-red-500">
          <p className="text-lg">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings2 size={20} />
          <span>LLM Model Preferences</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure your preferred Large Language Models for different tasks. These settings will be applied across
          Orion for AI-driven features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}

        <div className="mb-6">
          <Label htmlFor="global-default-model" className="block text-sm font-medium text-gray-300 mb-2">
            Global Default Model
          </Label>
          <Select value={currentSelections.globalDefault || '__DEFAULT__'} onValueChange={handleGlobalDefaultChange}>
            <SelectTrigger id="global-default-model" name="globalDefaultModel" className="w-full bg-gray-700 border-gray-600 text-gray-100">
              <SelectValue placeholder="Select a global default model" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
              <SelectItem value="__DEFAULT__">Application Default</SelectItem>
              {AVAILABLE_LLM_MODELS.map((model: LLMModelConfig) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} ({model.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400 mt-1">
            This model will be used for all tasks unless a specific override is set below.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-100 mb-4">Request Type Overrides</h3>
        <div className="space-y-4">
          {requestTypes.map((type) => (
            <div key={type.id} className="flex flex-col">
              <Label htmlFor={`model-${type.id}`} className="block text-sm font-medium text-gray-300 mb-2">
                Model for {type.name}
              </Label>
              <Select
                value={currentSelections.requestTypeOverrides?.[type.id] || '__DEFAULT__'}
                onValueChange={(value) => handleRequestTypeChange(type.id, value)}
              >
                <SelectTrigger id={`model-${type.id}`} name={`model-${type.id}`} className="w-full bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder={`Select model for ${type.name}`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                  <SelectItem value="__DEFAULT__">
                    Global Default ({getModelDisplayName(currentSelections.globalDefault)})
                  </SelectItem>
                  {AVAILABLE_LLM_MODELS.map((model: LLMModelConfig) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Override the global default for {type.name} tasks.</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            onClick={handleResetToDefaults}
            disabled={isSaving || isLoading}
            variant="outline"
            className="border-gray-600 text-gray-200 hover:bg-gray-700"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Reset to Application Defaults
          </Button>
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
