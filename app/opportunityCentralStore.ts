import { create, StateCreator } from 'zustand';
import { OrionOpportunity, Stakeholder, Filters, SortableOpportunityKeys, SortOrder } from '@/lib/types';
// NOTE: The previous comment about stubbing Stakeholder is no longer relevant as it is correctly imported.

// Define a type for keys that can be used for sorting
// This is now imported from @/lib/types, but keeping here for reference if specific needs arise.
// export type SortableOpportunityKeys =
//   | 'updatedAt'
//   | 'createdAt'
//   | 'nextActionDate'
//   | 'title'
//   | 'company'
//   | 'priority'
//   | 'dateIdentified'
//   | 'lastStatusUpdate'
//   | 'id'
//   | 'url'
//   | 'notes'
//   | 'companyOrInstitution'
//   | 'content'
//   | 'sourceUrl'
//   | 'deadline'
//   | 'location'
//   | 'salary'
//   | 'contact'
//   | 'position'
//   | 'notionPageId'
//   | 'contentType'
//   | 'type'
//   | 'status';

// Forward declaration for the main store type to resolve circular dependency
export type OpportunityCentralStoreType = BoardSlice &
  DialogSlice &
  FiltersSlice &
  DraftApplicationDialogSlice &
  FinalizeAndSendEmailDialogSlice &
  GenerateOutreachDialogSlice &
  FindStakeholdersDialogSlice;

// Define the type for the 'set' function passed to slice creators from the main store
type MainStoreSet = Parameters<StateCreator<OpportunityCentralStoreType, [], [], OpportunityCentralStoreType>>[0];

// --- Board Slice ---
interface BoardSlice {
  needsRefetch: boolean;
  setNeedsRefetch: (value: boolean) => void;
}
const createBoardSlice = (set: MainStoreSet): BoardSlice => ({
  needsRefetch: false,
  setNeedsRefetch: (value: boolean) => {
    console.info('[CentralStore][Board] setNeedsRefetch', { value });
    set({ needsRefetch: value });
  },
});

// --- Dialog Slice ---
interface DialogSlice {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}
const createDialogSlice = (set: MainStoreSet): DialogSlice => ({
  isDialogOpen: false,
  openDialog: () => {
    console.debug('[CentralStore][Dialog] openDialog');
    set({ isDialogOpen: true });
  },
  closeDialog: () => {
    console.debug('[CentralStore][Dialog] closeDialog');
    set({ isDialogOpen: false });
  },
});

// --- Filters Slice ---
// Filters and SortOrder are now imported from @/lib/types
// type SortOrder = 'asc' | 'desc'; // Moved to types/index.ts
// type Filters = Partial<OrionOpportunityDetails> & { tag?: string }; // Moved to types/index.ts
interface FiltersSlice {
  filters: Filters;
  sort: SortableOpportunityKeys;
  sortOrder: SortOrder;
  setFilters: (filters: Filters) => void;
  setSort: (sort: SortableOpportunityKeys) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  clearFilters: () => void;
}
const createFiltersSlice = (set: MainStoreSet): FiltersSlice => ({
  filters: {} as Filters,
  sort: 'updatedAt' as SortableOpportunityKeys,
  sortOrder: 'desc' as SortOrder,
  setFilters: (filters: Filters) => {
    console.info('[CentralStore][Filters] setFilters', { filters });
    set({ filters });
  },
  setSort: (sort: SortableOpportunityKeys) => {
    console.info('[CentralStore][Filters] setSort', { sort });
    set({ sort });
  },
  setSortOrder: (sortOrder: SortOrder) => {
    console.info('[CentralStore][Filters] setSortOrder', { sortOrder });
    set({ sortOrder });
  },
  clearFilters: () => {
    console.info('[CentralStore][Filters] clearFilters');
    set({ filters: {} });
  },
});

// --- Draft Application Dialog Slice ---
interface DraftApplicationDialogSlice {
  isDraftDialogOpen: boolean;
  draftOpportunity: OrionOpportunity | undefined;
  openDraftDialog: (orionOpportunity: OrionOpportunity) => void;
  closeDraftDialog: () => void;
}
const createDraftApplicationDialogSlice = (set: MainStoreSet): DraftApplicationDialogSlice => ({
  isDraftDialogOpen: false,
  draftOpportunity: undefined as OrionOpportunity | undefined,
  openDraftDialog: (orionOpportunity: OrionOpportunity) => {
    console.debug('[CentralStore][DraftDialog] openDraftDialog', {
      orionOpportunity,
    });
    set({ isDraftDialogOpen: true, draftOpportunity: orionOpportunity });
  },
  closeDraftDialog: () => {
    console.debug('[CentralStore][DraftDialog] closeDraftDialog');
    set({ isDraftDialogOpen: false, draftOpportunity: undefined });
  },
});

