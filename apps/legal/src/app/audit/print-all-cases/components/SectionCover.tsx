import React from 'react';

interface SectionCoverProps {
  sectionKey: string;
  label: string;
  index: number; // 0-based index of the section
  itemCount: number;
}

export default function SectionCover({ sectionKey, label, index, itemCount }: SectionCoverProps) {
  return (
    <div className="section-cover page-break" id={`section-${sectionKey}`} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '290mm', // Full A4 height approximate for print flex layout
      padding: '60px 40px',
      boxSizing: 'border-box'
    }}>
      {/* Top decorative element */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: 0.3
      }}>
        <div style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Litigation Audit Report
        </div>
      </div>

      {/* Main Content */}
      <div className="section-cover-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="section-cover-badge" style={{
          background: 'transparent',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          padding: '8px 20px',
          letterSpacing: '3px',
          fontWeight: 500,
          fontSize: '11px',
          marginBottom: '40px',
          borderRadius: '0' // Sharp corners for minimalism
        }}>SECTION {index + 1}</div>

        <h1 className="section-cover-title" style={{
          fontSize: '48px',
          color: '#111827',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 300, // Lighter weight for elegance
          letterSpacing: '-0.5px'
        }}>
          {label}
        </h1>

        <div className="section-cover-line" style={{
          width: '60px',
          height: '2px',
          background: '#2d4f8f',
          margin: '0 auto 30px auto'
        }}></div>

        <div className="section-cover-count" style={{
          color: '#6b7280',
          fontFamily: 'serif', // Elegant touch
          fontSize: '18px',
          fontStyle: 'italic'
        }}>
          {itemCount} {itemCount === 1 ? 'Matter' : 'Matters'}
        </div>
      </div>

      {/* Bottom Footer with Logos */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '25px',
        width: '100%'
      }}>
        <div style={{ width: '30px', height: '1px', background: '#e5e7eb' }}></div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '50px',
          opacity: 1
        }}>
          <img
            src="/law-firm-logo/jackson etti and edu logo.png"
            alt="Jackson, Etti & Edu"
            style={{ height: '40px', width: 'auto', filter: 'grayscale(100%)', opacity: 0.8 }}
          />
          <div style={{ width: '1px', height: '25px', background: '#d1d5db' }}></div>
          <img
            src="/client-logo/Ecobank_Logo.svg.png"
            alt="Ecobank"
            style={{ height: '30px', width: 'auto', filter: 'grayscale(100%)', opacity: 0.8 }}
          />
        </div>
      </div>

      <div className="section-watermark" style={{ opacity: 0.02 }}>{label.toUpperCase()}</div>
    </div>
  );
}
