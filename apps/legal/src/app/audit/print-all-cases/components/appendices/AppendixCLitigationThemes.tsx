import React from 'react';
import { formatCurrency, THEME_ORDER } from '../../utils';

interface ThemeGroup {
  againstBank: { count: number; ngnTotal: number; usdTotal: number };
  forBank: { count: number; ngnTotal: number; usdTotal: number };
}

interface AppendixCLitigationThemesProps {
  themeGroups: Record<string, ThemeGroup>;
  onFilter?: (theme: string, type: 'against' | 'by') => void;
}

export default function AppendixCLitigationThemes({ themeGroups, onFilter }: AppendixCLitigationThemesProps) {
  // Sort themes according to THEME_ORDER, then alphabetically for any not in the list
  const sortedThemes = Object.entries(themeGroups).sort(([a], [b]) => {
    const indexA = THEME_ORDER.indexOf(a);
    const indexB = THEME_ORDER.indexOf(b);
    
    // If both are in the order list, use that order
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only one is in the list, it comes first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // Otherwise, alphabetical
    return a.localeCompare(b);
  });

  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix C</div>
        <h1 className="appendix-title">Litigation Themes</h1>
        <p className="appendix-subtitle">Case Categorization and Value Analysis</p>
      </div>
      
      {sortedThemes.map(([theme, data]) => {
        const totalCount = data.againstBank.count + data.forBank.count;
        const hasExposure = data.againstBank.ngnTotal > 0 || data.againstBank.usdTotal > 0;
        const hasReceivables = data.forBank.ngnTotal > 0 || data.forBank.usdTotal > 0;
        
        return (
          <div className="theme-section" key={theme}>
            <div className="theme-title">{theme}</div>
            <div className="theme-stats">
              <div className="theme-stat">
                <span className="theme-stat-label">Total Cases</span>
                <span className="theme-stat-value">{totalCount}</span>
              </div>
              <div className="theme-stat">
                <span className="theme-stat-label">Against The Bank</span>
                <span className="theme-stat-value">{data.againstBank.count}</span>
              </div>
              <div className="theme-stat">
                <span className="theme-stat-label">By The Bank</span>
                <span className="theme-stat-value">{data.forBank.count}</span>
              </div>
            </div>
            
            {/* Exposure (Claims Against Bank - Liabilities) */}
            {hasExposure && (
              <div className="theme-subsection">
                <div className="theme-subsection-label">Exposure (Claims Against The Bank)</div>
                <div className="theme-stats">
                  {data.againstBank.ngnTotal > 0 && (
                    <div className="theme-stat">
                      <span className="theme-stat-label">NGN</span>
                      <span className="theme-stat-value" style={{ color: '#dc2626' }}>{formatCurrency(data.againstBank.ngnTotal, 'NGN')}</span>
                    </div>
                  )}
                  {data.againstBank.usdTotal > 0 && (
                    <div className="theme-stat">
                      <span className="theme-stat-label">USD</span>
                      <span className="theme-stat-value" style={{ color: '#dc2626' }}>{formatCurrency(data.againstBank.usdTotal, 'USD')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Receivables (Claims By Bank - Assets) */}
            {hasReceivables && (
              <div className="theme-subsection">
                <div className="theme-subsection-label">Receivables (Claims By The Bank)</div>
                <div className="theme-stats">
                  {data.forBank.ngnTotal > 0 && (
                    <div className="theme-stat">
                      <span className="theme-stat-label">NGN</span>
                      <span className="theme-stat-value" style={{ color: '#2d4f8f' }}>{formatCurrency(data.forBank.ngnTotal, 'NGN')}</span>
                    </div>
                  )}
                  {data.forBank.usdTotal > 0 && (
                    <div className="theme-stat">
                      <span className="theme-stat-label">USD</span>
                      <span className="theme-stat-value" style={{ color: '#2d4f8f' }}>{formatCurrency(data.forBank.usdTotal, 'USD')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