// --- Finalize and Send Email Dialog Slice ---
interface FinalizeAndSendEmailDialogSlice {
  isFinalizeDialogOpen: boolean;
  initialTo: string;
  initialSubject: string;
  initialHtmlBody: string;
  attachmentsToSend: File[]; // Assuming attachments are File objects
  openFinalizeDialog: () => void;
  closeFinalizeDialog: () => void;
  setFinalizeDialogData: (data: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    attachmentsToSend?: File[];
  }) => void;
}
const createFinalizeAndSendEmailDialogSlice = (set: MainStoreSet): FinalizeAndSendEmailDialogSlice => ({
  isFinalizeDialogOpen: false,
  initialTo: '',
  initialSubject: '',
  initialHtmlBody: '',
  attachmentsToSend: [] as File[],
  openFinalizeDialog: () => {
    console.debug('[CentralStore][FinalizeDialog] openFinalizeDialog');
    set({ isFinalizeDialogOpen: true });
  },
  closeFinalizeDialog: () => {
    console.debug('[CentralStore][FinalizeDialog] closeFinalizeDialog');
    set({ isFinalizeDialogOpen: false });
  },
  setFinalizeDialogData: (data) => {
    console.info('[CentralStore][FinalizeDialog] setFinalizeDialogData', {
      data,
    });
    set({ ...data });
  },
});

// --- Generate Outreach Dialog Slice ---
interface GenerateOutreachDialogSlice {
  isOutreachDialogOpen: boolean;
  stakeholder: Stakeholder | undefined;
  opportunityTitle: string | undefined;
  opportunityCompany: string | undefined;
  onOutreachGenerated: ((outreach: string) => void) | undefined;
  openOutreachDialog: (data: {
    stakeholder: Stakeholder;
    opportunityTitle: string;
    opportunityCompany: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => void;
  closeOutreachDialog: () => void;
  setOutreachDialogData: (data: {
    stakeholder?: Stakeholder;
    opportunityTitle?: string;
    opportunityCompany?: string;
    onOutreachGenerated?: (outreach: string) => void;
  }) => void;
}
const createGenerateOutreachDialogSlice = (set: MainStoreSet): GenerateOutreachDialogSlice => ({
  isOutreachDialogOpen: false,
  stakeholder: undefined as Stakeholder | undefined,
  opportunityTitle: undefined as string | undefined,
  opportunityCompany: undefined as string | undefined,
  onOutreachGenerated: undefined as ((outreach: string) => void) | undefined,
  openOutreachDialog: (data) => {
    console.debug('[CentralStore][OutreachDialog] openOutreachDialog', { data });
    set({
      isOutreachDialogOpen: true,
      stakeholder: data.stakeholder,
      opportunityTitle: data.opportunityTitle,
      opportunityCompany: data.opportunityCompany,
      onOutreachGenerated: data.onOutreachGenerated,
    });
  },
  closeOutreachDialog: () => {
    console.debug('[CentralStore][OutreachDialog] closeOutreachDialog');
    set({
      isOutreachDialogOpen: false,
      stakeholder: undefined,
      opportunityTitle: undefined,
      opportunityCompany: undefined,
      onOutreachGenerated: undefined,
    });
  },
  setOutreachDialogData: (data) => {
    console.info('[CentralStore][OutreachDialog] setOutreachDialogData', { data });
    set({ ...data });
  },
});

// --- Find Stakeholders Dialog Slice ---
interface FindStakeholdersDialogSlice {
  isFindStakeholdersDialogOpen: boolean;
  stakeholders: Stakeholder[];
  selectedStakeholder: Stakeholder | null;
  orionOpportunity: OrionOpportunity | undefined;
  openFindStakeholdersDialog: () => void;
  closeFindStakeholdersDialog: () => void;
  setStakeholders: (stakeholders: Stakeholder[]) => void;
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => void;
  setOpportunity: (orionOpportunity: OrionOpportunity) => void;
}
const createFindStakeholdersDialogSlice = (set: MainStoreSet): FindStakeholdersDialogSlice => ({
  isFindStakeholdersDialogOpen: false,
  stakeholders: [] as Stakeholder[],
  selectedStakeholder: null,
  orionOpportunity: undefined as OrionOpportunity | undefined,
  openFindStakeholdersDialog: () => {
    console.debug('[CentralStore][FindStakeholdersDialog] openFindStakeholdersDialog');
    set({ isFindStakeholdersDialogOpen: true });
  },
  closeFindStakeholdersDialog: () => {
    console.debug('[CentralStore][FindStakeholdersDialog] closeFindStakeholdersDialog');
    set({ isFindStakeholdersDialogOpen: false });
  },
  setStakeholders: (stakeholders: Stakeholder[]) => {
    console.info('[CentralStore][FindStakeholdersDialog] setStakeholders', {
      stakeholders,
    });
    set({ stakeholders });
  },
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => {
    console.info('[CentralStore][FindStakeholdersDialog] setSelectedStakeholder', {
      stakeholder,
    });
    set({ selectedStakeholder: stakeholder });
  },
  setOpportunity: (orionOpportunity: OrionOpportunity) => {
    console.info('[CentralStore][FindStakeholdersDialog] setOpportunity', {
      orionOpportunity,
    });
    set({ orionOpportunity });
  },
});

export const useOpportunityCentralStore = create<OpportunityCentralStoreType>()((set) => ({
  ...createBoardSlice(set),
  ...createDialogSlice(set),
  ...createFiltersSlice(set),
  ...createDraftApplicationDialogSlice(set),
  ...createFinalizeAndSendEmailDialogSlice(set),
  ...createGenerateOutreachDialogSlice(set),
  ...createFindStakeholdersDialogSlice(set),
}));
