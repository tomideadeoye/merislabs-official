'use client';

// NICArb Conference Pages - Barrel Export
export { CoverPage } from './CoverPage';  // Named export
export { ExecutiveSummary } from './ExecutiveSummary';  // Named export
export { SponsorsPage } from './SponsorsPage';  // Named export
export { PlanningCommitteePage } from './PlanningCommitteePage';  // Named export
export { StateBranchesPage } from './StateChaptersPage';  // Named export (renamed)
export { StateBranchesContactPage } from './StateBranchesContactPage';  // Named export
export { Page } from './Page';  // Named export

// Default exports need to be re-exported with explicit name
export { default as WelcomeAddressPage } from './WelcomeAddressPage';
export { default as OpeningRemarksPage } from './OpeningRemarksPage';
export { default as GoverningCouncilPage } from './GoverningCouncilPage';
export { default as ConferenceBrochure } from './ConferenceBrochure';

// Schedule Components
export * from './schedule/day1';
export * from './schedule/day2';
export { Nicarb2025ConferenceFooter as Footer } from './ui/footer';
