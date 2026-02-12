import React from 'react';
import { normalizeRisk } from '../utils';

interface CaseCardProps {
  caseItem: any;
  sectionKey: string;
}

export default function CaseCard({ caseItem, sectionKey }: CaseCardProps) {
  const caseId = caseItem.CaseID || caseItem.id || 'N/A';
  const suitNo = caseItem.SuitNo || caseItem.suitNo || 'N/A';
  const parties = caseItem.Parties || caseItem.parties || 'N/A';
  const causeOfAction = caseItem.CauseOfAction || caseItem.causeOfAction || 'N/A';
  const monetaryClaim = caseItem.ClaimantMonetaryClaim || caseItem.claimsMonetary || 0;
  const currency = caseItem.Currency || caseItem.currency || '₦';
  const court = caseItem.Court || caseItem.court || 'N/A';
  const status = caseItem.CaseStatus || caseItem.caseStatus || caseItem.status || 'N/A';
  const risk = normalizeRisk(caseItem.RiskAssessment || caseItem.riskAssessment);
  const externalCounsel = caseItem.externalCounsel || caseItem.ExternalCounsel || 'N/A';
  const category = caseItem.Category || caseItem.category || 'N/A';

  // Appeal specific fields
  const appealNo = caseItem.AppealNo || caseItem.appealNo || 'N/A';
  const originalSuitNo = caseItem.OriginalSuitNo || caseItem.originalSuitNo || 'N/A';
  const appellant = caseItem.Appellant || caseItem.appellant || 'N/A';

  // Helper to check for "invalid" values that act like nulls
  const isValidValue = (val: string) => {
    if (!val) return false;
    const v = val.trim().toLowerCase();
    return (
      v !== 'n/a' &&
      v !== 'none' &&
      v !== 'not stated' &&
      v !== 'ca/none' &&
      v !== 'ca/not stated' &&
      v !== 'null' &&
      v !== ''
    );
  };

  // Determine Header Title
  let headerTitle = 'N/A';

  if (isValidValue(appealNo)) {
    headerTitle = appealNo;
  } else if (isValidValue(suitNo)) {
    headerTitle = suitNo;
  } else if (isValidValue(originalSuitNo)) {
    headerTitle = originalSuitNo;
  } else {
    // Fallback if absolutely nothing else is valid, though usually one of the above exists
    headerTitle = caseId !== 'N/A' ? `Case ${caseId}` : 'Untitled Case';
  }

  // Get all additional fields
  const excludedKeys = [
    'CaseID', 'id', 'suitNo', 'SuitNo', 'parties', 'Parties', 'causeOfAction',
    'CauseOfAction', 'claimsMonetary', 'ClaimantMonetaryClaim', 'currency',
    'Currency', 'claimsCurrency', 'court', 'Court', 'caseStatus', 'CaseStatus',
    'riskAssessment', 'RiskAssessment', 'ReportSection', 'uniqueId', 'section',
    'externalCounsel', 'ExternalCounsel', 'Category', 'category', 'status', 'Status',
    'AppealNo', 'appealNo', 'OriginalSuitNo', 'originalSuitNo', 'Appellant', 'appellant'
  ];

  const additionalDetails = Object.entries(caseItem)
    .filter(([key, value]) =>
      !excludedKeys.includes(key) &&
      value !== null &&
      value !== undefined &&
      value !== 'null' &&
      value !== 'N/A' &&
      value !== ''
    )
    .map(([key, value]) => {
      const isMonetaryValue = key.toLowerCase().includes('monetary') ||
        key.toLowerCase().includes('counterclaim') ||
        key.toLowerCase().includes('claim');

      let displayValue = String(value);
      if (isMonetaryValue && typeof value === 'number' && !isNaN(value)) {
        displayValue = `${currency} ${value.toLocaleString('en-NG', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      } else if (typeof value === 'number' && !isNaN(value)) {
        displayValue = value.toLocaleString('en-NG', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
      }

      return {
        key: key.replace(/([A-Z])/g, ' $1').trim().toLowerCase().replace(/^./, str => str.toUpperCase()),
        value: displayValue
      };
    });

  return (
    <div id={`case-${sectionKey}-${caseId}`} className="case-card" style={{ marginBottom: '0', pageBreakInside: 'avoid', pageBreakAfter: 'always' }}>
      <div className="case-header">
        <div>
          <h1 className="case-title">{headerTitle}</h1>
          {caseId !== 'N/A' && (
            <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '12px' }}>Case ID: {caseId}</p>
          )}
        </div>
        <span className={`risk-badge risk-${risk.toLowerCase()}`}>
          {risk} Risk
        </span>
      </div>

      <div className="case-body">
        <div className="case-grid">
          <div className="case-section">
            <h3>Case Information</h3>
            {isValidValue(appealNo) && (
              <div className="case-field">
                <div className="field-label">Appeal No</div>
                <div className="field-value">{appealNo}</div>
              </div>
            )}
            {isValidValue(originalSuitNo) && (
              <div className="case-field">
                <div className="field-label">Original Suit No</div>
                <div className="field-value">{originalSuitNo}</div>
              </div>
            )}
            {isValidValue(appellant) && (
              <div className="case-field">
                <div className="field-label">Appellant</div>
                <div className="field-value">{appellant}</div>
              </div>
            )}
            {parties !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">Parties</div>
                <div className="field-value">{parties}</div>
              </div>
            )}
            {causeOfAction !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">Cause of Action</div>
                <div className="field-value">{causeOfAction}</div>
              </div>
            )}
            {monetaryClaim > 0 && (
              <div className="case-field">
                <div className="field-label">Monetary Claim</div>
                <div className="field-value">{currency} {monetaryClaim.toLocaleString()}</div>
              </div>
            )}
            {category !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">Category</div>
                <div className="field-value">{category}</div>
              </div>
            )}
          </div>

          <div className="case-section">
            <h3>Court Information</h3>
            {court !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">Court</div>
                <div className="field-value">{court}</div>
              </div>
            )}

            {externalCounsel !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">External Counsel</div>
                <div className="field-value">{externalCounsel}</div>
              </div>
            )}  {status !== 'N/A' && (
              <div className="case-field">
                <div className="field-label">Status</div>
                <div className="field-value">{status}</div>
              </div>
            )}

          </div>
        </div>

        {additionalDetails.length > 0 && (
          <div className="additional-details">
            <h3>Additional Details</h3>
            <div className="additional-details-grid">
              {additionalDetails.map((detail, detailIdx) => (
                <div key={detailIdx} className="case-field">
                  <div className="field-label">{detail.key}</div>
                  <div className="field-value">{detail.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="case-footer">
          <img src="/law-firm-logo/jackson etti and edu logo.png" alt="Jackson, Etti & Edu" />
          <img src="/client-logo/Ecobank_Logo.svg.png" alt="Ecobank" />
        </div>
      </div>
    </div>
  );
}
