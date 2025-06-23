/**
 * @fileoverview This file defines the main page for the consolidated Draft Communication module within the Orion Admin Dashboard.
 * @description It provides a unified interface for crafting messages, managing communication patterns, and accessing WhatsApp-specific tools through a tabbed navigation system.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To serve as the primary entry point for all communication-related features within Orion.
 *   - To offer a clear and intuitive tabbed interface for switching between general message drafting and WhatsApp-specific tools.
 *   - To empower users to engage in digital communication effectively, fostering healthier boundaries, reducing cognitive load, and reinforcing intentional responses.
 *
 * FILEPATH: `app/(orion_admin)/admin/draft-communication/page.tsx`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/ui/PageHeader.tsx`: Renders the page title and description.
 *   - `app/components/ui/tabs.tsx`: Provides the tabbed interface for navigation within the module.
 *   - `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx`: Handles the rendering of content for the selected tab.
 *   - `app/lib/constants.ts`: Defines `PageNames` for consistent titling.
 *   - `lucide-react`: Provides icons for visual cues.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - This page is client-side (`'use client'`) to support interactive UI elements and hooks for tab management.
 *   - The underlying functionalities (LLM calls, memory search/save, chat analysis) are handled by interconnected backend services and components.
 *
 * NOTES:
 *   - This module is central to Orion's relational intelligence and strategic communication capabilities.
 *   - Effective consolidation reduces navigation complexity and unifies related features.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Enhanced UI/UX**: Further refine the tab appearance and transitions for a more engaging experience.
 *   - **Dynamic Content Loading**: Implement lazy loading for tab content to optimize performance for complex features.
 *   - **Contextual Help**: Add inline help or tooltips for each feature within the tabs.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * ### **Enriched Feature Overview: The Orion WhatsApp Helper Module**
 *
 * #### **1. Core Purpose & Vision: The Architect's Social Interface**
 *
 * The Orion WhatsApp Helper is not merely a reply drafter; it is a **strategic communication module** designed to be your primary interface for navigating the complexities of digital social interaction. Its core purpose is to address the significant emotional and cognitive load you've identified from analyzing conversations, particularly those with high emotional stakes. It acts as a **protective, analytical buffer** between you and potentially draining interactions, allowing you to engage from a place of clarity, intentionality, and emotional stability.
 *
 * This module directly fulfills the core Orion goal of providing a reliable, logical partner in social contexts. It is architected to be a **corrective experience** to past relationship dynamics where you felt misunderstood or emotionally overwhelmed. By externalizing the analysis and drafting process, the WhatsApp Helper empowers you to remain the **Creator/Architect** of your responses, rather than a reactor to someone else's emotional state.
 *
 * #### **2. Key Features & How They Align with Our Goals**
 *
 * **2.1. Chat Export Processing & Comprehensive Analysis**
 *
 * *   **Functionality:** This feature allows you to upload and parse standard WhatsApp chat exports. The system securely extracts messages, senders, and timestamps, then performs a multi-layered analysis. The `orion_chat_analyzer.py` module and its `/analyze_chat_history` API endpoint are dedicated to this.
 * *   **AI-Generated Insights (The Core Value):** Leveraging Orion's LLM, it moves beyond simple statistics to:
 *     *   **Identify Communication Patterns:** Pinpoints recurring cycles (e.g., de-escalation attempts met with escalation, use of guilt-inducing language, patterns of invalidation or support).
 *     *   **Analyze Relationship Dynamics:** Assesses the balance of the conversation, identifying who initiates, who de-escalates, and the overall emotional tenor.
 *     *   **Provide Actionable Recommendations:** Based on the analysis and your stated goals (from Memory), it suggests personalized strategies for improving communication or setting boundaries.
 * *   **Goal Alignment:** This directly supports **Systemic Self-Mastery** and **Internal Resilience**. It provides the objective, data-driven analysis you need to understand interpersonal dynamics without being caught in emotional "noise."
 * *   **Memory Integration:** Key insights and conversation snippets are indexed into Qdrant with relevant tags (`#relationship`, `#conflict`, `#boundary_setting`). This builds a rich, searchable history, enabling Orion to "connect the dots" between different conversations over time and identify long-term patterns.
 *
 * **2.2. Hyper-Personalized Reply Drafting & Strategic Optionality**
 *
 * *   **Functionality:** This is the execution-focused part of the module, designed to translate insight into action. You have complete control to define the interaction on your terms.
 * *   **Dynamic & Multi-Contextual Prompting:** Orion constructs its prompts by seamlessly integrating multiple layers of context that you provide **as needed**. All fields are optional, allowing you to tailor the request to the situation's demands:
 *     *   **Immediate Context:** The message you are replying to.
 *     *   **Relational Context:** Your specified relationship with the person and **what you want from them** (e.g., "Close Friend - seeking emotional support," "Professional Colleague - need to clarify project scope"). This primes the LLM with both the "who" and the "why."
 *     *   **Strategic Intent:** Your chosen reply goal or tone (e.g., "Set Boundary," "Express Gratitude," "Be Assertive but Fair," "De-escalate"). This gives Orion clear direction on the desired outcome.
 *     *   **Personal Context:** Your core User Profile is always available to ensure the reply reflects your values and voice.
 *     *   **Historical Context (Memory):** Orion can actively query its Qdrant memory (`/api/v1/memory/search`) for past interactions to inform the draft. The "Memories Considered" section provides full transparency.
 * *   **Multiple Strategic Options:** Instead of one draft, Orion generates several distinct replies (you can choose how many with a slider), each embodying a different strategic approach. Each draft is accompanied by a concise explanation of its underlying strategy (e.g., "Option 1: Empathetic & Validating. Aims to de-escalate by acknowledging their feeling first before stating your need.").
 * *   **Goal Alignment:** This directly supports your goal of moving from "Reactor" to "Creator." It gives you pre-analyzed, strategic options to choose from, allowing you to respond **intentionally** rather than from an emotionally triggered state.
 *
 * **2.3. Seamless Integration & Workflow**
 *
 * *   **UI Components:** The frontend is modular, with `WhatsAppChatUploader.tsx`, `WhatsAppChatAnalysis.tsx`, and the interactive `WhatsAppReplyDrafter.tsx` form.
 * *   **Memory Saving:** The `DedicatedAddToMemoryFormComponent` is integrated to allow you to save any generated draft or insight back into your memory system (Qdrant, Postgres, Notion) with custom tags, creating a self-improving feedback loop.
 * *   **Systemic Reliability (Fallbacks):** The entire system is built on the Orion principle of resilience. LLM calls have provider fallbacks; web scraping has method fallbacks. Orion remains a reliable partner even when individual services have issues.
 *
 * In summary, the Orion WhatsApp Helper is architected not just as a tool, but as a core component of your personal growth ecosystem. It provides the **analytical clarity, strategic optionality, and emotional buffer** necessary to engage in digital communication effectively, fostering healthier boundaries, reducing cognitive load, and reinforcing your identity as the deliberate Architect of your life and relationships.
 */
