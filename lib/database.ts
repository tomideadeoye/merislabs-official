import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const dbPath = path.join(dataDir, 'orion.db');
export const db = new Database(dbPath);

// Set up tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    companyOrInstitution TEXT,
    type TEXT,
    descriptionSummary TEXT,
    sourceURL TEXT,
    status TEXT NOT NULL,
    priority TEXT,
    dateIdentified TEXT,
    lastStatusUpdate TEXT,
    nextActionDate TEXT,
    tags TEXT,
    relatedEvaluationId TEXT,
    applicationMaterialIds TEXT,
    stakeholderContactIds TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS opportunity_evaluations (
    id TEXT PRIMARY KEY,
    opportunityId TEXT NOT NULL,
    fitScorePercentage INTEGER NOT NULL,
    recommendation TEXT NOT NULL,
    alignmentHighlights TEXT,
    gapAnalysis TEXT,
    suggestedNextSteps TEXT,
    fullEvaluationText TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (opportunityId) REFERENCES opportunities (id)
  );

  CREATE TABLE IF NOT EXISTS opportunity_status_history (
    id TEXT PRIMARY KEY,
    opportunity_id TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities (id)
  );

  CREATE TABLE IF NOT EXISTS memory_entries (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL,
    text TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    metadata TEXT
  );

  -- New table for storing multiple drafts per opportunity
  CREATE TABLE IF NOT EXISTS opportunity_drafts (
    id TEXT PRIMARY KEY,
    opportunityId TEXT NOT NULL,
    draftType TEXT NOT NULL, -- e.g., 'application_email', 'cover_letter'
    content TEXT NOT NULL,
    metadata TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (opportunityId) REFERENCES opportunities (id)
  );
`);

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
  CREATE INDEX IF NOT EXISTS idx_opportunity_evaluations_opportunityId ON opportunity_evaluations(opportunityId);
  CREATE INDEX IF NOT EXISTS idx_opportunity_status_history_opportunity_id ON opportunity_status_history(opportunity_id);
  CREATE INDEX IF NOT EXISTS idx_memory_entries_type ON memory_entries(type);
  CREATE INDEX IF NOT EXISTS idx_memory_entries_source_id ON memory_entries(source_id);
  CREATE INDEX IF NOT EXISTS idx_opportunity_drafts_opportunityId ON opportunity_drafts(opportunityId);
`);

export default db;
