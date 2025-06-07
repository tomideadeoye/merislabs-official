// ...existing tests...

import * as React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { OpportunityPipelineCharts } from "../app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts";

// --- Opportunity Pipeline D3 Visualization & UI Tests ---
describe("OpportunityPipelineCharts D3 Visualizations & UI", () => {
  const baseOpportunities = [
    {
      id: "1",
      title: "Software Engineer",
      company: "TechCorp",
      companyOrInstitution: "TechCorp",
      content: "Exciting job opportunity.",
      type: "job" as "job",
      status: "applied" as "applied",
      priority: "high" as "high",
      url: "https://example.com",
      sourceURL: "https://example.com/source",
      tags: ["engineering", "job"],
    },
    {
      id: "2",
      title: "MBA Program",
      company: "BizSchool",
      companyOrInstitution: "BizSchool",
      content: "Top-tier MBA program.",
      type: "education_program" as "education_program",
      status: "evaluating" as "evaluating",
      priority: "medium" as "medium",
      url: "https://mba.com",
      sourceURL: "https://mba.com/source",
      tags: ["mba", "education"],
    },
    {
      id: "3",
      title: "AI Project",
      company: "AIGroup",
      companyOrInstitution: "AIGroup",
      content: "Collaborative AI project.",
      type: "project_collaboration" as "project_collaboration",
      status: "identified" as "identified",
      priority: "low" as "low",
      url: "https://aigroup.com",
      sourceURL: "https://aigroup.com/source",
      tags: ["ai", "collaboration"],
    },
  ];

  it("renders Loader when loading", async () => {
    render(<OpportunityPipelineCharts opportunities={baseOpportunities} />);
    expect(screen.getByText(/loading pipeline analytics/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading pipeline analytics/i)).not.toBeInTheDocument(), { timeout: 2000 });
  });

  it("renders bar and pie charts with correct labels and counts", async () => {
    render(<OpportunityPipelineCharts opportunities={baseOpportunities} />);
    await waitFor(() => screen.getByText(/pipeline visual analytics/i), { timeout: 2000 });
    expect(screen.getByText(/pipeline visual analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/applied/i)).toBeInTheDocument();
    expect(screen.getByText(/evaluating/i)).toBeInTheDocument();
    expect(screen.getByText(/identified/i)).toBeInTheDocument();
    expect(screen.getByText(/job/i)).toBeInTheDocument();
    expect(screen.getByText(/education/i)).toBeInTheDocument();
    expect(screen.getByText(/collab/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/low/i)).toBeInTheDocument();
  });

  it("shows motivational message", async () => {
    render(<OpportunityPipelineCharts opportunities={baseOpportunities} />);
    await waitFor(() => screen.getByText(/pipeline visual analytics/i), { timeout: 2000 });
    // At least one motivational quote should be present
    const found = [
      "Every opportunity is a step closer to Avalon!",
      "You are the architect of your destiny.",
      "Keep building, keep growing, keep winning!",
      "Greatness is inevitable. Let's go!",
      "Your pipeline is your power.",
      "Every application is a new adventure.",
      "You are unstoppable, Tomide!",
    ].some((q) => !!screen.queryByText(q));
    expect(found).toBe(true);
  });

  it("shows gamification badges for 10+ and 25+ opportunities", async () => {
    const manyOpportunities = Array.from({ length: 26 }, (_, i) => ({
      ...baseOpportunities[0],
      id: String(i + 1),
      title: `Opportunity ${i + 1}`,
      status: "applied" as "applied",
    }));
    render(<OpportunityPipelineCharts opportunities={manyOpportunities} />);
    await waitFor(() => screen.getByText(/pipeline pro/i), { timeout: 2000 });
    expect(screen.getByText(/pipeline pro/i)).toBeInTheDocument();
    expect(screen.getByText(/pipeline master/i)).toBeInTheDocument();
  });

  it("handles empty opportunities gracefully", () => {
    render(<OpportunityPipelineCharts opportunities={[]} />);
    expect(screen.getByText(/no opportunities to visualize/i)).toBeInTheDocument();
  });

  it("handles render errors gracefully", () => {
    // Simulate error by passing invalid data
    const badData = [{ bad: "data" }] as any;
    render(<OpportunityPipelineCharts opportunities={badData} />);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});

// One-liner summary for README:
// tests/e2e.test.ts: E2E and UI tests for Opportunity Pipeline, D3 visualizations, and core API/data flows.