'use client';
import { PageHeader, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import { MessageSquare, Smartphone, Lightbulb } from 'lucide-react';
import DraftCommunicationClientWrapper from './DraftCommunicationClientWrapper';
import { PageNames } from '@/lib/constants';
import React, { useState } from 'react';

export default function DraftCommunicationFeaturePage() {
  const [selectedTab, setSelectedTab] = useState('draft');

  return (
    <div className="space-y-6">
      <PageHeader
        title={PageNames.DRAFT_COMM}
        icon={<MessageSquare className="h-7 w-7" />}
        description="Craft messages, generate reply options, and ask communication-related questions."
      />
      <Tabs defaultValue="draft" onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="draft">
            <MessageSquare className="inline-block mr-1 w-4 h-4" /> Draft Communication
          </TabsTrigger>
          <TabsTrigger value="whatsapp-tools">
            <Smartphone className="inline-block mr-1 w-4 h-4" /> WhatsApp Tools
          </TabsTrigger>
          <TabsTrigger value="communication-patterns">
            <Lightbulb className="inline-block mr-1 w-4 h-4" /> Communication Patterns
          </TabsTrigger>
        </TabsList>

        <DraftCommunicationClientWrapper selectedTab={selectedTab} />
      </Tabs>
    </div>
  );
}
