import { NextRequest, NextResponse } from 'next/server';
import { parseWhatsAppChat, getBasicChatStats } from '@shared/lib/whatsapp_parser';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';
import { v4 as uuidv4 } from 'uuid';

/**
 * API route for analyzing WhatsApp chat exports
 */
export async function POST(req: NextRequest) {
  try {
    // Get chat text from request
    const formData = await req.formData();
    const chatFile = formData.get('chatFile') as File;
    const contactName = formData.get('contactName') as string;
    
    if (!chatFile) {
      return NextResponse.json({ 
        success: false, 
        error: 'No chat file provided' 
      }, { status: 400 });
    }
    
    // Read chat text from file
    const chatText = await chatFile.text();
    
    // Parse chat
    const chat = parseWhatsAppChat(chatText);
    
    // Get basic statistics
    const basicStats = getBasicChatStats(chat);
    
    // Generate insights using LLM
    const insights = await generateChatInsights(chatText, contactName);
    
    // Store analysis in memory
    const analysisId = await storeChatAnalysisInMemory(contactName, basicStats, insights);
    
    return NextResponse.json({ 
      success: true, 
      chat,
      basicStats,
      insights,
      analysisId
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/whatsapp/analyze:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

/**
 * Generate insights from chat text using LLM
 */
async function generateChatInsights(chatText: string, contactName: string) {
  try {
    // Prepare a sample of the chat for analysis (to avoid token limits)
    const chatLines = chatText.split('\n');
    const sampleSize = Math.min(chatLines.length, 500); // Limit to 500 lines
    const chatSample = chatLines.slice(0, sampleSize).join('\n');
    
    // Call LLM API for analysis
    const response = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestType: 'WHATSAPP_ANALYSIS',
        primaryContext: `
          Analyze the following WhatsApp chat conversation with ${contactName || 'a contact'}. 
          Focus on communication patterns, relationship dynamics, and potential insights.
          
          Chat sample:
          ${chatSample}
          
          Please provide the following analysis in JSON format:
          {
            "communicationPatterns": [
              "pattern 1",
              "pattern 2",
              ...
            ],
            "relationshipDynamics": [
              "dynamic 1",
              "dynamic 2",
              ...
            ],
            "conversationTopics": [
              "topic 1",
              "topic 2",
              ...
            ],
            "suggestions": [
              "suggestion 1",
              "suggestion 2",
              ...
            ]
          }
        `,
        temperature: 0.3,
        maxTokens: 1000
      })
    });
    
    const data = await response.json();
    
    if (data.success && data.content) {
      try {
        return JSON.parse(data.content);
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        return {
          communicationPatterns: [],
          relationshipDynamics: [],
          conversationTopics: [],
          suggestions: []
        };
      }
    } else {
      throw new Error(data.error || 'Failed to generate insights');
    }
  } catch (error) {
    console.error('Error generating chat insights:', error);
    return {
      communicationPatterns: [],
      relationshipDynamics: [],
      conversationTopics: [],
      suggestions: []
    };
  }
}

/**
 * Store chat analysis in memory
 */
async function storeChatAnalysisInMemory(contactName: string, stats: any, insights: any) {
  try {
    const analysisId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Create memory point
    const memoryPoint = {
      id: analysisId,
      payload: {
        type: 'whatsapp_analysis',
        source_id: `whatsapp_analysis_${analysisId}`,
        text: `WhatsApp chat analysis with ${contactName || 'a contact'}: ${JSON.stringify(insights)}`,
        timestamp,
        tags: ['whatsapp', 'chat_analysis', contactName].filter(Boolean),
        metadata: {
          contactName,
          stats,
          insights
        }
      }
    };
    
    // Store in memory
    const response = await fetch('/api/orion/memory/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        points: [memoryPoint],
        collectionName: ORION_MEMORY_COLLECTION_NAME
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to store analysis in memory');
    }
    
    return analysisId;
  } catch (error) {
    console.error('Error storing chat analysis in memory:', error);
    return null;
  }
}