import { create } from "zustand";
import type { Opportunity, OpportunityDetails } from "@shared/types/opportunity";
import type { Stakeholder } from "@/components/orion/opportunities/networking/FindStakeholdersButton";
import { logger } from '@shared/lib/logger';

/**
 * Orion Opportunity Central Zustand Store
 *
 * GOAL: Centralize all opportunity-related state management for the Orion admin dashboard and related flows.
 *
 * This store unifies all previously separate Zustand stores for opportunity features into a single, composable, slice-based store.
 *
 * SLICES INCLUDED:
 * - Board Slice: Kanban/board state (e.g., needsRefetch)
 * - Dialog Slice: Generic dialog open/close state
 * - Filters Slice: Opportunity filters and sorting
 * - Draft Application Dialog Slice: State for the draft application modal
 * - Finalize and Send Email Dialog Slice: State for the finalize/send email modal
 * - Generate Outreach Dialog Slice: State for generating outreach messages
 * - Find Stakeholders Dialog Slice: State for stakeholder search and selection
 *
 * HOW IT'S LINKED:
 * - All opportunity-related components (Kanban, List, Filters, Dialogs, Networking, etc.) now import and use this central store.
 * - Each slice exposes state and actions, which are destructured in components as needed.
 * - All state changes are logged with context for rapid debugging and traceability.
 *
 * MIGRATION:
 * - All previous individual store files (e.g., opportunityBoardStore.ts, opportunityDialogStore.ts, etc.) have been removed.
 * - All usages in components have been updated to use this central store.
 *
 * EXTENSION:
 * - New slices can be added here for future opportunity features.
 * - For global (non-opportunity) state, create a similar pattern in a global store file.
 */

// --- Board Slice ---
const createBoardSlice = (set: any) => ({
  needsRefetch: false,
  setNeedsRefetch: (value: boolean) => {
    logger.info('[CentralStore][Board] setNeedsRefetch', { value });
    set({ needsRefetch: value });
  },
});

// --- Dialog Slice ---
const createDialogSlice = (set: any) => ({
  isDialogOpen: false,
  openDialog: () => {
    logger.debug('[CentralStore][Dialog] openDialog');
    set({ isDialogOpen: true });
  },
  closeDialog: () => {
    logger.debug('[CentralStore][Dialog] closeDialog');
    set({ isDialogOpen: false });
  },
});

// --- Filters Slice ---
type SortOrder = "asc" | "desc";
type Filters = Partial<OpportunityDetails> & { tag?: string };
const createFiltersSlice = (set: any) => ({
  filters: {} as Filters,
  sort: "updatedAt" as keyof OpportunityDetails,
  sortOrder: "desc" as SortOrder,
  setFilters: (filters: Filters) => {
    logger.info('[CentralStore][Filters] setFilters', { filters });
    set({ filters });
  },
  setSort: (sort: keyof OpportunityDetails) => {
    logger.info('[CentralStore][Filters] setSort', { sort });
    set({ sort });
  },
  setSortOrder: (sortOrder: SortOrder) => {
    logger.info('[CentralStore][Filters] setSortOrder', { sortOrder });
    set({ sortOrder });
  },
  clearFilters: () => {
    logger.info('[CentralStore][Filters] clearFilters');
    set({ filters: {} });
  },
});

// --- Draft Application Dialog Slice ---
const createDraftApplicationDialogSlice = (set: any) => ({
  isDraftDialogOpen: false,
  draftOpportunity: undefined as Opportunity | undefined,
  openDraftDialog: (opportunity: Opportunity) => {
    logger.debug('[CentralStore][DraftDialog] openDraftDialog', { opportunity });
    set({ isDraftDialogOpen: true, draftOpportunity: opportunity });
  },
  closeDraftDialog: () => {
    logger.debug('[CentralStore][DraftDialog] closeDraftDialog');
    set({ isDraftDialogOpen: false, draftOpportunity: undefined });
  },
});

