import React from 'react';
import { formatCurrency } from '../../utils';

interface AppendixASummaryProps {
  totalCases: number;
  claimsByCurrency: Record<string, { count: number; total: number }>;
  priorityClaimsByCurrency: Record<string, { count: number; total: number }>;
  priorityCasesCount: number;
  pendingCasesCount: number;
  dormantCasesCount: number;
  unascertainedCasesCount: number;
  grouped: {
    key: string;
    label: string;
    items: any[];
  }[];
  onFilterCurrency?: (curr: string) => void;
  onFilterStatus?: (status: string) => void;
  onFilterSection?: (key: string) => void;
}

export default function AppendixASummary({
  totalCases,
  claimsByCurrency,
  priorityClaimsByCurrency,
  priorityCasesCount,
  pendingCasesCount,
  dormantCasesCount,
  unascertainedCasesCount,
  grouped,
  onFilterCurrency,
  onFilterStatus,
  onFilterSection,
}: AppendixASummaryProps) {
  // Filter out priority-matters from grouped for breakdown (they're a subset, not separate)
  const nonPriorityGroups = grouped.filter(g => g.key !== 'priority-matters');
  
  const isInteractive = !!onFilterCurrency && !!onFilterStatus && !!onFilterSection;
  const cursorStyle = isInteractive ? 'pointer' : 'default';

  return (
    <div className="appendix-page">
      <div className="appendix-header">
        <div className="appendix-badge">Appendix A</div>
        <h1 className="appendix-title">Summary Statistics</h1>
        <p className="appendix-subtitle">Total Claims and Case Count Overview</p>
      </div>
      
      {/* Priority Matters - Professional subtle highlight */}
      <div 
        onClick={() => isInteractive && onFilterStatus?.('priority')}
        style={{ 
          background: '#f8fafc', 
          padding: '16px 20px', 
          borderRadius: '6px', 
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          borderLeft: '4px solid #1e293b',
          cursor: cursorStyle,
          transition: 'all 0.2s ease'
        }}
        className={isInteractive ? "hover:bg-gray-100 hover:shadow-md" : ""}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ 
            background: '#1e293b', 
            color: 'white', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontSize: '10px', 
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Priority</span>
          <span style={{ color: '#334155', fontWeight: 600, fontSize: '14px' }}>High-Value Cases Requiring Attention</span>
        </div>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '2px' }}>Cases</span>
            <strong style={{ fontSize: '20px', color: '#0f172a' }}>{priorityCasesCount}</strong>
          </div>
          {Object.entries(priorityClaimsByCurrency).map(([currency, data]) => (
            <div key={currency}>
              <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '2px' }}>
                Priority Exposure ({currency})
              </span>
              <strong style={{ fontSize: '18px', color: '#0f172a' }}>{formatCurrency(data.total, currency)}</strong>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0 0', fontSize: '11px', color: '#64748b' }}>
          These high-value cases are already included in the section totals below.
        </p>
      </div>
      
      {/* Summary Cards - Professional neutral design */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div 
          onClick={() => isInteractive && onFilterStatus?.('all')}
          style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            padding: '16px',
            textAlign: 'center',
            cursor: cursorStyle
          }}
          className={isInteractive ? "hover:border-blue-400 hover:shadow-sm" : ""}
        >
          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Total Unique Cases
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{totalCases}</div>
        </div>
        
        {Object.entries(claimsByCurrency).map(([currency, data]) => (
          <div 
            key={currency} 
            onClick={() => isInteractive && onFilterCurrency?.(currency)}
            style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px', 
              padding: '16px',
              textAlign: 'center',
              cursor: cursorStyle
            }}
            className={isInteractive ? "hover:border-blue-400 hover:shadow-sm" : ""}
          >
            <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Total Claims ({currency}) · {data.count} cases
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{formatCurrency(data.total, currency)}</div>
          </div>
        ))}
        
        <div 
          onClick={() => isInteractive && onFilterStatus?.('pending')}
          style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            padding: '16px',
            textAlign: 'center',
            cursor: cursorStyle
          }}
          className={isInteractive ? "hover:border-blue-400 hover:shadow-sm" : ""}
        >
          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Pending Cases
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{pendingCasesCount}</div>
        </div>
        
        <div 
          onClick={() => isInteractive && onFilterStatus?.('dormant')}
          style={{ 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            padding: '16px',
            textAlign: 'center',
            cursor: cursorStyle
          }}
          className={isInteractive ? "hover:border-blue-400 hover:shadow-sm" : ""}
        >
          <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Dormant Cases
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{dormantCasesCount}</div>
        </div>
      </div>
      
      <h3 style={{ marginBottom: '12px', color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>Breakdown by Section</h3>
      <table className="appendix-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Case Count</th>
            <th>% of Total</th>
          </tr>
        </thead>
        <tbody>
          {nonPriorityGroups.map(g => (
            <tr 
              key={g.key}
              onClick={() => isInteractive && onFilterSection?.(g.key)}
              style={{ cursor: cursorStyle }}
              className={isInteractive ? "hover:bg-blue-50" : ""}
            >
              <td>{g.label}</td>
              <td>{g.items.length}</td>
              <td>{((g.items.length / totalCases) * 100).toFixed(1)}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>
            <td>Total</td>
            <td>{nonPriorityGroups.reduce((sum, g) => sum + g.items.length, 0)}</td>
            <td>{((nonPriorityGroups.reduce((sum, g) => sum + g.items.length, 0) / totalCases) * 100).toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
