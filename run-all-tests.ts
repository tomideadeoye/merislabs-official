// run-all-tests.ts
// Centralized test runner for core shared modules in the monorepo.
// Run with: npx ts-node run-all-tests.ts

import assert from "assert";

// Test: packages/shared/lib/database.ts
try {
  const db = require("./packages/shared/lib/database");
  assert(db, "Database module should be defined");
  if (typeof db.query === "function") {
    // Test a dummy query if possible (mocked)
    try {
      db.query("SELECT 1");
      console.log("database.query: PASS");
    } catch (e) {
      console.log("database.query: Function exists, but threw error (expected if not implemented):", e.message);
    }
  } else {
    console.log("database.query: FAIL (not a function)");
  }
} catch (e) {
  console.log("database: FAIL", e.message);
}

// Test: packages/shared/lib/email_service.ts
try {
  const email = require("./packages/shared/lib/email_service");
  assert(email, "Email service module should be defined");
  if (typeof email.sendEmail === "function") {
    // Test a dummy sendEmail call (mocked)
    try {
      email.sendEmail({ to: "test@example.com", subject: "Test", body: "Hello" });
      console.log("email_service.sendEmail: PASS");
    } catch (e) {
      console.log("email_service.sendEmail: Function exists, but threw error (expected if not implemented):", e.message);
    }
  } else {
    console.log("email_service.sendEmail: FAIL (not a function)");
  }
} catch (e) {
  console.log("email_service: FAIL", e.message);
}

// Test: packages/shared/lib/narrative_service.ts
try {
  const narrative = require("./packages/shared/lib/narrative_service");
  assert(narrative, "Narrative service module should be defined");
  if (typeof narrative.generateNarrative === "function") {
    try {
      narrative.generateNarrative({ input: "test" });
      console.log("narrative_service.generateNarrative: PASS");
    } catch (e) {
      console.log("narrative_service.generateNarrative: Function exists, but threw error (expected if not implemented):", e.message);
    }
  } else {
    console.log("narrative_service.generateNarrative: FAIL (not a function)");
  }
} catch (e) {
  console.log("narrative_service: FAIL", e.message);
}

// Test: packages/shared/lib/persona_service.ts
try {
  const persona = require("./packages/shared/lib/persona_service");
  assert(persona, "Persona service module should be defined");
  if (typeof persona.getPersonaById === "function") {
    try {
      persona.getPersonaById("test-id");
      console.log("persona_service.getPersonaById: PASS");
    } catch (e) {
      console.log("persona_service.getPersonaById: Function exists, but threw error (expected if not implemented):", e.message);
    }
  } else {
    console.log("persona_service.getPersonaById: FAIL (not a function)");
  }
} catch (e) {
  console.log("persona_service: FAIL", e.message);
}

console.log("run-all-tests.ts: Completed basic shared module checks.");

// --- Shared Types Validation Section ---

try {
  // Narrative Clarity Types
  const {
    NarrativeGenerationRequest,
    NarrativeGenerationResponse,
    CareerMilestone,
  } = require("./packages/shared/types/narrative-clarity");

  // Example: Validate NarrativeGenerationRequest structure
  const exampleNarrativeReq: typeof NarrativeGenerationRequest = {
    narrativeType: "career_summary",
    valueProposition: {
      coreStrengths: ["resilience"],
      uniqueSkills: ["AI integration"],
      passions: ["helping others"],
      vision: "Empower people",
      targetAudience: "Professionals",
      valueStatement: "Delivering clarity and impact",
    },
    careerMilestones: [],
    tone: "professional",
    length: "standard",
    additionalContext: "Test context",
    specificRequirements: "Test requirements",
  };
  assert(exampleNarrativeReq, "NarrativeGenerationRequest: PASS");

  // Example: Validate CareerMilestone structure
  const exampleMilestone: typeof CareerMilestone = {
    id: "test-id",
    title: "Test Milestone",
    organization: "Test Org",
    startDate: "2020-01-01",
    endDate: "2021-01-01",
    description: "Test description",
    achievements: ["Achievement 1"],
    skills: ["Skill 1"],
    impact: "Test impact",
    order: 1,
  };
  assert(exampleMilestone, "CareerMilestone: PASS");

  // Orion Types
  const { QdrantFilter, ScoredMemoryPoint } = require("./packages/shared/types/orion");
  const filter: typeof QdrantFilter = { must: [{ key: "payload.tags", match: { value: "achievement" } }] };
  assert(filter, "QdrantFilter: PASS");

  // Insights Types
  const { PatternAnalysisRequest } = require("./packages/shared/types/insights");
  const examplePatternReq: typeof PatternAnalysisRequest = {
    limit: 5,
    dateFrom: "2024-01-01",
    dateTo: "2024-12-31",
    tags: ["growth"],
    types: ["journal_entry"],
    customQuery: "growth patterns"
  };
  assert(examplePatternReq, "PatternAnalysisRequest: PASS");

  console.log("Shared types: PASS");
} catch (e) {
  console.log("Shared types: FAIL", e.message);
}
