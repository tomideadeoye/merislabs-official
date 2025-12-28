'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import data
import { highClaimCases, getAllCases, appeals, casesByEcobank, mattersAgainstBank, lawFirmMappings } from '@merislabs/data';
import {
  RiskLevel,
  MattersAgainstBankItem,
  CaseWithMetadata,
  AnyCase,
  DashboardView,
  CurrencyFilter,
  SortOrder,
  DashboardAppendixData,
  ThemeGroupStats,
  DashboardFilters,
  LowValueCase
} from '@merislabs/types';

import {
  getSectionLabel,
  sortByRisk as appendixSortByRisk,
  getClaimValue as appendixGetClaimValue,
  getCurrency as appendixGetCurrency,
  getCategory as appendixGetCategory,
  getStatus as appendixGetStatus,
  sectionOrder,
  sectionLabels
} from './print-all-cases/utils';
import AppendixASummary from './print-all-cases/components/appendices/AppendixASummary';
import AppendixBLowValue from './print-all-cases/components/appendices/AppendixBLowValue';
import AppendixCLitigationThemes from './print-all-cases/components/appendices/AppendixCLitigationThemes';
import AppendixDDormant from './print-all-cases/components/appendices/AppendixDDormant';
import AppendixEPending from './print-all-cases/components/appendices/AppendixEPending';
import AppendixFBlacklisted from './print-all-cases/components/appendices/AppendixFBlacklisted';
import PrintGlobalStyles from './print-all-cases/components/PrintGlobalStyles';

// RIGID ACCESSORS
// ---------------------------------------------------------------------------
const getClaimValue = (c: AnyCase): number => {
  if ('ClaimantMonetaryClaim' in c && c.ClaimantMonetaryClaim) return Number(c.ClaimantMonetaryClaim);
  if ('ClaimAmount' in c && (c as any).ClaimAmount) return Number((c as any).ClaimAmount); // Legacy/Loose fallback
  if ('TotalClaim' in c && (c as any).TotalClaim) return Number((c as any).TotalClaim); // Legacy/Loose fallback
  return 0;
};

const getSuitNo = (c: AnyCase): string => {
  const formatValue = (val: string | null | undefined) => {
    if (!val) return '';
    const upper = val.toUpperCase().trim();
    if (upper === 'N/A' || upper === 'NONE' || upper === 'CA/NONE' || upper === '-') return '';
    return val;
  };

  if ('SuitNo' in c && c.SuitNo) return formatValue(c.SuitNo);
  if ('AppealNo' in c && c.AppealNo) return formatValue(c.AppealNo);
  if ('OriginalSuitNo' in c && c.OriginalSuitNo) return formatValue(c.OriginalSuitNo);
  return '';
};

const getCurrency = (c: AnyCase): string => {
  if ('Currency' in c && c.Currency) return c.Currency;
  return 'NGN';
};

const getCauseOfAction = (c: AnyCase): string => {
  if ('CauseOfAction' in c && c.CauseOfAction) return c.CauseOfAction;
  if ('NatureOfAppeal' in c && c.NatureOfAppeal) return c.NatureOfAppeal;
  return 'N/A';
};



