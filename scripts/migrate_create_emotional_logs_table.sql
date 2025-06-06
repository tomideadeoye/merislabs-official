-- Migration: Create emotional_logs table for Postgres/Neon

CREATE TABLE IF NOT EXISTS emotional_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  primaryEmotion TEXT NOT NULL,
  secondaryEmotions JSONB NOT NULL DEFAULT '[]',
  intensity INTEGER,
  triggers JSONB NOT NULL DEFAULT '[]',
  physicalSensations JSONB NOT NULL DEFAULT '[]',
  accompanyingThoughts TEXT,
  copingMechanismsUsed JSONB NOT NULL DEFAULT '[]',
  contextualNote TEXT,
  relatedJournalSourceId TEXT,
  cognitiveDistortionAnalysis JSONB
);

-- Indexes for efficient querying (optional, but recommended)
CREATE INDEX IF NOT EXISTS idx_emotional_logs_timestamp ON emotional_logs (timestamp);
CREATE INDEX IF NOT EXISTS idx_emotional_logs_primaryEmotion ON emotional_logs (primaryEmotion);
