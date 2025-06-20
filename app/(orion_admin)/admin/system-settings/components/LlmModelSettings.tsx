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
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LLMModelConfig } from '@/lib/types';
import { Sparkles, Settings2 } from 'lucide-react';
import { Cog, Mail, Database, Cloud, Key } from 'lucide-react';
import { EmailTestButton } from '@/components/ui/orion';

// Define the structure for storing user-preferred models
interface PreferredModels {
  globalDefault?: string;
  [requestType: string]: string | undefined; // Allows specific overrides per request type
}

const LLM_MODEL_PREFERENCES_KEY = 'orion_llm_model_preferences';

export default function LlmModelSettings() {
  const [preferences, setPreferences] = useLocalStorage<PreferredModels>(LLM_MODEL_PREFERENCES_KEY, {});
  const [currentSelections, setCurrentSelections] = useState<PreferredModels>({});

  // Initialize currentSelections state from preferences when component mounts
  useEffect(() => {
    setCurrentSelections(preferences);
  }, [preferences]);

  const handleGlobalDefaultChange = (value: string) => {
    setCurrentSelections((prev) => ({ ...prev, globalDefault: value }));
  };

  const handleRequestTypeChange = (requestType: string, value: string) => {
    setCurrentSelections((prev) => ({ ...prev, [requestType]: value }));
  };

  const handleSavePreferences = () => {
    setPreferences(currentSelections);
    // You might want to add a toast notification here for user feedback
    console.log('[LLM_MODEL_SETTINGS] Preferences saved:', currentSelections);
  };

  const handleResetToDefaults = () => {
    setPreferences({}); // Clears local storage, falling back to orion_config defaults
    setCurrentSelections({});
    console.log('[LLM_MODEL_SETTINGS] Preferences reset to application defaults.');
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

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Settings2 className="h-6 w-6" /> LLM Model Settings
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure default and specific AI models for various Orion tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Default Model */}
        <div>
          <Label htmlFor="global-default-model" className="text-gray-300 mb-2 block">
            <Sparkles className="inline-block h-4 w-4 mr-1 text-yellow-400" /> Global Default Model
          </Label>
          <Select onValueChange={handleGlobalDefaultChange} value={currentSelections.globalDefault || ''}>
            <SelectTrigger id="global-default-model" className="w-full bg-gray-700 text-gray-200 border-gray-600">
              <SelectValue placeholder="Select a global default model" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
              <SelectItem value="">Use application default (from config)</SelectItem>
              {AVAILABLE_LLM_MODELS.map((model: LLMModelConfig) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                  {model.supportsTools && <span className="ml-2 text-xs text-green-400">[Tools]</span>}
                  {model.supportsJson && <span className="ml-1 text-xs text-purple-400">[JSON]</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-400 mt-1">This model will be used unless a specific override is set below.</p>
        </div>

        {/* Request Type Overrides */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
            <Sparkles className="inline-block h-5 w-5 mr-1 text-yellow-400" /> Specific Task Overrides
          </h3>
          {requestTypes.map((type) => (
            <div key={type.id}>
              <Label htmlFor={`model-${type.id}`} className="text-gray-300 mb-2 block">
                {type.name}
              </Label>
              <Select
                onValueChange={(value) => handleRequestTypeChange(type.id, value)}
                value={currentSelections[type.id] || ''}
              >
                <SelectTrigger id={`model-${type.id}`} className="w-full bg-gray-700 text-gray-200 border-gray-600">
                  <SelectValue
                    placeholder={`Use global default (${getModelDisplayName(currentSelections.globalDefault || preferences.globalDefault)})`}
                  />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
                  <SelectItem value="">
                    Use Global Default (
                    {getModelDisplayName(currentSelections.globalDefault || preferences.globalDefault)})
                  </SelectItem>
                  {AVAILABLE_LLM_MODELS.map((model: LLMModelConfig) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                      {model.supportsTools && <span className="ml-2 text-xs text-green-400">[Tools]</span>}
                      {model.supportsJson && <span className="ml-1 text-xs text-purple-400">[JSON]</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handleSavePreferences} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            Save Preferences
          </Button>
          <Button
            onClick={handleResetToDefaults}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Reset to App Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
