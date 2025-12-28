import React from 'react';
import { normalizeRisk, formatCurrency, getClaimValue, getCurrency, getSuitNumber, AnyCase } from '../../utils';

interface AppendixEPendingProps {
  pendingCases: AnyCase[];
  onCaseClick?: (id: string) => void;
}

export default function AppendixEPending({ pendingCases, onCaseClick }: AppendixEPendingProps) {
  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix E</div>
        <h1 className="appendix-title">Pending Cases</h1>
        <p className="appendix-subtitle">Cases with Pending Status ({pendingCases.length} cases)</p>
      </div>
      
      <table className="appendix-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>S/N</th>
            <th>Suit No.</th>
            <th style={{ width: '25%' }}>Parties</th>
            <th>Claim Value</th>
            <th>Court</th>
            <th>Risk Level</th>
            <th style={{ width: '25%' }}>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {pendingCases.map((c, idx) => {
            const claimValue = getClaimValue(c);
            const currency = getCurrency(c);
            return (
              <tr 
                key={idx}
                onClick={() => onCaseClick?.((c as any).uniqueId || `case-${c.CaseID}`)}
                style={{ cursor: onCaseClick ? 'pointer' : 'default' }}
                className={onCaseClick ? "hover:bg-blue-50" : ""}
              >
                <td>{idx + 1}</td>
                <td>{getSuitNumber(c)}</td>
                <td>{c.Parties}</td>
                <td>{claimValue > 0 ? formatCurrency(claimValue, currency) : '-'}</td>
                <td>{c.Court}</td>
                <td>{normalizeRisk(c.RiskAssessment)}</td>
                <td style={{ fontSize: '10px' }}>{c.RemarksRecommendation || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

