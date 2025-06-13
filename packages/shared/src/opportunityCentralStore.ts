import { create } from "zustand";
import type { OrionOpportunity, OrionOpportunityDetails } from "@repo/shared";
// NOTE: Stakeholder type stubbed for shared package build. Replace with real type if available.
export type Stakeholder = { id: string; name: string; [key: string]: any };

// --- Board Slice ---
const createBoardSlice = (set: any) => ({
  needsRefetch: false,
  setNeedsRefetch: (value: boolean) => {
    console.info("[CentralStore][Board] setNeedsRefetch", { value });
    set({ needsRefetch: value });
  },
});

// --- Dialog Slice ---
const createDialogSlice = (set: any) => ({
  isDialogOpen: false,
  openDialog: () => {
    console.debug("[CentralStore][Dialog] openDialog");
    set({ isDialogOpen: true });
  },
  closeDialog: () => {
    console.debug("[CentralStore][Dialog] closeDialog");
    set({ isDialogOpen: false });
  },
});

// --- Filters Slice ---
type SortOrder = "asc" | "desc";
type Filters = Partial<OrionOpportunityDetails> & { tag?: string };
const createFiltersSlice = (set: any) => ({
  filters: {} as Filters,
  sort: "updatedAt" as keyof OrionOpportunityDetails,
  sortOrder: "desc" as SortOrder,
  setFilters: (filters: Filters) => {
    console.info("[CentralStore][Filters] setFilters", { filters });
    set({ filters });
  },
  setSort: (sort: keyof OrionOpportunityDetails) => {
    console.info("[CentralStore][Filters] setSort", { sort });
    set({ sort });
  },
  setSortOrder: (sortOrder: SortOrder) => {
    console.info("[CentralStore][Filters] setSortOrder", { sortOrder });
    set({ sortOrder });
  },
  clearFilters: () => {
    console.info("[CentralStore][Filters] clearFilters");
    set({ filters: {} });
  },
});

// --- Draft Application Dialog Slice ---
const createDraftApplicationDialogSlice = (set: any) => ({
  isDraftDialogOpen: false,
  draftOpportunity: undefined as OrionOpportunity | undefined,
  openDraftDialog: (OrionOpportunity: OrionOpportunity) => {
    console.debug("[CentralStore][DraftDialog] openDraftDialog", {
      OrionOpportunity,
    });
    set({ isDraftDialogOpen: true, draftOpportunity: OrionOpportunity });
  },
  closeDraftDialog: () => {
    console.debug("[CentralStore][DraftDialog] closeDraftDialog");
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
    console.debug("[CentralStore][FinalizeDialog] openFinalizeDialog");
    set({ isFinalizeDialogOpen: true });
  },
  closeFinalizeDialog: () => {
    console.debug("[CentralStore][FinalizeDialog] closeFinalizeDialog");
    set({ isFinalizeDialogOpen: false });
  },
  setFinalizeDialogData: (data: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    attachmentsToSend?: any[];
  }) => {
    console.info("[CentralStore][FinalizeDialog] setFinalizeDialogData", {
      data,
    });
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
    console.debug("[CentralStore][OutreachDialog] openOutreachDialog", { data });
    set({ isOutreachDialogOpen: true, ...data });
  },
  closeOutreachDialog: () => {
    console.debug("[CentralStore][OutreachDialog] closeOutreachDialog");
    set({ isOutreachDialogOpen: false });
  },
  setOutreachDialogData: (data: {
    stakeholder?: any;
    opportunityTitle?: string;
    opportunityCompany?: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => {
    console.info("[CentralStore][OutreachDialog] setOutreachDialogData", {
      data,
    });
    set({ ...data });
  },
});

// --- Find Stakeholders Dialog Slice ---
const createFindStakeholdersDialogSlice = (set: any) => ({
  isFindStakeholdersDialogOpen: false,
  stakeholders: [] as Stakeholder[],
  selectedStakeholder: null as Stakeholder | null,
  OrionOpportunity: undefined as OrionOpportunity | undefined,
  openFindStakeholdersDialog: () => {
    console.debug(
      "[CentralStore][FindStakeholdersDialog] openFindStakeholdersDialog"
    );
    set({ isFindStakeholdersDialogOpen: true });
  },
  closeFindStakeholdersDialog: () => {
    console.debug(
      "[CentralStore][FindStakeholdersDialog] closeFindStakeholdersDialog"
    );
    set({ isFindStakeholdersDialogOpen: false, selectedStakeholder: null });
  },
  setStakeholders: (stakeholders: Stakeholder[]) => {
    console.info("[CentralStore][FindStakeholdersDialog] setStakeholders", {
      stakeholders,
    });
    set({ stakeholders });
  },
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => {
    console.info(
      "[CentralStore][FindStakeholdersDialog] setSelectedStakeholder",
      { stakeholder }
    );
    set({ selectedStakeholder: stakeholder });
  },
  setOpportunity: (OrionOpportunity: OrionOpportunity) => {
    console.info("[CentralStore][FindStakeholdersDialog] setOpportunity", {
      OrionOpportunity,
    });
    set({ OrionOpportunity });
  },
});

export type OpportunityCentralStoreType = ReturnType<typeof createBoardSlice> &
  ReturnType<typeof createDialogSlice> &
  ReturnType<typeof createFiltersSlice> &
  ReturnType<typeof createDraftApplicationDialogSlice> &
  ReturnType<typeof createFinalizeAndSendEmailDialogSlice> &
  ReturnType<typeof createGenerateOutreachDialogSlice> &
  ReturnType<typeof createFindStakeholdersDialogSlice>;

export const useOpportunityCentralStore = create<OpportunityCentralStoreType>(
  (set) => ({
    ...createBoardSlice(set),
    ...createDialogSlice(set),
    ...createFiltersSlice(set),
    ...createDraftApplicationDialogSlice(set),
    ...createFinalizeAndSendEmailDialogSlice(set),
    ...createGenerateOutreachDialogSlice(set),
    ...createFindStakeholdersDialogSlice(set),
  })
);
