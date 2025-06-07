import { create } from "zustand";
import type { OpportunityDetails } from "@/types/opportunity";

type SortOrder = "asc" | "desc";
type Filters = Partial<OpportunityDetails> & { tag?: string };

interface OpportunityFiltersState {
  filters: Filters;
  sort: keyof OpportunityDetails;
  sortOrder: SortOrder;
  setFilters: (filters: Filters) => void;
  setSort: (sort: keyof OpportunityDetails) => void;
  setSortOrder: (order: SortOrder) => void;
  clearFilters: () => void;
}

export const useOpportunityFiltersStore = create<OpportunityFiltersState>((set) => ({
  filters: {},
  sort: "updatedAt",
  sortOrder: "desc",
  setFilters: (filters) => set({ filters }),
  setSort: (sort) => set({ sort }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  clearFilters: () => set({ filters: {} }),
}));
