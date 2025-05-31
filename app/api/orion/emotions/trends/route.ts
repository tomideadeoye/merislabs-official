import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { OPPORTUNITY_EVALUATION_REQUEST_TYPE } from '@/lib/orion_config';

/**
 * API route for analyzing emotional trends
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Build query with filters
    let query = `SELECT primaryEmotion, COUNT(*) as count, AVG(intensity) as avgIntensity FROM emotional_logs WHERE 1=1`;
    const params: any = {};
    
    if (startDate) {
      query += ` AND timestamp >= @startDate`;
      params.startDate = startDate;
    }
    
    if (endDate) {
      query += ` AND timestamp <= @endDate`;
      params.endDate = endDate;
    }
    
    query += ` GROUP BY primaryEmotion ORDER BY count DESC`;
    
    // Execute query
    const stmt = db.prepare(query);
    const emotionCounts = stmt.all(params);
    
    // Get most common triggers
    const triggerQuery = `
      SELECT json_extract(value, '$') as trigger, COUNT(*) as count
      FROM emotional_logs, json_each(emotional_logs.triggers)
      WHERE triggers IS NOT NULL
      ${startDate ? 'AND timestamp >= @startDate' : ''}
      ${endDate ? 'AND timestamp <= @endDate' : ''}
      GROUP BY trigger
      ORDER BY count DESC
      LIMIT 10
    `;
    
    const triggerStmt = db.prepare(triggerQuery);
    const commonTriggers = triggerStmt.all(params);
    
    // Get emotion intensity over time
    const timelineQuery = `
      SELECT 
        date(timestamp) as date, 
        primaryEmotion,
        AVG(intensity) as avgIntensity
      FROM emotional_logs
      WHERE intensity IS NOT NULL
      ${startDate ? 'AND timestamp >= @startDate' : ''}
      ${endDate ? 'AND timestamp <= @endDate' : ''}
      GROUP BY date, primaryEmotion
      ORDER BY date
    `;
    
    const timelineStmt = db.prepare(timelineQuery);
    const emotionTimeline = timelineStmt.all(params);
    
    // Get LLM analysis of the emotional data
    const emotionalData = {
      emotionCounts,
      commonTriggers,
      emotionTimeline
    };
    
    // Use LLM to analyze the emotional data
    const llmResponse = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestType: OPPORTUNITY_EVALUATION_REQUEST_TYPE,
        primaryContext: `
          Analyze the following emotional data and provide insights:
          
          Emotion Frequencies:
          ${JSON.stringify(emotionCounts, null, 2)}
          
          Common Triggers:
          ${JSON.stringify(commonTriggers, null, 2)}
          
          Emotion Timeline:
          ${JSON.stringify(emotionTimeline, null, 2)}
          
          Please provide:
          1. Key patterns or trends you observe
          2. Potential correlations between emotions and triggers
          3. Suggestions for emotional well-being based on this data
          
          Format your response as a JSON object with the following structure:
          {
            "patterns": ["pattern 1", "pattern 2", ...],
            "correlations": ["correlation 1", "correlation 2", ...],
            "suggestions": ["suggestion 1", "suggestion 2", ...]
          }
        `,
        temperature: 0.3,
        maxTokens: 1000
      })
    });
    
    let insights = null;
    
    if (llmResponse.ok) {
      const llmData = await llmResponse.json();
      if (llmData.success && llmData.content) {
        try {
          insights = JSON.parse(llmData.content);
        } catch (parseError) {
          console.error('Error parsing LLM response:', parseError);
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        emotionCounts,
        commonTriggers,
        emotionTimeline,
        insights
      }
    });
    
  } catch (error: any) {
    console.error('Error in GET /api/orion/emotions/trends:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}