export default function AuditDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('dashboard');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  // STRICT STATE TYPES
  // -------------------------------------------------------------------------
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [monetaryRange, setMonetaryRange] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<SortOrder>('default');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('all');
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState<boolean>(false);

  useEffect(() => {
    console.log('[AUDIT_DASHBOARD] Initializing Audit Dashboard. Filters Reset.');
  }, []);

  useEffect(() => {
    console.log('[AUDIT_DASHBOARD] Filter State Updated:', {
      activeSection,
      selectedRisk,
      searchQuery,
      monetaryRange,
      statusFilter,
      currencyFilter,
      showOnlyConfirmed
    });
  }, [activeSection, selectedRisk, searchQuery, monetaryRange, statusFilter, currencyFilter, showOnlyConfirmed]);

  // Combine all cases for filtering
  const allCases = useMemo((): CaseWithMetadata[] => {
    return getAllCases();
  }, []);

  // Filter cases based on selected filters
  const filteredCases = useMemo(() => {
    const result = allCases.filter(caseItem => {
      // 1. Section Filter
      if (activeSection === 'all') {
        if (caseItem.section === 'priority-matters') return false;
      } else if (caseItem.section !== activeSection) {
        return false;
      }

      // 2. Risk Level Filter
      const risk = caseItem.RiskAssessment || RiskLevel.Unassessed;
      if (selectedRisk !== 'All' && risk !== selectedRisk) return false;

      // 3. Currency Filter
      if (currencyFilter !== 'all' && getCurrency(caseItem) !== currencyFilter) return false;

      // 4. Bank Counterclaim Filter (Strict Property Check)
      if (showOnlyConfirmed) {
        const hasCounterclaim = 'BankCounterclaim' in caseItem &&
          caseItem.BankCounterclaim != null &&
          Number(caseItem.BankCounterclaim) > 0;
        if (!hasCounterclaim) return false;
      }

      // 5. Category Filter
      if (categoryFilter !== 'all' && caseItem.category !== categoryFilter) return false;

      // 6. Status Filter
      if (statusFilter !== 'all') {
        const caseStatus = caseItem.CaseStatus || 'N/A';
        const statusMapping: Record<string, string[]> = {
          'Pending Matters': ['Pending', 'Active', 'Ongoing'],
          'Dormant Matters': ['Dormant', 'Inactive', 'Stalled'],
          'Inconclusive Matters': ['Inconclusive', 'Undecided', 'Pending Decision'],
          'Concluded Matters': ['Concluded', 'Closed', 'Settled', 'Resolved']
        };
        const mappedStatuses = statusMapping[statusFilter] || [statusFilter];
        if (!mappedStatuses.includes(caseStatus)) return false;
      }

      // 7. Monetary Range
      const monetaryClaim = getClaimValue(caseItem);
      if (monetaryRange !== 'all') {
        if (monetaryRange === 'none') {
          if (monetaryClaim > 0) return false;
        } else {
          const [min, max] = monetaryRange.split('-');
          if (max) {
            if (monetaryClaim < Number(min) || monetaryClaim > Number(max)) return false;
          } else {
            if (monetaryClaim < Number(min.replace('+', ''))) return false;
          }
        }
      }

      // 8. Search
      if (searchQuery) {
        const searchString = searchQuery.toLowerCase();
        const reportSection = 'ReportSection' in caseItem ? caseItem.ReportSection : '';
        const searchableFields = [
          String(caseItem.CaseID),
          getSuitNo(caseItem),
          caseItem.Parties,
          caseItem.Court,
          getCauseOfAction(caseItem),
          reportSection,
        ];
        return searchableFields.some(field => field && field.toLowerCase().includes(searchString));
      }

      return true;
    });
    console.log(`[AUDIT_DASHBOARD] Filtering complete. Showing ${result.length} out of ${allCases.length} cases.`);
    return result;
  }, [allCases, selectedRisk, activeSection, categoryFilter, statusFilter, monetaryRange, searchQuery, currencyFilter, showOnlyConfirmed]);

  // Apply ordering
  const orderedCases = useMemo(() => {
    const cases = [...filteredCases];
    if (orderBy === 'highest') {
      cases.sort((a, b) => getClaimValue(b) - getClaimValue(a));
    } else if (orderBy === 'lowest') {
      cases.sort((a, b) => getClaimValue(a) - getClaimValue(b));
    }
    return cases;
  }, [filteredCases, orderBy]);

  // Get unique risk levels for filter dropdown
  const riskLevels = useMemo(() => [
    'All', RiskLevel.High, RiskLevel.MediumHigh, RiskLevel.Medium,
    RiskLevel.LowMedium, RiskLevel.Low, RiskLevel.VeryLow, RiskLevel.Unassessed
  ], []);

  // Define categories and statuses
  const categories = [
    'Debt Recovery', 'Pre-emptory actions against Debt Recovery', 'Labour Disputes',
    'Property Disputes', 'Contractual Disputes, Banker/Customer Relationship or Intellectual Property Disputes',
    'Fundamental Right Actions, Defamation, Action by/against Regulators', 'Garnishee Proceedings', 'Uncategorized'
  ];

  const statusOptions = ['Pending Matters', 'Dormant Matters', 'Inconclusive Matters', 'Concluded Matters'];

  // Calculate section counts
  const sectionCounts = useMemo(() => {
    const initialCounts: Record<string, number> = { all: 0, 'priority-matters': 0, 'matters-against': 0, 'cases-by-bank': 0, appeals: 0 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return allCases.reduce((acc: any, item) => {
      if (item.section !== 'priority-matters') acc.all++;
      if (acc[item.section] !== undefined) acc[item.section]++;
      return acc;
    }, initialCounts);
  }, [allCases]);

  // ========== APPENDIX DATA CALCULATION ==========
  const appendixData = useMemo((): DashboardAppendixData => {
    const rawCases = getAllCases(); // Strictly CaseWithMetadata[]

    // Explicit map for priority cases
    const priorityCases: CaseWithMetadata[] = (highClaimCases as unknown as MattersAgainstBankItem[]).map(c => ({
      ...c,
      section: 'priority-matters',
      uniqueId: `priority-matters-${c.CaseID}`
    }));
    console.log('[AUDIT_DASHBOARD] Priority cases identified:', priorityCases.length);

    const grouped = sectionOrder.map(key => {
      const items = key === 'priority-matters'
        ? priorityCases.slice()
        : rawCases.filter(c => c.section === key);
      items.sort(appendixSortByRisk);
      console.log(`[AUDIT_DASHBOARD] Grouped section '${key}': ${items.length} items`);
      return { key, label: sectionLabels[key], items };
    }).filter(g => g.items.length > 0);

    const uniqueRawCases = rawCases.filter(c => c.section !== 'priority-matters');
    const totalCases = uniqueRawCases.length;

    const claimsByCurrency: Record<string, { count: number; total: number; confirmed: number }> = {};
    let unascertainedCasesCount = 0;

    uniqueRawCases.forEach(c => {
      const currency = appendixGetCurrency(c);
      const value = appendixGetClaimValue(c);

      // HUMAN RATIONALE: Unascertained claims are those where the amount is 0, null, or explicitly marked
      // as Unascertained. These are counted separately to avoid skewing the exposure totals.
      if (currency === 'Unascertained' || value <= 0) {
        unascertainedCasesCount++;
        // We still check for counterclaims even in unascertained main claims
        if (currency !== 'Unascertained' && 'BankCounterclaim' in c && c.BankCounterclaim != null) {
          if (!claimsByCurrency[currency]) claimsByCurrency[currency] = { count: 0, total: 0, confirmed: 0 };
          claimsByCurrency[currency].confirmed += Number(c.BankCounterclaim);
        }
        return;
      }

      if (!claimsByCurrency[currency]) claimsByCurrency[currency] = { count: 0, total: 0, confirmed: 0 };

      claimsByCurrency[currency].count++;
      claimsByCurrency[currency].total += value;

      if ('BankCounterclaim' in c && c.BankCounterclaim != null) {
        claimsByCurrency[currency].confirmed += Number(c.BankCounterclaim);
      }
    });

    console.log('[DEBUG] Appendix Data Aggregation:', {
      totalCases,
      unascertainedCasesCount,
      quantifiedCurrencies: Object.keys(claimsByCurrency)
    });

    const dormantCases = uniqueRawCases.filter(c => appendixGetStatus(c).toLowerCase().includes('dormant'));
    const pendingCases = uniqueRawCases.filter(c => appendixGetStatus(c).toLowerCase().includes('pending'));
    const blacklistedCases = uniqueRawCases.filter(c => {
      const status = appendixGetStatus(c).toLowerCase();
      return status.includes('abeyance') || status.includes('struck out') || status.includes('abandoned') || status.includes('concluded') || status.includes('settled');
    });

    console.log('[AUDIT_DASHBOARD] Case status breakdown:', {
      dormant: dormantCases.length,
      pending: pendingCases.length,
      blacklisted: blacklistedCases.length
    });

    const finalThemeGroups: Record<string, { againstBank: ThemeGroupStats; forBank: ThemeGroupStats }> = {};

    uniqueRawCases.forEach(c => {
      const category = appendixGetCategory(c);
      const sectionStr = c.section || ('ReportSection' in c ? c.ReportSection : '');
      const isAgainstBank = sectionStr.includes('against') || sectionStr.includes('matters-against');
      const currency = appendixGetCurrency(c);
      const value = appendixGetClaimValue(c);

      if (!finalThemeGroups[category]) {
        finalThemeGroups[category] = {
          againstBank: { count: 0, ngnTotal: 0, usdTotal: 0 },
          forBank: { count: 0, ngnTotal: 0, usdTotal: 0 },
        };
      }
      const bucket = isAgainstBank ? finalThemeGroups[category].againstBank : finalThemeGroups[category].forBank;
      bucket.count++;
      if (currency === 'USD') bucket.usdTotal += value; else bucket.ngnTotal += value;
    });

    const LOW_VALUE_THRESHOLD = 15_000_000;
    const lowValueCases: LowValueCase[] = uniqueRawCases
      .filter(c => appendixGetClaimValue(c) > 0)
      .map(c => ({
        ...c,
        _claimValue: appendixGetClaimValue(c),
        _currency: appendixGetCurrency(c)
      }))
      .filter(c => c._currency === 'NGN' && c._claimValue <= LOW_VALUE_THRESHOLD)
      .sort((a, b) => a._claimValue - b._claimValue);

    console.log('[AUDIT_DASHBOARD] Low value cases identified:', lowValueCases.length);

    /*
     * HUMAN RATIONALE: We calculate priority stats here in the dashboard to ensure consistency
     * with the main summary view. Priority cases intersect with other lists but are surfaced
     * specifically for their high risk/value impact.
     */
    const priorityClaimsByCurrency: Record<string, { count: number; total: number }> = {};
    priorityCases.forEach(c => {
      const currency = appendixGetCurrency(c);
      const value = appendixGetClaimValue(c);
      if (!priorityClaimsByCurrency[currency]) priorityClaimsByCurrency[currency] = { count: 0, total: 0 };
      priorityClaimsByCurrency[currency].count++;
      if (value > 0) priorityClaimsByCurrency[currency].total += value;
    });

    return {
      totalCases,
      claimsByCurrency,
      priorityClaimsByCurrency,
      priorityCasesCount: priorityCases.length,
      pendingCasesCount: pendingCases.length,
      dormantCasesCount: dormantCases.length,
      grouped,
      dormantCases,
      pendingCases,
      blacklistedCases,
      lowValueCases,
      unascertainedCasesCount,
      themeGroups: finalThemeGroups
    };
  }, []);

  // Export handlers
  const handleExportFilteredCases = async () => {
    try {
      const response = await fetch('/api/export-filtered-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases: orderedCases }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'filtered-cases-report.csv';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
    } catch (error) { console.error('Export error:', error); }
  };

  const handleGenerateAllCasesPDF = () => {
    const link = document.createElement('a');
    link.href = '/Ecobank_Litigation_Audit_Report_2025.pdf';
    link.download = 'Ecobank_Litigation_Audit_Report_2025.pdf';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleGenerateFilteredCasesPDF = async () => {
    try {
      const filters: DashboardFilters = {
        risk: selectedRisk,
        section: activeSection,
        category: categoryFilter,
        status: statusFilter,
        monetaryRange,
        searchQuery,
        orderBy,
        currency: currencyFilter,
        showOnlyConfirmed
      };

      const response = await fetch('/api/generate-filtered-cases-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cases: orderedCases,
          filters: { ...filters, totalCases: orderedCases.length }
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'filtered-cases-report.pdf';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }
    } catch (error) { console.error('PDF generation error:', error); }
  };

  // Render case card
  const renderCaseCard = (caseItem: CaseWithMetadata, index: number) => {
    const suitNo = getSuitNo(caseItem);
    const monetaryClaim = getClaimValue(caseItem);
    const currency = getCurrency(caseItem);
    const risk = caseItem.RiskAssessment || RiskLevel.Unassessed;
    const uniqueId = caseItem.uniqueId || `case-${caseItem.CaseID}`;

    const getRiskColorClass = (riskLevel: string) => {
      switch (riskLevel) {
        case RiskLevel.High: return 'bg-red-100 text-red-800';
        case RiskLevel.MediumHigh: return 'bg-orange-100 text-orange-800';
        case RiskLevel.Medium: return 'bg-yellow-100 text-yellow-800';
        case RiskLevel.LowMedium: return 'bg-lime-100 text-lime-800';
        case RiskLevel.Low: return 'bg-green-100 text-green-800';
        case RiskLevel.VeryLow: return 'bg-emerald-100 text-emerald-800';
        default: return 'bg-slate-100 text-slate-600';
      }
    };

    return (
      <Link href={`/cases/${encodeURIComponent(uniqueId)}`} key={uniqueId}>
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col overflow-hidden bg-white">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{caseItem.CaseID}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${getRiskColorClass(risk)}`}>
              {risk} Risk
            </span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight uppercase tracking-tight">{caseItem.Parties}</h3>
          {suitNo && <p className="text-[11px] text-gray-500 mb-3 font-medium">{suitNo}</p>}
          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            {monetaryClaim > 0 ? (
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Claim Amount</span>
                <span className="text-sm font-black text-gray-900">
                  {currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : ''}
                  {monetaryClaim.toLocaleString(undefined, {
                    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
                    maximumFractionDigits: currency === 'NGN' ? 0 : 2
                  })}
                </span>
              </div>
            ) : <div />}
            <div className="text-right">
              <span className="text-[9px] px-2 py-1 bg-gray-100 rounded text-gray-600 font-bold uppercase tracking-tighter">
                {getSectionLabel(caseItem.section)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Appendix styles */}
      <PrintGlobalStyles />
      {/* Professional White Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>

              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
                Litigation Audit <span className="text-blue-600">Report</span>
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 font-medium text-xs uppercase tracking-wider">Ecobank Nigeria</p>
                <Link href="/admin" className="text-[10px] text-gray-300 hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter opacity-0 hover:opacity-100">
                  [Admin]
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher */}
              <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                  onClick={() => {
                    console.log('[AUDIT_DASHBOARD] Switching view to: dashboard');
                    setActiveView('dashboard');
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wide ${activeView === 'dashboard' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Report
                </button>
                <button
                  onClick={() => {
                    console.log('[AUDIT_DASHBOARD] Switching view to: appendices');
                    setActiveView('appendices');
                  }}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wide ${activeView === 'appendices' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Appendices
                </button>
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <button
                onClick={handleExportFilteredCases}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Export CSV"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              <a
                href="/Ecobank_Litigation_Audit_Report_2025.pdf"
                download="Ecobank_Litigation_Audit_Report_2025.pdf"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm uppercase tracking-wide no-underline"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download Report
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeView === 'dashboard' && (
          <>
            {/* Metric Overview Row */}
            {/* Metric Overview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* CARD 1: TOTAL EXPOSURE (ALL CURRENCIES) - Click to reset all filters */}
              <div
                className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col items-center transition-all cursor-pointer ${currencyFilter !== 'all' || selectedRisk !== 'All' || showOnlyConfirmed || searchQuery
                    ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                    : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  console.log('[AUDIT_DASHBOARD] Resetting all filters');
                  setCurrencyFilter('all');
                  setSelectedRisk('All');
                  setShowOnlyConfirmed(false);
                  setSearchQuery('');
                }}
                title="Click to reset all filters"
              >
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                  Exposure
                </span>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-bold text-gray-900">
                    ₦{(appendixData.claimsByCurrency['NGN']?.total || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  {(appendixData.claimsByCurrency['USD']?.total || 0) > 0 && (
                    <span className="font-medium text-gray-700">
                      ${(appendixData.claimsByCurrency['USD']?.total || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
              </div>


              {/* CARD 3: COUNTERCLAIM (CURRENCY BREAKDOWN) */}
              <div
                className={`bg-white p-4 rounded-xl shadow-sm border ${showOnlyConfirmed ? 'border-green-500 bg-green-50' : 'border-gray-100'} flex flex-col items-center cursor-pointer hover:bg-green-50 transition-all`}
                onClick={() => {
                  console.log('[AUDIT_DASHBOARD] Toggling counterclaim filter:', !showOnlyConfirmed);
                  setShowOnlyConfirmed(!showOnlyConfirmed);
                }}
              >
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                  Counterclaim
                </span>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-bold text-green-700">
                    ₦{(appendixData.claimsByCurrency['NGN']?.confirmed || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  {(appendixData.claimsByCurrency['USD']?.confirmed || 0) > 0 && (
                    <span className="font-medium text-green-600">
                      ${(appendixData.claimsByCurrency['USD']?.confirmed || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="SEARCH PARTIES, SUIT NO, COURT, OR CAUSE OF ACTION..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                  />
                  <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 font-medium outline-none">
                    {riskLevels.map(risk => <option key={risk} value={risk}>{risk === 'All' ? 'All Risks' : `${risk} Risk`}</option>)}
                  </select>

                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="max-w-[150px] bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 font-medium outline-none">
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>

                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 font-medium outline-none">
                    <option value="all">All Statuses</option>
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>

                  <select value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value as CurrencyFilter)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 font-medium outline-none">
                    <option value="all">Currencies</option>
                    {Object.keys(appendixData.claimsByCurrency).map(curr => <option key={curr} value={curr}>{curr}</option>)}
                  </select>

                  <select value={orderBy} onChange={(e) => setOrderBy(e.target.value as SortOrder)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 font-medium outline-none">
                    <option value="default">Sort Order</option>
                    <option value="highest">Highest Claim</option>
                    <option value="lowest">Lowest Claim</option>
                  </select>
                </div>
              </div>

              {/* Counter Row */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sectionCounts).map(([key, count]) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${activeSection === key ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {key === 'priority-matters' ? 'priority matters' : key.replace(/-/g, ' ')} ({String(count)})
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  Showing <span className="text-blue-600 font-black">{orderedCases.length}</span> Results
                </div>
              </div>

              {/* ACTIVE FILTER PILLS */}
              {(searchQuery || selectedRisk !== 'All' || categoryFilter !== 'all' || statusFilter !== 'all' || currencyFilter !== 'all' || showOnlyConfirmed || activeSection !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-300">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="group flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md text-[10px] font-bold text-blue-700 hover:bg-blue-100 transition-all">
                      SEARCH: {searchQuery.toUpperCase()}
                      <svg className="w-3 h-3 text-blue-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {activeSection !== 'all' && (
                    <button onClick={() => setActiveSection('all')} className="group flex items-center gap-1.5 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-all">
                      SECTION: {getSectionLabel(activeSection)}
                      <svg className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {selectedRisk !== 'All' && (
                    <button onClick={() => setSelectedRisk('All')} className="group flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-100 rounded-md text-[10px] font-bold text-orange-700 hover:bg-orange-100 transition-all">
                      RISK: {selectedRisk.toUpperCase()}
                      <svg className="w-3 h-3 text-orange-400 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {categoryFilter !== 'all' && (
                    <button onClick={() => setCategoryFilter('all')} className="group flex items-center gap-1.5 px-2 py-1 bg-purple-50 border border-purple-100 rounded-md text-[10px] font-bold text-purple-700 hover:bg-purple-100 transition-all">
                      CATEGORY: {categoryFilter.toUpperCase()}
                      <svg className="w-3 h-3 text-purple-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {statusFilter !== 'all' && (
                    <button onClick={() => setStatusFilter('all')} className="group flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-100 rounded-md text-[10px] font-bold text-teal-700 hover:bg-teal-100 transition-all">
                      STATUS: {statusFilter.toUpperCase()}
                      <svg className="w-3 h-3 text-teal-400 group-hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {currencyFilter !== 'all' && (
                    <button onClick={() => setCurrencyFilter('all')} className="group flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-md text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all">
                      CURRENCY: {currencyFilter}
                      <svg className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  {showOnlyConfirmed && (
                    <button onClick={() => setShowOnlyConfirmed(false)} className="group flex items-center gap-1.5 px-2 py-1 bg-pink-50 border border-pink-100 rounded-md text-[10px] font-bold text-pink-700 hover:bg-pink-100 transition-all">
                      BANK COUNTERCLAIM
                      <svg className="w-3 h-3 text-pink-400 group-hover:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSearchQuery(''); setSelectedRisk('All'); setCategoryFilter('all');
                      setStatusFilter('all'); setCurrencyFilter('all'); setShowOnlyConfirmed(false);
                      setMonetaryRange('all'); setActiveSection('all');
                    }}
                    className="ml-2 text-[10px] font-black text-red-600 hover:text-red-800 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    Clear All
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Currency Breakdown Mini-Cards */}
            <div className="mb-6 flex overflow-x-auto pb-2 gap-3 no-scrollbar scroll-smooth">
              {Object.entries(appendixData.claimsByCurrency)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([curr, stats]) => (
                  <div
                    key={curr}
                    onClick={() => setCurrencyFilter(currencyFilter === curr ? 'all' : curr as CurrencyFilter)}
                    className={`flex-shrink-0 min-w-[140px] p-3 rounded-xl border transition-all cursor-pointer ${currencyFilter === curr ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-300 hover:bg-blue-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${currencyFilter === curr ? 'text-blue-100' : 'text-gray-400'}`}>{curr}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${currencyFilter === curr ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{stats.count}</span>
                    </div>
                    <div className={`text-sm font-black ${currencyFilter === curr ? 'text-white' : 'text-gray-900'}`}>
                      {curr === 'NGN' ? '₦' : curr === 'USD' ? '$' : curr === 'GBP' ? '£' : curr === 'EUR' ? '€' : ''}
                      {stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                ))}
            </div>

            {/* Main Grid */}
            {orderedCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orderedCases.map((c, i) => renderCaseCard(c, i))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1 uppercase tracking-tight">No matters found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Try adjusting your filters or search query to find the litigation you're looking for.</p>
                <button onClick={() => { setSearchQuery(''); setSelectedRisk('All'); setCategoryFilter('all'); setStatusFilter('all'); setCurrencyFilter('all'); setShowOnlyConfirmed(false); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md">Reset Audit Parameters</button>
              </div>
            )}
          </>
        )}

        {activeView === 'appendices' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section>
              <AppendixASummary
                {...appendixData}
                onFilterCurrency={(curr) => {
                  setCurrencyFilter(curr as CurrencyFilter);
                  setActiveView('dashboard');
                }}
                onFilterStatus={(status) => {
                  if (status === 'all' as any) {
                    setCurrencyFilter('all');
                    setStatusFilter('all');
                    setActiveSection('all');
                    setSelectedRisk('All');
                  } else if (status === 'pending') {
                    setStatusFilter('Pending Matters');
                    setActiveSection('all');
                  } else if (status === 'dormant') {
                    setStatusFilter('Dormant Matters');
                    setActiveSection('all');
                  } else if (status === 'priority') {
                    setActiveSection('priority-matters');
                    setStatusFilter('all');
                  }
                  setActiveView('dashboard');
                }}
                onFilterSection={(key) => {
                  if (key === 'all') {
                    setActiveSection('all');
                  } else {
                    setActiveSection(key);
                  }
                  setActiveView('dashboard');
                }}
              />
            </section>
            <section>
              <AppendixBLowValue
                lowValueCases={appendixData.lowValueCases}
                onCaseClick={(id) => router.push(`/cases/${encodeURIComponent(id)}`)}
              />
            </section>
            <section>
              <AppendixCLitigationThemes
                themeGroups={appendixData.themeGroups}
                onFilter={(theme, type) => {
                  setCategoryFilter(theme);
                  if (type === 'against') {
                    setActiveSection('matters-against');
                  } else if (type === 'by') {
                    setActiveSection('cases-by-bank');
                  } else {
                    setActiveSection('all');
                  }
                  setActiveView('dashboard');
                }}
              />
            </section>
            <section>
              <AppendixDDormant
                dormantCases={appendixData.dormantCases}
                onCaseClick={(id) => router.push(`/cases/${encodeURIComponent(id)}`)}
              />
            </section>
            <section>
              <AppendixEPending
                pendingCases={appendixData.pendingCases}
                onCaseClick={(id) => router.push(`/cases/${encodeURIComponent(id)}`)}
              />
            </section>
            <section>
              <AppendixFBlacklisted
                blacklistedCases={appendixData.blacklistedCases}
                onCaseClick={(id) => router.push(`/cases/${encodeURIComponent(id)}`)}
              />
            </section>
          </div>
        )}
      </div>

      {/* Floating Action Button (Download Master Report) */}
      <button
        onClick={handleGenerateAllCasesPDF}
        className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-all group z-50 flex items-center gap-2"
        title="Download 2025 Audit Report"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-black uppercase tracking-widest whitespace-nowrap">MASTER REPORT</span>
      </button>
    </div>
  );
}
