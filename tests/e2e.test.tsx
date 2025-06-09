// ...existing tests...

import * as React from "react";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { OpportunityPipelineCharts } from "../app/(orion_admin)/admin/opportunity-pipeline/OpportunityPipelineCharts";
import userEvent from '@testing-library/user-event';
import OpportunityPipelinePage from '../app/(orion_admin)/admin/opportunity-pipeline/page';
import { useOpportunityCentralStore } from '../components/orion/opportunities/opportunityCentralStore';

// Mock the opportunity store
jest.mock('../components/orion/opportunities/opportunityCentralStore', () => ({
  useOpportunityCentralStore: jest.fn(),
}));

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

describe('Opportunity Pipeline', () => {
  const mockOpportunities = [
    {
      id: '1',
      company: 'Test Company',
      position: 'Software Engineer',
      status: 'new',
      location: 'Remote',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockStore = {
    opportunities: mockOpportunities,
    isLoading: false,
    error: null,
    setOpportunities: jest.fn(),
    addOpportunity: jest.fn(),
    updateOpportunity: jest.fn(),
    deleteOpportunity: jest.fn(),
    fetchOpportunities: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    (useOpportunityCentralStore as jest.Mock).mockImplementation(() => mockStore);
  });

  it('renders opportunity pipeline page', () => {
    render(<OpportunityPipelinePage />);
    expect(screen.getByText('Opportunity Pipeline')).toBeInTheDocument();
  });

  it('displays list of opportunities', () => {
    render(<OpportunityPipelinePage />);
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('switches between list and kanban views', async () => {
    render(<OpportunityPipelinePage />);

    // Initially in list view
    expect(screen.getByText('List View')).toHaveClass('bg-primary');

    // Switch to kanban view
    await userEvent.click(screen.getByText('Kanban View'));
    expect(screen.getByText('Kanban View')).toHaveClass('bg-primary');
  });

  it('shows loading state', () => {
    (useOpportunityCentralStore as jest.Mock).mockImplementation(() => ({
      ...mockStore,
      isLoading: true,
    }));

    render(<OpportunityPipelinePage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useOpportunityCentralStore as jest.Mock).mockImplementation(() => ({
      ...mockStore,
      error: new Error('Failed to load opportunities'),
    }));

    render(<OpportunityPipelinePage />);
    expect(screen.getByText('Error Loading Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Failed to load opportunities. Please try again later.')).toBeInTheDocument();
  });

  it('fetches opportunities on mount', async () => {
    render(<OpportunityPipelinePage />);
    await waitFor(() => {
      expect(mockStore.fetchOpportunities).toHaveBeenCalled();
    });
  });

  it('handles empty opportunities list', () => {
    (useOpportunityCentralStore as jest.Mock).mockImplementation(() => ({
      ...mockStore,
      opportunities: [],
    }));

    render(<OpportunityPipelinePage />);
    expect(screen.queryByText('Test Company')).not.toBeInTheDocument();
  });

  it('handles opportunity status changes', async () => {
    render(<OpportunityPipelinePage />);

    // Find and click the status dropdown
    const statusDropdown = screen.getByRole('combobox', { name: /status/i });
    await userEvent.click(statusDropdown);

    // Select a new status
    const newStatus = screen.getByText('applied');
    await userEvent.click(newStatus);

    // Verify the update was called
    expect(mockStore.updateOpportunity).toHaveBeenCalledWith('1', expect.objectContaining({
      status: 'applied',
    }));
  });

  it('handles opportunity deletion', async () => {
    render(<OpportunityPipelinePage />);

    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    // Verify the delete was called
    expect(mockStore.deleteOpportunity).toHaveBeenCalledWith('1');
  });

  it('handles opportunity creation', async () => {
    render(<OpportunityPipelinePage />);

    // Find and click the add opportunity button
    const addButton = screen.getByRole('button', { name: /add opportunity/i });
    await userEvent.click(addButton);

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/company/i), 'New Company');
    await userEvent.type(screen.getByLabelText(/position/i), 'New Position');
    await userEvent.type(screen.getByLabelText(/location/i), 'New Location');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // Verify the add was called
    expect(mockStore.addOpportunity).toHaveBeenCalledWith(expect.objectContaining({
      company: 'New Company',
      position: 'New Position',
      location: 'New Location',
    }));
  });
});

// One-liner summary for README:
// tests/e2e.test.ts: E2E and UI tests for Opportunity Pipeline, D3 visualizations, and core API/data flows.
