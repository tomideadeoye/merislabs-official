import type { OrionOpportunityDetails, OrionOpportunity, Stakeholder } from './types';
import { create, StateCreator } from 'zustand';

// Define a type for keys that can be used for sorting
export type SortableOpportunityKeys =
  | 'updatedAt'
  | 'createdAt'
  | 'nextActionDate'
  | 'title'
  | 'company'
  | 'priority'
  | 'dateIdentified'
  | 'lastStatusUpdate'
  | 'id'
  | 'url'
  | 'notes'
  | 'companyOrInstitution'
  | 'content'
  | 'sourceUrl'
  | 'deadline'
  | 'location'
  | 'salary'
  | 'contact'
  | 'position'
  | 'notionPageId'
  | 'contentType'
  | 'type'
  | 'status';

// --- Slice Interfaces ---

interface BoardSlice {
  needsRefetch: boolean;
  setNeedsRefetch: (value: boolean) => void;
}

interface DialogSlice {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

type SortOrder = 'asc' | 'desc';
type Filters = Partial<OrionOpportunityDetails> & { tag?: string };
interface FiltersSlice {
  filters: Filters;
  sort: SortableOpportunityKeys;
  sortOrder: SortOrder;
  setFilters: (filters: Filters) => void;
  setSort: (sort: SortableOpportunityKeys) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  clearFilters: () => void;
}

interface DraftApplicationDialogSlice {
  isDraftDialogOpen: boolean;
  draftOpportunity: OrionOpportunity | undefined;
  openDraftDialog: (orionOpportunity: OrionOpportunity) => void;
  closeDraftDialog: () => void;
}

interface FinalizeAndSendEmailDialogSlice {
  isFinalizeDialogOpen: boolean;
  initialTo: string;
  initialSubject: string;
  initialHtmlBody: string;
  attachmentsToSend: File[];
  openFinalizeDialog: () => void;
  closeFinalizeDialog: () => void;
  setFinalizeDialogData: (data: {
    initialTo?: string;
    initialSubject?: string;
    initialHtmlBody?: string;
    attachmentsToSend?: File[];
  }) => void;
}

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
}

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

export type OpportunityCentralStoreType = BoardSlice &
  DialogSlice &
  FiltersSlice &
  DraftApplicationDialogSlice &
  FinalizeAndSendEmailDialogSlice &
  GenerateOutreachDialogSlice &
  FindStakeholdersDialogSlice;

// --- Slice Implementations ---

const createBoardSlice: StateCreator<OpportunityCentralStoreType, [], [], BoardSlice> = (set) => ({
  needsRefetch: false,
  setNeedsRefetch: (value) => set({ needsRefetch: value }),
});

const createDialogSlice: StateCreator<OpportunityCentralStoreType, [], [], DialogSlice> = (set) => ({
  isDialogOpen: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
});

const createFiltersSlice: StateCreator<OpportunityCentralStoreType, [], [], FiltersSlice> = (set) => ({
  filters: {},
  sort: 'updatedAt',
  sortOrder: 'desc',
  setFilters: (filters) => set({ filters }),
  setSort: (sort) => set({ sort }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  clearFilters: () => set({ filters: {} }),
});

const createDraftApplicationDialogSlice: StateCreator<
  OpportunityCentralStoreType,
  [],
  [],
  DraftApplicationDialogSlice
> = (set) => ({
  isDraftDialogOpen: false,
  draftOpportunity: undefined,
  openDraftDialog: (orionOpportunity) => set({ isDraftDialogOpen: true, draftOpportunity: orionOpportunity }),
  closeDraftDialog: () => set({ isDraftDialogOpen: false, draftOpportunity: undefined }),
});

const createFinalizeAndSendEmailDialogSlice: StateCreator<
  OpportunityCentralStoreType,
  [],
  [],
  FinalizeAndSendEmailDialogSlice
> = (set) => ({
  isFinalizeDialogOpen: false,
  initialTo: '',
  initialSubject: '',
  initialHtmlBody: '',
  attachmentsToSend: [],
  openFinalizeDialog: () => set({ isFinalizeDialogOpen: true }),
  closeFinalizeDialog: () => set({ isFinalizeDialogOpen: false }),
  setFinalizeDialogData: (data) => set(data),
});

const createGenerateOutreachDialogSlice: StateCreator<
  OpportunityCentralStoreType,
  [],
  [],
  GenerateOutreachDialogSlice
> = (set) => ({
  isOutreachDialogOpen: false,
  stakeholder: undefined,
  opportunityTitle: undefined,
  opportunityCompany: undefined,
  onOutreachGenerated: undefined,
  openOutreachDialog: (data) => set({ isOutreachDialogOpen: true, ...data }),
  closeOutreachDialog: () => set({ isOutreachDialogOpen: false }),
});

const createFindStakeholdersDialogSlice: StateCreator<
  OpportunityCentralStoreType,
  [],
  [],
  FindStakeholdersDialogSlice
> = (set) => ({
  isFindStakeholdersDialogOpen: false,
  stakeholders: [],
  selectedStakeholder: null,
  orionOpportunity: undefined,
  openFindStakeholdersDialog: () => set({ isFindStakeholdersDialogOpen: true }),
  closeFindStakeholdersDialog: () => set({ isFindStakeholdersDialogOpen: false, selectedStakeholder: null }),
  setStakeholders: (stakeholders) => set({ stakeholders }),
  setSelectedStakeholder: (stakeholder) => set({ selectedStakeholder: stakeholder }),
  setOpportunity: (orionOpportunity) => set({ orionOpportunity }),
});

export const useOpportunityCentralStore = create<OpportunityCentralStoreType>()((...a) => ({
  ...createBoardSlice(...a),
  ...createDialogSlice(...a),
  ...createFiltersSlice(...a),
  ...createDraftApplicationDialogSlice(...a),
  ...createFinalizeAndSendEmailDialogSlice(...a),
  ...createGenerateOutreachDialogSlice(...a),
  ...createFindStakeholdersDialogSlice(...a),
}));
