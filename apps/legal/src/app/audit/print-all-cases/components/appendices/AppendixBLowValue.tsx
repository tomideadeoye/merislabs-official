import React from 'react';
import { formatCurrency, getSuitNumber, AnyCase } from '../../utils';

interface AppendixBLowValueProps {
  lowValueCases: (AnyCase & { _claimValue: number; _currency: string })[];
  onCaseClick?: (id: string) => void;
}

export default function AppendixBLowValue({ lowValueCases, onCaseClick }: AppendixBLowValueProps) {
  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix B</div>
        <h1 className="appendix-title">Low-Value Claims</h1>
        <p className="appendix-subtitle">Cases with Monetary Claims of ₦15 Million and Below</p>
      </div>
      
      <table className="appendix-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>S/N</th>
            <th>Suit No.</th>
            <th style={{ width: '25%' }}>Parties</th>
            <th>Claim Value</th>
            <th>External Counsel</th>
            <th style={{ width: '30%' }}>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {lowValueCases.map((c, idx) => (
            <tr 
              key={idx}
              onClick={() => onCaseClick?.((c as any).uniqueId || `case-${c.CaseID}`)}
              style={{ cursor: onCaseClick ? 'pointer' : 'default' }}
              className={onCaseClick ? "hover:bg-blue-50" : ""}
            >
              <td>{idx + 1}</td>
              <td>{getSuitNumber(c)}</td>
              <td>{c.Parties}</td>
              <td>{formatCurrency(c._claimValue, c._currency)}</td>
              <td>{c.ExternalCounsel || '-'}</td>
              <td style={{ fontSize: '10px' }}>{c.RemarksRecommendation || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

