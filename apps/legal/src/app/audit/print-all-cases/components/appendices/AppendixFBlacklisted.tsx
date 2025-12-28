import React from 'react';
import { formatCurrency, getClaimValue, getCurrency, getSuitNumber, AnyCase } from '../../utils';

interface AppendixFBlacklistedProps {
  blacklistedCases: AnyCase[];
  onCaseClick?: (id: string) => void;
}

export default function AppendixFBlacklisted({ blacklistedCases, onCaseClick }: AppendixFBlacklistedProps) {
  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix F</div>
        <h1 className="appendix-title">Abandoned/Concluded Matters</h1>
        <p className="appendix-subtitle">Settled, Concluded, or Abandoned Cases ({blacklistedCases.length} cases)</p>
      </div>
      
      <table className="appendix-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>S/N</th>
            <th>Suit No.</th>
            <th style={{ width: '28%' }}>Parties</th>
            <th>Claim Value</th>
            <th>Status</th>
            <th>External Counsel</th>
          </tr>
        </thead>
        <tbody>
          {blacklistedCases.map((c, idx) => {
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
                <td>{c.CaseStatus}</td>
                <td>{c.ExternalCounsel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

