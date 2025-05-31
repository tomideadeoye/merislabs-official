import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { EmotionalLogEntry, LogEmotionRequest } from '@/types/emotions';

/**
 * API route for logging emotions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as LogEmotionRequest;
    
    // Validate required fields
    if (!body.primaryEmotion) {
      return NextResponse.json({ 
        success: false, 
        error: 'Primary emotion is required' 
      }, { status: 400 });
    }
    
    // Create new emotional log entry
    const newEntry: EmotionalLogEntry = {
      id: uuidv4(),
      timestamp: body.entryTimestamp || new Date().toISOString(),
      primaryEmotion: body.primaryEmotion,
      secondaryEmotions: body.secondaryEmotions || [],
      intensity: body.intensity,
      triggers: body.triggers || [],
      physicalSensations: body.physicalSensations || [],
      accompanyingThoughts: body.accompanyingThoughts,
      copingMechanismsUsed: body.copingMechanismsUsed || [],
      contextualNote: body.contextualNote,
      relatedJournalSourceId: body.relatedJournalSourceId
    };
    
    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO emotional_logs (
        id, timestamp, primaryEmotion, secondaryEmotions, intensity, triggers,
        physicalSensations, accompanyingThoughts, copingMechanismsUsed, contextualNote, relatedJournalSourceId
      ) VALUES (
        @id, @timestamp, @primaryEmotion, @secondaryEmotionsJson, @intensity, @triggersJson,
        @physicalSensationsJson, @accompanyingThoughts, @copingMechanismsUsedJson, @contextualNote, @relatedJournalSourceId
      )
    `);
    
    stmt.run({
      id: newEntry.id,
      timestamp: newEntry.timestamp,
      primaryEmotion: newEntry.primaryEmotion,
      secondaryEmotionsJson: JSON.stringify(newEntry.secondaryEmotions),
      intensity: newEntry.intensity,
      triggersJson: JSON.stringify(newEntry.triggers),
      physicalSensationsJson: JSON.stringify(newEntry.physicalSensations),
      accompanyingThoughts: newEntry.accompanyingThoughts,
      copingMechanismsUsedJson: JSON.stringify(newEntry.copingMechanismsUsed),
      contextualNote: newEntry.contextualNote,
      relatedJournalSourceId: newEntry.relatedJournalSourceId
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Emotional log saved successfully',
      entry: newEntry
    });
    
  } catch (error: any) {
    console.error('Error in POST /api/orion/emotions/log:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}