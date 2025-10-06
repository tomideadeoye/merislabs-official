import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EndnotesPage } from '../EndnotesPage';

describe('EndnotesPage', () => {
  it('does not display "rel=\'noopener noreferrer\'" in visible text', () => {
    const { container } = render(<EndnotesPage />);
    expect(container.textContent).not.toContain("rel='noopener noreferrer'");
  });

  it('renders with correct page structure', () => {
    const { container } = render(<EndnotesPage pageNumber={16} />);

    // Check if the component has the correct ID
    expect(container.firstChild).toHaveAttribute('id', 'page-16');

    // Check if it contains the title
    expect(screen.getByText('Endnotes.')).toBeInTheDocument();

    // Check if it has the correct dimensions
    const pageElement = container.firstChild as HTMLElement;
    expect(pageElement).toHaveStyle({
      width: '794px',
      height: '1123px'
    });
  });

  it('renders footnotes in columns', () => {
    const { container } = render(
      <EndnotesPage
        footnoteStart={1}
        footnoteEnd={5}
        startFromNote={1}
      />
    );

    // Check if columns are present
    const columnsContainer = container.querySelector('[class*="columns-2"]');
    expect(columnsContainer).toBeInTheDocument();

    // Check if footnotes are rendered
    const footnotes = container.querySelectorAll('sup');
    expect(footnotes.length).toBeGreaterThan(0);
  });
});
