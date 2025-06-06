// Orion LLM Tool Definitions
// Defines tools (functions) that the LLM can call via function calling/tool use

import type { ChatCompletionTool } from 'openai/resources/chat/completions';

// Tool 1: Search Orion's Qdrant Memory
export const searchOrionMemoryTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "search_orion_memory",
    description: "Searches Tomide's personal Orion memory (Qdrant vector store) for relevant information based on a natural language query and optional filters. Use this to recall past journal entries, notes, ideas, or other stored knowledge.",
    parameters: {
      type: "object",
      properties: {
        queryText: {
          type: "string",
          description: "The natural language query to search for in memory. Should be descriptive of the information sought.",
        },
        memorySourceTypes: {
          type: "array",
          items: { type: "string" },
          description: "Optional. List of memory types to filter by (e.g., 'journal_entry', 'local_document_txt', 'idea_incubator_note', 'opportunity_evaluation'). Only include if user specifies a source or if context implies one.",
        },
        memorySourceTags: {
          type: "array",
          items: { type: "string" },
          description: "Optional. List of tags to filter memories by (e.g., 'career', 'project_phoenix', 'fintech'). Only include if user mentions specific tags or topics.",
        },
        limit: {
          type: "integer",
          description: "Optional. Maximum number of memory snippets to return. Default is 3-5 if not specified.",
        },
      },
      required: ["queryText"],
    },
  },
};

// Tool 2: Create a Habitica To-Do Task
export const createHabiticaTodoTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_habitica_todo",
    description: "Creates a new To-Do task in Tomide's Habitica account. Use this when an actionable item is identified.",
    parameters: {
      type: "object",
      properties: {
        taskText: {
          type: "string",
          description: "The text/description of the To-Do task.",
        },
        taskNotes: {
          type: "string",
          description: "Optional. Additional notes for the Habitica task.",
        },
        priority: {
          type: "number",
          description: "Optional. Priority of the task (0.1 Trivial, 1 Easy, 1.5 Medium, 2 Hard). Default is 1 (Easy).",
        },
        orionSourceModule: {
          type: "string",
          description: "Originating Orion module (e.g., 'JournalReflection', 'IdeaIncubator').",
        },
        orionSourceReferenceId: {
          type: "string",
          description: "ID of the source item in Orion.",
        },
      },
      required: ["taskText", "orionSourceModule", "orionSourceReferenceId"],
    },
  },
};

// Export all available tools as an array
export const AVAILABLE_ORION_TOOLS: ChatCompletionTool[] = [
  searchOrionMemoryTool,
  createHabiticaTodoTool,
];

// Sequential Thinking MCP Tool Utility
export async function callSequentialThinking({
  thought,
  nextThoughtNeeded = true,
  thoughtNumber = 1,
  totalThoughts = 5,
}: {
  thought: string;
  nextThoughtNeeded?: boolean;
  thoughtNumber?: number;
  totalThoughts?: number;
}) {
  // Use the MCP client if available in the browser
  if (typeof window !== 'undefined' && (window as any).mcp_sequentialThinking) {
    return await (window as any).mcp_sequentialThinking({
      thought,
      nextThoughtNeeded,
      thoughtNumber,
      totalThoughts,
    });
  }
  // Fallback: call the server-side API route
  try {
    const res = await fetch('/api/sequential-thinking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thought, nextThoughtNeeded, thoughtNumber, totalThoughts }),
    });
    const data = await res.json();
    if (res.ok && data && data.thought) return data;
    throw new Error(data.error || 'Sequential Thinking MCP tool is not available.');
  } catch (err: any) {
    throw new Error(err.message || 'Sequential Thinking MCP tool is not available.');
  }
}
