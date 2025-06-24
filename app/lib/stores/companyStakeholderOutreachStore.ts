import { create } from 'zustand';

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
}

interface CompanySearchResult {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  stakeholders: Stakeholder[];
}

interface CompanyStakeholderOutreachState {
  companySearchQuery: string;
  searchResults: CompanySearchResult[];
  isSearching: boolean;
  selectedStakeholder: Stakeholder | null;
  emailDraft: string;
  linkedinDraft: string;
  isDrafting: boolean;
  activeTab: string;
  setCompanySearchQuery: (query: string) => void;
  setSearchResults: (results: CompanySearchResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  setSelectedStakeholder: (stakeholder: Stakeholder | null) => void;
  setEmailDraft: (draft: string) => void;
  setLinkedinDraft: (draft: string) => void;
  setIsDrafting: (drafting: boolean) => void;
  setActiveTab: (tab: string) => void;
  reset: () => void;
}

export const useCompanyStakeholderOutreachStore = create<CompanyStakeholderOutreachState>((set) => ({
  companySearchQuery: '',
  searchResults: [],
  isSearching: false,
  selectedStakeholder: null,
  emailDraft: '',
  linkedinDraft: '',
  isDrafting: false,
  activeTab: 'search',
  setCompanySearchQuery: (query) => set({ companySearchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setSelectedStakeholder: (stakeholder) => set({ selectedStakeholder: stakeholder }),
  setEmailDraft: (draft) => set({ emailDraft: draft }),
  setLinkedinDraft: (draft) => set({ linkedinDraft: draft }),
  setIsDrafting: (drafting) => set({ isDrafting: drafting }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  reset: () =>
    set({
      companySearchQuery: '',
      searchResults: [],
      isSearching: false,
      selectedStakeholder: null,
      emailDraft: '',
      linkedinDraft: '',
      isDrafting: false,
      activeTab: 'search',
    }),
}));
