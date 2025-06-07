import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useHabiticaTaskDialogStore } from './habiticaTaskDialogStore';
import { CreateHabiticaTaskDialog } from './CreateHabiticaTaskDialog';

// Mock parent components
import { AddTaskFromReflection } from '../AddTaskFromReflection';
import { OpportunityEvaluator } from '../OpportunityEvaluator';
import { PatternAnalysisDisplay } from '../PatternAnalysisDisplay';
import { CreateHabiticaTaskButton } from '../opportunities/CreateHabiticaTaskButton';

jest.mock('./habiticaTaskDialogStore', () => {
  const actual = jest.requireActual('./habiticaTaskDialogStore');
  return {
    ...actual,
    useHabiticaTaskDialogStore: jest.fn(() => ({
      isOpen: true,
      openDialog: jest.fn(),
      closeDialog: jest.fn(),
    })),
  };
});

describe('CreateHabiticaTaskDialog integration', () => {
  it('renders dialog with correct props', () => {
    render(
      <CreateHabiticaTaskDialog
        initialTaskText="Test Task"
        initialTaskNotes="Test Notes"
        sourceModule="Test Module"
        sourceReferenceId="test-id"
      />
    );
    expect(screen.getByText(/Test Task/)).toBeInTheDocument();
    expect(screen.getByText(/Test Notes/)).toBeInTheDocument();
  });

  it('opens dialog from AddTaskFromReflection', () => {
    render(<AddTaskFromReflection suggestedTask="Reflection Task" />);
    fireEvent.click(screen.getByText(/Create Task/i));
    expect(useHabiticaTaskDialogStore().openDialog).toHaveBeenCalled();
  });

  it('opens dialog from OpportunityEvaluator', () => {
    render(<OpportunityEvaluator />);
    // Simulate evaluation result and next step
    // This is a placeholder: in a real test, mock evaluation state and fire click
    // fireEvent.click(screen.getByText(/Create Task/i));
    // expect(useHabiticaTaskDialogStore().openDialog).toHaveBeenCalled();
  });

  it('opens dialog from PatternAnalysisDisplay', () => {
    render(<PatternAnalysisDisplay />);
    // Simulate pattern analysis and actionable insight
    // This is a placeholder: in a real test, mock pattern state and fire click
    // fireEvent.click(screen.getByText(/Create Task/i));
    // expect(useHabiticaTaskDialogStore().openDialog).toHaveBeenCalled();
  });

  it('opens dialog from CreateHabiticaTaskButton', () => {
    const opportunity = {
      id: 'op-1',
      title: 'Software Engineer',
      company: 'TestCorp',
      companyOrInstitution: 'TestCorp',
      type: 'job' as any, // Cast as OpportunityType to satisfy TS
      content: 'Test opportunity content',
      status: 'identified',
      tags: ['engineering'],
    };
    render(<CreateHabiticaTaskButton opportunity={opportunity} />);
    fireEvent.click(screen.getByText(/Create Task/i));
    expect(useHabiticaTaskDialogStore().openDialog).toHaveBeenCalled();
  });
});
