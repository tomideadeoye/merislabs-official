/**
 * ============================================================================
 * UNIFIED TYPES DEFINITION (SHARED)
 * ============================================================================
 */

// --- CORE DATA TYPES ---

export type Category =
    | "Debt Recovery"
    | "Pre-emptory actions against Debt Recovery"
    | "Labour Disputes"
    | "Property Disputes"
    | "Fundamental Right Actions, Defamation, Action by/against Regulators"
    | "Contractual Disputes, Banker/Customer Relationship or Intellectual Property Disputes"
    | "Uncategorized";

export enum RiskLevel {
    VeryLow = "Very Low",
    Low = "Low",
    LowMedium = "Low-Medium",
    Medium = "Medium",
    MediumHigh = "Medium-High",
    High = "High",
    Unassessed = "Unassessed"
}

// Type that accepts both enum values and their string equivalents
export type RiskAssessment = `${RiskLevel}` | null;

export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR" | "ZAR" | "Unascertained";

export interface MonetaryAmount {
    currency: CurrencyCode;
    amount: number;
}

export type ClaimType =
    | "Principal Debt"
    | "General Damages"
    | "Special Damages"
    | "Pre-Judgment Interest"
    | "Post-Judgment Interest"
    | "Cost of Action"
    | "Unquantified Relief";

export interface ClaimComponent {
    type: ClaimType;
    description?: string; // e.g. "Interest at 21% per annum"
    value: MonetaryAmount | null; // Null if it's an unquantified declaratory relief

    // Structured Interest Logic
    interestMetadata?: {
        rate: number; // 0.21 for 21%
        period: "per_annum" | "flat" | "monthly";
        startDate?: string; // ISO DateString
        endDate?: string;   // ISO DateString or "Judgment Date"
        isCompound: boolean;
    };
}

export interface LegalClaim {
    // The "Bottom Line" exposure. Array allows for multiple currencies (e.g. NGN + USD)
    totalExposure: MonetaryAmount[];

    // Granular breakdown of the claim
    components: ClaimComponent[];

    // Fallback/Legacy representation
    formattedString: string;
}

// Base interface for PascalCase data structures (Appeals & MattersAgainstBank)
export interface BaseCase {
    CaseID: number;
    ReportSection: string;
    Parties: string;
    Court: string;
    CaseStatus: string;
    CaseStatusNormalized?: 'Pending' | 'Ongoing' | 'Concluded' | 'Adjourned Since Die' | 'Judgment Delivered' | 'Appeal Pending' | 'Garnishee Proceedings' | 'Settlement' | 'Dormant' | 'Struck Out' | 'Discontinued' | 'Stay of Proceedings' | 'Execution';
    RiskAssessment: RiskAssessment;
    ExternalCounsel: string;
    BackgroundFacts: string;
    ReliefsSought: string | null; // Made nullable in base to accommodate loose data
    DefenceCounterclaimText: string | null;
    StatusDetails: string | null;
    RemarksRecommendation: string | null;
    category?: Category;

    // Future: Structured data field
    structuredClaim?: LegalClaim;
}

export interface AppealsItem extends BaseCase {
    AppealNo: string | null;
    OriginalSuitNo: string | null;
    Appellant: string | null;
    NatureOfAppeal: string;
}

export type Appeals = AppealsItem[];

export interface CasesByEcobankItem extends BaseCase {
    SuitNo: string;
    CauseOfAction: string;
    ClaimantMonetaryClaim: number | null;
    Currency: string;
    ClaimsText: string;
    // Overrides for stricter typing matching original data needs
    ReliefsSought: string;
    DefenceCounterclaimText: string;
    StatusDetails: string;
    RemarksRecommendation: string;
    category: Category;
}

export type CasesByEcobank = CasesByEcobankItem[];

export interface MattersAgainstBankItem extends BaseCase {
    SuitNo: string;
    CauseOfAction: string;
    ClaimantMonetaryClaim?: number | null;
    BankCounterclaim: number | null;
    Currency: string;
    ReliefsSought: string;
    DefenceCounterclaimText: string;
    StatusDetails: string;
    RemarksRecommendation: string;
    category: Category;
}

export type MattersAgainstBank = MattersAgainstBankItem[];


// --- CASE UNION TYPES ---

// Type-safe union of all case types
export type AnyCase = AppealsItem | CasesByEcobankItem | MattersAgainstBankItem;

// Extended case type with section and uniqueId metadata
export type CaseWithMetadata = AnyCase & { section: string; uniqueId: string };

// Legacy alias for backward compatibility
export type CaseData = CaseWithMetadata;


// --- DASHBOARD UI TYPES ---

export type DashboardView = 'dashboard' | 'appendices';

export type CurrencyFilter = 'all' | 'NGN' | 'USD' | 'GBP' | 'EUR';

export type SortOrder = 'default' | 'highest' | 'lowest';

export interface DashboardFilters {
    risk: string; // 'All' | RiskLevel key
    section: string; // 'all' | section key
    searchQuery: string;
    monetaryRange: string;
    orderBy: SortOrder;
    category: string;
    status: string;
    currency: CurrencyFilter;
    showOnlyConfirmed: boolean;
}

export interface CurrencyStats {
    count: number;
    total: number;
    confirmed: number;
}

export interface ThemeGroupStats {
    count: number;
    ngnTotal: number;
    usdTotal: number;
}

export interface ThemeGroup {
    againstBank: ThemeGroupStats;
    forBank: ThemeGroupStats;
}

export type LowValueCase = CaseWithMetadata & {
    _claimValue: number;
    _currency: string;
};

// Strictly typed return object for the expensive data calculation memo
export interface DashboardAppendixData {
    totalCases: number;
    claimsByCurrency: Record<string, CurrencyStats>;
    priorityClaimsByCurrency: Record<string, { count: number; total: number }>;
    priorityCasesCount: number;
    pendingCasesCount: number;
    dormantCasesCount: number;
    grouped: { key: string; label: string; items: CaseWithMetadata[] }[];
    dormantCases: CaseWithMetadata[];
    pendingCases: CaseWithMetadata[];
    blacklistedCases: CaseWithMetadata[];
    lowValueCases: LowValueCase[];
    unascertainedCasesCount: number;
    themeGroups: Record<string, ThemeGroup>;
}
