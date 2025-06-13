"use client";

import React, { useState, useCallback, useEffect } from "react";
import { apiClient } from "@repo/shared/apiClient";
import {
  WHATSAPP_REPLY_HELPER_REQUEST_TYPE,
  DRAFT_COMMUNICATION_REQUEST_TYPE,
  ASK_QUESTION_REQUEST_TYPE,
} from "@repo/shared/orion_config";
import { toast } from "react-hot-toast";

interface DraftCommunicationFormProps {
  profileData?: string | null;
  memoryAvailable?: boolean;
}

function DraftCommunicationForm({ profileData, memoryAvailable }: DraftCommunicationFormProps) {
  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askProcessing, setAskProcessing] = useState(false);

  const [generateInput, setGenerateInput] = useState("");
  const [generateOutput, setGenerateOutput] = useState("");
  const [generateProcessing, setGenerateProcessing] = useState(false);

  const [modelList, setModelList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("azure/gpt-4.1-mini");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(512);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await apiClient.get("/orion/models");
        if (response.data.success) {
          setModelList(response.data.models);
          if (response.data.models.length > 0) {
            setSelectedModel(response.data.models[0]);
          }
        } else {
          toast.error("Failed to load models");
        }
      } catch {
        toast.error("Error fetching models");
      }
    }
    fetchModels();
  }, []);

  const handleAskQuestion = useCallback(async () => {
    if (!askQuestion.trim()) {
      toast.error("Please enter a question.");
      return;
    }
    setAskProcessing(true);
    setAskAnswer("");
    try {
      const requestBody = {
        requestType: ASK_QUESTION_REQUEST_TYPE,
        primaryContext: askQuestion,
        profileContext: profileData,
        modelOverride: selectedModel,
        temperature,
        maxTokens,
      };
      const response = await apiClient.post("/orion/llm", requestBody);
      if (response.data.success) {
        setAskAnswer(response.data.content || "No answer generated.");
      } else {
        throw new Error(response.data.error || "Failed to get answer from API");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during 'Ask Question'";
      setAskAnswer(`Error: ${errorMessage}. Please try again.`);
      toast.error(`Failed to get answer: ${errorMessage}`);
    } finally {
      setAskProcessing(false);
    }
  }, [askQuestion, profileData, selectedModel, temperature, maxTokens]);

  const handleGenerate = useCallback(async () => {
    if (!generateInput.trim()) {
      toast.error("Please enter input for generation.");
      return;
    }
    setGenerateProcessing(true);
    setGenerateOutput("");
    try {
      const requestBody = {
        requestType: DRAFT_COMMUNICATION_REQUEST_TYPE,
        primaryContext: generateInput,
        profileContext: profileData,
        modelOverride: selectedModel,
        temperature,
        maxTokens,
      };
      const response = await apiClient.post("/orion/llm", requestBody);
      if (response.data.success) {
        setGenerateOutput(response.data.content || "No output generated.");
      } else {
        throw new Error(response.data.error || "Failed to generate output from API");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during generation";
      setGenerateOutput(`Error: ${errorMessage}. Please try again.`);
      toast.error(`Failed to generate output: ${errorMessage}`);
    } finally {
      setGenerateProcessing(false);
    }
  }, [generateInput, profileData, selectedModel, temperature, maxTokens]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-2">Ask a Question</h2>
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={3}
          value={askQuestion}
          onChange={(e) => setAskQuestion(e.target.value)}
          placeholder="Enter your question here..."
          disabled={askProcessing}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 rounded text-white disabled:opacity-50"
          onClick={handleAskQuestion}
          disabled={askProcessing}
        >
          {askProcessing ? "Processing..." : "Ask"}
        </button>
        {askAnswer && (
          <div className="mt-4 p-3 bg-gray-700 rounded whitespace-pre-wrap">{askAnswer}</div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Generate Draft Communication</h2>
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={4}
          value={generateInput}
          onChange={(e) => setGenerateInput(e.target.value)}
          placeholder="Enter context or prompt for draft communication..."
          disabled={generateProcessing}
        />
        <button
          className="mt-2 px-4 py-2 bg-green-600 rounded text-white disabled:opacity-50"
          onClick={handleGenerate}
          disabled={generateProcessing}
        >
          {generateProcessing ? "Generating..." : "Generate"}
        </button>
        {generateOutput && (
          <div className="mt-4 p-3 bg-gray-700 rounded whitespace-pre-wrap">{generateOutput}</div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Model Settings</h2>
        <label className="block mb-1">
          Model:
          <select
            className="ml-2 p-1 rounded bg-gray-800 text-white"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {modelList.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-1">
          Temperature:
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="ml-2 p-1 rounded bg-gray-800 text-white w-20"
          />
        </label>
        <label className="block mb-1">
          Max Tokens:
          <input
            type="number"
            min={1}
            max={2048}
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            className="ml-2 p-1 rounded bg-gray-800 text-white w-24"
          />
        </label>
      </section>
    </div>
  );
}

export default DraftCommunicationForm;