// --- Finalize and Send Email Dialog Slice ---
const createFinalizeAndSendEmailDialogSlice = (set: any) => ({
  isFinalizeDialogOpen: false,
  initialTo: "",
  initialSubject: "",
  initialHtmlBody: "",
  attachmentsToSend: [] as any[],
  openFinalizeDialog: () => {
    logger.debug('[CentralStore][FinalizeDialog] openFinalizeDialog');
    set({ isFinalizeDialogOpen: true });
  },
  closeFinalizeDialog: () => {
    logger.debug('[CentralStore][FinalizeDialog] closeFinalizeDialog');
    set({ isFinalizeDialogOpen: false });
  },
  setFinalizeDialogData: (data: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    attachmentsToSend?: any[];
  }) => {
    logger.info('[CentralStore][FinalizeDialog] setFinalizeDialogData', { data });
    set({ ...data });
  },
});

// --- Generate Outreach Dialog Slice ---
const createGenerateOutreachDialogSlice = (set: any) => ({
  isOutreachDialogOpen: false,
  stakeholder: undefined as any,
  opportunityTitle: undefined as string | undefined,
  opportunityCompany: undefined as string | undefined,
  onOutreachGenerated: undefined as ((outreach: string) => void) | undefined,
  openOutreachDialog: (data: {
    stakeholder: any;
    opportunityTitle: string;
    opportunityCompany: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => {
    logger.debug('[CentralStore][OutreachDialog] openOutreachDialog', { data });
    set({ isOutreachDialogOpen: true, ...data });
  },
  closeOutreachDialog: () => {
    logger.debug('[CentralStore][OutreachDialog] closeOutreachDialog');
    set({ isOutreachDialogOpen: false });
  },
  setOutreachDialogData: (data: {
    stakeholder?: any;
    opportunityTitle?: string;
    opportunityCompany?: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => {
    logger.info('[CentralStore][OutreachDialog] setOutreachDialogData', { data });
    set({ ...data });
  },
});

// --- Find Stakeholders Dialog Slice ---
const createFindStakeholdersDialogSlice = (set: any) => ({
  isFindStakeholdersDialogOpen: false,
  stakeholders: [] as Stakeholder[],
  selectedStakeholder: null as Stakeholder | null,
  opportunity: undefined as Opportunity | undefined,
  openFindStakeholdersDialog: () => {
    logger.debug('[CentralStore][FindStakeholdersDialog] openFindStakeholdersDialog');
    set({ isFindStakeholdersDialogOpen: true });
  },
  closeFindStakeholdersDialog: () => {
    logger.debug('[CentralStore][FindStakeholdersDialog] closeFindStakeholdersDialog');
    set({ isFindStakeholdersDialogOpen: false, selectedStakeholder: null });
  },
  setStakeholders: (stakeholders: Stakeholder[]) => {
    logger.info('[CentralStore][FindStakeholdersDialog] setStakeholders', { stakeholders });
    set({ stakeholders });
  },
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => {
    logger.info('[CentralStore][FindStakeholdersDialog] setSelectedStakeholder', { stakeholder });
    set({ selectedStakeholder: stakeholder });
  },
  setOpportunity: (opportunity: Opportunity) => {
    logger.info('[CentralStore][FindStakeholdersDialog] setOpportunity', { opportunity });
    set({ opportunity });
  },
});

// 1. Define the full store type as a type alias (not interface)
export type OpportunityCentralStoreType =
  ReturnType<typeof createBoardSlice> &
  ReturnType<typeof createDialogSlice> &
  ReturnType<typeof createFiltersSlice> &
  ReturnType<typeof createDraftApplicationDialogSlice> &
  ReturnType<typeof createFinalizeAndSendEmailDialogSlice> &
  ReturnType<typeof createGenerateOutreachDialogSlice> &
  ReturnType<typeof createFindStakeholdersDialogSlice>;

// 2. Type the store
export const useOpportunityCentralStore = create<OpportunityCentralStoreType>((set) => ({
  ...createBoardSlice(set),
  ...createDialogSlice(set),
  ...createFiltersSlice(set),
  ...createDraftApplicationDialogSlice(set),
  ...createFinalizeAndSendEmailDialogSlice(set),
  ...createGenerateOutreachDialogSlice(set),
  ...createFindStakeholdersDialogSlice(set),
}));
