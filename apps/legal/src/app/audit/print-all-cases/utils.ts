import {
    AppealsItem,
    CasesByEcobankItem,
    MattersAgainstBankItem,
    RiskLevel,
    CurrencyCode,
    Category,
    AnyCase
} from '@merislabs/types';

// Re-export for convenience
export type { AnyCase };

// Define the canonical order of litigation themes
// Client feedback: "Debt Recovery" should come AFTER "Pre-emptory actions against Debt Recovery"
// Labour and Property are separate categories
export const THEME_ORDER = [
    'Pre-emptory actions against Debt Recovery',
    'Debt Recovery',
    'Labour Disputes',
    'Property Disputes',
    'Contractual Disputes, Banker/Customer Relationship or Intellectual Property Disputes',
    'Fundamental Right Actions, Defamation, Action by/against Regulators',
    'Uncategorized',
];

export const sectionOrder = ['priority-matters', 'matters-against', 'cases-by-bank', 'appeals'] as const;

export const sectionLabels: Record<string, string> = {
    // 'priority-matters' and 'high-claim-cases' are synonyms - both refer to the 14 high-value matters
    'priority-matters': 'PRIORITY MATTERS',
    'high-claim-cases': 'PRIORITY MATTERS', // Alias for priority-matters
    'matters-against': 'MATTERS AGAINST THE BANK',
    'cases-by-bank': 'CASES BY THE BANK',
    'appeals': 'APPEALS',
};

/**
 * Get the display label for a section key.
 * This is the single source of truth for section name mappings.
 * Use this instead of switch statements throughout the app.
 */
export const getSectionLabel = (sectionKey: string | undefined | null): string => {
    if (!sectionKey) return '';
    return sectionLabels[sectionKey] || sectionKey;
};

export const riskRank: Record<string, number> = {
    [RiskLevel.High]: 0,
    [RiskLevel.MediumHigh]: 1,
    [RiskLevel.Medium]: 2,
    [RiskLevel.LowMedium]: 3,
    [RiskLevel.Low]: 4,
    [RiskLevel.VeryLow]: 5,
    [RiskLevel.Unassessed]: 6
};

// Normalize risk to display format (primarily for backwards compatibility)
export const normalizeRisk = (r: string | null | undefined): string => {
    if (!r) return RiskLevel.Unassessed;
    // Already valid enum values pass through
    if (Object.values(RiskLevel).includes(r as RiskLevel)) {
        return r;
    }
    return RiskLevel.Unassessed;
};

// Type guard for cases with SuitNo
const hasSuitNo = (c: AnyCase): c is CasesByEcobankItem | MattersAgainstBankItem =>
    'SuitNo' in c;

// Type guard for appeal cases
const isAppeal = (c: AnyCase): c is AppealsItem =>
    'AppealNo' in c;

// Get suit number (handles AppealNo vs SuitNo)
export const getSuitNumber = (c: AnyCase): string => {
    const val = hasSuitNo(c) ? c.SuitNo : (isAppeal(c) ? c.AppealNo || '' : '');
    if (!val) return '';
    const upper = val.toUpperCase().trim();
    if (upper === 'N/A' || upper === 'NONE' || upper === 'CA/NONE' || upper === '-') return '';
    return val;
};

// Sort by risk (highest first)
export const sortByRisk = (a: AnyCase, b: AnyCase) => {
    const ar = a.RiskAssessment || RiskLevel.Unassessed;
    const br = b.RiskAssessment || RiskLevel.Unassessed;
    const ad = riskRank[ar] ?? 6;
    const bd = riskRank[br] ?? 6;
    if (ad !== bd) return ad - bd;
    const am = getClaimValue(a);
    const bm = getClaimValue(b);
    return bm - am;
};

// Get monetary claim value (simplified - now uses consistent PascalCase)
export const getClaimValue = (c: AnyCase): number => {
    if ('ClaimantMonetaryClaim' in c && c.ClaimantMonetaryClaim) {
        return Number(c.ClaimantMonetaryClaim);
    }
    return 0;
};

// Get currency (simplified - uses consistent PascalCase)
export const getCurrency = (c: AnyCase): CurrencyCode => {
    if ('Currency' in c) {
        return (c.Currency as CurrencyCode) || 'NGN';
    }
    return 'NGN';
};

// Get category (simplified)
export const getCategory = (c: AnyCase): Category | string => {
    if (c.category) return c.category;
    if (hasSuitNo(c)) return c.CauseOfAction;
    return 'Uncategorized';
};

// Get status (normalized to lowercase for filtering)
export const getStatus = (c: AnyCase): string => {
    return (c.CaseStatus || '').toLowerCase();
};

// Format currency with symbol
export const formatCurrency = (value: number, currency: CurrencyCode | string = 'NGN'): string => {
    const symbols: Record<string, string> = {
        'NGN': '₦',
        'USD': '$',
        'GBP': '£',
        'EUR': '€',
        'ZAR': 'R'
    };
    const symbol = symbols[currency] || '₦';
    return `${symbol}${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
