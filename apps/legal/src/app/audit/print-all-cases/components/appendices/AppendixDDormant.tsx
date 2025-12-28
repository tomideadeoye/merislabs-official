import React from 'react';
import { formatCurrency, getClaimValue, getCurrency, getSuitNumber, AnyCase } from '../../utils';

interface AppendixDDormantProps {
  dormantCases: AnyCase[];
  onCaseClick?: (id: string) => void;
}

export default function AppendixDDormant({ dormantCases, onCaseClick }: AppendixDDormantProps) {
  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix D</div>
        <h1 className="appendix-title">Dormant Cases</h1>
        <p className="appendix-subtitle">Cases with No Recent Activity ({dormantCases.length} cases)</p>
      </div>
      
      <table className="appendix-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>S/N</th>
            <th>Suit No.</th>
            <th style={{ width: '30%' }}>Parties</th>
            <th>Claim Value</th>
            <th>External Counsel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dormantCases.map((c, idx) => {
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
                <td>{c.ExternalCounsel}</td>
                <td>{c.CaseStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

