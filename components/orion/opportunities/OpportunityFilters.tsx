"use client";

import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  X, 
  Search,
  Tag
} from 'lucide-react';
import { OpportunityFilters as FiltersType } from '@/hooks/useOpportunities';

interface OpportunityFiltersProps {
  filters: FiltersType;
  setFilters: (filters: FiltersType) => void;
  sort: string;
  setSort: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  setFilters,
  sort,
  setSort,
  sortOrder,
  setSortOrder
}) => {
  const [tagInput, setTagInput] = useState<string>(filters.tag || '');
  
  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value === 'all' ? undefined : value });
  };
  
  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, type: value === 'all' ? undefined : value });
  };
  
  const handlePriorityChange = (value: string) => {
    setFilters({ ...filters, priority: value === 'all' ? undefined : value });
  };
  
  const handleTagSearch = () => {
    setFilters({ ...filters, tag: tagInput || undefined });
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTagSearch();
    }
  };
  
  const handleSortChange = (value: string) => {
    setSort(value);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const clearFilters = () => {
    setFilters({});
    setTagInput('');
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-400" />
          Filter Opportunities
        </h3>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Status</label>
          <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="identified">Identified</SelectItem>
              <SelectItem value="researching">Researching</SelectItem>
              <SelectItem value="evaluating">Evaluating</SelectItem>
              <SelectItem value="application_ready">Application Ready</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="offer_received">Offer Received</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected_by_them">Rejected</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Type</label>
          <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="job">Job</SelectItem>
              <SelectItem value="education_program">Education Program</SelectItem>
              <SelectItem value="project_collaboration">Project/Collaboration</SelectItem>
              <SelectItem value="funding">Funding</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Priority</label>
          <Select value={filters.priority || 'all'} onValueChange={handlePriorityChange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Tag Search</label>
          <div className="flex">
            <div className="relative flex-grow">
              <Tag className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Search tags..."
                className="pl-8 bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <Button 
              onClick={handleTagSearch}
              className="ml-2 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-gray-700 pt-4">
        <div className="flex items-center">
          <label className="text-xs text-gray-400 mr-2">Sort By:</label>
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200 w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
              <SelectItem value="lastStatusUpdate">Last Updated</SelectItem>
              <SelectItem value="dateIdentified">Date Identified</SelectItem>
              <SelectItem value="nextActionDate">Next Action Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="companyOrInstitution">Company/Institution</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSortOrder}
            className="ml-2 text-gray-400 hover:text-gray-300"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          {hasActiveFilters ? 'Filtered results' : 'Showing all opportunities'}
        </div>
      </div>
    </div>
  );
};