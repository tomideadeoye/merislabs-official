import '@testing-library/jest-dom';
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { JournalEntryForm } from "./JournalEntryForm";

// Mock useSessionState to avoid localStorage issues in test
jest.mock('@/hooks/useSessionState', () => ({
  useSessionState: (key: string, defaultValue: any) => {
    const [state, setState] = React.useState(defaultValue);
    return [state, setState];
  }
}));

describe("JournalEntryForm", () => {
  it("renders input and allows typing", () => {
    render(<JournalEntryForm />);
    const textarea = screen.getByPlaceholderText(/pour out your thoughts/i);
    expect(textarea).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value: "Test journal entry" } });
    expect((textarea as HTMLTextAreaElement).value).toBe("Test journal entry");
  });

  it("disables submit if no save option is checked", () => {
    render(<JournalEntryForm />);
    const notionCheckbox = screen.getByLabelText(/Save to Notion/i);
    const qdrantCheckbox = screen.getByLabelText(/Save to Qdrant/i);
    const clipboardCheckbox = screen.getByLabelText(/Copy to Clipboard/i);
    // Uncheck all
    fireEvent.click(notionCheckbox);
    fireEvent.click(qdrantCheckbox);
    fireEvent.click(clipboardCheckbox);
    const button = screen.getByRole("button", { name: /save journal entry/i });
    expect(button).toBeDisabled();
  });

  it("shows error if trying to submit empty entry", async () => {
    render(<JournalEntryForm />);
    const button = screen.getByRole("button", { name: /save journal entry/i });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument();
    });
  });

  it("submits when valid and shows feedback", async () => {
    // Mock fetch for backend API
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        success: true,
        notionSaved: true,
        qdrantSaved: true,
        reflectionGenerated: true,
        sourceId: "test-id",
        reflection: "Test reflection"
      })
    }) as any;

    const onEntrySaved = jest.fn();
    render(<JournalEntryForm onEntrySaved={onEntrySaved} />);
    const textarea = screen.getByPlaceholderText(/pour out your thoughts/i);
    fireEvent.change(textarea, { target: { value: "Test journal entry" } });
    const button = screen.getByRole("button", { name: /save journal entry/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/saved to notion/i)).toBeInTheDocument();
      expect(onEntrySaved).toHaveBeenCalledWith("test-id", "Test reflection");
    });
  });
});
