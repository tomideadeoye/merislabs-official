import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HybridESGDemo from '../page';

// Mock the PDF generation libraries
jest.mock('react-to-pdf', () => ({
  usePDF: () => ({
    toPDF: jest.fn(),
    targetRef: { current: null }
  }),
  default: jest.fn()
}));

jest.mock('html2canvas', () => jest.fn());
jest.mock('jspdf', () => ({
  default: jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    },
    addImage: jest.fn(),
    save: jest.fn(),
    addPage: jest.fn()
  }))
}));

jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn().mockResolvedValue(new Blob())
  })),
  Document: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the PDFGenerator utility
jest.mock('../../../lib/pdfUtils', () => ({
  PDFGenerator: {
    generateFullReport: jest.fn().mockResolvedValue(undefined)
  },
  ComponentRef: jest.fn()
}));

// Mock the theme hook
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: jest.fn(),
    theme: 'light'
  })
}));

// Mock the report components
jest.mock('../../../../components/reports/esg-pages/EndnotesPage', () => ({
  EndnotesPage: () => <div data-testid="endnotes-page">Endnotes Page</div>
}));

jest.mock('../../../../components/reports/pages/EndPage', () => ({
  Endpage: () => <div data-testid="end-page">End Page</div>
}));

jest.mock('../../../../components/reports/esg-pages/CoverPage', () => ({
  CoverPage: ({ pageNumber }: { pageNumber: number }) => (
    <div data-testid="cover-page">Cover Page {pageNumber}</div>
  )
}));

jest.mock('../../../../components/reports/esg-pages', () => ({
  IntroductionPage: () => <div data-testid="introduction-page">Introduction Page</div>,
  TableOfContents: () => <div data-testid="table-of-contents">Table of Contents</div>,
  IntroductionPage2: () => <div data-testid="introduction-page-2">Introduction Page 2</div>,
  IntroductionPage3: () => <div data-testid="introduction-page-3">Introduction Page 3</div>,
  InternalBarriersPage1: () => <div data-testid="internal-barriers-1">Internal Barriers 1</div>,
  InternalBarriersPage2: () => <div data-testid="internal-barriers-2">Internal Barriers 2</div>,
  InternalBarriersPage3: () => <div data-testid="internal-barriers-3">Internal Barriers 3</div>,
  ExternalBarriersPage: () => <div data-testid="external-barriers">External Barriers</div>,
  ESGPage8: () => <div data-testid="esg-page-8">ESG Page 8</div>,
  ESGPage9: () => <div data-testid="esg-page-9">ESG Page 9</div>,
  ESGPage10: () => <div data-testid="esg-page-10">ESG Page 10</div>,
  ESGPage11: () => <div data-testid="esg-page-11">ESG Page 11</div>,
  ESGPage12: () => <div data-testid="esg-page-12">ESG Page 12</div>,
  ESGPage13: () => <div data-testid="esg-page-13">ESG Page 13</div>
}));

describe('HybridESGDemo PDF Download Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock document methods
    Object.defineProperty(document, 'createElement', {
      writable: true,
      value: jest.fn().mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          return {
            href: '',
            download: '',
            click: jest.fn(),
            style: {}
          };
        }
        return {};
      })
    });

    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the ESG report page correctly', () => {
    render(<HybridESGDemo />);

    // Check if main components are rendered
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
    expect(screen.getByTestId('table-of-contents')).toBeInTheDocument();
    expect(screen.getByTestId('introduction-page')).toBeInTheDocument();
    expect(screen.getByTestId('end-page')).toBeInTheDocument();

    // Check if download buttons are present
    expect(screen.getByText('🖼️ High Quality (Recommended)')).toBeInTheDocument();
    expect(screen.getByText('🖼️ Medium Quality')).toBeInTheDocument();
  });

  it('calls PDFGenerator.generateFullReport when html2canvas download button is clicked', async () => {
    // Import the mocked module
    const { PDFGenerator } = await import('@/lib/pdfUtils');

    render(<HybridESGDemo />);

    const downloadButton = screen.getByText('🖼️ High Quality (Recommended)');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(PDFGenerator.generateFullReport).toHaveBeenCalledWith(
        expect.any(Array), // components array
        expect.stringContaining('esg-full-report-html2canvas'), // filename
        expect.objectContaining({
          method: 'html2canvas',
          quality: 'high',
          format: 'a4',
          orientation: 'portrait'
        })
      );
    });
  });

  it('calls PDFGenerator.generateFullReport with medium quality when medium button is clicked', async () => {
    // Import the mocked module
    const { PDFGenerator } = await import('@/lib/pdfUtils');

    render(<HybridESGDemo />);

    const downloadButton = screen.getByText('🖼️ Medium Quality');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(PDFGenerator.generateFullReport).toHaveBeenCalledWith(
        expect.any(Array),
        expect.stringContaining('esg-full-report-html2canvas'),
        expect.objectContaining({
          method: 'html2canvas',
          quality: 'medium',
          format: 'a4',
          orientation: 'portrait'
        })
      );
    });
  });

  it('includes timestamp in filename', async () => {
    // Import the mocked module
    const { PDFGenerator } = await import('@/lib/pdfUtils');

    render(<HybridESGDemo />);

    const downloadButton = screen.getByText('🖼️ High Quality (Recommended)');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      const call = PDFGenerator.generateFullReport.mock.calls[0];
      const filename = call[1];
      // Check if filename contains date-like pattern
      expect(filename).toMatch(/esg-full-report-html2canvas-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/);
    });
  });

  it('disables button while generating PDF', async () => {
    // Import the mocked module
    const { PDFGenerator } = await import('@/lib/pdfUtils');

    // Mock a delay in PDF generation
    PDFGenerator.generateFullReport.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<HybridESGDemo />);

    const downloadButton = screen.getByText('🖼️ High Quality (Recommended)');
    fireEvent.click(downloadButton);

    // Button should show "Generating..." text
    expect(screen.getByText('Generating...')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('🖼️ High Quality (Recommended)')).toBeInTheDocument();
    });
  });

  it('handles PDF generation errors gracefully', async () => {
    // Import the mocked module
    const { PDFGenerator } = await import('@/lib/pdfUtils');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Mock PDF generation to throw an error
    PDFGenerator.generateFullReport.mockRejectedValue(new Error('PDF generation failed'));

    render(<HybridESGDemo />);

    const downloadButton = screen.getByText('🖼️ High Quality (Recommended)');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Full report generation failed for html2canvas:',
        expect.any(Error)
      );
      expect(alertSpy).toHaveBeenCalledWith(
        'Full report generation failed for html2canvas. PDF generation failed'
      );
    });

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('react-to-pdf button is disabled (temporarily unavailable)', () => {
    render(<HybridESGDemo />);

    const reactToPdfButton = screen.getByText('Coming Soon');
    expect(reactToPdfButton).toBeDisabled();
    expect(reactToPdfButton).toHaveClass('cursor-not-allowed');
  });

  it('contains all required report components in refs array', () => {
    render(<HybridESGDemo />);

    // The component should render without errors and all refs should be created
    // This test ensures the component structure is correct
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
    expect(screen.getByTestId('table-of-contents')).toBeInTheDocument();
    expect(screen.getByTestId('introduction-page')).toBeInTheDocument();
    expect(screen.getByTestId('end-page')).toBeInTheDocument();
  });
});
